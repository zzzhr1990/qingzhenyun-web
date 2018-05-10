<template>
    <v-app dark>
        <v-toolbar dense>
            <img :src="logo" height="38" width="38">
            <v-toolbar-title v-text="appName"></v-toolbar-title>
        </v-toolbar>
        <v-content>
            <section>
                <v-parallax :src="bg" height="600">
                    <v-layout
                        column
                        align-center
                        justify-center
                        class="white--text"
                    >
                        <img :src="logo" alt="Vuetify.js" height="200">
                        <h1 class="white--text mb-2 display-1 text-xs-center">{{appName}}</h1>
                        <div class="subheading mb-3 text-xs-center">{{appSimpleDescribe}}</div>
                        <div>
                            <v-btn
                                class="blue lighten-2 mt-5"
                                dark
                                large
                                to="/login"
                                :nuxt="true"
                            >用户登录</v-btn>
                            <v-btn
                                class="blue lighten-2 mt-5"
                                large
                                dark
                                to="/regist"
                                :nuxt="true"
                            >用户注册</v-btn>
                        </div>
                        <v-btn
                            flat
                            to="/challenge/ipp"
                            class="white--text"
                            :nuxt="true"
                        >忘记密码？</v-btn>
                    </v-layout>
                </v-parallax>
            </section>

            <section>
                <v-layout
                    column
                    wrap
                    class="my-5"
                    align-center
                >
                    <v-flex xs12 sm4 class="my-3">
                        <div class="text-xs-center">
                            <h2 class="headline">{{descripe.headline}}</h2>
                            <span class="subheading">{{descripe.subhead}}</span>
                        </div>
                    </v-flex>
                    <v-flex xs12>
                        <v-container grid-list-xl>
                            <v-layout row wrap align-center>
                                <v-flex xs12 md4 v-for="(item, index) in descripe.descripeSections" :key="index">
                                    <v-card class="elevation-0 transparent">
                                        <v-card-text class="text-xs-center">
                                                <v-icon
                                                    x-large
                                                    class="blue--text text--lighten-2"
                                                >{{item.symbol}}</v-icon>
                                        </v-card-text>
                                        <v-card-title primary-title class="layout justify-center">
                                            <div class="headline text-xs-center">{{item.title}}</div>
                                        </v-card-title>
                                        <v-card-text>{{item.content}}</v-card-text>
                                    </v-card>
                                </v-flex>
                            </v-layout>
                        </v-container>
                    </v-flex>
                </v-layout>
            </section>

            <section>
                <v-parallax :src="sectionbg" height="380">
                    <v-layout column align-center justify-center>
                        <div class="headline white--text mb-3 text-xs-center">{{descripe.posterHeadline}}</div>
                        <em>{{descripe.posterSubhead}}</em>
                    </v-layout>
                </v-parallax>
            </section>

            <section>
                <v-container grid-list-xl>
                    <v-layout row wrap justify-center class="my-5">
                        <v-flex xs12 sm4>
                            <v-card class="elevation-0 transparent">
                                <v-card-title primary-title class="layout justify-center">
                                    <div class="headline">{{company.info.title}}</div>
                                </v-card-title>
                                <v-card-text>{{company.info.content}}</v-card-text>
                            </v-card>
                        </v-flex>
                        <v-flex xs12 sm4 offset-sm1>
                            <v-card class="elevation-0 transparent">
                                <v-card-title primary-title class="layout justify-center">
                                    <div class="headline">{{company.contact.title}}</div>
                                </v-card-title>
                                <v-card-text>{{company.contact.content}}</v-card-text>
                                <v-list class="transparent">
                                    <v-list-tile v-for="(item, key) in company.contact.info" :key="key">
                                        <v-list-tile-action>
                                            <v-icon class="blue--text text--lighten-2">{{item.symbol}}</v-icon>
                                        </v-list-tile-action>
                                        <v-list-tile-content>
                                            <v-list-tile-title>{{item.content}}</v-list-tile-title>
                                        </v-list-tile-content>
                                    </v-list-tile>
                                </v-list>
                            </v-card>
                        </v-flex>
                    </v-layout>
                </v-container>
            </section>

            <v-footer>
                <v-layout row wrap align-center>
                    <v-flex xs12>
                        <div class="white--text ml-3" v-html="footer"></div>
                    </v-flex>
                </v-layout>
            </v-footer>
        </v-content>
    </v-app>
</template>

<script>
import al from '@/assets/anla.jpg'
import logo from '@/assets/logo.jpg'
export default {
    middleware: 'jumptohome',
    data () {
        return {
            sectionbg: al,
            bg: al,
            logo: logo,
            appName: process.env.appName,
            footer: `${process.env.appName} 版权所有 <a href="/docs/privacy" target="_blank">隐私协议</a>`,
            // app简单描述
            appSimpleDescribe: '6PAN.COM-专业的私人云盘,在线存储,云端备份,为您提供安全、便捷、愉悦的云存储体验',
            descripe: {
                headline: 'The best way to start developing',
                subhead: 'Cras facilisis mi vitae nunc',
                posterHeadline: 'Web development has never been easier',
                posterSubhead: 'Kick-start your application today',
                descripeSections: [
                    {
                        // symbol是material icon
                        symbol: 'color_lens',
                        title: 'Material Design',
                        content: 'Cras facilisis mi vitae nunc lobortis pharetra. Nulla volutpat tincidunt ornare. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nullam in aliquet odio. Aliquam eu est vitae tellus bibendum tincidunt. Suspendisse potenti.'
                    },
                    {
                        symbol: 'flash_on',
                        title: 'Fast development',
                        content: 'Cras facilisis mi vitae nunc lobortis pharetra. Nulla volutpat tincidunt ornare. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nullam in aliquet odio. Aliquam eu est vitae tellus bibendum tincidunt. Suspendisse potenti.'
                    },
                    {
                        symbol: 'build',
                        title: 'Completely Open Sourced',
                        content: 'Cras facilisis mi vitae nunc lobortis pharetra. Nulla volutpat tincidunt ornare. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nullam in aliquet odio. Aliquam eu est vitae tellus bibendum tincidunt. Suspendisse potenti.'
                    }
                ]
            },
            company: {
                info: {
                    title: 'Company info',
                    content: 'Cras facilisis mi vitae nunc lobortis pharetra. Nulla volutpat tincidunt ornare. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nullam in aliquet odio. Aliquam eu est vitae tellus bibendum tincidunt. Suspendisse potenti.'
                },
                contact: {
                    title: 'Contact us',
                    content: 'Cras facilisis mi vitae nunc lobortis pharetra. Nulla volutpat tincidunt ornare.',
                    info: [
                        {
                            symbol: 'phone',
                            content: '+8618888888888'
                        },
                        {
                            symbol: 'place',
                            content: 'China'
                        },
                        {
                            symbol: 'email',
                            content: 'admin@test.com'
                        }
                    ]
                }
            }
        }
    }
}
</script>
