import Vue from 'vue'

export default {
  /**
   * 获取上传用token
   * @param  {Object} opts 参数
   *     - *name {string}  file name
   *     - *hash {string} file hash
   *     - *parent {string} parent directory id of the upload file. default is root('')
   * @return {Promise}
   */
  token (opts) {
    return Vue.http.post('/v1/store/token', opts)
  }
}
