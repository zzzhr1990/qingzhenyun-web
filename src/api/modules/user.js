import Vue from 'vue'
export default {
  /**
   * [login description]
   * 登录，若登录完成，需要设置csrf标志来着
   * @param  {Object} opts 传入参数，有username, password两个咯
   * @return {Promise}
   */
  login (opts) {
    return Vue.http.post('/v1/user/login', opts)
  },

  /**
   * [logout description]
   * @return {Promise}
   */
  logout () {
    return Vue.http.get('/v1/user/logout')
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
    return Vue.http.post('/v1/user/register', opts)
  },

  info () {
    return Vue.http.get('/v1/user/info')
  },

  captcha (opts) {
    return Vue.http.post('/v1/user/pc_get_captcha', opts)
  },

  validateCaptcha (opts) {
    return Vue.http.post('/v1/user/pc_validate', opts)
  },

  /**
   * 获取指定用户信息，username, json
   * @param  {[type]} opts [description]
   * @return {[type]}      [description]
   */
  profile (opts) {
    return Vue.http.post('/v1/user/profile', opts)
  },

  /**
   * 修改密码，"new_password", "old_password"， json
   * @param  {[type]} opts [description]
   * @return {[type]}      [description]
   */
  changePassword (opts) {
    return Vue.http.post('/v1/user/change_password', opts)
  }
}
