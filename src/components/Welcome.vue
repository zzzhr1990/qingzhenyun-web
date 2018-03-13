<template>
  <div class="welcome" v-loading.body="loading">
    <div class="header">
      <ul class="nav">
        <li class="register"><ButtonUI size="normal" emphas="true" @clickButton="register">免费注册</ButtonUI></li>
        <li @click="login">登录</li>
        <li @click="client">客户端</li>
      </ul>
    </div>
    <form class="loginbox" action="#" @submit.stop.prevent>
      <el-input v-model="loginField.value" placeholder="用户名/手机号/电话号码" type="text">
        <template slot="prepend">
          <i class="icon nickname"></i>
        </template>
      </el-input>
      <!-- <el-input v-model="loginField.email" placeholder="手机/邮箱" type="text">
        <template slot="prepend">
          <i class="icon email"></i>
        </template>
      </el-input> -->
      <el-input v-model="loginField.password" placeholder="密码" type="password">
        <template slot="prepend">
          <i class="icon password"></i>
        </template>
      </el-input>
      <ButtonUI size="normal" emphas="true" :disabled="disabled" @clickButton="loginAction">免费体验</ButtonUI>
    </form>
  </div>
</template>

<script>
import ButtonUI from '@/components/common/ButtonUI'
import { mapGetters } from 'vuex'
import loginMixins from '@/components/common/mixins/login'
import myMixins from '@/components/common/mixins/utils'
import Message from '@/components/common/message/message'
export default {
  components: {
    ButtonUI
  },
  mixins: [myMixins, loginMixins],
  data () {
    return {
      // username: 'guest',
      // email: '',
      // password: '12345678',
      loading: false
    }
  },
  computed: {
    ...mapGetters('login', ['isLogining']),
    disabled () {
      return !(this.loginField.value && this.loginField.password)
    }
  },
  methods: {
    login () {
      this.$router.push('/login')
    },
    client () {
      Message.DEVELOPING()
    },
    register () {
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
.welcome {
  height: 100%;
  position: relative;
}
.header {
  height: 80px;
  background-color: #f2f2f2;
}
.nav:after {
  clear: both;
  content: '';
  display: block;
}

.nav li {
  margin-left: 50px;
  float: right;
  font-size: 18px;
  color: #b5b5b5;
  line-height: 80px;
  cursor: pointer;
}

.register {
  width: 180px;
  margin-right: 20px;
}
</style>
