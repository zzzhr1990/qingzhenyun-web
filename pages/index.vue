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
            appSimpleDescribe: '极简、低成本的的私人云存储方案',
            descripe: {
                headline: '资源存储 | 云端下载 | 在线预览 | 云端同步 | 资源分享',
                subhead: '做最良心的个人存储方案提供商',
                posterHeadline: 'Web development has never been easier',
                posterSubhead: 'Kick-start your application today',
                descripeSections: [
                    {
                        // symbol是material icon
                        symbol: 'color_lens',
                        title: '跨平台',
                        content: '我们支持Android、iOS、Windows、OSX等多个平台，同时在Web层面上给予尽量全面的功能支持。我们也提供详尽的API文档，您甚至可以自行开发客户端软件。'
                    },
                    {
                        symbol: 'flash_on',
                        title: '安全稳定',
                        content: '用户数据均采用高强度的RSA加密，一户一密钥；我们在国内有北京、苏州、武汉三个数据中心，国外有印度德里、俄罗斯莫斯科两个数据中心，构成3+2的异地容灾体系，韩国数据中心也正在准备中。'
                    },
                    {
                        symbol: 'build',
                        title: '完全开源',
                        content: '我们完全开放客户端、APP、以及服务端的源代码，以及提供完善的API文档。如果您在安全方面有所疑虑，您可以自行编译客户端运行。我们也为您自行编译提供帮助。'
                    }
                ]
            },
            company: {
                info: {
                    title: '关于我们',
                    content: '欢众（北京）数据网络科技有限公司是一家专注于存储和传输解决方案的公司。公司有全国各地IDC机房，在北京地区以北京兆维机房和北京数北机房为基地，为企业和个人提供安全稳定的存储解决方案。'
                },
                contact: {
                    title: '联系我们',
                    content: '您可以通过电话或者邮件来联系我们',
                    info: [
                        {
                            symbol: 'phone',
                            content: '010-82611960 (请在工作时间拨打)'
                        },
                        {
                            symbol: 'place',
                            content: '中国,北京市,海淀区,中关村,天创科技大厦1107B'
                        },
                        {
                            symbol: 'email',
                            content: 'service@6pan.cn'
                        }
                    ]
                }
            }
        }
    }
}
</script>
