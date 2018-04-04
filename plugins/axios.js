/*
 *
 * axios
 *
*/
import axios from 'axios'
export default ({ app, store }) => {
  const service = axios.create({
    baseURL: process.env.baseURL
  })

  app.$axios = service
}
