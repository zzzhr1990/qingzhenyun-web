/*
 *
 * axios
 *
*/
import axios from 'axios'
export default ({ app, store }) => {
    const service = axios.create({
        baseURL: process.server ? process.env.serverBaseURL : process.env.baseURL
    })

    app.$axios = service
}
