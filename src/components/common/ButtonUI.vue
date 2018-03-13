<template>
  <div class="buttonUI" :class="myclass" @click="click"><slot></slot></div>
</template>

<style>
.buttonUI {
  display: inline-block;
  background: none;
  border: 0;
  outline: 0;
  position: relative;
  text-align: center;
  height: 44px;
  line-height: 44px;
  border-radius: 22px;
  box-sizing: border-box;
  border: 1px solid #53D9A4;
  font-size: 18px;
  color: #53D9A4;
  width: 100%;
  cursor: pointer;
}
.buttonUI.normal {
}
.buttonUI.small {
  height: 36px;
  line-height: 36px;
  line-height: 36px;
  font-size: 14px;
}
.buttonUI.big {
  height: 48px;
  line-height: 48px;
}
.buttonUI.emphas {
  background: #53D9A4;
  background-image: linear-gradient(-90deg, #53D9A4 0%, #B6E6A9 100%);
  border-radius: 77px;
  color: #fff;
  border: 0;
}

.buttonUI.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>

<script>
export default {
  props: [
    'size',
    'disabled',
    'emphas'
  ],
  computed: {
    myclass () {
      return {
        normal: this.size === 'normal',
        big: this.size === 'big',
        small: this.size === 'small',
        emphas: !!this.emphas,
        disabled: !!this.disabled
      }
    }
  },
  methods: {
    click () {
      if (this.disabled) {
        return
      }
      this.$emit('clickButton')
    }
  }
}
</script>
