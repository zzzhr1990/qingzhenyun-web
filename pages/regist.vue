<template>
    <v-card id="qz-sign-up">
        <div class="logo"></div>
        <v-form v-model="valid" class="form">
            <div class="outline-form-group v-input-custom" :class="{'outline-form-group-focus': 1}">
                <v-select class="v-input-group-item" :class="{'small-text': select.code.length > 3}" :item-text="itemCode" :items="countryCode" return-object :hint="`${select.code}`" persistent-hint height="48" v-model="select" solo :hide-details="true" :menu-props="{'closeOnClick':false,'closeOnContentClick':false,'openOnClick':false,'minWidth':328,'maxHeight':124, 'content-class': 'v-select-offset'}" color="#2EC17C">
                    <template slot="item" slot-scope="data">
                        <span class="v-list-item-code">+{{ data.item.code }}</span>
                        <span class="v-list-item-name">{{ data.item.country_zh }}</span>
                    </template>
                </v-select>
                <div class="outline-line-v"></div>
                <v-text-field class="main-input v-input-group-item" placeholder="请输入您的手机号" v-model="phone" :rules="phoneRules" :hide-details="true" solo required :clearable="true" height="48" color="#2EC17C"></v-text-field>
            </div>
            <div class="v-form-group">
                <v-text-field class="v-input-custom" placeholder="请输入您的用户名" v-model="name" :rules="nameRules" :hide-details="true" solo :clearable="true" color="#2EC17C" height="48"></v-text-field>
                <div class="v-form-group-hint" v-if="name != ''">
                    <div class="hint-row">
                        <i class="material-icons hint-success" v-if="/^[a-zA-Z0-9_\u4e00-\u9fa5]*$/.test(name) && !/^\d+$/.test(name)">check_circle</i>
                        <i class="material-icons hint-fail" v-else>cancel</i>
                        <div class="hint-text">用户名仅支持中英文、数字和下划线，<br>且不能为纯数字</div>
                    </div>
                    <div class="hint-row" v-if="name.length > 64">
                        <i class="material-icons hint-fail">cancel</i>
                        <div class="hint-text">长度小于64个字符</div>
                    </div>
                    <div class="arrow-left"></div>
                    <div class="arrow-left-outline"></div>
                </div>
            </div>
            <div class="v-form-group">
                <v-text-field class="v-input-custom" placeholder="请输入您的密码" type="password" v-model="password" :rules="passwordRules" :hide-details="true" solo required :clearable="true" color="#2EC17C" height="48"></v-text-field>
                <div class="v-form-group-hint" v-if="password != ''">
                    <div class="hint-row">
                        <i class="material-icons hint-success" v-if="password.length >=6 && password.length <=14">check_circle</i>
                        <i class="material-icons hint-fail" v-else>cancel</i>
                        <div class="hint-text">长度为6-14个字符</div>
                    </div>
                    <div class="hint-row">
                        <i class="material-icons hint-success" v-if="!/[\s\u1289]/.test(password)">check_circle</i>
                        <i class="material-icons hint-fail" v-else>cancel</i>
                        <div class="hint-text">不允许有空格</div>
                    </div>
                    <div class="arrow-left"></div>
                    <div class="arrow-left-outline"></div>
                </div>
            </div>
            <v-container grid-list-md text-xs-center>
                <v-layout row wrap>
                    <v-flex xs6>
                        <v-text-field class="v-input-custom" placeholder="验证码" v-model="code" :rules="codeRules" maxlength="6" required solo :hide-details="true" color="#2EC17C" height="48"></v-text-field>
                    </v-flex>
                    <v-flex xs6 class="text-xs-right">
                        <v-btn class="v-btn-custom" @click="getCode" :disabled="(msg.fetching || timer) && true" block color="#2EC17C" height="48">{{buttonText}}</v-btn>
                    </v-flex>
                </v-layout>
            </v-container>
            <v-checkbox hide-details class="v-checkbox-custom" color="#2EC17C" height="17" v-model="applyLicence" :rules="applyRules">
                <template slot="label">
                    同意
                    <router-link to="/docs/agreement" target="_blank">《软件许可及服务协议》</router-link>
                </template>
            </v-checkbox>
            <v-container class="v-container-last" grid-list-md text-xs-center>
                <v-layout row wrap>
                    <v-flex xs6>
                        <v-btn class="v-btn-custom" outline color="#2EC17C" to="/login" block>取消</v-btn>
                    </v-flex>
                    <v-flex xs6 class="text-xs-right">
                        <v-btn class="v-btn-custom" color="#2EC17C" :disabled="!valid" :loading="reg.fetching" @click="registWithPhone" block>注册</v-btn>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-form>
    </v-card>
</template>

<script>
import md5 from 'md5'
import Message from 'vuetify-toast'
import countryCode from '@/assets/countryCode.json'
import { mapState, mapActions } from 'vuex'
export default {
    layout: 'sign',
    head: {
        title: '注册'
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
                // 何总说：昵称可以不填，不填的话会自动生成
                // v => !!v || '请填写昵称',
                v => v.length <= 64 || '用户名应小于64个字符',
                v => (/^[a-zA-Z0-9_\u4e00-\u9fa5]*$/.test(v) && !/^\d+$/.test(v)) || '用户名仅支持中英文、数字和下划线，且不能为纯数字'
            ],
            password: '',
            passwordRules: [
                v => !!v || '请填写密码',
                v => (v.length >= 6 && v.length <= 14) || '长度为6-14个字符',
                v => !/[\s\u1289]/.test(v) || '不允许有空格'
            ],
            applyLicence: false,
            applyRules: [
                v => v || '请同意使用协议'
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
            'sendMsg'
        ]),

        async registWithPhone () {
            let done = await this.regist({
                code: this.code,
                name: this.name,
                phoneInfo: this.msg.phoneInfo,
                password: md5(this.password)
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
        },

        itemCode (value) {
            return '+' + value.code
        }
    }
}
</script>
