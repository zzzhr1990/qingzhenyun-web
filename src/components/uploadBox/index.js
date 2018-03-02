import Vue from 'vue'
import UploadBox from './UploadBox.vue'
import store from '@/store'

let UploadBoxConstructor = Vue.extend(UploadBox)
let instance = null

export default function () {
  if (!instance) {
    instance = new UploadBoxConstructor({
      store: store
    })
    instance.vm = instance.$mount()
    document.body.appendChild(instance.vm.$el)
  }
  instance.vm.showUploadBox = true
  return instance.vm
}
