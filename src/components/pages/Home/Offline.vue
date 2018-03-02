<template>
  <el-container class="container" v-loading="loading">
    <el-aside width="100px" class="aside">
      <layoutAside></layoutAside>
    </el-aside>
    <el-container>
      <el-header class="header">
        <layoutNavHeader :defaultnav="'2'"></layoutNavHeader>
      </el-header>
      <el-main class="main">
        <el-container>
          <el-header class="mainheader" height="80px">
          </el-header>
          <el-main class="main-content">
            <layoutOfflineList></layoutOfflineList>
          </el-main>
        </el-container>
      </el-main>
      <el-footer class="footer" v-if="paginationShow">
        <layoutOfflineFooter></layoutOfflineFooter>
      </el-footer>
    </el-container>
  </el-container>
</template>

<script>
import { mapGetters } from 'vuex'
import layoutAside from './layoutAside'
import layoutNavHeader from './layoutNavHeader'
import layoutOfflineFooter from './layoutOfflineFooter'
import layoutOfflineList from './layoutOfflineList'
export default {
  components: {
    layoutAside,
    layoutNavHeader,
    layoutOfflineFooter,
    layoutOfflineList
  },
  computed: {
    ...mapGetters('offline', ['pageInfo', 'loading']),
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