import getErrorMsg from '@/utils/getErrorMsg'

export const state = () => {
  return {
    fetching: false,
    previewMsg: null,
    previewImage: {
      url: '',
      dialog: false
    },
    previewPdf: {
      url: ''
    }
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
    state.previewMsg = {
      type: 'error',
      message: result
    }
  },
  SET_IMG (state, result) {
    state.fetching = false
    state.previewImage.url = result
    state.previewImage.dialog = true
  },
  DIALOG (state, show) {
    state.previewImage.dialog = show
  },
  SET_PDF (state, result) {
    state.fetching = false
    state.previewPdf.url = result
  }
}

export const actions = {
  async text ({ commit }, opts) {
    commit('REQUEST')
    try {
      let { data: { result } } = await this.app.$http.post('/v1/preview/text', opts)
      return result
    } catch (e) {
      commit('RESPONSE_FAILED', getErrorMsg(e))
    }
  },

  async image ({ commit }, opts) {
    commit('REQUEST')
    try {
      let { data: { result } } = await this.app.$http.post('/v1/preview/image', opts)
      commit('SET_IMG', result.url)
    } catch (e) {
      commit('RESPONSE_FAILED', getErrorMsg(e))
    }
  },

  async pdf ({ commit }, opts) {
    commit('REQUEST')
    try {
      let { data: { result } } = await this.app.$http.post('/v1/preview/pdf', opts)
      commit('SET_PDF', result.url)
    } catch (e) {
      commit('RESPONSE_FAILED', getErrorMsg(e))
    }
  },

  async video ({ commit }, opts) {
    commit('REQUEST')
    try {
      let { data: { result } } = await this.app.$http.post('/v1/preview/video', opts)
      return result
    } catch (e) {
      commit('RESPONSE_FAILED', getErrorMsg(e))
    }
  },

  async audio ({ commit }, opts) {
    commit('REQUEST')
    try {
      let { data: { result } } = await this.app.$http.post('/v1/preview/audio', opts)
      return result
    } catch (e) {
      commit('RESPONSE_FAILED', getErrorMsg(e))
    }
  }
}
