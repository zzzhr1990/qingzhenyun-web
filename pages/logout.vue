<template>
    <div></div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
    async mounted () {
        let result = await this.logout()
        if (result) {
            window.location.reload()
        } else {
            alert('退出发生错误，请清除cookie后重试')
        }
    },
    methods: {
        ...mapActions('login', ['logout'])
    }
}
</script>
