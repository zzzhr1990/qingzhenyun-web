import Vue from 'vue'

Vue.directive('tabelloadmore', {
  bind (el, binding) {
    const SELECTWRAP_DOM = el.querySelector('.el-table__body-wrapper')
    SELECTWRAP_DOM.handler = function () {
      let sign = 20
      const CONDITION = (this.scrollHeight - this.scrollTop === this.clientHeight) && this.scrollTop > sign
      if (this.scrollTop > sign) {
        sign = this.scrollTop
      }
      if (this.scrollTop < sign) {
        sign = this.scrollTop
      }
      if (CONDITION) {
        binding.value()
      }
    }
    SELECTWRAP_DOM.addEventListener('scroll', SELECTWRAP_DOM.handler)
  },
  unbind (el) {
    const SELECTWRAP_DOM = el.querySelector('.el-table__body-wrapper')
    SELECTWRAP_DOM.removeEventListener('scroll', SELECTWRAP_DOM.handler)
    SELECTWRAP_DOM.handler = function () {}
  }
})
