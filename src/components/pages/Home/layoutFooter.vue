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
import fileMixns from '@/components/common/mixins/file'
export default {
  name: 'layoutFooter',
  computed: {
    ...mapGetters('login', ['userInfo']),
    ...mapGetters('files', ['uuid', 'pageInfo', 'loading'])
  },
  mixins: [fileMixns],
  methods: {
    onPageChange (currentPage) {
      this.getData({
        parent: this.uuid,
        page: currentPage,
        pageSize: types.HOME_PAGE_SIZE
      })
      this.$store.commit(`files/${types.PATH_SET_PAGE_NUMBER}`, currentPage)
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
