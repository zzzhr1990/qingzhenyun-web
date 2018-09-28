import getErrorMsg from '@/utils/getErrorMsg'

export const state = () => {
    return {
        dialog: false,
        components: '',
        fetching: false,
        previewMsg: null,
        file: null,
        previewImage: null,
        previewVideo: {
            data: null,
            quality: null,
            selectedQuality: null
        },
        previewPdf: {
            url: ''
        }
    }
}

export const mutations = {
    DIALOG (state, show) {
        state.dialog = show
    },
    DIALOG_CLOSE (state) {
        state.dialog = false
    },
    REQUEST (state) {
        state.fetching = true
    },
    RESPONSE_SUCCESS (state) {
        state.fetching = false
    },
    RESPONSE_FAILED (state, result) {
        state.fetching = false
        state.previewMsg = {
            type: 'error',
            message: result
        }
    },
    SET_FILE (state, result) {
        state.file = result
    },
    SET_IMG (state, result) {
        state.fetching = false
        state.components = 'imagePreview'
        state.previewImage = result
        state.dialog = true
    },
    SET_VIDEO (state, result) {
        state.fetching = false
        state.components = 'videoPreview'
        state.previewVideo.data = result
        state.previewVideo.quality = {}
        result.preview.map(item => {
            state.previewVideo.quality[item.clear] = item
        })

        state.dialog = true
    },
    SET_VIDEO_QUALITY (state, result) {
        state.previewVideo.selectedQuality = result
    },
    SET_PDF (state, result) {
        state.fetching = false
        state.previewPdf.url = result
    }
}

export const actions = {
    async preview ({ commit, dispatch }, opts) {
        commit('SET_FILE', opts)
        if (opts.preview === 300) {
            dispatch('image', {
                uuid: opts.uuid
            })
        } else if (opts.preview === 1000) {
            dispatch('video', {
                uuid: opts.uuid
            })
        }
    },

    async text ({ commit }, opts) {
        commit('REQUEST')
        try {
            let {
                data: { result }
            } = await this.app.$http.post('/v1/preview/text', opts)
            return result
        } catch (e) {
            commit('RESPONSE_FAILED', getErrorMsg(e))
        }
    },

    async image ({ commit }, opts) {
        commit('REQUEST')
        try {
            let {
                data: { result }
            } = await this.app.$http.post('/v1/preview/image', opts)
            commit('SET_IMG', result)
        } catch (e) {
            commit('RESPONSE_FAILED', getErrorMsg(e))
        }
    },

    async pdf ({ commit }, opts) {
        commit('REQUEST')
        try {
            let {
                data: { result }
            } = await this.app.$http.post('/v1/preview/pdf', opts)
            commit('SET_PDF', result.url)
        } catch (e) {
            commit('RESPONSE_FAILED', getErrorMsg(e))
        }
    },

    async video ({ commit }, opts) {
        commit('REQUEST')
        try {
            let {
                data: { result }
            } = await this.app.$http.post('/v1/preview/media', opts)
            commit('SET_VIDEO', result)
        } catch (e) {
            commit('RESPONSE_FAILED', getErrorMsg(e))
        }
    },

    async playlistUrl ({ state, commit }, opts) {
        var manifest = ['#EXTM3U']
        var bandwidthDict = {
            240: 246440,
            380: 460560,
            480: 836280,
            720: 2149280,
            1080: 6221600
        }
        var bandwidth = function (clear) {
            return clear in bandwidthDict ? bandwidthDict[clear] : 6221600
        }
        state.previewVideo.data.preview.map(item => {
            manifest.push(
                `#EXT-X-STREAM-INF:PROGRAM-ID=1,BANDWIDTH=${bandwidth(
                    item.clear
                )},RESOLUTION=${item.resolution.toLowerCase()},NAME="${
                    item.clearText
                }"`
            )
            manifest.push(item.url)
        })

        console.group('manifest')
        console.log(manifest.join('\n'))
        console.groupEnd()

        let blob = new Blob([manifest.join('\n')], {
            type: 'application/vnd.apple.mpegurl'
        })
        return URL.createObjectURL(blob)
    },

    async videoUrl ({ state, commit }, opts) {
        commit('REQUEST')
        try {
            if (opts in state.previewVideo.quality) {
                let quality = state.previewVideo.quality[opts]
                let req = await this.app.$http.get(quality.url)
                let blob = new Blob([req.data], {
                    type: req.headers['content-type']
                })
                return URL.createObjectURL(blob)
            } else {
                throw new Error(`object has no key "${opts}"`)
            }
        } catch (e) {
            commit('RESPONSE_FAILED', getErrorMsg(e))
        }
    },

    async videoProxyUrl ({ state, commit }, opts) {
        commit('REQUEST')
        try {
            let req = await this.app.$http.get(opts)
            let blob = new Blob([req.data], {
                type: req.headers['content-type']
            })
            return URL.createObjectURL(blob)
        } catch (e) {
            commit('RESPONSE_FAILED', getErrorMsg(e))
        }
    },

    async audio ({ commit }, opts) {
        commit('REQUEST')
        try {
            let {
                data: { result }
            } = await this.app.$http.post('/v1/preview/audio', opts)
            return result
        } catch (e) {
            commit('RESPONSE_FAILED', getErrorMsg(e))
        }
    }
}
