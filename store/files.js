import getErrorMsg from '@/utils/getErrorMsg'

export const state = () => {
  return {
    fetching: false,
    message: null,
    pageInfo: {
      list: [],
      info: {
        path: ''
      }
    }
  }
}

// result: {
//   page: 0,
//   pageSize: types.HOME_PAGE_SIZE,
//   totalCount: 0,
//   totalPage: 0,
//   list: [],
//   path: [],
//   info: {
//     uuid: ''
//   }
// },
// page: 1,
// requestStatus: 'waiting'

export const getters = {
  breadcrumbs (state) {
    let paths = state.pageInfo.info.path.split('/')
    let length = paths.length - 1
    return paths.map((item, index, arr) => {
      return {
        text: index === 0 ? '全部文件' : item,
        path: arr.slice(0, index + 1).join('%2F'),
        disabled: index === length
      }
    })
  }
}

export const mutations = {
  REQUEST (state) {
    state.fetching = true
  },
  RESPONSE_SUCCESS (state) {
    state.fetching = false
  },
  RESPONSE_FAILED (state, result) {
    state.fetching = false
    state.message = {
      type: 'error',
      message: result
    }
  },
  SET_PAGE_INFO (state, result) {
    state.fetching = false
    state.pageInfo = result
  },
  ADD_FILE (state, result) {
    state.fetching = false
    state.pageInfo.list.unshift(result)
  }
}

export const actions = {
  refresh ({ state, dispatch }, opts) {
    // console.log(app.state)
    dispatch('page', {
      page: state.pageInfo.page,
      pageSize: state.pageInfo.pageSize,
      path: state.pageInfo.info.path,
      orderBy: state.pageInfo.orderBy
    })
  },

  async move ({ commit, dispatch }, opts) {
    commit('REQUEST')
    try {
      await this.app.$http.post('/v1/files/move', opts)
      dispatch('refresh')
    } catch (e) {
      commit('RESPONSE_FAILED', getErrorMsg(e))
    }
  },

  async rename ({ commit, dispatch }, opts) {
    commit('REQUEST')
    try {
      await this.app.$http.post('/v1/files/rename', opts)
      dispatch('refresh')
    } catch (e) {
      commit('RESPONSE_FAILED', getErrorMsg(e))
    }
  },

  async recycle ({ commit, dispatch }, opts) {
    commit('REQUEST')
    try {
      await this.app.$http.post('/v1/files/recycle', opts)
      dispatch('refresh')
      return true
    } catch (e) {
      commit('RESPONSE_FAILED', getErrorMsg(e))
    }
  },

  async remove ({ commit, dispatch }, opts) {
    commit('REQUEST')
    try {
      await this.app.$http.post('/v1/files/remove', opts)
      dispatch('refresh')
      return true
    } catch (e) {
      commit('RESPONSE_FAILED', getErrorMsg(e))
    }
  },

  async page ({ commit }, opts) {
    commit('REQUEST')
    try {
      const { data: { result } } = await this.app.$http.post('/v1/files/page', opts)
      commit('SET_PAGE_INFO', result)
    } catch (e) {
      console.log('error')
      commit('RESPONSE_FAILED', getErrorMsg(e))
    }
  },

  async get ({ commit }, opts) {
    commit('REQUEST')
    try {
      const { data: { result } } = await this.app.$http.post('/v1/files/get', opts)
      commit('RESPONSE_SUCCESS')
      return result
    } catch (e) {
      commit('RESPONSE_FAILED', getErrorMsg(e))
    }
  },

  async createDirectory ({ commit }, opts) {
    commit('REQUEST')
    try {
      const { data: { result } } = await this.app.$http.post('/v1/files/createDirectory', opts)
      commit('ADD_FILE', result)
      return result
    } catch (e) {
      commit('RESPONSE_FAILED', getErrorMsg(e))
    }
  },

  async download ({ commit }, opts) {
    try {
      let { data: { result } } = await this.app.$http.post('/v1/files/download', opts)
      return result
    } catch (e) {
      commit('RESPONSE_FAILED', getErrorMsg(e))
    }
  },

  async folder ({ commit }, opts) {
    try {
      let { data: { result } } = await this.app.$http.post('/v1/files/list', opts)
      return result
    } catch (e) {
      commit('RESPONSE_FAILED', getErrorMsg(e))
    }
  }
}
