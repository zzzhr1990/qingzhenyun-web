<template>
  <div>
    <el-dialog title="离线任务" :visible.sync="visible">
      <el-button-group>
        <el-button size="small" @click="createTask(types.BT)">新建BT任务</el-button>
        <el-button size="small" @click="createTask()">新建链接任务</el-button>
        <!-- <el-button size="small" @click="createTask(types.MAGNET)">新建磁力链任务</el-button>
        <el-button size="small" @click="createTask(types.ED2K)">新建电驴任务</el-button>
        <el-button size="small" @click="createTask(types.HTTP)">新建链接任务</el-button> -->
      </el-button-group>
      <div style="display:none">
        <input ref="fileinput" type="file" @change="fileSelect($event)" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api'
import WUFile from '@/utils/file'
import { mapGetters } from 'vuex'
import axios from 'axios'
import FileSelect from '@/components/parseFileSelectDialog'
import Message from '@/components/common/message/message'
import Notify from '@/components/common/message/notify'
import DirSelectDialogShow from '@/components/dirSelectDialog'

export default {
  data () {
    return {
      visible: false,
      types: {
        BT: 0,
        MAGNET: 10,
        HTTP: 20,
        ED2K: 40
      }
    }
  },
  computed: {
    ...mapGetters('upload', ['uploadConfig'])
  },
  methods: {
    createTask (type) {
      switch (type) {
        case this.types.BT:
          this.btDownload()
          break
        default:
          this.anotherDownLoad()
          break
      }
    },
    anotherDownLoad () {
      this.$prompt('磁力链/电驴/http链接', '请输入链接地址')
        .then(({value}) => {
          if (/^(magnet:\?xt=urn:btih:)[0-9a-fA-F]{40}.*$/.test(value)) {
            this.magnetDownload(value)
          } else if (/^ed2k:/.test(value)) {
            this.ed2kDownload(value)
          } else if (/(^https?:\/\/)|(^s?ftp:\/\/)/.test(value)) {
            this.download(value)
          } else {
            Message.ILLEGAL_URL()
          }
        })
        .catch(e => {})
    },
    download (value) {
      DirSelectDialogShow()
        .then(dir => {
          var saveUuid = ''
          if (dir === '根目录') {
            saveUuid = ''
          } else {
            saveUuid = dir.uuid
          }
          this.start({
            url: value,
            saveUuid: saveUuid,
            type: this.types.HTTP
          })
        })
        .catch(e => {})
    },
    ed2kDownload (value) {
      Message.DEVELOPING()
    },
    magnetDownload (value) {
      api
        .offline
        .parseMagnet({
          url: value
        })
        .then(res => {
          if (!res.result.files) {
            DirSelectDialogShow()
              .then(dir => {
                var saveUuid = ''
                if (dir !== '根目录') {
                  saveUuid = dir.uuid
                }
                this.start({
                  url: value,
                  saveUuid: saveUuid,
                  type: this.types.MAGNET,
                  files: '*'
                })
              })
              .catch(e => {})
          } else {
            FileSelect({
              list: res.result.files,
              title: res.result.name
            })
            .then(({files, saveUuid}) => {
              this.start({
                type: this.types.MAGNET,
                taskHash: res.result.taskHash,
                files: files,
                saveUuid: saveUuid
              })
            })
          }
        })
        .catch(e => {
          Notify.COMMON_WARNING(e)
        })
    },
    fileSelect (evt) {
      let files = evt.target.files
      if (!files.length) {
        return
      }
      this.file = new WUFile({
        file: files[0],
        blockSize: this.uploadConfig.BlockSize,
        chunkSize: this.uploadConfig.ChunkSize,
        uuid: ':TORRENT',
        chunkRetry: this.uploadConfig.ChunkRetry
      })
      let promise = Promise.resolve(this.file)

      promise
        .then(file => {
          file.setStatus(WUFile.STATUS.CALCULATING)
          return file.getHash()
        })
        .then(file => {
          file.setStatus(WUFile.STATUS.PREPARING)
          return file.getToken()
        })
        .then(file => {
          if (file.isExisted()) {
            file.setStatus(WUFile.STATUS.DONE)
            let info = file.getFileInfo()
            file.destroy()
            this.parseTorrent(info)
          } else {
            file.setStatus(WUFile.STATUS.UPLOADING)
            this.uploadBTFile(file)
          }
        })
        .catch(e => {
          Notify.COMMON_WARNING(e)
        })
    },
    uploadBTFile (file) {
      let uploadInfo = file.getServerInfo()
      Promise
        .resolve(file)
        .then((file) => {
          return axios.post(
            uploadInfo.url,
            file.slice(uploadInfo.chunk.startByte, uploadInfo.chunk.endByte),
            {
              headers: {
                Authorization: uploadInfo.Authorization,
                UploadBatch: uploadInfo.UploadBatch,
                'Content-Type': 'application/octet-stream'
              }
            }
          )
        })
        .then((res) => {
          file.setCtx(res.ctx, uploadInfo.chunk)
          if (uploadInfo.chunk.isFileEnd) {
            const creatServer = file.getCreatFileServerInfo()
            return axios.post(
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
            this.uploadBTFile(file)
          }
        })
        .then(res => {
          if (!res) {
            return
          }
          if (res.hash !== file.sha1) {
            Notify.FILE_CHECK_FAILED(file.name)
            file.setStatus(WUFile.STATUS.FAILED)
          } else {
            let fileInfo = JSON.parse(res.response).result
            file.setFileInfo(fileInfo)
            file.setStatus(WUFile.STATUS.DONE)
            file.destroy()
            this.parseTorrent(fileInfo)
          }
        })
        .catch(e => {
          Notify.COMMON_WARNING(e)
        })
    },
    parseTorrent (fileInfo) {
      api
        .offline
        .parseTorrent({
          uuid: fileInfo.uuid
        })
        .then(res => {
          FileSelect({
            list: res.result.files,
            title: res.result.name
          })
          .then(({files, saveUuid}) => {
            this.start({
              type: this.types.BT,
              taskHash: res.result.taskHash,
              files: files,
              saveUuid: saveUuid
            })
          })
        })
        .catch(res => {
          Notify.COMMON_WARNING(res)
        })
    },
    start (opts = {}) {
      api
        .offline
        .start(opts)
        .then(res => {
          Notify.OFFLINE_SUCCESS()
          this.$emit('addonSuccess', res.result)
        })
        .catch(res => {
          Notify.COMMON_WARNING(res)
        })
    },
    btDownload () {
      this.$refs.fileinput.click()
    }
  }
}
</script>

<style scoped>
.dirtree {
  max-height: 700px;
  overflow: auto;
}
</style>