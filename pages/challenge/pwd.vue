<template>
    <ChallengeWrap>
        <v-form>
            <v-text-field
                prepend-icon="lock"
                v-model="password"
                label="旧密码"
                id="password"
                type="password"
                required
                :rules="passwordRules"
            ></v-text-field>
            <v-text-field
                prepend-icon="lock"
                v-model="newPsw"
                label="新密码"
                id="newPsw"
                type="password"
                required
                :rules="pswRules"
            ></v-text-field>
        </v-form>
        <v-card-actions>
            <v-btn
                :loading="change.fetching"
                @click="changePassword"
            >提交</v-btn>
            <v-spacer></v-spacer>
            <v-btn flat color="blue lighten-3" small to="/challenge/ipp">使用手机验证码修改</v-btn>
        </v-card-actions>
    </ChallengeWrap>
</template>

<script>
import Message from 'vuetify-toast'
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
    middleware: 'auth',
    data () {
        return {
            newPsw: '',
            pswRules: [
                v => !!v || '请输入新密码'
            ],
            password: '',
            passwordRules: [
                v => !!v || '请填写密码'
            ]
        }
    },

    computed: {
        ...mapState('pwd', ['fetching', 'message'])
    },

    watch: {
        message (newVal) {
            Message[newVal.type](newVal.message)
        }
    },

    methods: {
        ...mapActions('pwd', [
            'change'
        ]),

        async changePassword () {
            let done = await this.change({
                newPassword: this.newPsw,
                oldPassword: this.password
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
