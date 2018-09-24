<template>
    <v-app id="qz-profile">
        <v-layout column wrap align-center justify-start class="qz-header">
            <div class="qz-avatar align-center justify-center">
                <v-img width="100" height="100"></v-img>
            </div>
            <div class="qz-username">
                您好，
                <span>{{user.name}}！</span>
            </div>
        </v-layout>
        <v-layout column align-center justify-start class="qz-content">
            <v-card class="qz-profile-card" flat>
                <div class="qz-profile-card-preview">
                    <v-layout row wrap align-center justify-start fill-height>
                        <v-flex class="qz-profile-card-header">
                            <i class="v-icon qz-icon qz-icon-prfile-username"></i>
                            <div>用户名</div>
                        </v-flex>
                        <v-flex class="qz-profile-card-content">
                            <span>{{user.name}}</span>
                        </v-flex>
                        <v-flex class="qz-profile-card-action">
                            <v-btn flat color="#2EC17C">修改</v-btn>
                        </v-flex>
                    </v-layout>
                </div>
            </v-card>

            <v-card class="qz-profile-card" flat>
                <div class="qz-profile-card-preview">
                    <v-layout row align-center justify-start fill-height>
                        <v-flex class="qz-profile-card-header">
                            <i class="v-icon qz-icon qz-icon-prfile-mobile"></i>
                            <div>手机号</div>
                        </v-flex>
                        <v-flex class="qz-profile-card-content">
                            <span>{{user.phone}}</span>
                        </v-flex>
                        <v-flex class="qz-profile-card-action">
                            <v-btn flat color="#2EC17C">更换手机</v-btn>
                        </v-flex>
                    </v-layout>
                </div>
            </v-card>

            <v-card class="qz-profile-card" flat>
                <div class="qz-profile-card-preview">
                    <v-layout row align-center justify-start fill-height>
                        <v-flex class="qz-profile-card-header">
                            <i class="v-icon qz-icon qz-icon-prfile-space"></i>
                            <div>我的空间</div>
                        </v-flex>
                        <v-flex class="qz-profile-card-content">
                            <v-layout align-center justify-start row>
                                <v-flex class="qz-space">
                                    <v-progress-linear color="#2EC17C" height="8" :value="user.spaceUsed / user.spaceCapacity * 100"></v-progress-linear>
                                </v-flex>
                                <v-flex class="qz-space-text">
                                    <span>{{(user.spaceUsed/1024 || 0).toFixed(0)}}/{{(user.spaceCapacity || 0/1024).toFixed(0) }}G</span>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                        <v-flex class="qz-profile-card-action">
                            <v-btn flat color="#2EC17C">扩展空间</v-btn>
                        </v-flex>
                    </v-layout>
                </div>
            </v-card>

            <v-card class="qz-profile-card" flat :class="{'qz-active': changePassword.showEditor}">
                <v-form v-model="changePassword.valid">
                    <div class="qz-profile-card-preview">
                        <v-layout row align-center justify-start fill-height>
                            <v-flex class="qz-profile-card-header">
                                <i class="v-icon qz-icon qz-icon-prfile-space"></i>
                                <div>密码</div>
                            </v-flex>
                            <v-flex class="qz-profile-card-content">
                                <span>********</span>
                            </v-flex>
                            <v-flex class="qz-profile-card-action">
                                <v-btn flat color="#2EC17C" @click="showChangePasswordEditor">修改密码</v-btn>
                            </v-flex>
                        </v-layout>
                    </div>
                    <div class="qz-profile-card-editor" v-show="changePassword.showEditor">
                        <v-layout column align-center justify-start>
                            <v-flex class="qz-profile-control">
                                <v-layout row align-center justify-start>
                                    <v-flex class="qz-profile-label">原始密码</v-flex>
                                    <v-flex class="qz-profile-input">
                                        <v-text-field type="password" v-model="changePassword.originPassword" autocomplete="off" required :rules="changePassword.rules" autofocus outline flat full-width height="40" hide-details single-line color="#2EC17C"></v-text-field>
                                    </v-flex>
                                </v-layout>
                            </v-flex>
                            <v-flex class="qz-profile-control">
                                <v-layout row align-center justify-start>
                                    <v-flex class="qz-profile-label">新密码</v-flex>
                                    <v-flex class="qz-profile-input">
                                        <v-text-field type="password" v-model="changePassword.newlyPassword" autocomplete="off" required :rules="changePassword.rules" outline flat full-width height="40" hide-details single-line color="#2EC17C"></v-text-field>
                                    </v-flex>
                                </v-layout>
                            </v-flex>
                            <v-flex class="qz-profile-control">
                                <v-layout row align-center justify-start>
                                    <v-flex class="qz-profile-label">再次确认</v-flex>
                                    <v-flex class="qz-profile-input">
                                        <v-text-field type="password" v-model="changePassword.checkPassword" autocomplete="off" required :rules="changePassword.newlyPasswordRules" outline flat full-width height="40" hide-details single-line color="#2EC17C"></v-text-field>
                                    </v-flex>
                                </v-layout>
                            </v-flex>
                            <v-flex class="qz-profile-control qz-profile-card-editor-action">
                                <v-layout row align-center justify-start>
                                    <v-flex class="qz-profile-label"></v-flex>
                                    <v-flex class="qz-profile-input">
                                        <v-layout row align-center justify-space-between>
                                            <v-btn flat style="margin-left: -16px;" @click="cancelChangePassword">取消</v-btn>
                                            <v-btn flat @click="changePasswordSubmit" :disabled="!changePassword.valid && changePasswordFetching" color="#2EC17C" style="margin-right: -16px;">确认修改</v-btn>
                                        </v-layout>
                                    </v-flex>
                                </v-layout>
                            </v-flex>
                        </v-layout>
                    </div>
                </v-form>
            </v-card>
        </v-layout>
    </v-app>
</template>

<script>
import Message from 'vuetify-toast'
import { mapState, mapActions } from 'vuex'
export default {
    middleware: 'auth',
    computed: {
        ...mapState('login', ['user']),
        ...mapState('pwd', {
            'changePasswordFetching': 'fetching'
        })
    },
    data () {
        return {
            changePassword: {
                originPassword: '',
                newlyPassword: '',
                newlyPasswordRules: [
                    v => !!v || '请输入新密码',
                    v => (v.length >= 6 && v.length <= 14) || '长度为6-14个字符',
                    v => !/[\s\u1289]/.test(v) || '不允许有空格'
                ],
                checkPassword: '',
                checkPasswordRules: [
                    v => !!v || '请填写密码',
                    v => {
                        if (v !== this.newlyPassword) {
                            return '两次密码输入不一致'
                        }
                        return true
                    }
                ],
                showEditor: false,

                rules: [v => !!v || '必须填写！'],
                valid: true
            } }
    },

    watch: {
        message (newVal) {
            Message[newVal.type](newVal.message)
        }
    },

    methods: {
        showChangePasswordEditor () {
            this.changePassword.originPassword = ''
            this.changePassword.newlyPassword = ''
            this.changePassword.checkPassword = ''
            this.changePassword.showEditor = true
        },
        cancelChangePassword () {
            this.changePassword.showEditor = false
        },
        ...mapActions('pwd', {
            changePasswordRequest: 'change'
        }),

        async changePasswordSubmit () {
            let done = await this.changePasswordRequest({
                newPassword: this.changePassword.newlyPassword,
                oldPassword: this.changePassword.originPassword
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
