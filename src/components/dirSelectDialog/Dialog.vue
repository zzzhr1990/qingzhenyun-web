<template>
  <el-dialog title="选择文件夹" :visible.sync="dialogTableVisible">
    <div class="dirtree">
      <el-tree
        :props="dirtree"
        :load="loadDir"
        :render-content="refresh"
        :expand-on-click-node="false"
        @node-click="selectDir"
        lazy
      >
      </el-tree>
    </div>
    <el-button type="success" @click="ensureSelectedDir">确定</el-button>
    <el-button @click="cancelSelectedDir">取消</el-button>
  </el-dialog>
</template>

<script>
import api from '@/api'
export default {
  data () {
    return {
      dirtree: {
        label: function (data, node) {
          return data.name
        },
        data: null,
        isLeaf: true
      },
      dialogTableVisible: false,
      selectedDir: ''
    }
  },
  methods: {
    ensureSelectedDir () {
      this.dialogTableVisible = false
      this.$emit('selected', this.selectedDir)
    },

    cancelSelectedDir () {
      this.dialogTableVisible = false
    },

    selectDir (data) {
      this.selectedDir = data
    },

    refreshDirData ($event, ctx) {
      $event.stopPropagation()
      ctx.node.loaded = false
      ctx.node.expand()
    },

    loadDir (node, resolve) {
      if (node.level === 0) {
        return resolve([{ name: '根目录' }])
      }
      api
        .files
        .page({
          parent: node.data.uuid,
          type: 1,
          pageSize: 999
        })
        .then((result) => {
          resolve(result.result.list)
        })
    },

    refresh (h, ctx) {
      return (
        <span style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
          <span>
            <span>{ctx.node.label}</span>
          </span>
          <span>
            <i class="el-icon-refresh" on-click={($event) => this.refreshDirData($event, ctx)}></i>
          </span>
        </span>
      )
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
