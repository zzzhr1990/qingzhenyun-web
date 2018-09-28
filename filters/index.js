export default {
    timeFilter (date) {
        let d = new Date(date)
        let year = d.getFullYear()
        let month = d.getMonth() + 1
        let day = d.getDate()
        let hours = d.getHours()
        let mins = d.getMinutes()
        let secs = d.getSeconds()
        function plus0 (num) {
            if (num < 10) {
                return '0' + num
            }
            return num + ''
        }
        return `${plus0(year)}.${plus0(month)}.${plus0(day)} ${plus0(hours)}:${plus0(mins)}:${plus0(secs)}`
    },
    fileSizeFilter (size) {
        let p = Math.pow(1024, 3)
        let unit = 'B'
        if (size > p) {
            unit = 'GB'
        } else if (size > (p /= 1024)) {
            unit = 'MB'
        } else if (size > (p /= 1024)) {
            unit = 'KB'
        } else if (size > (p /= 1024)) {
            unit = 'B'
        }
        return (size / p).toFixed(1) + unit
    },
    cloudStatusFilter (status) {
        return {
            0: 'cloud_queue',
            10: 'cloud_queue',
            20: 'cloud_download',
            100: 'cloud_download',
            150: 'cloud_upload',
            200: 'cloud_done',
            '-1': 'cloud_off'
        }[status] || 'cloud_queue'
    },
    MMSS (s) {
        var t = '00:00'
        if (s > -1) {
            var min = Math.floor(s / 60)
            var sec = Math.floor(s % 60)
            if (min < 10) {
                t = '0'
            } else {
                t = ''
            }
            t += min + ':'
            if (sec < 10) {
                t += '0'
            }
            t += sec
        }
        return t
    }
}
