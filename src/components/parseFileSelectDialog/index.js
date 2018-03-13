import Vue from 'vue'
import SelectFile from './SelectFile.vue'

let SelectFileConstructor = Vue.extend(SelectFile)

export default function (opts = {}) {
  let instance = new SelectFileConstructor({
    data: {
      list: opts.list || [],
      fileName: opts.title || '',
      dir: '',
      selectedFiles: ''
    }
  })
  instance.vm = instance.$mount()
  document.body.appendChild(instance.vm.$el)
  instance.vm.visible = true
  instance.vm.$off()
  return new Promise(function (resolve, reject) {
    instance.vm.$on('selectDone', function (value) {
      if (value) {
        resolve(value)
      } else {
        reject(new Error('Select file Canceled!'))
      }
    })
  })
}
