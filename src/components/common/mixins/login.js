import * as types from '@/store/mutation-types'
import Message from '@/components/common/message/message'
export default {
  data: function () {
    return {
      loginField: {
        value: '',
        password: ''
      }
    }
  },
  methods: {
    goToHome () {
      this.$nextTick(() => {
        this.$router.replace('home')
      })
    },
    loginAction () {
      if (this.isLogining) {
        Message.WAITING()
        return
      }
      this.$store.dispatch('login/login', this.loginField)
        .then(result => {
          Message.LOGIN_SUCCESS()
          this.$store.commit('login/' + types.LOGIN_SET_UINFO, result.result)
          this.$store.commit('login/' + types.LOGIN_SET_TOKEN, result.token)
          this.$store.commit('login/' + types.LOGIN_SUCCESS)
          this.goToHome()
        })
        .catch((e) => {
          this.catchErrorHandler(e, 'login/' + types.LOGIN_FAILURE)
        })
    },
    logoutAction () {
      this.$store.dispatch('login/logout')
      Message.LOGOUT_SUCCESS()
      this.$nextTick(() => {
        this.$router.replace('login')
      })
    }
  }
}
