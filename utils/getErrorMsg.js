export default function getErrorMsg (rsp) {
    if (typeof rsp === 'object') {
        if (typeof rsp.response === 'string') {
            return rsp.response
        }
        if (typeof rsp.response === 'object') {
            if (typeof rsp.response.data === 'string') {
                return rsp.response.data
            }
            if (typeof rsp.response.data === 'object') {
                return rsp.response.data.message || rsp.response.data.code
            }
        }
    }
    if (rsp instanceof Error) {
        return rsp.message
    }
    if (typeof rsp === 'string') {
        return rsp
    }
    if (typeof rsp === 'function') {
        return getErrorMsg(rsp())
    }
    return '未知错误'
}
