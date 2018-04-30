<template>
    <v-card>
        <v-toolbar card dense>
            <v-toolbar-title class="body-2">注册账号</v-toolbar-title>
        </v-toolbar>
        <v-stepper :value="step" vertical>
            <v-stepper-step step="1" :complete="step > 1">
                获取验证码
                <small>获取验证码以进行注册</small>
            </v-stepper-step>
            <v-stepper-content step="1">
                <v-form lazy-validation>
                    <v-select
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
                        label="手机号"
                        v-model="phone"
                        :rules="phoneRules"
                        required
                    ></v-text-field>
                    <v-text-field
                        label="验证码"
                        v-model="code"
                        :rules="codeRules"
                        maxlength="6"
                        required
                    ></v-text-field>
                    <v-btn
                        @click="getCode"
                        :disabled="(msg.fetching || timer) && true"
                        flat
                    >{{buttonText}}</v-btn>
                    <v-btn
                        color="primary"
                        @click="nextStep"
                        :disabled="(!msg.phoneInfo || !code) && true"
                    >下一步</v-btn>
                </v-form>
            </v-stepper-content>
            <v-stepper-step step="2" :complete="step > 2">
                注册账号
                <small>注册账号密码</small>
            </v-stepper-step>
            <v-stepper-content step="2">
                <v-form v-model="valid" ref="form" lazy-validation>
                    <v-text-field
                        label="用户名"
                        v-model="name"
                        :rules="nameRules"
                        required
                    ></v-text-field>
                    <v-text-field
                        label="密码"
                        v-model="password"
                        :rules="passwordRules"
                        required
                        hint="密码必须包涵数字，大小写字母，特殊符号"
                    ></v-text-field>
                    <v-btn
                        color="primary"
                        :loading="reg.fetching"
                        @click="registWithPhone"
                    >注册</v-btn>
                    <v-btn @click="prevStep">上一步</v-btn>
                </v-form>
            </v-stepper-content>
        </v-stepper>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn flat color="blue lighten-3" small to="/login">已有账号？</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
import Message from 'vuetify-toast'
import countryCode from '@/assets/countryCode.json'
import { mapState, mapActions } from 'vuex'
export default {
    layout: 'toolbarback',
    head: {
        title: '账号注册'
    },
    data () {
        return {
            // 选择的国家号
            select: {
                country: 'China',
                code: '86'
            },
            countryCode: countryCode,
            // 输入的电话号码
            phone: '',
            // 输入的电话号码规则
            phoneRules: [
                v => !!v || '请填写手机号',
                v => /^[0-9]+$/.test(v) || '电话号码非法'
            ],
            // 输入的手机验证码
            code: '',
            codeRules: [
                v => !!v || '请填写验证码',
                v => /^\d{6}$/.test(v) || '验证码非法'
            ],
            valid: true,
            name: '',
            nameRules: [
                v => !!v || '请填写昵称'
            ],
            password: '',
            passwordRules: [
                v => !!v || '请填写密码'
            ],
            timer: null,
            time: 120,
            buttonText: '发送验证码'
        }
    },

    computed: {
        ...mapState('regist', ['step', 'msg', 'reg', 'message'])
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
        ...mapActions('regist', [
            'regist',
            'sendMsg',
            'nextStep',
            'prevStep'
        ]),

        async registWithPhone () {
            let done = await this.regist({
                code: this.code,
                name: this.name,
                phoneInfo: this.msg.phoneInfo,
                password: this.password
            })
            if (done) {
                this.$nextTick(() => {
                    this.$router.push('/home/')
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
                phone: this.phone
            })
        }
    }
}
</script>
