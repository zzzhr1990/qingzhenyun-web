import Vue from 'vue'
import Player from './Player.vue'

let PlayerConstructor = Vue.extend(Player)

export default function (options = {}) {
  let instance = new PlayerConstructor({
    data: {
      playerData: options
    }
  })
  instance.vm = instance.$mount()
  document.body.appendChild(instance.vm.$el)
  instance.vm.visible = true
  return instance.vm
}
