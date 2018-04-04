<template>
  <v-app>
    <v-toolbar color="primary" fixed>
      <v-btn icon @click="goBack">
        <v-icon color="white">arrow_back</v-icon>
      </v-btn>
      <v-toolbar-title class="white--text" href="/">仓鼠云</v-toolbar-title>
      <v-spacer></v-spacer>
      <span class="white--text">{{ time }}</span>
    </v-toolbar>
    <v-content class="bg">
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <nuxt/>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      timer: null,
      time: '00:00:00'
    }
  },
  created () {
    this.timer = setInterval(() => {
      this.time = this.getTime(new Date())
    }, 1000)
  },
  beforeDestroy () {
    clearInterval(this.timer)
  },
  methods: {
    goBack () {
      this.$router.back(-1)
    },
    getTime (t) {
      let hours = t.getHours()
      let min = t.getMinutes()
      let sec = t.getSeconds()
      if (hours <= 9) {
        hours = '0' + hours
      }
      if (min <= 9) {
        min = '0' + min
      }
      if (sec <= 9) {
        sec = '0' + sec
      }
      return `${hours}:${min}:${sec}`
    }
  }
}
</script>

<style scoped>
.bg {
  background: linear-gradient(to right, #64b3f4, #c2e59c);
  padding-top: 64px;
}
</style>
