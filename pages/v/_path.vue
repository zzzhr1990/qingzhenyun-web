<template>
    <div class="video" v-if="result" v-player="result"></div>
</template>

<script>
import { mapState } from 'vuex'
import Message from 'vuetify-toast'

export default {
    middleware: 'auth',
    layout: 's1',
    data () {
        return {
            result: null
        }
    },
    computed: {
        ...mapState([
            'isMobile'
        ]),
        ...mapState('preview', [
            'previewMsg'
        ])
    },
    watch: {
        previewMsg (msg) {
            Message[msg.type](msg.message)
        }
    },
    async created () {
        let result = await this.$store.dispatch('preview/' + this.$route.query.type, {
            path: this.$route.params.path
        })
        if (result) {
            this.result = result
        }
    }
}
</script>

<style>
@media only screen and (min-width: 0px) {
  .CH_player {
    height: 180px
  }
}
@media only screen and (min-width: 360px) {
  .CH_player {
    height: 200px
  }
}

@media only screen and (min-width: 420px) {
  .CH_player {
    height: 236px
  }
}
@media only screen and (min-width: 600px) {
  .CH_player {
    height: 338px
  }
}

@media only screen and (min-width: 768px) {
  .CH_player {
    height: 432px
  }
}

@media only screen and (min-width: 1024px) {
  .CH_player {
    height: 576px
  }
}
</style>
