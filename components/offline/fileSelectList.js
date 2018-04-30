// import Vue from 'vue'
import List from './fileSelectList.vue'
import Vue from 'vue'

function createDialogCmp (options) {
    return new Promise(resolve => {
        const cmp = new Vue(Object.assign(List, {
            destroyed: (c) => {
                document.body.removeChild(cmp.$el)
                if (cmp.value) {
                    resolve(cmp.value)
                }
            }
        }))
        Object.assign(cmp, options)
        document.body.appendChild(cmp.$mount().$el)
    })
}

export default createDialogCmp
