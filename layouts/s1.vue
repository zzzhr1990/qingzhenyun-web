<template>
    <v-app dark>
        <v-toolbar dense>
            <v-btn icon @click="goBack">
                <v-icon color="white">keyboard_arrow_left</v-icon>
            </v-btn>
            <img :src="logo" height="38" width="38">
            <v-toolbar-title>
                <router-link class="href-link white--text" to="/">{{appName}}</router-link>
            </v-toolbar-title>
        </v-toolbar>
        <v-content>
            <v-container fluid fill-height>
                <v-layout justify-center>
                    <v-flex xs12>
                        <nuxt/>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-content>
    </v-app>
</template>

<script>
import logo from '@/assets/logo.jpg'
export default {
    data () {
        return {
            logo,
            appName: process.env.appName
        }
    },
    methods: {
        goBack () {
            this.$router.back(-1)
        }
    }
}
</script>
