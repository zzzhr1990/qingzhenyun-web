export default () => {
    return new Promise(function (resolve) {
        let dict = {}
        let LOGIN_PREFIX = 'LOGIN_'

        dict[LOGIN_PREFIX + 'PHONE_REQUIRED'] = '手机号码为必填项'
        dict[LOGIN_PREFIX + 'PASSWORD_REQUIRED'] = '密码为必填项'
        dict[LOGIN_PREFIX + 'USER_LOGIN_FAILED'] = '用户登录失败'
        dict[LOGIN_PREFIX + 'USER_NOT_FOUND'] = '用户不存在'

        resolve(dict)
    })
}
