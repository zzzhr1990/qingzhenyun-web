import Vue from 'vue'
import Dialog from './Dialog.vue'

let DialogConstructor = Vue.extend(Dialog)
let instance = null

export default function () {
  if (!instance) {
    instance = new DialogConstructor()
    instance.vm = instance.$mount()
    document.body.appendChild(instance.vm.$el)
  }
  instance.vm.dialogTableVisible = true
  instance.vm.$off()
  return new Promise(function (resolve, reject) {
    instance.vm.$on('selected', function (value) {
      if (value) {
        resolve(value)
      } else {
        reject(new Error('Dir select canceled!'))
      }
    })
  })
}
