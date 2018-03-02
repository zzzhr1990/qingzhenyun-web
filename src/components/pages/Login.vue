<template>
  <div class="login loginbox">
    <div class="header">
      <Avator type="big" :src="userInfo.src"></Avator>
      <div class="nav">
        <span class="login" :class="loginActive" @click="navLogin">登录</span>
        <span class="register" :class="registerActive" @click="navRegister">注册</span>
      </div>
    </div>
    <transition
      name="custom-classes-transition"
      enter-active-class="fadeInUp"
    >
      <form v-show="showLoginBox" class="content" action="#" @submit.stop.prevent>
        <el-input v-model="loginField.value" placeholder="手机/邮箱" type="text">
          <template slot="prepend">
            <i class="icon account"></i>
          </template>
        </el-input>
        <el-input v-model="loginField.password" placeholder="密码" type="password">
          <template slot="prepend">
            <i class="icon password"></i>
          </template>
        </el-input>
        <ButtonUI size="normal" emphas="true" :disabled="disabled" @clickButton="loginAction">登录</ButtonUI>
      </form>
    </transition>
    <transition
      name="custom-classes-transition"
      enter-active-class="fadeInUp"
    >
      <form v-show="!showLoginBox" class="content" action="#" @submit.stop.prevent>
        <el-input v-model="emailField.name" placeholder="昵称" type="text">
          <template slot="prepend">
            <i class="icon account"></i>
          </template>
        </el-input>
        <el-input v-model="emailField.email" placeholder="邮箱" type="text">
          <template slot="prepend">
            <i class="icon email"></i>
          </template>
        </el-input>
        <el-input v-model="emailField.phone" placeholder="手机号码" type="text">
          <template slot="prepend">
            <i class="icon phone"></i>
          </template>
        </el-input>
        <el-input v-model="emailField.password" placeholder="密码" type="text">
          <template slot="prepend">
            <i class="icon password"></i>
          </template>
        </el-input>
        <ButtonUI size="normal" emphas="true" :disabled="disabledRegistWithEmail" @clickButton="signinWithEmail">免费注册</ButtonUI>
      </form>
    </transition>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ButtonUI from '@/components/common/ButtonUI'
import Avator from '@/components/common/Avator'
import * as types from '@/store/mutation-types'
import loginMixins from '@/components/common/mixins/login'
import myMixins from '@/components/common/mixins/utils'
import Message from '@/components/common/message/message'
export default {
  components: {
    ButtonUI,
    Avator
  },
  mixins: [myMixins, loginMixins],
  data () {
    return {
      loginField: {
        value: '',
        password: ''
      },
      emailField: {
        name: '',
        email: '',
        password: '',
        phone: ''
      },
      // phoneField: {
      //   name: '',
      //   phone: '',
      //   code: '',
      //   password: ''
      // },
      // showEmailRegister: true,
      showLoginBox: true
    }
  },
  computed: {
    ...mapGetters('login', ['userInfo', 'isLogining', 'isRegisting']),
    loginActive () {
      return {
        cur: this.showLoginBox
      }
    },
    registerActive () {
      return {
        cur: !this.showLoginBox
      }
    },
    disabled () {
      return !(this.loginField.value && this.loginField.password)
    },
    disabledRegistWithEmail () {
      return !(this.emailField.name && this.emailField.password && this.emailField.email && this.emailField.phone)
    },
    // disabledRegistWithPhone () {
    //   return !(this.phoneField.name && this.phoneField.phone && this.phoneField.password)
    // },
    disabledValidBtn () {
      return true
    }
  },
  watch: {
    // 'loginField.value' (newValue, oldValue) {
    //   if (this.containBlank(newValue)) {
    //     this.loginField.value = newValue.trim()
    //   }
    // },
    // 'loginField.password' (newValue, oldValue) {
    //   if (this.containBlank(newValue)) {
    //     this.loginField.passowrd = newValue.trim()
    //   }
    // },
    // 'emailField.name' (newValue, oldValue) {
    //   if (this.containBlank(newValue)) {
    //     this.emailField.name = newValue.trim()
    //   }
    // },
    // 'emailField.password' (newValue, oldValue) {
    //   if (this.containBlank(newValue)) {
    //     this.emailField.password = newValue.trim()
    //   }
    // },
    // 'emailField.email' (newValue, oldValue) {
    //   if (this.containBlank(newValue)) {
    //     this.emailField.email = newValue.trim()
    //   }
    // },
    // 'phoneField.password' (newValue, oldValue) {
    //   if (this.containBlank(newValue)) {
    //     this.phoneField.password = newValue.trim()
    //   }
    // },
    // 'phoneField.name' (newValue, oldValue) {
    //   if (this.containBlank(newValue)) {
    //     this.phoneField.name = newValue.trim()
    //   }
    // },
    // 'phoneField.phone' (newValue, oldValue) {
    //   if (this.containBlank(newValue)) {
    //     this.phoneField.phone = newValue.trim()
    //   }
    // }
  },
  methods: {
    // containBlank (v) {
    //   return /(^\s+|\s+$)/.test(v)
    // },
    navLogin () {
      this.showLoginBox = true
    },
    navRegister () {
      this.showLoginBox = false
    },
    goToHome () {
      this.$nextTick(() => {
        this.$router.replace('home')
      })
    },
    register (field) {
      if (this.isRegisting) {
        this.$message(Message.WAITING)
        return
      }
      this.$store.dispatch('login/register', field)
        .then(res => {
          const result = res.body
          if (result.success) {
            this.$message(Message.REGIST_SUCCESS)
            this.$store.commit('login/' + types.LOGIN_SET_UINFO, result.result)
            this.goToHome()
          } else {
            this.$message(Message.COMMON_WARNING(result))
          }
          this.$store.commit('login/' + types.SIGNIN_SUCCESS)
        })
        .catch((e) => {
          this.catchErrorHandler(e, 'login/' + types.SIGNIN_FAILURE)
        })
    },
    signinWithEmail (field) {
      this.register(this.emailField)
    },
    signinWithPhone () {
      this.register(this.phoneField)
    },
    // switchPage () {
    //   this.showEmailRegister = !this.showEmailRegister
    // },
    getValidCode () {
    }
  }
}
</script>

<style scoped>
.loginbox {
  top: -500px;
}
.avator {
  margin: 0 auto;
}
.nav {
  margin-top: 40px;
  font-size: 18px;
  color: #b5b5b5;
}
.login,
.register {
  display: inline-block;
  height: 40px;
  line-height: 40px;
  box-sizing: border-box;
  cursor: pointer;
}
.cur {
  color: #53d9a4;
  border-bottom: 2px solid #53d9a4;;
}
.register {
  margin-left: 65px;
}
.content {
  margin-top: 60px;
}
.group {
  text-align: left;
}
.group .el-input-group {
  display: inline-block;
  width: 210px;
}
.group .buttonUI {
  display: inline-block;
  width: 120px;
  margin-left: 10px;
  vertical-align: top;
}
/*.y {
  text-align: right;
  color: #53d9a4;
}*/
</style>