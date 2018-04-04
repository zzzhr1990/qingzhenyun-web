// import Vue from 'vue'
import Prompt from './Prompt.vue'

function Install (Vue, options) {
  const property = '$prompt'
  function createDialogCmp (options) {
    return new Promise(resolve => {
      const cmp = new Vue(Object.assign(Prompt, {
        destroyed: (c) => {
          document.body.removeChild(cmp.$el)
          resolve(cmp.value)
        }
      }))
      Object.assign(cmp, Vue.prototype.$prompt.options || {}, options)
      document.body.appendChild(cmp.$mount().$el)
    })
  }

  function show (message, options = {}) {
    options.message = message
    return createDialogCmp(options)
  }

  Vue.prototype[property] = show
  Vue.prototype[property].options = options || {}
}

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(Install)
}

export default Install
