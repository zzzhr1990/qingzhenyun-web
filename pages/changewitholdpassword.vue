<template>
  <v-card>
    <v-toolbar card dense>
      <v-toolbar-title class="body-2">修改密码</v-toolbar-title>
    </v-toolbar>
    <v-card-text></v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn flat color="blue lighten-3" small to="/login">已有账号？</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import Message from 'vuetify-toast'
import { mapState, mapActions } from 'vuex'
export default {
  layout: 'toolbarback',
  head: {
    title: '修改密码'
  },
  middleware: 'auth',
  data () {
    return {
      newPsw: '',
      pswRules: [
        v => !!v || '请输入新密码',
        v => {
          var t = 0
          if (v === null) {
            return false
          }
          if (v.length < 6) {
            t = 0
          }
          if (v.match(/([a-z])+/)) {
            t++
          }
          if (v.match(/([0-9])+/)) {
            t++
          }
          if (v.match(/[^a-zA-Z0-9]+/)) {
            t++
          }
          if (t < 3) {
            return '密码过于简单'
          }
          return true
        }
      ],
      password: '',
      passwordRules: [
        v => !!v || '请填写密码'
      ]
    }
  },

  computed: {
    ...mapState('changepasswordwitholdpassword', ['fetching', 'message'])
  },

  watch: {
    message (newVal) {
      Message[newVal.type](newVal.message)
      this.clearTimer()
    }
  },

  beforeDestroy () {
    this.clearTimer()
  },

  methods: {
    ...mapActions('changepasswordwitholdpassword', [
      'change'
    ]),

    async changePassword () {
      let done = await this.changeByMsg({
        newPassword: this.newPsw,
        oldPassword: this.password
      })
      if (done) {
        Message['success']('修改密码成功，请登录！')
        this.$nextTick(() => {
          this.$router.push('/login')
        })
      }
    }
  }
}
</script>
