import api from '@/api'
import * as types from '../mutation-types'

// initial state
const state = {
  result: {
    page: 0,
    pageSize: types.HOME_PAGE_SIZE,
    totalCount: 0,
    totalPage: 0,
    list: [],
    path: [],
    info: {
      uuid: ''
    }
  },
  page: 1,
  requestStatus: 'waiting'
}

const getters = {
  uuid (state) {
    return state.result.info.uuid === '0' ? '' : state.result.info.uuid
  },
  pageInfo (state) {
    return state.result
  },
  loading (state) {
    return state.requestStatus === 'waiting'
  },
  nowPage (state) {
    return state.page
  }
}

const actions = {
  page ({ commit, state }, options = {}) {
    commit(types.PATH_REQUEST)
    return api.files.page(options)
  },
  create ({ commit, state }, opts) {
    commit(types.PATH_CREATE_REQUEST)
    return api.files.create(opts)
      // .then((res) => {
      //   commit(types.PATH_CREATE_SUCCESS, res.body)
      // })
      // .catch((e) => {
      //   commit(types.PATH_CREATE_FAILURE, e)
      // })
  },
  delete ({ commit, state }, opts) {
    commit(types.PATH_DELETE_REQUEST)
    return api.files.recycle(opts)
      // .then((res) => {
      //   commit(types.PATH_DELETE_SUCCESS, opts)
      // })
      // .catch((e) => {
      //   commit(types.PATH_DELETE_FAILURE, e)
      // })
  },
  rename ({ commit, state }, opts) {
    commit(types.PATH_RENAME_REQUEST)
    return api.files.rename(opts)
      // .then((res) => {
      //   commit(types.PATH_RENAME_SUCCESS, opts)
      // })
      // .catch((e) => {
      //   commit(types.PATH_RENAME_FAILURE, e)
      // })
  },
  move ({ commit, state }, opts) {
    commit(types.PATH_MOVE_REQUEST)
    return api.files.move(opts)
  }
}

const mutations = {
  [types.PATH_REQUEST] (state) {
    state.requestStatus = 'waiting'
  },

  [types.PATH_SUCCESS] (state) {
    state.requestStatus = 'done'
  },

  [types.PATH_MOVE_REQUEST] (state) {
    state.requestStatus = 'waiting'
  },

  [types.PATH_MOVE_DONE] (state, shouldDelete) {
    state.requestStatus = 'done'
    if (shouldDelete) {
      for (var i = 0; i < state.result.list.length; i++) {
        if (state.result.list[i].uuid === shouldDelete.uuid) {
          state.result.list.splice(i, 1)
          return
        }
      }
    }
  },

  [types.PATH_SET_PAGE_NUMBER] (state, page) {
    state.page = page
  },

  [types.PATH_FAILURE] (state) {
    state.requestStatus = 'done'
  },

  [types.PATH_SET_PAGE] (state, result) {
    state.result = result
  },

  [types.PATH_CREATE_REQUEST] (state) {
    state.requestStatus = 'waiting'
  },

  [types.PATH_CREATE_SUCCESS] (state, data) {
    state.requestStatus = 'done'
    if (!data || (state.result.list.length === types.HOME_PAGE_SIZE && state.result.page !== 1)) {
      return
    }
    state.result.list.unshift(data)
    if (state.result.list.length > types.HOME_PAGE_SIZE) {
      state.result.list.pop()
    }
  },

  [types.PATH_CREATE_FAILURE] (state) {
    state.requestStatus = 'done'
  },

  [types.PATH_DELETE_REQUEST] (state) {
    state.requestStatus = 'waiting'
  },

  [types.PATH_DELETE_SUCCESS] (state, data) {
    state.requestStatus = 'done'
    for (var i = 0; i < state.result.list.length; i++) {
      if (state.result.list[i].uuid === data.uuid) {
        state.result.list.splice(i, 1)
        return
      }
    }
  },

  [types.PATH_DELETE_FAILURE] (state) {
    state.requestStatus = 'done'
  },

  [types.PATH_RENAME_REQUEST] (state) {
    state.requestStatus = 'waiting'
  },

  [types.PATH_RENAME_SUCCESS] (state, data) {
    state.requestStatus = 'done'
    for (var i = 0; i < state.result.list.length; i++) {
      if (state.result.list[i].uuid === data.uuid) {
        state.result.list[i].name = data.name
        state.result.list[i].atime = data.atime
        state.result.list[i].ctime = data.ctime
        state.result.list[i].mtime = data.mtime
        return
      }
    }
  },

  [types.PATH_RENAME_FAILURE] (state) {
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
