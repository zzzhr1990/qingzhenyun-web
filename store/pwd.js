import getErrorMsg from '@/utils/getErrorMsg'

export const state = () => {
    return {
        fetching: false,
        message: null
    }
}

export const mutations = {
    REQUEST_CHANGEPASWORD (state) {
        state.fetching = true
    },
    CHANGEPASWORD_SUCCESS (state) {
        state.fetching = false
    },
    CHANGEPASWORD_FAILED (state, result) {
        state.fetching = false
        state.message = {
            type: 'error',
            message: result
        }
    }
}

export const actions = {
    async change ({ commit }, opts) {
        commit('REQUEST_CHANGEPASWORD')
        try {
            await this.app.$http.post('/v1/user/changePassword', opts)
            commit('CHANGEPASWORD_SUCCESS')
            return true
        } catch (error) {
            commit('CHANGEPASWORD_FAILED', getErrorMsg(error))
        }
    }
}
