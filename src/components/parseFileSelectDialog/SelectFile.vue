<template>
  <div>
    <el-dialog :title="fileName" :visible.sync="visible" :close="close">
      <el-table
        ref="multipleTable"
        :data="list"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          label="文件"
          width="200"
          prop="name"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          label="路径"
          width="200"
          prop="path"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          label="大小"
          width="120">
          <template slot-scope="scope">{{ fileSizeFilter(scope.row.length) }}</template>
        </el-table-column>
      </el-table>
      <div slot="footer">
        <el-button @click="selectDir">选择文件夹</el-button>
        <el-button @click="ok">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import myMixins from '@/components/common/mixins/utils'
import DirSelectDialogShow from '@/components/dirSelectDialog'
export default {
  name: 'SelectFile',
  data () {
    return {
      list: [],
      fileName: '',
      visible: false,
      dir: '',
      selectedFiles: ''
    }
  },
  mixins: [myMixins],
  methods: {
    handleSelectionChange (selections) {
      if (selections.length === this.list.length) {
        this.selectedFiles = '*'
        return
      }
      var selectionsFiles = []
      for (let i = 0, j = 0, len = this.list.length; i < len; i++) {
        if (this.list[i] === selections[j]) {
          selectionsFiles.push(i)
          j++
        }
      }
      this.selectedFiles = selectionsFiles.join(',')
    },
    selectDir () {
      DirSelectDialogShow()
        .then(dir => {
          if (dir === '根目录') {
            this.dir = ''
          } else {
            this.dir = dir.uuid
          }
        })
        .catch(e => {})
    },
    ok () {
      this.$emit('selectDone', {
        files: this.selectedFiles,
        saveUuid: this.dir
      })
      this.$nextTick(() => {
        this.close()
      })
    },
    close () {
      this.visible = false
      this.$nextTick(() => {
        this.$destroy(true)
        this.$el.parentNode.removeChild(this.$el)
      })
    }
  }
}
</script>
