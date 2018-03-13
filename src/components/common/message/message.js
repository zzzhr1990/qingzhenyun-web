import { Message } from 'element-ui'

const MES = {
  WAITING () {
    Message({
      message: '正在请求中，请耐心等待',
      type: 'warning'
    })
  },
  LOGIN_SUCCESS () {
    Message({
      message: '登录成功',
      type: 'success'
    })
  },
  ILLEGAL_URL () {
    Message({
      message: '链接非法',
      type: 'error'
    })
  },
  LOGOUT_SUCCESS () {
    Message({
      message: '退出成功',
      type: 'success'
    })
  },
  COMMON (ret = {}) {
    if (typeof ret === 'string') {
      return {
        message: ret,
        type: 'error'
      }
    }
    if (ret instanceof Error) {
      return {
        message: ret.message,
        type: 'error'
      }
    }
    if (ret.data) {
      if (typeof ret.data === 'string') {
        return {
          message: ret.data,
          type: 'error'
        }
      }
      return {
        message: ret.data.message || ret.data.code,
        type: 'error'
      }
    }
    return {
      message: '未知错误',
      type: 'error'
    }
  },
  COMMON_ERROR (ret) {
    Message(MES.COMMON(ret))
  },

  REGIST_SUCCESS () {
    Message({
      message: '注册成功，3秒钟后跳转',
      type: 'success'
    })
  },

  DEVELOPING () {
    Message({
      message: '功能正在开发中...',
      type: 'warning'
    })
  }
}

export default MES
