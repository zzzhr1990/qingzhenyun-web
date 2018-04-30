<template>
    <LoginWrap title="账号密码登录">
        <v-form v-model="valid" slot="cardText">
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
        <template slot="extra">
            <v-container>
                <v-btn
                    block
                    color="primary"
                    :loading="fetching"
                    :disabled="!valid || fetching"
                    @click="loginWithName"
                >登录</v-btn>
            </v-container>
            <LoginFooter></LoginFooter>
        </template>
    </LoginWrap>
</template>

<script>
import Message from 'vuetify-toast'
import { mapState, mapActions } from 'vuex'
import LoginWrap from '@/components/login/wrap.vue'
import LoginFooter from '@/components/login/actions.vue'
export default {
    layout: 'simpleLayout',
    head: {
        title: '账号密码登录'
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
