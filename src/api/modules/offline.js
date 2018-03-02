import Vue from 'vue'

export default {
  /**
   * 预解析种子
   * @param  {Object} opts 参数
   *     - uuid {string}  The uuid of the file
   * @return {Promise}
   */
  parseTorrent (opts) {
    return Vue.http.post('/v1/offline/parseTorrent', opts)
  },

  /**
   * 启动离线下载
   * @param  {Object} opts 参数
   *     - type 整型 0BT, 10 磁力链, 20 http/https, 40 电驴
   *     - *taskHash 字符串 如果是需要预处理的任务，那么此项必须。
   *     - files 需要下载的文件 如 0,1,2,3 用英文逗号隔开，* 表示下载所有文件。
   *     - *savePath 存储的父路径 与 saveUuid 不共存，如a/b/c
   *     - *saveUuid 存储的父文件夹，与 savePath 不共存
   *     - *name 自定义任务名
   * @return {Promise}
   */
  start (opts) {
    return Vue.http.post('/v1/offline/start', opts)
  },

  /**
   * 预解析磁力链
   * @param  {Object} opts 参数
   *     - url {string}
   * @return {Promise}
   */
  parseMagnet (opts) {
    return Vue.http.post('/v1/offline/parseMagnet', opts)
  },

  /**
   * 获取云下载任务列表
   * @param  {Object} opts 参数
   *     - *page {int} The page of the list, default is 1
   *     - *pageSize {int} The page size of the lis, max 999, default is 20
   *     - *order {int} 整形 1:按发布时间倒序 -1:按发布时间正序
   * @return {Promise}
   */
  page (opts) {
    return Vue.http.post('/v1/offline/page', opts)
  },

  /**
   * 终止云下载任务
   * @param  {Object} opts 参数
   *     - taskHash {Array} 要终止的任务序列
   * @return {Promise}
   */
  remove (opts) {
    return Vue.http.post('/v1/offline/remove', opts)
  }
}
