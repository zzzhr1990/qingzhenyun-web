<template>
    <LoginWrap title="登录">
        <v-form v-model="valid" slot="cardText">
            <v-text-field v-model="value" placeholder="手机/用户名/邮箱" type="text" required :rules="rules" :hide-details="true" color="#2EC17C"></v-text-field>
            <v-text-field v-model="password" placeholder="密码" id="password" type="password" required :rules="rules" :hide-details="true" color="#2EC17C"></v-text-field>
            <v-container id="qz-sign-in-extend">
                <v-layout row wrap>
                    <v-flex xs6>
                        <v-checkbox label="记住帐号" v-model="rememberUsername" hide-details color="#2EC17C"></v-checkbox>
                    </v-flex>
                    <v-flex xs6 class="text-xs-right">
                        <v-btn small flat :nuxt="true" to="/challenge/ipp">忘记密码</v-btn>
                    </v-flex>
                </v-layout>
                <v-layout row wrap>
                    <v-flex xs6>
                        <v-checkbox label="自动登录" v-model="rememberMe" hide-details color="#2EC17C"></v-checkbox>
                    </v-flex>
                    <v-flex xs6 class="text-xs-right">
                        <v-btn small flat :nuxt="true" to="/regist">注册账号</v-btn>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-form>
        <template slot="extra">
            <v-container id="qz-sign-in-submit">
                <v-btn block :loading="fetching" :disabled="!valid || fetching" @click="loginWithName">登录</v-btn>
            </v-container>
        </template>
    </LoginWrap>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Message from 'vuetify-toast'
import md5 from 'md5'
import LoginWrap from '@/components/login/wrap.vue'
import LoginFooter from '@/components/login/actions.vue'

export default {
    layout: 'sign',
    head: {
        title: '登录'
    },
    components: {
        LoginWrap,
        LoginFooter
    },
    data () {
        return {
            rules: [v => !!v || '必须填写！'],
            valid: true,
            value: '',
            password: '',
            rememberUsername: false,
            rememberMe: false
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
            'login',
            'defaultValue'
        ]),
        async loginWithName () {
            let done = await this.login({
                value: this.value,
                password: md5(this.password),
                countryCode: '86',
                rememberUsername: this.rememberUsername,
                rememberMe: this.rememberMe
            })
            if (done) {
                this.$nextTick(() => {
                    this.$router.push('/home/')
                })
            } else {
                this.password = ''
            }
        }
    },
    async mounted () {
        let value = await this.defaultValue()
        if (value) {
            this.value = value
            this.rememberUsername = true
        }
    }
}
</script>
