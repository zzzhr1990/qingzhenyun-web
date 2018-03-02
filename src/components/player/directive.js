import ChimeePlayer from 'chimee-player'
import Vue from 'vue'
import myMixins from '@/components/common/mixins/utils'
import pluginPlaySeek from './chimee-plugin-play-seek'
import {getLocalStorage, setLocalStorage} from 'chimee-helper-utils'
import * as types from '@/store/mutation-types'

let player = null

let Vars = null

let videoPlayList = {
  length: 0
}

let maxListLength = 30

let _timer = null

ChimeePlayer.install(pluginPlaySeek)

export const STOP_PLAY = 'STOP_PLAY'

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
    const id = 'player_' + myMixins.methods.randomId()
    dom.id = id
    dom.className = 'CH_player'
    Vars = binding.value || {}
    el.appendChild(dom)
    let list = getClarities(binding.value.video)
    if (list.length) {
      Vue.nextTick()
        .then(() => {
          player = new ChimeePlayer({
            wrapper: '#' + id,
            src: list[0].src,
            box: 'hls',
            autoplay: true,
            controls: true,
            plugin: [
              pluginPlaySeek.name,
              {
                name: 'chimeeControl',
                children: {
                  play: {},
                  progressTime: {},
                  progressBar: {},
                  volume: {},
                  screen: {},
                  clarity: {
                    list: list
                  }
                }
              }
            ]
          })
          player.ready.then(function () {
            let d = getLocalStorage(types.VIDEO_LIST_ST)
            videoPlayList = d ? JSON.parse(d) : videoPlayList
            if (videoPlayList.length && videoPlayList[Vars.uuid]) {
              player.emit('openPlaySeekPopup', videoPlayList[Vars.uuid])
            }
          })
          player.on('timeupdate', function () {
            if (!player.currentTime) {
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
            videoPlayList[Vars.uuid] = player.currentTime
            clearTimeout(_timer)
            _timer = setTimeout(function () {
              setLocalStorage(types.VIDEO_LIST_ST, JSON.stringify(videoPlayList))
            }, 2000)
          })
        })
    }
  },

  update: function (newVal, oldVal, c) {
    if (newVal === STOP_PLAY && player) {
      clearTimeout(_timer)
      player.destroy()
      player = null
    }
  }
})

export const Version = '1.0'
