<template>
    <v-card class="qz-preview-video" ref="card" @mousemove="resetIdleTimer" :class="{'hide-controller': hideController}">
        <v-toolbar card color="rgba(0,0,0,0.50);" height="80" dark absolute v-show="!hideController">

            <v-toolbar-title>{{file.name}}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="dialogClose">
                <v-icon>close</v-icon>
            </v-btn>

        </v-toolbar>
        <v-layout class="qz-preview-status" align-center justify-center column fill-height text-md-center>
            <v-flex class="qz-preview-status-icon" v-if="tipCode > 0">
                <v-progress-circular indeterminate v-if="tip[tipCode].icon === 'progress'" :size="64"></v-progress-circular>
                <v-icon v-else>{{tip[tipCode].icon}}</v-icon>
            </v-flex>
            <v-flex class="qz-preview-status-title" v-if="tipCode > 0">
                {{tip[tipCode].title}}
            </v-flex>
            <v-flex class="qz-preview-status-text" v-if="tipCode > 0">
                {{tip[tipCode].text}}
            </v-flex>
        </v-layout>
        <v-layout class="qz-preview-layout" align-end justify-center column fill-height>

            <video class="qz-video" ref="video" :autoplay="autoPlay" object-fit="contain" @pause="onPause" @play="onPlay" @canplay="onCanplay" @stalled="onStalled" @seeking="onSeeking" @seeked="onSeeked" @progress="onProgress" @timeupdate="onTimeupdate" @durationchange="onDurationchange"></video>
            <v-spacer></v-spacer>

            <v-flex class="qz-preview-progress" v-show="!hideController" v-if="video && canPlay" align-end justify-center>
                <v-slider class="qz-preview-progress-buffered" v-model="bufferedTime" readonly height="8" color="#FFFFFF" :min="0" :max="duration" :step="0.1" hide-details></v-slider>
                <v-slider v-model="seekTime" height="8" color="#37ECBA" :min="0" :max="duration" :step="0.1" @start="seekingTime = true" @end="seekingTime = false" @change="changeTime($event)" hide-details></v-slider>
            </v-flex>
            <v-flex class="qz-preview-controller" v-show="!hideController">
                <!-- v-if="video && canPlay" -->
                <v-layout class="qz-preview-controller-layout" align-center justify-start row fill-height>
                    <v-btn flat @click.stop="togglePlay" class="qz-player-btn qz-player-play" :class="{'qz-player-paused': paused}">
                        <i class="v-icon qz-icon" :class="{'qz-icon-player-play': paused, 'qz-icon-player-pause': !paused}"></i>
                    </v-btn>
                    <v-flex class="qz-player-progress-text">
                        {{seekingTime ? seekTime : currentTime | MMSS}}/{{duration | MMSS}}
                    </v-flex>
                    <v-spacer></v-spacer>
                    <v-menu content-class="qz-player-volume-menu" top z-index="999" offset-y nudge-left="-7" nudge-bottom="-5" min-width="40" max-width="40" min-height="185" max-height="185">
                        <v-btn flat slot="activator" class="qz-player-btn">
                            <i class="v-icon qz-icon qz-player-volume"></i>
                        </v-btn>
                        <div class="qz-player-volume-fill">
                            <div class="qz-player-volume-fill-volume" :style="{'width': volume * 100 + '%'}"></div>
                        </div>
                        <input type="range" min="0" max="1" v-model="volume" step="0.01" @input="onVolumeChange" @change="onVolumeChange">
                    </v-menu>
                        <v-menu content-class="qz-player-quality-menu" top z-index="999" offset-y nudge-left="20" nudge-bottom="-5">
                            <v-btn flat slot="activator" class="qz-player-btn qz-player-change-quality">
                                清晰度
                            </v-btn>
                            <v-list>
                                <v-list-tile v-for="(item, index) in preview.quality" :key="index" @click="selectQuality(item.clearText)" :class="{'qz-active': item.clearText === currentQuality}">
                                    <v-list-tile-title>{{ item.clearText }}</v-list-tile-title>
                                </v-list-tile>
                            </v-list>
                        </v-menu>
                        <v-btn flat class="qz-player-btn" :input-value="fullscreen" @click="toggleFullscreen">
                            <i class="v-icon qz-icon qz-player-fullscreen"></i>
                        </v-btn>
                </v-layout>
            </v-flex>
        </v-layout>
    </v-card>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'

import Hls from 'hls.js'

