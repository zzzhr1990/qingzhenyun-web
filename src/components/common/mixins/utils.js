import Message from '@/components/common/message/message'
export default {
  methods: {
    catchErrorHandler (e, commit) {
      Message.COMMON_ERROR(e)
      if (commit) {
        this.$store.commit(commit)
      }
    },

    randomId () {
      return Math.random().toString(16).substring(2)
    },

    awaysGetArray (obj) {
      if (!(obj instanceof Array)) {
        return [obj]
      }
      return obj
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

    filterTime (time) {
      const t = new Date(time)
      const year = t.getFullYear()
      let month = t.getMonth()
      let day = t.getDate()
      month > 9 ? '' : (month = '0' + month)
      day > 9 ? '' : (day = '0' + day)
      return `${year}-${month}-${day}`
    },

    fileTypeFilter (data) {
      if (data.mime === 'application/x-directory') {
        return 'floder'
      }

      const name = data.name
      if (/\.(txt|pdf)$/i.test(name)) {
        return 'documents'
      }
      if (/\.(jpe?g|png|bmp|gif|tiff)$/i.test(name)) {
        return 'image'
      }
      if (/\.(mp4)$/i.test(name)) {
        return 'video'
      }
      if (/\.(zip|rar|7z)$/i.test(name)) {
        return 'pack'
      }
      if (/\.(wav|mp3)$/i.test(name)) {
        return 'music'
      }
      return 'other'
    },

    openDownloadSource (url) {
      var a = document.createElement('a')
      a.setAttribute('href', url)
      a.setAttribute('target', '_blank')
      a.style.visibility = 'hidden'
      document.body.appendChild(a)
      a.click()
      // this.$nextTick(() => {
      //   try {
      //     document.body.removeChild(a)
      //   }
      //   catch (e) {}
      // })
      setTimeout(() => {
        try {
          document.body.removeChild(a)
        } catch (e) {}
      }, 10)
    }
  }
}
