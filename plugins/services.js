/*
 *
 * axios
 *
*/
import axios from 'axios'

// const service = axios.create({})

// // 拦截器
// service.interceptors.request.use(config => {
//   return config
// }, error => {
//   return Promise.reject(error)
// })

// service.interceptors.response.use(response => {
//   return response
// }, error => {
//   return Promise.reject(error)
// })

// Vue.prototype.$services = service
const REQUIRE_AUTH = 401
export default ({ app, store, redirect }) => {
    const service = axios.create({
        baseURL: process.server ? process.env.serverBaseURL : process.env.baseURL
    })
    service.interceptors.request.use(config => {
        if (store.state.login.token && !config.headers.Authorization) {
            config.headers.Authorization = 'Bearer ' + store.state.login.token
        }
        return config
    }, error => {
        return Promise.reject(error)
    })

    service.interceptors.response.use(response => {
        if (response && response.data && typeof response.data === 'object' && response.data.token) {
            store.commit('login/SET_TOKEN', response.data.token)
        }
        return response
    }, error => {
        if (error.response && (error.response.status === REQUIRE_AUTH)) {
            store.commit('login/LOGOUT')
            redirect('/login')
        }
        return Promise.reject(error)
    })

    app.$http = service
}
