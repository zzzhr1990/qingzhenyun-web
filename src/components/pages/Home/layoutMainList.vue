<template>
  <el-table
    ref="multipleTable"
    :data="pageInfo.list"
    tooltip-effect="dark"
    style="width: 100%"
    height="100%"
    @selection-change="handleSelectionChange"
  >
    <el-table-column
      type="selection"
      width="45">
    </el-table-column>
    <el-table-column
      label="文件名"
      width="200"
      show-overflow-tooltip
    >
      <template slot-scope="scope">
        <div class="fileInfoHead" :title="scope.row.name" @click="fileNameClick(scope.row)">
          <div class="typeIcon">
            <FileIcon :type="fileTypeFilter(scope.row)"></FileIcon>
          </div>
          <div class="fileInfo" :class="cacluCanPointer(scope.row)">
            <div class="fileName">{{ scope.row.name }}</div>
            <div v-if="fileTypeFilter(scope.row) !== 'floder'" class="fileSize">{{fileSizeFilter(scope.row.size)}}</div>
          </div>
        </div>
      </template>
    </el-table-column>
    <el-table-column
      label="操作"
      class-name="operate"
    >
      <template slot-scope="scope">
        <span class="pointer" @click="download(scope.row)">
          <i class="el-icon-arrow-down"></i>
          下载
        </span>
        <el-dropdown @command="handleCtrlCommand">
          <span>
            <i class="el-icon-caret-bottom el-icon--right"></i>更多
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item :command="{type:'delete', data: scope.row}">删除</el-dropdown-item>
            <el-dropdown-item :command="{type:'move', data: scope.row}">移动到</el-dropdown-item>
            <el-dropdown-item :command="{type:'rename', data: scope.row}">重命名</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </template>
    </el-table-column>
    <el-table-column
      label="创建时间"
      class-name="createTime"
      width="110"
    >
      <template slot-scope="scope">
        <span class="updateTime">{{filterTime(scope.row.ctime)}}</span>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import * as types from '@/store/mutation-types'
import { mapGetters } from 'vuex'
import fileMixns from '@/components/common/mixins/file'
import myMixins from '@/components/common/mixins/utils'
import Message from '@/components/common/message/message'
import api from '@/api'
import PlayerShow from '@/components/player'
import FileIcon from '@/components/common/FileIcon'
// import '@/utils/directives/tableLoadMore'
export default {
  name: 'layoutMainList',
  mixins: [myMixins, fileMixns],
  computed: {
    ...mapGetters('files', ['pageInfo'])
  },
  components: {
    FileIcon
  },
  created () {
    this.getData()
  },
  methods: {
    cacluCanPointer (data) {
      return {
        pointer: parseInt(data.preview) % 100 === 0
      }
    },
    handleSelectionChange (selection) {
      this.$store.commit(`pagefileselect/${types.PAGE_FILE_SELECT}`, selection)
    },
    fileNameClick (data) {
      let type = this.fileTypeFilter(data)
      switch (type) {
        case 'floder':
          this.getData({
            parent: data.uuid,
            page: 1,
            pageSize: types.HOME_PAGE_SIZE
          })
          break
        case 'image':
          break
        case 'video':
          break
        case 'pack':
          break
        case 'music':
          break
        case 'documents':
          break
      }

      if (this.canPreview(data.preview)) {
        this.videoPreview(data)
      }
    },
    canPreview (preview) {
      // 暂且只有视频可预览
      return parseInt(preview) / 100 === 1
    },
    videoPreview (data) {
      api
        .preview
        .video({
          uuid: data.uuid
        })
        .then((res) => {
          PlayerShow(Object.assign({
            uuid: data.uuid
          }, res.result))
        })
        .catch((res) => {
          Message.COMMON_ERROR(res)
        })
    },
    handleCtrlCommand (command) {
      switch (command.type) {
        case 'delete':
          this.deleteFile(command.data)
          break
        case 'move':
          this.moveFile(command.data)
          break
        case 'rename':
          this.renameFile(command.data)
          break
      }
    },

    download (file) {
      api
        .files
        .download({
          uuid: file.uuid
        })
        .then((result) => {
          this.openDownloadSource(result.result.url)
        })
        .catch(res => {
          Message.COMMON_ERROR(res)
        })
    }
  }
}
</script>

<style scoped>
.pointer {
  cursor: pointer;
}
.fileInfoHead {
  text-align: left;
}
.typeIcon {
  margin-right: 8px;
}
.fileInfo {
  line-height: 1;
}
.typeIcon,
.fileInfo {
  display: inline-block;
}
.fileName {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 5px;
}
</style>

<style>
.el-table_1_column_4.createTime {
  text-align: center;
}
.el-table_1_column_3.operate {
  text-align: center;
}
</style>
