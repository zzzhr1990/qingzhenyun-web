import api from '@/api'
import * as types from '../mutation-types'
import {getLocalStorage, setLocalStorage} from 'chimee-helper-utils'

// initial state
const state = {
  result: {
    page: 1,
    pageSize: types.HOME_PAGE_SIZE,
    totalCount: 0,
    totalPage: 0,
    list: []
  },
  requestStatus: 'waiting',
  order: parseInt(getLocalStorage(types.OFFLINE_LISE_ORDER)) || 1
}

const getters = {
  pageInfo (state) {
    return state.result
  },
  loading (state) {
    return state.requestStatus === 'waiting'
  },
  order (state) {
    return state.order
  }
}

const actions = {
  page ({ commit, state }, options = {}) {
    commit(types.OFFLINE_PATH_REQUEST)
    return api.offline.page(options)
  },

  stop ({ commit, state }, options = {}) {
    commit(types.OFFLINE_PATH_DELETE_REQUEST)
    return api.offline.remove(options)
  }
}

const mutations = {
  [types.SET_OFFLINE_ORDER] (state, order) {
    state.order = order
    setLocalStorage(types.OFFLINE_LISE_ORDER, order)
  },

  [types.OFFLINE_PATH_REQUEST] (state) {
    state.requestStatus = 'waiting'
  },

  [types.OFFLINE_PATH_SUCCESS] (state) {
    state.requestStatus = 'done'
  },

  [types.OFFLINE_PATH_FAILURE] (state) {
    state.requestStatus = 'done'
  },

  [types.OFFLINE_PATH_SET_PAGE] (state, result) {
    state.result = result
  },

  [types.OFFLINE_PATH_DELETE_REQUEST] (state) {
    state.requestStatus = 'waiting'
  },

  [types.OFFLINE_PATH_DELETE_SUCCESS] (state, data) {
    state.requestStatus = 'done'
  },

  [types.OFFLINE_PATH_DELETE_FAILURE] (state) {
    state.requestStatus = 'done'
  }
}

export default {
  state,
  actions,
  mutations,
  namespaced: true,
  getters
}
