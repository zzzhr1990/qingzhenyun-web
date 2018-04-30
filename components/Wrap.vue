<template>
    <v-app dark>
        <v-navigation-drawer
            :clipped="clipped"
            v-model="drawer"
            fixed
            app
            dark
        >
            <v-toolbar flat class="transparent" dark>
                <v-list class="pa-0 fullwidth">
                    <v-list-tile avatar>
                        <v-list-tile-content>
                            <v-list-tile-title>{{user.name}}</v-list-tile-title>
                            <v-list-tile-sub-title>{{user.lastLoginTime | timeFilter}}</v-list-tile-sub-title>
                        </v-list-tile-content>
                        <v-list-tile-action>
                            <v-btn icon @click.stop="drawer = !drawer">
                                <v-icon>chevron_left</v-icon>
                            </v-btn>
                        </v-list-tile-action>
                    </v-list-tile>
                </v-list>
            </v-toolbar>
            <v-divider></v-divider>
            <v-list>
                <v-list-tile
                    router
                    :to="item.to"
                    :key="i"
                    v-for="(item, i) in items"
                    exact
                >
                    <v-list-tile-action>
                        <v-icon v-html="item.icon"></v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title v-text="item.title"></v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>
        </v-navigation-drawer>
        <v-toolbar fixed app :clipped-left="clipped" class="elevation-0" :extension-height="'160px'">
            <v-toolbar-side-icon @click="drawer = !drawer"></v-toolbar-side-icon>
            <v-toolbar-title>
                <router-link class="href-link white--text" to="/">{{appName}}</router-link>
            </v-toolbar-title>
            <v-layout slot="extension">
                <slot name="extension"></slot>
            </v-layout>
        </v-toolbar>
        <v-content>
            <slot></slot>
        </v-content>
        <v-footer app dark>
            <span>&copy; 2018</span>
        </v-footer>
    </v-app>
</template>

<script>
import { mapState } from 'vuex'
export default {
    data () {
        return {
            clipped: false,
            drawer: null,
            items: [
                { icon: 'dashboard', title: '全部文件', to: '/home/' },
                { icon: 'system_update_alt', title: '离线下载', to: '/offline/' },
                { icon: 'delete', title: '回收站', to: '/recycle/' },
                { icon: 'edit', title: '修改密码', to: '/challenge/pwd' },
                { icon: 'exit_to_app', title: '退出', to: '/logout' }
            ],
            appName: process.env.appName
        }
    },
    middleware: 'auth',
    computed: {
        ...mapState('login', ['user'])
    }
}
</script>
