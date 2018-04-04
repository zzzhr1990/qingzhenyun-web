<template>
  <v-card>
    <v-toolbar card dense>
      <v-toolbar-title class="body-2">账号密码登录</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-menu bottom right>
        <v-btn icon slot="activator">
          <v-icon>more_vert</v-icon>
        </v-btn>
        <v-list>
          <v-list-tile v-for="(item, i) in items" :key="i" @click="go(item.to)">
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
    </v-toolbar>
    <v-card-text>
      <v-form v-model="valid">
        <v-text-field
          prepend-icon="person"
          v-model="value"
          label="手机/用户名/邮箱"
          type="text"
          required
          :rules="rules"
          hint="其他登录方式请点击扩展栏"
        ></v-text-field>
        <v-text-field
          prepend-icon="lock"
          v-model="password"
          label="密码"
          id="password"
          type="password"
          required
          :rules="rules"
        ></v-text-field>
      </v-form>
    </v-card-text>
    <v-container>
      <v-btn
        block
        color="primary"
        :loading="fetching"
        :disabled="!valid || fetching"
        @click="loginWithName"
      >登录</v-btn>
    </v-container>
    <v-layout>
      <v-btn small flat color="blue" :nuxt="true" to="/regist">没有账号?</v-btn>
      <v-spacer></v-spacer>
      <v-btn small flat color="blue" :nuxt="true" to="/changepswwithmsg">忘记密码?</v-btn>
    </v-layout>
  </v-card>
</template>

<script>
import Message from 'vuetify-toast'
import { mapState, mapActions } from 'vuex'
export default {
  layout: 'toolbarback',
  head: {
    title: '账号密码登录'
  },
  data () {
    return {
      items: [
        {
          title: '账号密码登录',
          to: '/login'
        },
        {
          title: '海外手机登录',
          to: '/loginwithphone'
        },
        {
          title: '短信快捷登录',
          to: '/loginwithmsg'
        }
      ],
      rules: [v => !!v || '必须填写！'],
      valid: true,
      value: '',
      password: ''
    }
  },
  computed: {
    ...mapState('login', ['fetching', 'message'])
  },
  watch: {
    message (msg) {
      Message[msg.type](msg.message)
    }
  },
  methods: {
    ...mapActions('login', [
      'login'
    ]),
    go (link) {
      this.$router.push(link)
    },
    async loginWithName () {
      let done = await this.login({
        value: this.value,
        password: this.password,
        countryCode: '86'
      })
      if (done) {
        this.$nextTick(() => {
          this.$router.push('/home/')
        })
      }
    }
  }
}
</script>
