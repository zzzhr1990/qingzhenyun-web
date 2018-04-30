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
    }
}

const RECOVERY = 0
const JUST_SEE_RECYCLE = 1

export const actions = {
    refresh ({ state, dispatch }, { orderBy } = {}) {
        dispatch('page', {
            page: state.pageInfo.page,
            path: state.pageInfo.info.path
        })
    },

    async recovery ({ commit, dispatch }, opts) {
        commit('REQUEST')
        try {
            await this.app.$http.post('/v1/files/recycle', Object.assign({}, opts, {
                recycle: RECOVERY
            }))
            dispatch('refresh')
            return true
        } catch (e) {
            commit('RESPONSE_FAILED', getErrorMsg(e))
        }
    },

    async remove ({ commit, dispatch }, opts) {
        commit('REQUEST')
        try {
            await this.app.$http.post('/v1/files/remove', Object.assign({}, opts))
            dispatch('refresh')
            return true
        } catch (e) {
            commit('RESPONSE_FAILED', getErrorMsg(e))
        }
    },

    async page ({ commit }, opts) {
        commit('REQUEST')
        try {
            const { data: { result } } = await this.app.$http.post('/v1/files/page', Object.assign({}, opts, {
                recycle: JUST_SEE_RECYCLE,
                pageSize: this.state.pageSize,
                orderBy: this.state.orderBy
            }))
            commit('SET_PAGE_INFO', result)
        } catch (e) {
            commit('RESPONSE_FAILED', getErrorMsg(e))
        }
    }
}
