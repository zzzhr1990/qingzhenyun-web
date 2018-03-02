<template>
  <div class="efooter">
    <el-pagination
      class="pagination"
      layout="prev, pager, next"
      :page-count="pageInfo.totalPage"
      :page-size="pageInfo.pageSize"
      :total="pageInfo.totalCount"
      :current-page="pageInfo.page"
      @current-change="onPageChange"
    >
    </el-pagination>
  </div>
</template>

<script>
import * as types from '@/store/mutation-types'
import { mapGetters } from 'vuex'
import offlineMixins from '@/components/common/mixins/offline'
export default {
  name: 'layoutOfflineFooter',
  computed: {
    ...mapGetters('offline', ['order', 'pageInfo'])
  },
  mixins: [offlineMixins],
  methods: {
    onPageChange (currentPage) {
      this.getOfflineData({
        order: this.order,
        page: currentPage,
        pageSize: types.HOME_PAGE_SIZE
      })
    }
  }
}
</script>

<style scoped>
.efooter {
  background: #fff;
  height: 60px;
}
</style>