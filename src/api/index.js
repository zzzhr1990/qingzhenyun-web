import axios from 'axios'
import files from './modules/files'
import user from './modules/user'
import store from '@/store/index'
import * as types from '@/store/mutation-types'
import preview from './modules/preview'
import offline from './modules/offline'
import storeapi from './modules/store'
import { isObject } from 'toxic-predicate-functions'

window.axios = axios

// Vue.use($HTTP)

function setToken (response) {
  if (response && response.data && isObject(response.data)) {
    store.commit(`login/${types.LOGIN_SET_TOKEN}`, response.data.token)
  }
}

// Vue.http.interceptors.push((request, next) => {
//   /**
//    * 为每个请求附上验证
//    * @param  {[type]} store.state.login.token [description]
//    * @return {[type]}                         [description]
//    */
//   if (store.state.login.token) {
//     if (!request.headers.get('Authorization')) {
//       request.headers.set('Authorization', 'Bearer ' + store.state.login.token)
//     }
//   }
//   next(function (response) {
//     /**
//      * 使每个请求得来的token储存
//      */
//     setToken(response)
//     return response
//   })
// })

axios.interceptors.request.use(config => {
  /**
   * 为每个请求附上验证
   * @param  {[type]} store.state.login.token [description]
   * @return {[type]}                         [description]
   */
  if (store.state.login.token) {
    config.headers.Authorization = 'Bearer ' + store.state.login.token
  }
  return config
})

axios.interceptors.response.use(response => {
  /**
   * 使每个请求得来的token储存
   */
  setToken(response)
  if (response.data) {
    return response.data
  }
  return response
}, error => {
  if (error.response && error.response.data) {
    return Promise.reject(error.response)
  }
  return Promise.reject(error)
})

export default {
  files,
  user,
  preview,
  offline,
  store: storeapi
}
