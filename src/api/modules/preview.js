import axios from 'axios'

export default {
  /**
   * 获视频预览信息
   * @param  {Object} opts 参数
   *     - *path {string} path of the upload file
   *     - uuid {string} file id
   * @return {Promise}
   */
  video (opts) {
    return axios.post('/v1/preview/video', opts)
  }
}
