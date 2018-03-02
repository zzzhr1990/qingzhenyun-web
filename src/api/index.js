import Vue from 'vue'
import $HTTP from 'vue-resource'
import files from './modules/files'
import user from './modules/user'
import store from '@/store/index'
import * as types from '@/store/mutation-types'
import preview from './modules/preview'
import offline from './modules/offline'
import storeapi from './modules/store'
import { isObject } from 'toxic-predicate-functions'

Vue.use($HTTP)

function setToken (response) {
  if (response && response.body && isObject(response.body)) {
    store.commit(`login/${types.LOGIN_SET_TOKEN}`, response.body.token)
  }
}

Vue.http.interceptors.push((request, next) => {
  /**
   * 为每个请求附上验证
   * @param  {[type]} store.state.login.token [description]
   * @return {[type]}                         [description]
   */
  if (store.state.login.token) {
    if (!request.headers.get('Authorization')) {
      request.headers.set('Authorization', 'Bearer ' + store.state.login.token)
    }
  }
  next(function (response) {
    /**
     * 使每个请求得来的token储存
     */
    setToken(response)
    return response
  })
})

export default {
  files,
  user,
  preview,
  offline,
  store: storeapi
}
