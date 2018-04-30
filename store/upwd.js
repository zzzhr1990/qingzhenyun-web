import getErrorMsg from '@/utils/getErrorMsg'

export const state = () => {
    return {
        step: 1,
        msg: {
            fetching: false,
            phoneInfo: ''
        },
        change: {
            fetching: false
        },
        message: null
    }
}

export const mutations = {
    REQUEST_PHONEINFO (state) {
        state.msg.fetching = true
    },
    GET_PHONEINFO_SUCCESS (state, result) {
        state.msg.fetching = false
        state.msg.phoneInfo = result
    },
    GET_PHONEINFO_FAILED (state, result) {
        state.msg.fetching = false
        state.message = {
            type: 'error',
            message: result
        }
    },
    REQUEST_CHANGEPASWORD (state) {
        state.change.fetching = true
    },
    CHANGEPASWORD_SUCCESS (state) {
        state.change.fetching = false
    },
    CHANGEPASWORD_FAILED (state, result) {
        state.change.fetching = false
        state.message = {
            type: 'error',
            message: result
        }
    },
    NEXT_STEP (state) {
        state.step++
    },
    PREV_STEP (state) {
        state.step--
    }
}

export const actions = {
    async sendMsg ({ commit }, opts) {
        commit('REQUEST_PHONEINFO')
        try {
            const { data: {result} } = await this.app.$http.post('/v1/user/sendChangePasswordMessage', opts)
            commit('GET_PHONEINFO_SUCCESS', result)
        } catch (error) {
            commit('GET_PHONEINFO_FAILED', getErrorMsg(error))
        }
    },

    async changeByMsg ({ commit }, opts) {
        commit('REQUEST_CHANGEPASWORD')
        try {
            await this.app.$http.post('/v1/user/changePasswordByMessage', opts)
            commit('CHANGEPASWORD_SUCCESS')
            return true
        } catch (error) {
            commit('CHANGEPASWORD_FAILED', getErrorMsg(error))
        }
    },

    nextStep ({ commit }) {
        commit('NEXT_STEP')
    },

    prevStep ({ commit }) {
        commit('PREV_STEP')
    }
}
