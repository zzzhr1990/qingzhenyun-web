<template>
  <v-app>
    <v-toolbar color="primary" app dense>
      <v-btn icon @click="goBack">
        <v-icon color="white">arrow_back</v-icon>
      </v-btn>
      <v-toolbar-title class="white--text" href="/">仓鼠云</v-toolbar-title>
    </v-toolbar>
    <v-content>
      <nuxt/>
    </v-content>
  </v-app>
</template>

<script>
export default {
  methods: {
    goBack () {
      this.$router.back(-1)
    }
  }
}
</script>
