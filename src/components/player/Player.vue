<template>
  <transition
    name="custom-classes-transition"
    enter-active-class="fadeIn"
    leave-active-class="fadeOut"
  >
    <div class="wrapper" v-show="visible">
      <i class="el-icon-close close" @click="close"></i>
      <div class="player" v-player="playerData"></div>
    </div>
  </transition>
</template>

<script>
import { STOP_PLAY } from './directive'
export default {
  data () {
    return {
      visible: false,
      closed: false,
      playerData: {}
    }
  },

  watch: {
    closed (newVal) {
      if (newVal) {
        this.playerData = STOP_PLAY
        this.$nextTick(() => {
          this.destroyElement()
        })
      }
    }
  },

  methods: {
    destroyElement () {
      this.$destroy(true)
      this.$el.parentNode.removeChild(this.$el)
    },

    close () {
      this.visible = false
      this.$nextTick(() => {
        this.destroyElement()
      })
    }
  }
}
</script>

<style scoped>
.close {
  position: absolute;
  padding: 10px;
  right: 0;
  color: #fff;
  font-size: 20px;
  z-index: 20;
  cursor: pointer;
}
.wrapper {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(0,0,0,.5);
  z-index: 30;
}
.player {
  position: absolute;
  width: 500px;
  height: 375px;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
}

.player .CH_player {
  width: 100%;
  height: 100%;
}
</style>
