import getErrorMsg from '@/utils/getErrorMsg'
import Cookies from 'universal-cookie'

const cookies = new Cookies()
const TOKEN_NAME = 'token'
const TOKEN_EXPIRE_TIME = 30

export const state = () => {
  return {
    user: null,
    token: null,
    fetching: false,
    message: null,
    phoneInfo: ''
  }
}

export const mutations = {
  SET_USER_INFO (state, result) {
    state.fetching = false
    state.user = result
  },

  SET_TOKEN (state, token) {
    state.token = token
    let date = new Date()
    date.setMinutes(date.getMinutes() + TOKEN_EXPIRE_TIME)
    cookies.set(TOKEN_NAME, token, {
      path: '/',
      expires: date
    })
  },

  REQUEST_LOGIN (state) {
    state.fetching = true
  },

  REQUEST_SEND_MSG (state) {
    state.fetching = true
  },

  SEND_MSG_FAILED (state, result) {
    state.fetching = false
    state.message = {
      type: 'error',
      message: result
    }
  },

  LOGIN_FAILED (state, result) {
    state.fetching = false
    state.message = {
      type: 'error',
      message: result
    }
  },

  SET_PHONE_INFO (state, result) {
    state.fetching = false
    state.phoneInfo = result
  },

  LOGOUT (state) {
    state.token = null
    let date = new Date()
    date.setDate(date.getDate() - 1)
    cookies.set(TOKEN_NAME, '', {
      path: '/',
      expires: date
    })
  }
}

export const actions = {
  async login ({ commit }, opts) {
    commit('REQUEST_LOGIN')
    try {
      const { data: { result, token } } = await this.app.$axios.post('/v1/user/login', opts)
      commit('SET_USER_INFO', result)
      commit('SET_TOKEN', token)
      return true
    } catch (e) {
      commit('LOGIN_FAILED', getErrorMsg(e))
    }
  },

  logout ({ commit }, opts) {
    commit('LOGOUT')
  },

  async sendMsg ({ commit }, opts) {
    commit('REQUEST_SEND_MSG')
    try {
      const { data: { result } } = await this.app.$axios.post('/v1/user/sendLoginMessage', opts)
      commit('SET_PHONE_INFO', result)
    } catch (e) {
      commit('SEND_MSG_FAILED', getErrorMsg(e))
    }
  },

  async loginByMsg ({ commit }, opts) {
    commit('REQUEST_LOGIN')
    try {
      const { data: { result, token } } = await this.app.$axios.post('/v1/user/loginByMessage', opts)
      commit('SET_USER_INFO', result)
      commit('SET_TOKEN', token)
      return true
    } catch (e) {
      commit('LOGIN_FAILED', getErrorMsg(e))
    }
  }
}
