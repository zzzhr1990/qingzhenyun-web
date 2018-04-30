import getErrorMsg from '@/utils/getErrorMsg'

export const state = () => {
    return {
        step: 1,
        msg: {
            fetching: false,
            phoneInfo: ''
        },
        reg: {
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
    REQUEST_REGIST (state) {
        state.reg.fetching = true
    },
    REGIST_SUCCESS (state) {
        state.reg.fetching = false
    },
    REGIST_FAILED (state, result) {
        state.reg.fetching = false
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
            const { data: {result} } = await this.app.$axios.post('/v1/user/sendRegisterMessage', opts)
            commit('GET_PHONEINFO_SUCCESS', result)
        } catch (error) {
            commit('GET_PHONEINFO_FAILED', getErrorMsg(error))
        }
    },

    async regist ({ commit }, opts) {
        commit('REQUEST_REGIST')
        try {
            const { data: { result, token } } = await this.app.$axios.post('/v1/user/register', opts)
            commit('REGIST_SUCCESS')
            this.commit('login/SET_USER_INFO', result)
            this.commit('login/SET_TOKEN', token)
            return true
        } catch (error) {
            commit('REGIST_FAILED', getErrorMsg(error))
        }
    },

    nextStep ({ commit }) {
        commit('NEXT_STEP')
    },

    prevStep ({ commit }) {
        commit('PREV_STEP')
    }
}
