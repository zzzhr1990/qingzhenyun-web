<template>
    <v-card class="qz-preview-video">
        <v-toolbar card color="rgba(0,0,0,0.50);" height="80" dark absolute>

            <v-toolbar-title>{{file.name}}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="dialogClose">
                <v-icon>close</v-icon>
            </v-btn>

        </v-toolbar>
        <v-layout class="qz-preview-layout" align-center justify-end column fill-height>
            <video class="qz-video" ref="video" object-fit="contain" @pause="onPause" @play="onPlay" @timeupdate="onTimeupdate" @durationchange="onDurationchange"></video>
            <v-spacer></v-spacer>
            <v-flex class="qz-preview-progress" v-if="video">

            </v-flex>
            <v-flex class="qz-preview-controller" v-if="video">
                <v-layout class="qz-preview-controller-layout" align-center justify-start row fill-height>
                    <v-btn flat @click.stop="togglePlay" class="qz-player-btn qz-player-play" :class="{'qz-player-paused': paused}">
                        <i class="v-icon qz-icon" :class="{'qz-icon-player-play': paused, 'qz-icon-player-pause': !paused}"></i>
                    </v-btn>
                    <v-flex class="qz-player-progress-text">
                        {{currentTime | MMSS}}/{{duration | MMSS}}
                    </v-flex>
                    <v-spacer></v-spacer>
                    <v-menu top z-index="999" offset-y>
                        <v-btn flat slot="activator" class="qz-player-btn qz-player-change-quality">
                            清晰度
                        </v-btn>
                        <v-list>
                            <v-list-tile v-for="(item, index) in preview.quality" :key="index" @click="selectQuality(item.clear)">
                                <v-list-tile-title>{{ item.clearText }}</v-list-tile-title>
                            </v-list-tile>
                        </v-list>
                    </v-menu>
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
        return {
            initialized: false,
            video: null,
            paused: true,
            duration: 0,
            currentTime: 0,
            hls: null,
            url: null,
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
                            // cannot recover
                            vm.hls.destroy()
                            break
                        }
                    }
                })
            })
        },
        reinit () {

        },
        loadSource () {
            // this.hls.destroy()
            this.hls.loadSource(this.url)
        },
        quit () {
            var vm = this
            vm.resetData()
            vm.hls && vm.hls.destroy()
        },
        resetData () {
            this.video = null
            this.paused = true
            this.duration = 0
            this.currentTime = 0
            this.url = null
        },
        async selectDefaultQuality () {
            var quality = this.defaultQuality
            if (!(this.defaultQuality in this.preview.quality)) {
                quality = Object.keys(this.preview.quality)[0]
            }
            await this.selectQuality(quality)
        },
        async selectQuality (quality) {

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
        onTimeupdate () {
            this.updateTime()
        },
        onDurationchange () {
            this.updateTime()
        }

    }
}
</script>
