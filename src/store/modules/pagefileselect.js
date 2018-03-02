import * as types from '../mutation-types'

// initial state
const state = {
  selections: []
}

const getters = {
  pagefileselect (state) {
    return state.selections
  }
}

const actions = {
}

const mutations = {
  [types.PAGE_FILE_SELECT] (state, options) {
    state.selections = options
  }
}

export default {
  state,
  actions,
  mutations,
  namespaced: true,
  getters
}
