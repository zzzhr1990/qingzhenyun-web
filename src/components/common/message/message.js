const Message = {
  WAITING: {
    message: '正在请求中，请耐心等待',
    type: 'warning'
  },
  LOGIN_SUCCESS: {
    message: '登录成功',
    type: 'success'
  },
  COMMON_WARNING (ret) {
    if (typeof ret === 'string') {
      return {
        message: ret,
        type: 'warning'
      }
    }
    return {
      message: ret.code + ':' + ret.message,
      type: 'warning'
    }
  },

  LOGOUT_SUCCESS: {
    message: '退出成功',
    type: 'success'
  },

  COMMON (ret = {}) {
    if (ret instanceof Error) {
      return {
        success: false,
        message: ret.message,
        code: 'ERROR',
        status: 0
      }
    }
    return ret.body || {
      success: false,
      message: 'ERR_INTERNET_DISCONNECTED',
      code: 'CONNECT_FAILED',
      status: 0
    }
  },

  COMMON_ERROR (ret) {
    const msg = Message.COMMON(ret)
    return Message.COMMON_WARNING(msg)
  },

  REGIST_SUCCESS: {
    message: '注册成功，3秒钟后跳转',
    type: 'success'
  },

  DEVELOPING: {
    message: '功能正在开发中...',
    type: 'warning'
  }
}

export default Message
