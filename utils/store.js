const store = (function () {
    var supportLocalStorage = !!window.localStorage
    return {
        set: function (name, value) {
            if (supportLocalStorage) {
                window.localStorage.setItem(name, value)
            } else {
                var expires = new Date()
                // 默认存储300天
                expires.setTime(expires.getTime() + 24 * 3600 * 1000 * 300)
                try {
                    document.cookie = name + '=' + escape(value) + ';expires=' + expires.toUTCString() + ';path=/;'
                } catch (e) {
                    console.error(e)
                }
            }
        },
        get: function (name) {
            if (supportLocalStorage) {
                return window.localStorage.getItem(name)
            } else {
                try {
                    var regRt = document.cookie.match(new RegExp('(^| )' + name + '=([^;]*)(;|$)'))
                    return regRt instanceof Array ? unescape(regRt[2]) : ''
                } catch (e) {
                    return ''
                }
            }
        }
    }
})()

export default store
