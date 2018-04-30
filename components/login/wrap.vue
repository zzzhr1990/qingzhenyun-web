<template>
    <v-card>
        <v-toolbar card dense>
            <v-toolbar-title class="body-2">{{title}}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-menu bottom right>
                <v-btn icon slot="activator">
                    <v-icon>more_vert</v-icon>
                </v-btn>
                <v-list>
                    <v-list-tile v-for="(item, i) in items" :key="i">
                        <v-list-tile-title>
                            <router-link class="href-link body-2 white--text" :to="item.to">{{ item.title }}</router-link>
                        </v-list-tile-title>
                    </v-list-tile>
                </v-list>
            </v-menu>
        </v-toolbar>
        <v-card-text>
            <slot name="cardText"></slot>
        </v-card-text>
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
