<template>
  <div class="avator" :class="avatorClass" :style="background"></div>
</template>

<script>
export default {
  props: [
    'type',
    'src',
    'border',
    'inline'
  ],
  computed: {
    background () {
      if (!this.src) {
        return {}
      }
      return {
        backgroundImage: `url(${this.src})`
      }
    },
    avatorClass () {
      return {
        big: this.type === 'big',
        normal: this.type === 'normal',
        small: this.type === 'small',
        border: !!this.border,
        inline: !!this.inline
      }
    }
  }
}
</script>

<style scoped>
.avator {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-image: linear-gradient(-90deg, #53D9A4 0%, #B6E6A9 100%);
}
.avator.big {
  width: 180px;
  height: 180px;
}
.avator.normal {
  width: 40px;
  height: 40px;
}
.avator.small {
  width: 20px;
  height: 20px;
}
.avator.border {
  box-shadow: 0 0 0 2px #fff;
}
.avator.inline {
  display: inline-block;
}
</style>
