import { Notification } from 'element-ui'

const Message = {
  FILE_NUM_OVERFLOW (num = 1) {
    Notification({
      title: '警告',
      message: `最多只能添加${num}个文件`,
      type: 'warning'
    })
  },

  FILE_UPLOAD_FAILED (fileName, ret) {
    Notification({
      title: '文件上传失败',
      message: `${fileName} 上传失败 ${Message.COMMON(ret)}`,
      type: 'error'
    })
  },

  FILE_CHECK_FAILED (fileName) {
    Notification({
      title: '文件校验失败',
      message: `${fileName} 校验失败，请重新上传`,
      type: 'error'
    })
  },

  FILE_MOVE_SUCCESS () {
    Notification({
      title: '成功',
      message: '文件移动成功',
      type: 'success'
    })
  },

  COMMON (ret) {
    if (typeof ret === 'string') {
      return ret
    }
    if (ret instanceof Error) {
      return ret.message
    }
    if (ret.data) {
      if (typeof ret === 'string') {
        return ret.data
      }
      return ret.data.message || ret.data.code
    }
    return '未知错误'
  },

  FILE_MOVE_FAILED (ret) {
    Notification({
      title: '失败',
      message: `文件移动失败: ${Message.COMMON(ret)}`,
      type: 'error'
    })
  },

  FILE_MODIFY_SUCCESS (fileName) {
    Notification({
      title: '文件修改成功',
      message: `文件 ${fileName} 名称修改成功`,
      type: 'success'
    })
  },

  FILE_MODIFY_FAILED (fileName, ret) {
    Notification({
      title: '文件修改失败',
      message: `修改 ${fileName} 失败 ${Message.COMMON(ret)}`,
      type: 'warning'
    })
  },

  FILE_DELETE_SUCCESS () {
    Notification({
      title: '成功',
      message: '文件删除成功',
      type: 'success'
    })
  },

  FILE_DELETE_ERROR (ret) {
    Notification({
      title: '失败',
      message: `文件删除失败: ${Message.COMMON(ret)}`,
      type: 'error'
    })
  },

  DIR_CREATE_SUCCESS (fileName) {
    Notification({
      title: '文件夹创建成功',
      message: `创建文件夹 ${fileName} 成功`,
      type: 'success'
    })
  },

  DIR_CREATE_FAILED (fileName, ret) {
    Notification({
      title: '文件夹创建失败',
      message: `创建 ${fileName} 失败: ${Message.COMMON(ret)}`,
      type: 'warning'
    })
  },

  COMMON_WARNING (ret) {
    if (typeof ret === 'string') {
      Notification({
        title: '警告',
        message: ret,
        type: 'warning'
      })
    }
    Notification({
      title: '警告',
      message: ret.message || ret.code,
      type: 'warning'
    })
  },

  OFFLINE_SUCCESS () {
    Notification({
      title: '成功',
      message: '添加离线下载成功',
      type: 'success'
    })
  },

  OFFLIEN_REMOVE_SUCCESS () {
    Notification({
      title: '成功',
      message: '删除离线任务成功',
      type: 'success'
    })
  }
}

export default Message

