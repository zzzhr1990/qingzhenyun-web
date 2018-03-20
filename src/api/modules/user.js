import axios from 'axios'

export default {
  /**
   * [login description]
   * 登录，若登录完成，需要设置csrf标志来着
   * @param  {Object} opts 传入参数，有username, password两个咯
   * @return {Promise}
   */
  login (opts) {
    return axios.post('/v1/user/login', opts)
  },

  /**
   * [register description]
   * @param  {Object} opts 参数
   * Param
   *      name | type | required
   *      -----|------|---------
   *      username| string| false
   *      password| more than 8 string| true
   *      email| email string| false
   *      phone_number| string (only numerical character)| false
   *      注意： username、email、phone_number 三个中必须填一个
   * @return {Promise}
   */
  register (opts) {
    return axios.post('/v1/user/register', opts)
  },

  /**
   * [sendmsg description]
   * @param  {Object} opts 参数
   * Param
   *      name | type | required
   *      -----|------|---------
   *      countryCode | string | false
   *      phone | string | true
   * @return {Promise}
   */
  sendmsg (opts) {
    return axios.post('/v1/user/sendRegisterMessage', opts)
  }
}
