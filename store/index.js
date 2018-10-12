import jwt from 'jwt-decode'
import Cookies from 'universal-cookie'
import Long from 'long'
// import isMobile from '@/utils/isMobile'

function toNumber (low, high, unsigned) {
    return new Long(low, high, unsigned).toNumber()
}

function formatNumber (obj) {
    for (let i in obj) {
        if (obj.hasOwnProperty(i)) {
            if (typeof obj[i] === 'object' && obj[i].low !== undefined) {
                obj[i] = toNumber(obj[i].low, obj[i].high)
            }
        }
    }
    return obj
}

export const state = () => ({
    isMobile: false,
    orderBy: -1,
    pageSize: 20
})

export const mutations = {
    SET_ISMOBI (state, result) {
        state.isMobile = result
    },

    SET_ORDER (state, result) {
        state.orderBy = result || -1
    }
}

export const actions = {
    async nuxtServerInit ({ commit, dispatch }, { req }) {
        if (!req) {
            return false
        }
        // const userAgent = process.server
        //     ? req.headers['user-agent']
        //     : navigator.userAgent
        // commit('SET_ISMOBI', isMobile(userAgent))

        let cookie = process.server
            ? new Cookies(req.headers.cookie)
            : new Cookies()
        let token = cookie.get('token')
        commit('SET_ORDER', cookie.get('orderBy'))

        if (token) {
            this.commit('login/SET_USER_INFO', formatNumber(jwt(token)))
            this.commit('login/SET_TOKEN', token)
        }
    }
}
