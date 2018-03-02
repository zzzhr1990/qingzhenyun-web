<template>
  <transition
    name="custom-classes-transition"
    enter-active-class="fadeInUp"
    leave-active-class="fadeOutDown"
  >
    <el-card class="box-upload" v-show="showUploadBox" :body-style="{ padding: '0px', overflowX: 'none', overflowY: 'auto', height: '290px' }">
      <div slot="header" class="clearfix">
        <i class="el-icon-close" style="float: right;" @click="hideUploadBox"></i>
        <el-button style="float: left; padding: 3px 0" type="text" @click="wakeUp">选择文件</el-button>
      </div>
      <div class="file clearfix" v-for="file in uploadList">
        <div class="progress" :style="{width:file.progress + '%'}"></div>
        <span class="filename" :title="file.name">{{file.name}}</span>
        <span class="filestatus" v-if="file.status !== 'failed'">{{file.status}} <i class="el-icon-delete pointer" @click="removeFileFromList(file)"></i></span>
        <span class="filestatus" v-else><span class="pointer" @click="retryUpload(file)">重试</span> <span class="pointer" @click="reUpload(file)">重传</span> <i class="el-icon-delete pointer" @click="removeFileFromList(file)"></i></span>
      </div>
      <div style="display:none">
        <input ref="fileinput" type="file" multiple @change="fileSelect($event)" />
      </div>
    </el-card>
  </transition>
</template>

