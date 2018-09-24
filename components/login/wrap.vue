<template>
    <v-card id="qz-sign-in">
        <div class="logo"></div>
        <slot name="cardText"></slot>
        <slot name="extra"></slot>
    </v-card>
</template>

<script>
export default {
    props: [
        'title'
    ],
    data () {
        return {
            items: [
                {
                    title: '账号密码登录',
                    to: '/login'
                },
                {
                    title: '手机号登录',
                    to: '/login/phone'
                },
                {
                    title: '短信快捷登录',
                    to: '/login/msg'
                }
            ]
        }
    }
}
</script>
