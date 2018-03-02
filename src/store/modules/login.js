import api from '@/api'
import * as types from '../mutation-types'
import Cookies from 'js-cookie'
import {getLocalStorage, setLocalStorage} from 'chimee-helper-utils'
// import router from '@/router/index'

// initial state
const state = {
  token: Cookies.get(types.TOKEN_COOKIE) || '',
  logining: false,
  userInfo: JSON.parse(getLocalStorage(types.USER_INFO) || '{}'),
  registing: false
}

const getters = {

  userInfo (state) {
    return state.userInfo
  },

  isLogining (state) {
    return state.logining
  },

  isRegisting (state) {
    return state.registing
  }
}

const actions = {
  login ({ commit, state }, opts) {
    commit(types.LOGIN_REQUEST)
    return api.user.login(opts)
  },

  logout ({commit, state}) {
    commit(types.LOGOUT)
  },

  register ({commit, state}, opts) {
    commit(types.SIGNIN_REQUEST)
    return api.user.register(opts)
  }
}

const mutations = {
  [types.LOGIN_REQUEST] (state) {
    state.logining = true
  },

  [types.LOGIN_SUCCESS] (state) {
    state.logining = false
  },

  [types.LOGIN_FAILURE] (state) {
    state.logining = false
  },

  [types.LOGIN_SET_UINFO] (state, userInfo) {
    state.userInfo = userInfo
    setLocalStorage(types.USER_INFO, JSON.stringify(userInfo))
  },

  [types.LOGIN_SET_TOKEN] (state, token) {
    if (token) {
      state.token = token
      Cookies.set(types.TOKEN_COOKIE, token, {
        expires: types.TOKEN_EXPIRE_TIME
      })
    }
  },

  [types.LOGOUT] (state) {
    state.token = ''
    Cookies.remove(types.TOKEN_COOKIE)
  },

  [types.SIGNIN_REQUEST] (state) {
    state.registing = true
  },

  [types.SIGNIN_SUCCESS] (state, siginInfo) {
    state.registing = false
  },

  [types.SIGNIN_REQUEST] (state) {
    state.registing = false
  }
}

export default {
  state,
  getters,
  actions,
  mutations,
  namespaced: true
}
