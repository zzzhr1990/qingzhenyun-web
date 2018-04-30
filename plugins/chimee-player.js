import ChimeePlayer from 'chimee-player'
import Vue from 'vue'
import randomId from '@/utils/randomid.js'
import pluginPlaySeek from '@/plugins/chimee-plugin-player-seek'
import LocalStore from '@/utils/store'
import isMobile from '@/utils/isMobile'

let videoPlayList = {
    length: 0
}

let maxListLength = 10

let _timer = null

let Vars = null

const VIDEO_LIST_ST = '_v_ls'

ChimeePlayer.install(pluginPlaySeek)

function isNativeSupported () {
    let video = document.createElement('video')
    return isMobile(navigator.userAgent) || (video.canPlayType && (video.canPlayType('application/x-mpegURL') || video.canPlayType('application/vnd.apple.mpegURL')))
}

const hlsIsSupported = isNativeSupported()

function getClarities (data) {
    if (data instanceof Array) {
        return data.map(function (element) {
            return {
                name: element.clear,
                src: element.url
            }
        })
    }
    return []
}

Vue.directive('player', {
    bind: function (el, binding, vnode) {
        const dom = document.createElement('div')
        const id = randomId('player_')
        dom.id = id
        dom.className = 'CH_player'
        Vars = binding.value || {}
        el.appendChild(dom)
        el.$dom = dom
        let list = getClarities(binding.value.video)
        let pluginChildren = {
            play: {},
            progressTime: {},
            progressBar: {},
            volume: {},
            screen: {},
            clarity: {
                list: list,
                width: '2em'
            }
        }

        if (isMobile(navigator.userAgent)) {
            delete pluginChildren.volume
        }
        if (list.length) {
            Vue.nextTick(() => {
                el.$player = new ChimeePlayer({
                    wrapper: '#' + id,
                    src: list[0].src,
                    box: hlsIsSupported ? 'native' : 'hls',
                    autoplay: true,
                    controls: true,
                    plugin: [
                        pluginPlaySeek.name,
                        {
                            name: 'chimeeControl',
                            children: pluginChildren
                        }
                    ]
                })
                el.$player.ready.then(function () {
                    let d = LocalStore.get(VIDEO_LIST_ST)
                    videoPlayList = d ? JSON.parse(d) : videoPlayList
                    if (videoPlayList.length && videoPlayList[Vars.uuid]) {
                        el.$player.emit('openPlaySeekPopup', videoPlayList[Vars.uuid])
                    }
                })
                el.$player.on('timeupdate', function () {
                    if (!el.$player.currentTime) {
                        return
                    }
                    if (videoPlayList.length > maxListLength) {
                        for (let k in videoPlayList) {
                            if (k !== 'length' && k !== Vars.uuid) {
                                delete videoPlayList[k]
                                videoPlayList.length--
                                break
                            }
                        }
                    }
                    if (!videoPlayList[Vars.uuid]) {
                        videoPlayList.length++
                    }
                    videoPlayList[Vars.uuid] = el.$player.currentTime
                    clearTimeout(_timer)
                    _timer = setTimeout(function () {
                        LocalStore.set(VIDEO_LIST_ST, JSON.stringify(videoPlayList))
                    }, 2000)
                })
            })
        }
    },

    unbind: function (el) {
        clearTimeout(_timer)
        el.$player && el.$player.destroy()
        el.$player = null
        el.$dom && el.removeChild(el.$dom)
        el.$dom = null
    }
})
