export default {
  FILE_NUM_OVERFLOW (num = 1) {
    return {
      title: '警告',
      message: `最多只能添加${num}个文件`,
      type: 'warning'
    }
  },

  FILE_UPLOAD_FAILED (fileName, msg = '') {
    return {
      title: '文件上传失败',
      message: `${fileName} 上传失败 ${msg}`,
      type: 'error'
    }
  },

  FILE_CHECK_FAILED (fileName) {
    return {
      title: '文件校验失败',
      message: `${fileName} 校验失败，请重新上传`,
      type: 'error'
    }
  },

  FILE_MOVE_SUCCESS (fileName) {
    return {
      title: '文件移动成功',
      message: `文件 ${fileName} 移动成功`,
      type: 'success'
    }
  },

  FILE_MOVE_FAILED (fileName, msg = '') {
    return {
      title: '文件移动失败',
      message: `移动文件 ${fileName} 失败 ${msg}`,
      type: 'warning'
    }
  },

  FILE_MODIFY_SUCCESS (fileName) {
    return {
      title: '文件修改成功',
      message: `文件 ${fileName} 名称修改成功`,
      type: 'success'
    }
  },

  FILE_MODIFY_FAILED (fileName, msg = '') {
    return {
      title: '文件修改失败',
      message: `修改 ${fileName} 失败 ${msg}`,
      type: 'warning'
    }
  },

  FILE_DELETE_SUCCESS (fileName) {
    return {
      title: '文件删除成功',
      message: `删除 ${fileName} 成功`,
      type: 'success'
    }
  },

  FILE_DELETE_ERROR (fileName, msg = '') {
    return {
      title: '文件删除失败',
      message: `删除 ${fileName} 失败: ${msg}`,
      type: 'warning'
    }
  },

  DIR_CREATE_SUCCESS (fileName) {
    return {
      title: '文件夹创建成功',
      message: `创建文件夹 ${fileName} 成功`,
      type: 'success'
    }
  },

  DIR_CREATE_FAILED (fileName, msg) {
    return {
      title: '文件夹创建失败',
      message: `创建 ${fileName} 失败: ${msg}`,
      type: 'warning'
    }
  },

  COMMON_WARNING (ret) {
    if (typeof ret === 'string') {
      return {
        title: '警告',
        message: ret,
        type: 'warning'
      }
    }
    return {
      title: '警告',
      message: ret.code + ':' + ret.message,
      type: 'warning'
    }
  },

  OFFLINE_SUCCESS: {
    title: '成功',
    message: '添加离线下载成功',
    type: 'success'
  },

  OFFLIEN_REMOVE_SUCCESS: {
    title: '成功',
    message: '删除离线任务成功',
    type: 'success'
  }
}
