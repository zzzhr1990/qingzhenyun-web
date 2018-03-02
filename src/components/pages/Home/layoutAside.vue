<template>
  <div>
    <Avator type="middle" :src="userInfo.src" border="true"></Avator>
    <el-menu
      default-active="1"
      class="menu"
    >
      <el-menu-item class="item" index="1">
        全部文件
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
import Avator from '@/components/common/Avator'
import { mapGetters } from 'vuex'
export default {
  name: 'layoutAside',
  components: {
    Avator
  },
  computed: {
    ...mapGetters('login', ['userInfo'])
  }
}
</script>

<style scoped>
.avator {
  margin: 15px auto 0;
}
.menu {
  border: 0;
  margin-top: 80px;
  background: transparent;
}
.menu .item {
  font-size: 14px;
  color: #B5B5B5;
  letter-spacing: 0;
  text-align: center;
}
.menu .item:hover,
.menu .item:focus,
.menu .item.is-active {
  color: #53D9A4;
  background: #E2E7E5;
}
</style>