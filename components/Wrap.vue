<template>
    <v-app id="qz-home">
        <v-navigation-drawer class="v-navigation-drawer-custom" :clipped="clipped" v-model="drawer" fixed app width="250" mobile-break-point="-1">
            <v-toolbar class="transparent qz-user" flat>
                <div class="qz-user-avatar">
                    <img />
                </div>
                <div class="qz-user-meta">
                    <span class="qz-user-username">{{user.name}}</span>
                    <v-progress-linear color="#2EC17C" height="4" :value="user.spaceUsed / user.spaceCapacity * 100"></v-progress-linear>
                    <div>
                        <span class="qz-user-amount">{{(user.spaceUsed/1024/1024/1024).toFixed(2)}}/{{(user.spaceCapacity/1024).toFixed(2)}}G</span>
                        <span class="qz-user-amount-upgrade">扩展</span>
                    </div>
                </div>
            </v-toolbar>
            <v-divider></v-divider>
            <v-list class="qz-left">
                <v-list-tile router :to="item.to" :key="i" v-for="(item, i) in items" exact>
                    <v-list-tile-action>
                        <i class="v-icon qz-icon" :class="['qz-icon-'+item.icon]"></i>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title v-text="item.title"></v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>
        </v-navigation-drawer>
        <v-toolbar class="qz-top elevation-0" fixed app :clipped-left="clipped">
            <v-toolbar-title :class="{'active': true}">
                <router-link class="href-link" :class="{'active': true}" to="/">{{appName}}</router-link>
            </v-toolbar-title>
            <v-toolbar-title>
                <router-link class="href-link" to="/">----</router-link>
            </v-toolbar-title>
            <v-toolbar-title>
                <router-link class="href-link" to="/">----</router-link>
            </v-toolbar-title>
        </v-toolbar>
        <v-content>
            <slot></slot>
        </v-content>
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
                { icon: 'home', title: '全部文件', to: '/home/' },
                { icon: 'offline', title: '离线下载', to: '/offline/' },
                { icon: 'recycle', title: '垃圾箱', to: '/recycle/' }
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
