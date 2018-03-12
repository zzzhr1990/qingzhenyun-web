<template>
  <div>
    <div class="userpanel" v-show="pagefileselect.length < 2">
      <div class="panel-left">
        <div class="volumn">可用空间：</div>
        <el-progress :percentage="10" status="success" :show-text="false"></el-progress>
      </div>
      <div class="panel-right">
        <el-button round class="btn" @click="createDirectoryBtnClicked"><Icon type="folderadd"></Icon>新建文件夹</el-button>
        <el-button round class="btn" @click="offlineDownload"><Icon type="download"></Icon>离线下载</el-button>
        <el-button round class="btn" @click="uploadClicked"><Icon type="upload"></Icon>上传</el-button>
      </div>
    </div>
    <div class="ctrlpanel" v-show="pagefileselect.length >= 2">
      <div class="panel-right">
        <el-button-group>
          <el-button round class="btn" @click="downloadAll">下载</el-button>
          <el-button round class="btn" @click="deleteAll">删除</el-button>
          <el-button round class="btn" @click="moveAll">移动到</el-button>
          <el-button round class="btn" @click="renameAll">重命名</el-button>
        </el-button-group>
      </div>
    </div>
    <div class="breadcrumb">
      <span @click="jumpTo('')">全部文件</span>
      <span v-for="path in pageInfo.path" :key="path.uuid" @click="jumpTo(path.uuid)">/ {{path.name}}</span>
    </div>
  </div>
</template>

<script>
import Icon from '@/components/common/Icon'
import { mapGetters } from 'vuex'
import * as types from '@/store/mutation-types'
import fileMixns from '@/components/common/mixins/file'
import myMixins from '@/components/common/mixins/utils'
import Message from '@/components/common/message/message'
import Notify from '@/components/common/message/notify'
import UploadBoxShow from '@/components/uploadBox'
import OfflinePopbox from '@/components/offlinePopbox'
export default {
  name: 'layoutControlHeader',
  computed: {
    ...mapGetters('login', ['userInfo']),
    ...mapGetters('files', ['uuid', 'pageInfo', 'loading']),
    ...mapGetters('pagefileselect', ['pagefileselect'])
  },
  components: {
    Icon
  },
  data () {
    return {
      showUploadBox: false
    }
  },
  mixins: [fileMixns, myMixins],
  methods: {
    jumpTo (uuid) {
      if (uuid === this.uuid) {
        return
      }
      this.getData({
        parent: uuid,
        page: 1,
        pageSize: types.HOME_PAGE_SIZE
      })
    },
    renameAll () {
      this.renameFile(this.pagefileselect)
    },
    moveAll () {
      this.moveFile(this.pagefileselect)
    },
    deleteAll () {
      this.$confirm('此操作将删除多个文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let promiselist = []
        for (const selected of this.pagefileselect) {
          promiselist.push(this.deleteone(selected))
        }
        return Promise.all(promiselist)
      }).then(() => {
        this.pageReFresh()
      })
    },
    downloadAll () {
      this.$message(Message.DEVELOPING)
    },
    createDirectoryBtnClicked () {
      this.$prompt('请输入文件夹名称', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
        // inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
        // inputErrorMessage: '邮箱格式不正确'
      }).then(({ value }) => {
        this.createDirectory(value)
      })
    },
    createDirectory (value) {
      this
        .$store
        .dispatch(`files/create`, {
          parent: this.uuid,
          name: value
        })
        .then((result) => {
          this.$notify(Notify.DIR_CREATE_SUCCESS(value))
          this.$store.commit(`files/${types.PATH_CREATE_SUCCESS}`, result.result)
        })
        .catch((res) => {
          const result = Message.COMMON(res)
          this.$notify(Notify.DIR_CREATE_FAILED(value, result.code || result.message))
          this.$store.commit(`files/${types.PATH_CREATE_FAILURE}`)
        })
    },
    offlineDownload () {
      OfflinePopbox()
    },
    uploadClicked () {
      UploadBoxShow()
    }
  }
}
</script>

<style scoped>
.ctrlpanel,
.userpanel {
  height: 42px;
}
.ctrlpanel:after,
.userpanel:after {
  display: block;
  content: '';
  width: 0;
  height: 0;
  clear: both;
}
.panel-left {
  float: left;
  text-align: left;
  width: 260px;
  color: #d8d8d8;
}
.panel-right {
  float: right;
}
.volumn {
  margin-bottom: 10px;
}
.btn {
  border: 1px solid #53D9A4;
  border-radius: 30px;
  color: #53D9A4;
}
.btn:hover,
.btn:active {
  background-image: linear-gradient(-90deg, #53D9A4 4%, #B6E6A9 100%);
  color: #fff;
  border: 1px solid transparent;
}
.btn .icon {
  margin-right: 5px;
}
.breadcrumb {
  margin-top: 10px;
  text-align: left;
}

.breadcrumb span {
  cursor: pointer;
}
</style>