<template>
    <LoginWrap title="手机号登录">
        <v-form v-model="valid" slot="cardText">
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
                    @click="loginWithPhone"
                >登录</v-btn>
            </v-container>
            <LoginFooter></LoginFooter>
        </template>
    </LoginWrap>
</template>

<script>
import Message from 'vuetify-toast'
import { mapState, mapActions } from 'vuex'
import countryCode from '@/assets/countryCode.json'
import LoginWrap from '@/components/login/wrap.vue'
import LoginFooter from '@/components/login/actions.vue'

export default {
    layout: 'simpleLayout',
    head: {
        title: '手机号登录'
    },
    components: {
        LoginWrap,
        LoginFooter
    },
    data () {
        return {
            // 选择的国家号
            select: {
                country: 'China',
                code: '86'
            },
            countryCode: countryCode,
            rules: [v => !!v || '必须填写！'],
            phoneRules: [
                v => !!v || '必须填写！',
                v => /^1[0-9]+$/.test(v) || '手机号码填写有误！'
            ],
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
        async loginWithPhone () {
            let done = await this.login({
                value: this.value,
                password: this.password,
                countryCode: this.select.code
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
