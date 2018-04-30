<template>
    <ChallengeWrap>
        <v-stepper :value="step" vertical>
            <v-stepper-step step="1" :complete="step > 1">
                获取验证码
                <small>获取验证码以进行密码修改</small>
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
                修改密码
                <small>修改新密码</small>
            </v-stepper-step>
            <v-stepper-content step="2">
                <v-form v-model="valid" ref="form" lazy-validation>
                    <v-text-field
                        label="输入新密码"
                        v-model="newPsw"
                        :rules="pswRules"
                        required
                    ></v-text-field>
                    <v-text-field
                        label="再次输入密码"
                        v-model="password"
                        :rules="passwordRules"
                        required
                    ></v-text-field>
                    <v-btn
                        color="primary"
                        :loading="change.fetching"
                        @click="changeWithPhone"
                    >提交</v-btn>
                    <v-btn
                        @click="prevStep"
                    >上一步</v-btn>
                </v-form>
            </v-stepper-content>
        </v-stepper>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn flat color="blue lighten-3" small to="/login">已有账号？</v-btn>
        </v-card-actions>
    </ChallengeWrap>
</template>

<script>
import Message from 'vuetify-toast'
import countryCode from '@/assets/countryCode.json'
import { mapState, mapActions } from 'vuex'
import ChallengeWrap from '@/components/challenge/wrap'

export default {
    layout: 'simpleLayout',
    head: {
        title: '修改密码'
    },
    components: {
        ChallengeWrap
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
            newPsw: '',
            pswRules: [
                v => !!v || '请输入新密码'
            ],
            password: '',
            passwordRules: [
                v => !!v || '请填写密码',
                v => {
                    if (v !== this.newPsw) {
                        return '两次密码输入不一致'
                    }
                    return true
                }
            ],
            timer: null,
            time: 120,
            buttonText: '发送验证码'
        }
    },

    computed: {
        ...mapState('ipp', ['step', 'msg', 'change', 'message'])
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
        ...mapActions('ipp', [
            'changeByMsg',
            'sendMsg',
            'nextStep',
            'prevStep'
        ]),

        async changeWithPhone () {
            let done = await this.changeByMsg({
                code: this.code,
                phoneInfo: this.msg.phoneInfo,
                newPassword: this.password
            })
            if (done) {
                Message['success']('修改密码成功，请登录！')
                this.$nextTick(() => {
                    this.$router.push('/login')
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
