<template>
    <div id="sign-ipp">
        <div class="logo"></div>
        <h1>密码找回</h1>
        <v-stepper :value="step">
            <v-stepper-step step="1" :complete="step > 1"></v-stepper-step>
            <v-stepper-content step="1">
                <h4>hi，请输入您注册的手机号</h4>
                <v-form lazy-validation>
                    <!-- <v-select item-text="country" item-value="code" :items="countryCode" label="国家/地区代码" return-object :hint="`${select.code}`" persistent-hint v-model="select"></v-select> -->
                    <div class="form-group">
                        <div class="form-group-label">手机号</div>
                        <v-text-field class="v-input-custom" v-model="phone" :rules="phoneRules" required solo hide-details color="#2EC17C" height="32"></v-text-field>
                    </div>
                    <v-container grid-list-md text-xs-center>
                        <v-layout row wrap>
                            <v-flex xs6>
                                <div class="form-group">
                                    <div class="form-group-label">验证码</div>
                                    <v-text-field class="v-input-custom" v-model="code" :rules="codeRules" maxlength="6" required solo hide-details color="#2EC17C" height="32"></v-text-field>
                                </div>
                            </v-flex>
                            <v-flex xs6 class="text-xs-right">
                                <v-btn class="v-btn-code" @click="getCode" :disabled="(msg.fetching || timer) && true" block color="#2EC17C">{{buttonText}}</v-btn>
                            </v-flex>
                        </v-layout>
                    </v-container>
                    <div class="form-hint">
                        <div v-if="phone && !/^[0-9]+$/.test(phone)">请输入合法的手机号</div>
                        <div v-if="code && !/^\d{6}$/.test(code)">请输入正确的验证码</div>
                    </div>

                    <v-btn @click="nextStep" :disabled="(!msg.phoneInfo || !code)" block color="#2EC17C">下一步</v-btn>
                </v-form>
            </v-stepper-content>
            <v-stepper-step step="2" :complete="step > 2"></v-stepper-step>
            <v-stepper-content step="2">
                <h4>hi，请输入您的新密码</h4>
                <v-form v-model="valid" ref="form" lazy-validation>
                    <div class="form-group">
                        <div class="form-group-label">新密码</div>
                        <v-text-field class="v-input-custom" type="password" v-model="newPsw" :rules="pswRules" required solo hide-details color="#2EC17C" height="32"></v-text-field>
                        <div class="v-form-group-hint" v-if="newPsw != ''">
                            <div class="hint-row">
                                <i class="material-icons hint-success" v-if="newPsw.length >=6 && newPsw.length <=14">check_circle</i>
                                <i class="material-icons hint-fail" v-else>cancel</i>
                                <div class="hint-text">长度为6-14个字符</div>
                            </div>
                            <div class="hint-row">
                                <i class="material-icons hint-success" v-if="!/[\s\u1289]/.test(newPsw)">check_circle</i>
                                <i class="material-icons hint-fail" v-else>cancel</i>
                                <div class="hint-text">不允许有空格</div>
                            </div>
                            <div class="arrow-left"></div>
                            <div class="arrow-left-outline"></div>
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="form-group-label">确认密码</div>
                        <v-text-field class="v-input-custom" type="password" v-model="password" :rules="passwordRules" required solo hide-details color="#2EC17C" height="32"></v-text-field>
                    </div>
                    <div class="form-hint">
                        <div v-if="password && newPsw && password !== newPsw">两次密码不一致</div>
                    </div>
                    <v-btn :loading="change.fetching" :disabled="!valid" @click="changeWithPhone" block color="#2EC17C">完成</v-btn>
                </v-form>
            </v-stepper-content>
        </v-stepper>
    </div>
    <!-- <ChallengeWrap>

        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn flat color="blue lighten-3" small to="/login">已有账号？</v-btn>
        </v-card-actions>
    </ChallengeWrap> -->
</template>

<script>
import md5 from 'md5'
import Message from 'vuetify-toast'
import countryCode from '@/assets/countryCode.json'
import { mapState, mapActions } from 'vuex'

export default {
    head: {
        title: '修改密码'
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
                v => !!v || '请输入新密码',
                v => (v.length >= 6 && v.length <= 14) || '长度为6-14个字符',
                v => !/[\s\u1289]/.test(v) || '不允许有空格'
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
                newPassword: md5(this.password)
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
                this.buttonText = this.time + '秒后重新获取'
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
