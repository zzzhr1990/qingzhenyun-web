import axios from 'axios'

export default {
  /**
   * 获取页信息
   * @param  {Object} opts 参数
   *     - *parent {string} The uuid of parent directory,'' for root directory, default is ''
   *     - *page {int} The page of the list, default is 1
   *     - *pageSize {int} The page size of the lis, max 999, default is 20
   * @return {Promise}
   */
  page (opts) {
    return axios.post('/v1/files/page', opts)
  },

  /**
   * 移动文件或文件夹
   * @param  {Object} opts 参数
   *     - *parent {string} The uuid of parent directory,'' for root directory, default is ''
   *     - uuid {string} The uuid of the file or director
   * @return {Promise}
   */
  move (opts) {
    return axios.post('/v1/files/move', opts)
  },

  /**
   * 删除文件或文件夹
   * @param  {Opiton} opts 参数
   *     - uuid {string} The uuid of the file or dorector
   * @return {Promise}
   */
  recycle (opts) {
    return axios.post('/v1/files/recycle', opts)
  },

  /**
   * 创建文件夹
   * @param  {Object} opts 参数
   *     - *parent {string} The uuid of parent directory,'' for root directory, default is ''
   *     - *name {string} The name of the directory
   * @return {Promise}
   */
  create (opts) {
    return axios.post('/v1/files/createDirectory', opts)
  },

  /**
   * 重命名文件
   * @param  {Object} opts 参数
   *     - uuid {string}  The uuid of the file
   *     - name {string}  The file name
   * @return {Promise}
   */
  rename (opts) {
    return axios.post('/v1/files/rename', opts)
  },

  /**
   * 获取文件信息
   * @param  {Object} opts 参数
   *     - uuid {string}  The uuid of the file
   * @return {Promise}
   */
  get (opts) {
    return axios.post('/v1/files/get', opts)
  },

  /**
   * web不使用
   * @return {[type]} [description]
   */
  list () {
    return axios.post('/v1/files/list')
  },

  /**
   * 文件下载
   * @param  {Object} opts 参数
   *     - *name {string} path of the upload file. like 'anc/c/c/c/sa/ss'
   *     - uuid {string} The uuid of the file
   * @return {Promise}
   */
  download (opts) {
    return axios.post('/v1/files/download', opts)
  }
}
