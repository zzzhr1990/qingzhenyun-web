<template>
  <v-card>
    <v-toolbar card dense>
      <v-toolbar-title class="body-2">短信快捷登录</v-toolbar-title>
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
        <v-select
          prepend-icon="terrain"
          item-text="country"
          item-value="code"
          :items="countryCode"
          label="国家/地区代码"
          return-object
          :hint="`${select.code}`"
          persistent-hint
          v-model="select"
        ></v-select>
        <v-text-field
          prepend-icon="phone"
          v-model="value"
          label="手机号"
          type="text"
          required
          :rules="phoneRules"
          hint="其他登录方式请点击扩展栏"
        ></v-text-field>
        <v-text-field
          prepend-icon="message"
          v-model="code"
          label="验证码"
          id="code"
          type="text"
          required
          :rules="codeRules"
          maxlength="6"
          hint="请输入6位验证码"
        ></v-text-field>
        <v-btn
          @click="getCode"
          :disabled="(fetching || timer) && true"
          color="blue light-3"
          flat
        >{{ buttonText }}</v-btn>
      </v-form>
    </v-card-text>
    <v-container>
      <v-btn
        block
        color="primary"
        :loading="fetching"
        :disabled="!valid || fetching"
        @click="loginWithMsg"
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
import countryCode from '@/assets/countryCode.json'

export default {
  layout: 'toolbarback',
  head: {
    title: '短信快捷登录'
  },
  data () {
    return {
      // 选择的国家号
      select: {
        country: 'China',
        code: '86'
      },
      countryCode: countryCode,
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
      codeRules: [
        v => !!v || '请填写验证码',
        v => /^\d{6}$/.test(v) || '验证码非法'
      ],
      phoneRules: [
        v => !!v || '必须填写！',
        v => /^1[0-9]+$/.test(v) || '手机号码填写有误！'
      ],
      valid: true,
      value: '',
      password: '',
      code: '',
      timer: null,
      buttonText: '发送验证码',
      time: 120
    }
  },
  computed: {
    ...mapState('login', ['fetching', 'message', 'phoneInfo'])
  },
  watch: {
    message (msg) {
      Message[msg.type](msg.message)
      this.clearTimer()
    }
  },
  beforeDestroy () {
    this.clearTimer()
  },
  methods: {
    ...mapActions('login', [
      'loginByMsg',
      'sendMsg'
    ]),
    go (link) {
      this.$router.push(link)
    },
    async loginWithMsg () {
      let done = await this.loginByMsg({
        phoneInfo: this.phoneInfo,
        code: this.code
      })
      if (done) {
        this.$nextTick(() => {
          this.$router.push('/home/root/1')
        })
      }
    },
    clearTimer () {
      clearInterval(this.timer)
      this.time = 120
      this.buttonText = '发送验证码'
      this.timer = null
    },
    getCode () {
      this.timer = setInterval(() => {
        this.time--
        this.buttonText = this.time + ''
        if (this.time < 0) {
          this.clearTimer()
        }
      }, 1000)
      this.sendMsg({
        countryCode: this.select.code,
        phone: this.value
      })
    }
  }
}
</script>
