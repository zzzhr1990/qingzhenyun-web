import { popupFactory } from 'chimee-player'
import './chimee-plugin-player-seek.css'

export default popupFactory({
    name: 'chimeePlaySeek',
    className: 'chimee-play-seek',
    body: '上次观看到 <span class="last-play-seek-time">00:00</span> <span class="jump">跳转</span>',
    offset: '78px 50%',
    hide: true,
    title: '',
    autoFocus: false,
    beforeCreate (_, option) {
        if (option.timeoutDelay) {
            this.timeoutDelay = option.timeoutDelay
        }
    },
    create () {
        const $wrap = this.$domWrap
        this.$seekTime = $wrap.find('.last-play-seek-time')
        this.$jump = $wrap.find('.jump')
        this.$jump.on('click', this.clickHandler)
        this.$emitSync('playSeekPluginCreate')
    },
    destroy () {
        clearTimeout(this._ls_timeout)
        this.$emitSync('playSeekPluginDestroy')
    },
    // 播放器初始化完毕
    inited () {
    },
    closed () {
        this.$seekTime.text('')
    },
    opened () {
        this._ls_timeout = setTimeout(() => {
            this.close()
        }, this.timeoutDelay)
        this.$bumpToTop()
    },
    methods: {
        clickHandler () {
            this.currentTime = this.seekTime
            this.emitSync('closePlaySeekPopup')
        },
        fixTime (time) {
            return time < 10 ? '0' + time : time
        },
        getTime (time) {
            let minus = Math.floor(time / 60)
            let second = Math.floor(time - minus * 60)
            return this.fixTime(minus) + ':' + this.fixTime(second)
        }
    },
    events: {
        openPlaySeekPopup (time = 0) {
            this.seekTime = time
            this.$seekTime.text(this.getTime(time))
            this.open()
        },

        closePlaySeekPopup () {
            clearTimeout(this._ls_timeout)
            this.close()
        }
    },
    // 以下为日志上报处理相关逻辑
    data: {
        timeoutDelay: 1e4,
        seekTime: 0,
        videoName: ''
    }
})
