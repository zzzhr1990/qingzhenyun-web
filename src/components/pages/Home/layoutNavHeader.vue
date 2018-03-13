<template>
  <div>
    <el-menu
      class="header-menu"
      mode="horizontal"
      :default-active="defaultnav"
      router
    >
      <el-menu-item class="item" index="1" :route="{path: '/home'}">
        仓鼠云
      </el-menu-item>
      <el-menu-item class="item" index="2" :route="{path: '/offline'}">
        离线
      </el-menu-item>
    </el-menu>
    <el-dropdown class="userInfo" @command="handleUserOpt">
      <span class="el-dropdown-link">
        <Avator type="small" class="uavator" :src="userInfo.src" border="true"></Avator>
        {{userInfo.name}}<i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="changepsw">修改密码</el-dropdown-item>
        <el-dropdown-item command="exit">退出</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import loginMixins from '@/components/common/mixins/login'
import Message from '@/components/common/message/message'
import Avator from '@/components/common/Avator'
import { mapGetters } from 'vuex'
export default {
  name: 'layoutNavHeader',
  mixins: [loginMixins],
  components: {
    Avator
  },
  props: ['defaultnav'],
  computed: {
    ...mapGetters('login', ['userInfo'])
  },
  methods: {
    handleUserOpt (command) {
      switch (command) {
        case 'changepsw':
          Message.DEVELOPING()
          break
        case 'exit':
          this.logoutAction()
          break
        default:
          break
      }
    }
  }
}
</script>

<style scoped>
.avator.uavator {
  margin: 0 5px 0 0;
  display: inline-block;
  vertical-align: middle;
}
.header-menu {
  background: transparent;
  border: none;
}
.header-menu .item {
  font-size: 14px;
}
.header-menu .item:hover,
.header-menu .item:focus,
.header-menu .item.is-active {
  color: #53D9A4;
  border-bottom: 2px solid #53D9A4;
}
.userInfo {
  position: absolute;
  right: 0;
  top: 20px;
  cursor: pointer;
}
</style>