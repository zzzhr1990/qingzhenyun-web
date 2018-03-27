import axios from 'axios'
import vue from 'vue'

const e = axios.create()

vue.prototype.$aaa = e
