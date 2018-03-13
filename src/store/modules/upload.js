// initial state
const state = {
  uploadConfig: {
    BlockSize: 4 * 1024 * 1024,
    ChunkSize: 1 * 1024 * 1024,
    maxQueueLen: 99,
    concurrency: 3,
    ChunkRetry: 3
  }
}

const getters = {
  uploadConfig (state) {
    return state.uploadConfig
  }
}

const actions = {
}

const mutations = {
}

export default {
  state,
  actions,
  mutations,
  namespaced: true,
  getters
}
