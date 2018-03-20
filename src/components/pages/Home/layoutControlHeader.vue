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
      <span v-for="(path, index) in pageInfo.path" :key="path.uuid" @click="jumpTo(path.uuid)">/ {{index === 0 ? '全部文件' : path.name}}</span>
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
import { MessageBox } from 'element-ui'

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
      this.deleteFile(this.pagefileselect)
    },
    downloadAll () {
      Message.DEVELOPING()
    },
    createDirectoryBtnClicked () {
      MessageBox({
        title: '提示',
        message: '请输入文件夹名称',
        showCancelButton: true,
        showInput: true,
        $type: 'prompt',
        confirmButtonText: '确定',
        cancelButtonText: '取消'
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
          Notify.DIR_CREATE_SUCCESS(value)
          this.$store.commit(`files/${types.PATH_CREATE_SUCCESS}`, result.result)
        })
        .catch((res) => {
          Notify.DIR_CREATE_FAILED(value, res)
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
