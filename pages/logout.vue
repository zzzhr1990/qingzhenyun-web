<template>
  <div></div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  middleware: 'auth',
  mounted () {
    this.logout()
    window.location.reload()
  },
  methods: {
    ...mapActions('login', ['logout'])
  }
}
</script>