<script>
import WUFile from '@/utils/file'
import Vue from 'vue'
import * as types from '@/store/mutation-types'
import fileMixns from '@/components/common/mixins/file'
import Message from '@/components/common/message/message'
import Notify from '@/components/common/message/notify'
import { mapGetters } from 'vuex'
export default {
  name: 'UploadBox',
  mixins: [fileMixns],
  data () {
    return {
      Q: null,
      showUploadBox: false,
      uploadList: [],
      uploadQueue: []
    }
  },
  computed: {
    ...mapGetters('upload', ['uploadConfig']),
    ...mapGetters('files', ['uuid'])
  },
  methods: {
    hideUploadBox () {
      this.showUploadBox = false
    },
    wakeUp () {
      this.$refs.fileinput.click()
    },
    removeFileFromList (file) {
      for (let i = 0, len = this.uploadList.length; i < len; i++) {
        if (this.uploadList[i] === file) {
          this.uploadList.splice(i, 1)
          break
        }
      }
      for (let j = 0, len1 = this.uploadQueue.length; j < len1; j++) {
        if (this.uploadQueue[j] === file) {
          this.uploadQueue.splice(j, 1)
          break
        }
      }
      file.setStatus(WUFile.STATUS.CANCEL)
      this.runUpload('noRefersh')
    },
    retryUpload (file) {
      file.resetTryout()
      this.runUpload()
    },
    reUpload (file) {
      file.resetState()
      this.runUpload()
    },
    fileSelect (evt) {
      let files = evt.target.files
      let len = files.length
      let list = this.uploadList.filter(item => !item.isDone())
      if (files.length + list.length > this.uploadConfig.maxQueueLen) {
        this.$notify(Notify.FILE_NUM_OVERFLOW(this.uploadConfig.maxQueueLen))
        len = this.uploadConfig.maxQueueLen - list.length
      }
      if (len <= 0) {
        return
      }
      for (var i = 0; i < len; i++) {
        this.uploadList.push(new WUFile({
          file: files[i],
          blockSize: this.uploadConfig.BlockSize,
          chunkSize: this.uploadConfig.ChunkSize,
          uuid: String(this.uuid),
          chunkRetry: this.uploadConfig.ChunkRetry
        }))
      }
      this.runUpload()
    },
    runUpload (noRefersh) {
      if (this.uploadQueue.length >= this.uploadConfig.concurrency) {
        return
      }
      if (!this.Q) {
        this.Q = Vue.Promise.resolve()
      }
      this.Q = this.Q.then(() => {
        if (this.uploadQueue.length < this.uploadConfig.concurrency) {
          const unhandleFileList = this.uploadList.filter(item => item.isPending())
          while (this.uploadQueue.length < this.uploadConfig.concurrency && unhandleFileList.length) {
            this.uploadQueue.push(unhandleFileList.shift())
          }
        }
        for (var i = 0; i < this.uploadQueue.length; i++) {
          this.uploadOneFile(this.uploadQueue[i])
        }

        if (this.uploadQueue.length === 0 && !noRefersh) {
          this.pageReFresh()
        }
      })
    },
    uploadOneFile (file) {
      if (file.isUploading()) {
        return
      }
      file.setStatus(WUFile.STATUS.CALCULATING)
      file
        .getHash()
        .then(() => {
          if (file.isCancel()) {
            return Vue.Promise.reject()
          }
          file.setStatus(WUFile.STATUS.PREPARING)
          return file.getToken()
        })
        .then(() => {
          if (file.isCancel()) {
            return Vue.Promise.reject()
          }
          if (file.isExisted()) {
            file.setStatus(WUFile.STATUS.DONE)
            let fileInfo = file.getFileInfo()
            this.$store.commit(`files/${types.PATH_CREATE_SUCCESS}`, fileInfo)
            this.removeUploadindTask(file)
            this.runUpload()
            return
          }
          file.setStatus(WUFile.STATUS.UPLOADING)
          this.uploadOneFileStart(file)
        })
        .catch((e) => {
          this.$notify(Notify.FILE_UPLOAD_FAILED(file.name, Message.COMMON(e).message))
          if (file.isCancel()) {
            file.destroy()
          } else {
            file.setStatus(WUFile.STATUS.FAILED)
            this.removeUploadindTask(file)
          }
          this.runUpload()
        })
    },

    removeUploadindTask (file) {
      const index = this.uploadQueue.indexOf(file)
      if (index < 0) {
        return
      }
      this.uploadQueue.splice(index, 1)
    },

    uploadOneFileStart (file) {
      if (file.isTryout()) {
        file.setStatus(WUFile.STATUS.FAILED)
        this.removeUploadindTask(file)
        this.runUpload()
        return
      }
      let uploadInfo = file.getServerInfo()
      Vue.Promise
        .resolve(file)
        .then((file) => {
          if (file.isCancel()) {
            return Vue.Promise.reject()
          }
          return this.$http.post(
            uploadInfo.url,
            file.slice(uploadInfo.chunk.startByte, uploadInfo.chunk.endByte),
            {
              headers: {
                Authorization: uploadInfo.Authorization,
                UploadBatch: uploadInfo.UploadBatch,
                'Content-Type': 'application/octet-stream'
              },
              progress: (event) => {
                if (event.lengthComputable) {
                  file.setProgress(event.loaded)
                }
              }
            }
          )
        })
        .then((res) => {
          if (file.isCancel()) {
            return Vue.Promise.reject()
          }
          if (res.body.code) {
            return Vue.Promise.reject()
          }
          file.setCtx(res.body.ctx, uploadInfo.chunk)
          if (uploadInfo.chunk.isFileEnd) {
            const creatServer = file.getCreatFileServerInfo()
            return this.$http.post(
              creatServer.url,
              creatServer.ctxList,
              {
                headers: {
                  Authorization: creatServer.Authorization,
                  UploadBatch: creatServer.UploadBatch,
                  'Content-Type': 'text/plain;charset=UTF-8'
                }
              }
            )
          } else {
            file.setPos(uploadInfo.chunk.index + 1)
            this.uploadOneFileStart(file)
          }
        })
        .then(res => {
          if (file.isCancel()) {
            return Vue.Promise.reject()
          }
          if (!res) {
            return
          }
          if (res.body.code) {
            this.$notify(Notify.FILE_UPLOAD_FAILED(file.name, res.body.message))
            this.removeUploadindTask(file)
          } else if (res.body.hash !== file.sha1) {
            this.$notify(Notify.FILE_CHECK_FAILED(file.name))
            file.setStatus(WUFile.STATUS.FAILED)
            file.setPos(0)
          } else {
            let fileInfo = JSON.parse(res.body.response).result
            file.setFileInfo(fileInfo)
            this.$store.commit(`files/${types.PATH_CREATE_SUCCESS}`, fileInfo)
            file.setStatus(WUFile.STATUS.DONE)
          }
          this.removeUploadindTask(file)
          this.runUpload()
        })
        .catch(e => {
          if (file.isCancel()) {
            file.destroy()
            this.runUpload()
          } else {
            file.markTry()
            this.uploadOneFileStart(file)
          }
        })
    }
  }
}
</script>

<style scoped>
.box-upload {
  width: 480px;
  height: 350px;
  position: absolute;
  bottom: 0;
  right: 0;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both
}


.file {
  width: 100%;
  height: 40px;
  line-height: 40px;
  background: #f9f9f9;
  margin-bottom: 1px;
  position: relative;
  text-align: left;
}
.progress {
  height: 40px;
  width: 0;
  position: absolute;
  top: 0;
  left: 0;
  background: #53D9A4;
}
span.filename {
  float: left;
  position: relative;
  width: 350px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding-left: 10px;
  z-index: 2;
}
.filestatus {
  float: right;
  position: relative;
  padding-right: 10px;
  z-index: 2;
}
.pointer {
  cursor: pointer;
}
</style>