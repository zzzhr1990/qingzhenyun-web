import * as types from '@/store/mutation-types'
import Message from '@/components/common/message/message'
export default {
  methods: {
    loginAction () {
      if (this.isLogining) {
        this.$message(Message.WAITING)
        return
      }
      this.$store.dispatch('login/login', this.loginField)
        .then(res => {
          const result = res.body
          if (result.success) {
            this.$message(Message.LOGIN_SUCCESS)
            this.$store.commit('login/' + types.LOGIN_SET_UINFO, result.result)
            this.$store.commit('login/' + types.LOGIN_SET_TOKEN, result.token)
            this.goToHome()
          } else {
            this.$message(Message.COMMON_WARNING(result))
          }
          this.$store.commit('login/' + types.LOGIN_SUCCESS)
        })
        .catch((e) => {
          this.catchErrorHandler(e, 'login/' + types.LOGIN_FAILURE)
        })
    },

    logoutAction () {
      this.$store.dispatch('login/logout')
      this.$message(Message.LOGOUT_SUCCESS)
      this.$nextTick(() => {
        this.$router.replace('login')
      })
    }
  }
}
