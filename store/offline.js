import getErrorMsg from '@/utils/getErrorMsg'

export const state = () => {
    return {
        fetching: false,
        message: null,
        pageInfo: {
            list: []
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
        state.message = {
            type: 'error',
            message: result
        }
    },
    SET_PAGE_INFO (state, result) {
        state.fetching = false
        state.pageInfo = result
    },
    ADD_TO_LIST (state, result) {
        state.pageInfo.list.unshift(result)
    }
}

export const actions = {
    refresh ({ state, dispatch }, { orderBy } = {}) {
        dispatch('page', {
            page: state.pageInfo.page
        })
    },

    async remove ({ commit, dispatch }, opts) {
        commit('REQUEST')
        try {
            await this.app.$http.post('/v1/offline/remove', opts)
            dispatch('refresh')
            return true
        } catch (e) {
            commit('RESPONSE_FAILED', getErrorMsg(e))
        }
    },

    async page ({ commit }, opts) {
        commit('REQUEST')
        try {
            const { data: { result } } = await this.app.$http.post('/v1/offline/page', Object.assign({}, opts, {
                pageSize: this.state.pageSize,
                orderBy: this.state.orderBy
            }))
            commit('SET_PAGE_INFO', result)
        } catch (e) {
            commit('RESPONSE_FAILED', getErrorMsg(e))
        }
    },

    async parseUrl ({ commit }, opts) {
        try {
            const { data: { result } } = await this.app.$http.post('/v1/offline/parseUrl', opts)
            return result
        } catch (e) {
            commit('RESPONSE_FAILED', getErrorMsg(e))
        }
    },

    async parseTorrent ({ commit }, opts) {
        try {
            const { data: { result } } = await this.app.$http.post('/v1/offline/parseTorrent', opts)
            return result
        } catch (e) {
            commit('RESPONSE_FAILED', getErrorMsg(e))
        }
    },

    async parseMagnet ({ commit }, opts) {
        try {
            const { data: { result } } = await this.app.$http.post('/v1/offline/parseMagnet', opts)
            return result
        } catch (e) {
            commit('RESPONSE_FAILED', getErrorMsg(e))
        }
    },

    async start ({ commit, dispatch }, opts) {
        try {
            await this.app.$http.post('/v1/offline/start', opts)
            dispatch('refresh')
        } catch (e) {
            commit('RESPONSE_FAILED', getErrorMsg(e))
        }
    }
}
