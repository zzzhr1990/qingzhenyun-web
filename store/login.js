import getErrorMsg from '@/utils/getErrorMsg'
import Cookies from 'universal-cookie'

const cookies = new Cookies()
const TOKEN_NAME = 'token'
const USERNAME_NAME = 'username'
const REMEMBER_ME_NAME = 'remember_me'
const TOKEN_EXPIRE_TIME = 30
const LOGIN_CODE_PREFIX = 'LOGIN_'

export const state = () => {
    return {
        user: null,
        token: null,
        fetching: false,
        message: null,
        phoneInfo: ''
    }
}

export const mutations = {
    SET_USER_INFO (state, result) {
        state.fetching = false
        state.user = result
    },
    SET_TOKEN (state, token) {
        let rememberMe = cookies.get(REMEMBER_ME_NAME)
        state.token = token
        let date = new Date()
        if (rememberMe === 'true') {
            date.setDate(date.getDate() + 7)
        } else {
            date.setMinutes(date.getMinutes() + TOKEN_EXPIRE_TIME)
        }

        cookies.set(TOKEN_NAME, token, { path: '/', expires: date })
    },
    SET_REMEMBER_ME (state, rememberMe) {
        let date = new Date()
        date.setDate(date.getDate() + 7)
        cookies.set(REMEMBER_ME_NAME, rememberMe, {
            path: '/',
            expires: date
        })
    },
    SET_USERNAME (state, username) {
        if (username) {
            let date = new Date()
            date.setDate(date.getDate() + 7)
            cookies.set(USERNAME_NAME, username, {
                path: '/',
                expires: date
            })
        } else {
            cookies.remove(USERNAME_NAME)
        }
    },
    REQUEST_LOGIN (state) {
        state.fetching = true
    },
    REQUEST_SEND_MSG (state) {
        state.fetching = true
    },
    SEND_MSG_FAILED (state, result) {
        state.fetching = false
        state.message = { type: 'error', message: result }
    },
    LOGIN_FAILED (state, result) {
        state.fetching = false
        state.message = { type: 'error', message: result }
    },
    SET_PHONE_INFO (state, result) {
        state.fetching = false
        state.phoneInfo = result
    },
    LOGOUT (state) {
        state.token = null
        let date = new Date()
        date.setDate(date.getDate() - 1)
        cookies.set(TOKEN_NAME, '', { path: '/', expires: date })
    }
}

export const actions = {
    async login ({ commit }, opts) {
        commit('REQUEST_LOGIN')
        try {
            const {
                data: { success, code, result, token }
            } = await this.app.$axios.post('/v1/user/login', opts)

            if (opts.rememberUsername) {
                commit('SET_USERNAME', opts.value)
            } else {
                commit('SET_USERNAME', false)
            }

            if (success) {
                commit('SET_REMEMBER_ME', opts.rememberMe)
                commit('SET_USER_INFO', result)
                commit('SET_TOKEN', token)
                return true
            } else {
                commit(
                    'LOGIN_FAILED',
                    this.app.i18n.t(LOGIN_CODE_PREFIX + code)
                )
                return false
            }
        } catch (e) {
            commit('LOGIN_FAILED', getErrorMsg(e))
            return false
        }
    },

    async defaultValue () {
        return cookies.get(USERNAME_NAME)
    },

    async refresh ({ commit }, opts) {
        commit('REQUEST_LOGIN')
        try {
            const {
                data: { result, token }
            } = await this.app.$http.post('/v1/user/info', opts)
            commit('SET_USER_INFO', result)
            commit('SET_TOKEN', token)
            return true
        } catch (e) {
            commit('LOGIN_FAILED', getErrorMsg(e))
        }
    },

    async logout ({ commit }) {
        try {
            await this.app.$http.post('/v1/user/logout', {
                time: new Date().getTime()
            })
            commit('LOGOUT')
            return true
        } catch (e) {
            return false
        }
    },

    async sendMsg ({ commit }, opts) {
        commit('REQUEST_SEND_MSG')
        try {
            const {
                data: { result }
            } = await this.app.$axios.post('/v1/user/sendLoginMessage', opts)
            commit('SET_PHONE_INFO', result)
        } catch (e) {
            commit('SEND_MSG_FAILED', getErrorMsg(e))
        }
    },

    async loginByMsg ({ commit }, opts) {
        commit('REQUEST_LOGIN')
        try {
            const {
                data: { result, token }
            } = await this.app.$axios.post('/v1/user/loginByMessage', opts)
            commit('SET_USER_INFO', result)
            commit('SET_TOKEN', token)
            return true
        } catch (e) {
            commit('LOGIN_FAILED', getErrorMsg(e))
        }
    }
}
