import { mapState, mapActions } from 'vuex'
import Message from 'vuetify-toast'
export default {
    watch: {
        message (msg) {
            Message[msg.type](msg.message)
        },
        previewMsg (msg) {
            Message[msg.type](msg.message)
        }
    },
    computed: {
        ...mapState('files', [
            'pageInfo',
            'fetching',
            'message'
        ]),
        ...mapState('preview', [
            'previewMsg'
        ])
    },
    methods: {

        /**
         * 混入方法
         */
        ...mapActions('files', [
            'download',
            'rename',
            'move',
            'recycle'
        ]),

        /**
         * 下载单个文件
         * @param  {Object} item 文件信息
         * @return {[type]}      [description]
         */
        async downloadIt (item) {
            let result = await this.download({path: item.path})
            if (result) {
                this.openDownloadSource(result)
            }
        },

        /**
         * 打开下载链接
         * @param  {Object} result 包涵下载链接的结果
         * @return {[type]}        [description]
         */
        openDownloadSource (result) {
            var a = document.createElement('a')
            a.setAttribute('href', result.url)
            a.setAttribute('download', result.name)
            a.style.visibility = 'hidden'
            document.body.appendChild(a)
            a.click()
            setTimeout(() => {
                try {
                    document.body.removeChild(a)
                } catch (e) {}
            }, 10)
        },

        async editIt (item) {
            let res = await this.$prompt('', {
                buttonTrueText: '确定',
                buttonFalseText: '取消',
                color: 'primary',
                icon: 'info',
                title: '提示',
                property: '$prompt'
            })
            if (res) {
                this.rename({
                    path: item.path,
                    name: res
                })
            }
        },

        deleteIt (item) {
            this.recycle({
                path: [item.path],
                recycle: 1
            })
        },

        tryOpenDir (item) {
            if (item.mime === 'application/x-directory') {
                this.$router.push('/home/' + encodeURIComponent(item.path))
            }
        },

        tryOpenPdf (type, item) {
            if (type === 3) {
                this.$router.push('/p/' + encodeURIComponent(item.path) + '?type=pdf')
                // window.open('/p/' + encodeURIComponent(item.path) + '?type=pdf', '_blank')
            }
        },

        ...mapActions('preview', [
            'image'
        ]),

        tryOpenImage (type, item) {
            if (type === 4) {
                this.image({
                    path: item.path
                })
            }
        },

        tryOpenVideo (type, item) {
            if (type === 1) {
                this.$router.push('/v/' + encodeURIComponent(item.path) + '?type=video')
            }
        },

        tryOpenAudio (type, item) {
            if (type === 2) {
                this.$router.push('/v/' + encodeURIComponent(item.path) + '?type=audio')
            }
        },

        userOperation (item) {
            let type = item.preview / 100
            this.tryOpenDir(item)
            // 如果是图片
            this.tryOpenImage(type, item)
            // 如果是视频
            this.tryOpenVideo(type, item)
            // 如果是音频
            this.tryOpenAudio(type, item)
            // 如果是pdf
            this.tryOpenPdf(type, item)
        },

        fileTypeFilter (data) {
            if (data.mime === 'application/x-directory') {
                return 'folder'
            }

            const name = data.name
            if (/\.(pdf)$/i.test(name)) {
                return 'picture_as_pdf'
            }
            if (/\.(txt|html|htm|docx|doc|xml|js|hjson|geojson|yml|config|ini|yaml|vtt|vcard|uri|uris|urls|ttl|t|tr|roff|man|me|ms|styl|stylus|rtf|rtx|conf|list|text|md|markdown|less|jsx|jade|shtml|csv|css|coffee|litcoffee|ics|ifb|manifest|appcache)$/i.test(name)) {
                return 'description'
            }
            if (/\.(jpe?g|png|bmp|gif|tiff|webp|apng|svg|fpx|svg|xbm|ico|heif)$/i.test(name)) {
                return 'image'
            }
            if (/\.(mp4|avi|rm|rmvb|mov|mtv|3gp|amv|flv|mpg|swf|f4v|m4v|mkv|mts|webm|h264|h263|h261|3gpp|)$/i.test(name)) {
                return 'movie'
            }
            if (/\.(zip|rar|cab|arj|lzh|ace|uue|z|7z|iso|jar|gz|gz2|gza|tar|bz2|bz|bza|7za|bzip)$/i.test(name)) {
                return 'archive'
            }
            if (/\.(wav|mp3|wmv|ogg|ape|aac|flac|mka|m4a|au|mpc|alac|tta|midi|dff)$/i.test(name)) {
                return 'music_video'
            }
            return 'note'
        },

        getColor (item) {
            let color = ''
            switch (this.fileTypeFilter(item)) {
            case 'folder':
                color = 'orange darken-2'
                break
            case 'description':
                color = 'blue darken-2'
                break
            case 'image':
                color = 'light-green darken-2'
                break
            case 'movie':
                color = 'blue-grey darken-2'
                break
            case 'archive':
                color = 'amber darken-2'
                break
            case 'music_video':
                color = 'light-blue darken-2'
                break
            case 'picture_as_pdf':
                color = 'red lighten-1'
                break
            default:
                color = 'grey lighten-5'
                break
            }
            return color
        }
    }
}
