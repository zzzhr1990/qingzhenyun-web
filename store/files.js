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

const RECYCLE = 1

export const getters = {
    breadcrumbs (state) {
        let paths = state.pageInfo.info.path.split('/')
        let length = paths.length - 1
        return paths.map((item, index, arr) => {
            return {
                text: index === 0 ? '全部文件' : item,
                path: arr.slice(0, index + 1).join('/'),
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
    refresh ({ state, dispatch }, { orderBy } = {}) {
        dispatch('page', {
            page: state.pageInfo.page,
            path: state.pageInfo.info.path,
            orderBy: orderBy || state.pageInfo.orderBy || this.state.orderBy
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

    // async recycle ({ commit, dispatch }, opts) {
    //     commit('REQUEST')
    //     try {
    //         await this.app.$http.post('/v1/files/recycle', Object.assign({}, opts, {
    //             recycle: RECYCLE
    //         }))
    //         dispatch('refresh')
    //         return true
    //     } catch (e) {
    //         commit('RESPONSE_FAILED', getErrorMsg(e))
    //     }
    // },

    async recycle ({ commit, dispatch }, opts) {
        commit('REQUEST')
        try {
            await this.app.$http.post('/v1/files/remove', Object.assign({}, opts, {
                recycle: RECYCLE
            }))
            dispatch('refresh')
            return true
        } catch (e) {
            commit('RESPONSE_FAILED', getErrorMsg(e))
        }
    },

    async page ({ commit, state }, opts) {
        commit('REQUEST')
        try {
            const { data: { result } } = await this.app.$http.post('/v1/files/page', Object.assign({}, opts, {
                // 使用index.js的全局设置
                pageSize: this.state.pageSize,
                orderBy: this.state.orderBy
            }))
            commit('SET_PAGE_INFO', result)
        } catch (e) {
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
            let { data: { result } } = await this.app.$http.post('/v1/files/list', Object.assign({}, opts, {
                mime: 'application/x-directory',
                size: 999
            }))
            return result
        } catch (e) {
            commit('RESPONSE_FAILED', getErrorMsg(e))
        }
    }
}
