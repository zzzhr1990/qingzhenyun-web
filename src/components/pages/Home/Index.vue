<template>
  <el-container class="container" v-loading="loading">
    <el-aside width="100px" class="aside">
      <layoutAside></layoutAside>
    </el-aside>
    <el-container>
      <el-header class="header">
        <layoutNavHeader :defaultnav="'1'"></layoutNavHeader>
      </el-header>
      <el-main class="main">
        <el-container>
          <el-header class="mainheader" height="80px">
            <layoutControlHeader></layoutControlHeader>
          </el-header>
          <el-main class="main-content">
            <layoutMainList></layoutMainList>
          </el-main>
        </el-container>
      </el-main>
      <el-footer class="footer" v-if="paginationShow">
        <layoutFooter></layoutFooter>
      </el-footer>
    </el-container>
  </el-container>
</template>

<script>
import { mapGetters } from 'vuex'
import layoutAside from './layoutAside'
import layoutNavHeader from './layoutNavHeader'
import layoutFooter from './layoutFooter'
import layoutControlHeader from './layoutControlHeader'
import layoutMainList from './layoutMainList'
export default {
  components: {
    layoutAside,
    layoutNavHeader,
    layoutFooter,
    layoutControlHeader,
    layoutMainList
  },
  computed: {
    ...mapGetters('files', ['pageInfo', 'loading']),
    paginationShow () {
      return this.pageInfo.totalPage > 1
    }
  }
}
</script>

<style scoped>
.footer {
  padding: 0;
}
.aside {
  background: #F2F2F2;
}
.header {
  padding: 0;
}
.container {
  width: 100%;
  height: 100%;
}

.main {
  background: #FFFFFF;
  border-radius: 7px;
}
.main-content,
.mainheader {
  padding: 0;
}
</style>