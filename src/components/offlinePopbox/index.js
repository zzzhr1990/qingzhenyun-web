import Vue from 'vue'
import PopBox from './PopBox.vue'
import store from '@/store'

let PopBoxConstructor = Vue.extend(PopBox)
let instance = null

export default function () {
  if (!instance) {
    instance = new PopBoxConstructor({
      store: store
    })
    instance.vm = instance.$mount()
    document.body.appendChild(instance.vm.$el)
  }
  instance.vm.visible = true
  return instance.vm
}