export default {
    data () {
        let tip = {
            1: {
                icon: 'progress',
                title: '正在初始化',
                text: ''
            },
            2: {
                icon: 'sentiment_very_dissatisfied',
                title: '发生错误',
                text: '请重新打开预览窗口重播'
            },
            3: {
                icon: 'progress',
                title: '数据加载中',
                text: ''
            }
        }

        return {
            initialized: false,
            idleTimer: null,
            autoPlay: true,
            fullscreen: false,
            hideController: false,
            canPlay: false,
            tip,
            tipCode: 1,
            video: null,
            paused: true,
            duration: 0,
            currentTime: 0,
            seekingTime: false,
            seekTime: 0,
            bufferedTime: 0,
            hls: null,
            url: null,
            volume: 0,
            currentQuality: null,
            defaultQuality: 1080
        }
    },
    watch: {

    },
    computed: {
        ...mapState('preview', {
            file: 'file',
            preview: 'previewVideo'
        })
    },
    methods: {
        ...mapMutations('preview', {
            dialogClose: 'DIALOG_CLOSE'
        }),
        ...mapActions('preview', {
            videoUrl: 'videoUrl',
            videoProxyUrl: 'videoProxyUrl',
            playlistUrl: 'playlistUrl'
        }),
        async init () {
            if (!Hls.isSupported()) {
                this.dialogClose()
            }

            var vm = this
            vm.hls = new Hls({
                pLoader (config) {
                    var Loader = Hls.DefaultConfig.loader
                    let loader = new Loader(config)

                    this.abort = () => loader.abort()
                    this.destroy = () => loader.destroy()
                    this.load = (context, config, callbacks) => {
                        let { type, url } = context

                        if (type === 'manifest') {
                            console.log(`Manifest ${url} will be loaded.`)
                        } else if (type === 'level') {
                            context.url = vm.videoProxyUrl(context.url)
                                .then(url => {
                                    context.url = url
                                    loader.load(context, config, callbacks)
                                })
                            return
                        }

                        loader.load(context, config, callbacks)
                    }
                }
            })
            vm.video = vm.$refs.video
            vm.url = await vm.playlistUrl()

            // attach fullscreen event
            vm.regFullscreenEvent()

            // attach idle timer
            vm.setIdleTimer()

            // attach video volume
            vm.volume = vm.video.volume

            vm.hls.attachMedia(vm.video)
            vm.hls.on(Hls.Events.MEDIA_ATTACHED, function () {
                vm.loadSource(vm.url)

                vm.hls.once(Hls.Events.MANIFEST_PARSED, function (event, data) {
                    vm.initialized = true
                    console.log('manifest loaded, found ' + data.levels.length + ' quality level')
                })

                vm.hls.on(Hls.Events.ERROR, function (event, data) {
                    if (data.fatal) {
                        switch (data.type) {
                        case Hls.ErrorTypes.NETWORK_ERROR:
                            // try to recover network error
                            console.log('fatal network error encountered, try to recover')
                            vm.hls.startLoad()
                            break
                        case Hls.ErrorTypes.MEDIA_ERROR:
                            console.log('fatal media error encountered, try to recover')
                            vm.hls.recoverMediaError()
                            break
                        default:
                            vm.tipCode = 2
                            vm.hls.destroy()
                            break
                        }
                    }
                })

                // vm.hls.on(Hls.Events.LEVEL_SWITCHING, function () {
                //     console.log('LEVEL_SWITCHING', vm.hls.currentLevel)
                // })
                vm.hls.on(Hls.Events.LEVEL_SWITCHED, function () {
                    vm.currentQuality = vm.hls.currentLevel >= 0 ? vm.hls.levels[vm.hls.currentLevel].name : vm.hls.currentLevel
                })
                // vm.hls.on(Hls.Events.LEVEL_LOADING, function () {
                //     console.log('LEVEL_LOADING', vm.hls.currentLevel)
                // })
                // vm.hls.on(Hls.Events.LEVEL_LOADED, function () {
                //     console.log('LEVEL_LOADED', vm.hls.currentLevel)
                // })
                // vm.hls.on(Hls.Events.LEVEL_UPDATED, function () {
                //     console.log('LEVEL_UPDATED', vm.hls.currentLevel)
                // })
                vm.hls.on(Hls.Events.FRAG_CHANGED, function () {
                    vm.currentQuality = vm.hls.currentLevel >= 0 ? vm.hls.levels[vm.hls.currentLevel].name : vm.hls.currentLevel
                })
            })
        },
        loadSource () {
            // this.hls.destroy()
            this.hls.loadSource(this.url)
        },
        quit () {
            var vm = this
            vm.exitFullscreen()
            vm.resetData()
            vm.hls && vm.hls.destroy()
        },
        resetData () {
            this.canPlay = false
            this.fullscreen = false
            this.tipCode = 1
            this.video = null
            this.paused = true
            this.duration = 0
            this.currentTime = 0
            this.seekingTime = false
            this.seekTime = 0
            this.bufferedTime = 0
            this.url = null
            this.currentQuality = null

            if (this.idleTimer) {
                clearTimeout(this.idleTimer)
                this.idleTimer = null
            }
        },
        async selectDefaultQuality () {
            var quality = this.defaultQuality
            if (!(this.defaultQuality in this.preview.quality)) {
                quality = Object.keys(this.preview.quality)[0]
            }
            await this.selectQuality(quality)
        },
        selectQuality (quality) {
            var vm = this
            let qualityIndex = vm.hls.levels.findIndex(el => {
                return el.name === quality
            })
            if (qualityIndex >= 0) {
                console.log('[request]', 'select quality', '=>', qualityIndex)
                vm.hls.currentLevel = qualityIndex
            }
        },
        resetIdleTimer () {
            var vm = this
            vm.hideController = false
            vm.setIdleTimer()
        },
        setIdleTimer () {
            var vm = this
            clearTimeout(vm.idleTimer)
            vm.idleTimer = setTimeout(function () {
                vm.hideController = true
            }, 5000)
        },
        toggleFullscreen () {
            var vm = this
            var el = vm.$refs.card.$el
            if (vm.fullscreenElement()) {
                vm.exitFullscreen()
            } else {
                vm.launchFullscreen(el)
            }
        },
        launchFullscreen (element) {
            if (element.requestFullscreen) {
                element.requestFullscreen()
            } else if (element.mozRequestFullScreen) {
                element.mozRequestFullScreen()
            } else if (element.msRequestFullscreen) {
                element.msRequestFullscreen()
            } else if (element.webkitRequestFullscreen) {
                element.webkitRequestFullScreen()
            }
        },
        regFullscreenEvent () {
            var vm = this

            if (document.exitFullscreen) {
                document.removeEventListener('fullscreenchange', vm.onFullscreenchange)
                document.addEventListener('fullscreenchange', vm.onFullscreenchange)
            } else if (document.msExitFullscreen) {
                document.removeEventListener('MSFullscreenChange', vm.onFullscreenchange)
                document.addEventListener('MSFullscreenChange', vm.onFullscreenchange)
            } else if (document.mozCancelFullScreen) {
                document.removeEventListener('mozfullscreenchange', vm.onFullscreenchange)
                document.addEventListener('mozfullscreenchange', vm.onFullscreenchange)
            } else if (document.webkitExitFullscreen) {
                document.removeEventListener('webkitfullscreenchange', vm.onFullscreenchange)
                document.addEventListener('webkitfullscreenchange', vm.onFullscreenchange)
            }
        },
        fullscreenElement () {
            var fullscreenElement =
                document.fullscreenElement ||
                document.mozFullScreenElement ||
                document.webkitFullscreenElement
            return fullscreenElement
        },
        exitFullscreen () {
            if (document.exitFullscreen) {
                document.exitFullscreen()
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen()
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen()
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen()
            }
        },
        togglePlay () {
            if (this.video.paused) {
                this.video.play()
            } else {
                this.video.pause()
            }
        },
        updatePausedStatus () {
            this.paused = this.video.paused
        },
        updateTime () {
            this.duration = this.video.duration
            this.currentTime = this.video.currentTime
            if (!this.seekingTime) {
                this.seekTime = this.video.currentTime
            }
        },
        changeTime (time) {
            this.video.currentTime = this.seekTime
        },
        toMMSS (num) {
            return (new Date()).clearTime()
                .addSeconds(num)
                .toString('H:mm:ss')
        },
        onPause () {
            this.updatePausedStatus()
        },
        onPlay () {
            this.updatePausedStatus()
        },
        onCanplay () {
            this.tipCode = -1
            this.canPlay = true
        },
        onStalled () {
            this.tipCode = 3
        },
        onSeeking () {
            this.tipCode = 3
        },
        onSeeked () {
            this.tipCode = -1
        },
        onProgress () {
            if (this.video.buffered.length > 0) {
                this.bufferedTime = this.video.buffered.end(0)
            } else {
                this.bufferedTime = 0
            }
        },
        onTimeupdate () {
            this.updateTime()
        },
        onDurationchange () {
            this.updateTime()
        },
        onFullscreenchange () {
            var vm = this
            console.log(vm.fullscreenElement())
            if (vm.fullscreenElement()) {
                vm.fullscreen = true
            } else {
                vm.fullscreen = false
            }
        },
        onVolumeChange () {
            this.video.volume = this.volume
        }
    }
}
</script>
