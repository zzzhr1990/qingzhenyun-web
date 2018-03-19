<template>
  <div>
    <div>
      <el-popover
        ref="popover"
        placement="bottom"
        v-model="visible2">
        <div>
          <div>
            <el-button size="mini" type="text" @click="setOrder(-1)">按时间顺序</el-button>
          </div>
          <div>
            <el-button type="text" size="mini" @click="setOrder(1)">按时间倒序</el-button>
          </div>
        </div>
      </el-popover>
      <el-button v-popover:popover>排序方式</el-button>
      <el-button type="primary" @click="offlineDownload">离线下载</el-button>
      <el-button @click="deleteAll" v-show="showDeleteBtn">删除全部</el-button>
    </div>
    <el-table
      ref="multipleTable"
      :data="pageInfo.list"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange">
    >
      <el-table-column
        type="selection"
        width="45">
      </el-table-column>
      <el-table-column
        label="文件名"
        width="200"
        show-overflow-tooltip
        prop="name"
      >
      </el-table-column>
      <el-table-column
        label="存储路径"
        show-overflow-tooltip
        prop="path"
      >
      </el-table-column>
      <el-table-column
        label="进度"
        prop="progress"
      >
      </el-table-column>
      <el-table-column
        label="状态"
      >
        <template slot-scope="scope">
          <span>{{scope.row.status === 200 ? '下载完成' : '正在下载'}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        width="110"
      >
        <template slot-scope="scope">
          <span class="updateTime">{{filterTime(scope.row.createTime)}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
      >
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-delete" @click="deleteFile(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import * as types from '@/store/mutation-types'
import { mapGetters } from 'vuex'
import myMixins from '@/components/common/mixins/utils'
import offlineMixins from '@/components/common/mixins/offline'
import Notify from '@/components/common/message/notify'
import OfflinePopbox from '@/components/offlinePopbox'

export default {
  name: 'layoutOfflineList',
  mixins: [myMixins, offlineMixins],
  computed: {
    ...mapGetters('offline', ['pageInfo', 'order'])
  },
  data () {
    return {
      visible2: false,
      timer: null,
      interval: 3e4,
      taskHash: [],
      showDeleteBtn: false
    }
  },
  created () {
    this.getOfflineData()
    this.timer = setInterval(() => {
      this.refresh()
    }, this.interval)
  },
  beforeDestroy () {
    clearInterval(this.timer)
  },
  methods: {
    setOrder () {
      this.visible2 = false
    },
    handleSelectionChange (selections) {
      let taskHash = selections.map((element) => {
        return element.taskHash
      })
      this.showDeleteBtn = selections.length
      this.taskHash = taskHash
    },
    deleteAll () {
      this.stopTask(this.taskHash)
    },
    stopTask (taskHash) {
      this
        .$store
        .dispatch('offline/stop', {
          taskHash: taskHash
        })
        .then(res => {
          Notify.OFFLIEN_REMOVE_SUCCESS()
          this.$store.commit(`offline/${types.OFFLINE_PATH_DELETE_SUCCESS}`)
          this.refresh()
        })
        .catch(e => {
          Notify.COMMON_WARNING(e)
          this.$store.commit(`offline/${types.OFFLINE_PATH_DELETE_FAILURE}`)
        })
    },
    refresh () {
      this.getOfflineData({
        page: this.pageInfo.page,
        pageSize: this.pageInfo.pageSize,
        order: this.order
      })
    },
    deleteFile (data) {
      this.stopTask([data.taskHash])
    },
    offlineDownload () {
      OfflinePopbox()
    }
  }
}
</script>
