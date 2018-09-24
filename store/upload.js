// initial state
import axios from 'axios'
import getErrorMsg from '@/utils/getErrorMsg'
import WUFile from '@/utils/File'
export const state = () => {
    return {
        uploadConfig: {
            BlockSize: 4 * 1024 * 1024,
            ChunkSize: 1 * 1024 * 1024,
            maxQueueLen: 99,
            concurrency: 3,
            ChunkRetry: 3
        },
        uploadList: [],
        uploadMsg: null
    }
}

// refresh ({ state, dispatch }, opts) {
//   // console.log(app.state)
//   dispatch('page', {
//     page: state.pageInfo.page,
//     pageSize: state.pageInfo.pageSize,
//     path: state.pageInfo.info.path,
//     orderBy: state.pageInfo.orderBy
//   })
// },
// PENDING: '排队中...',
// PREPARING: '准备中...',
// UPLOADING: '上传中...',
// CALCULATING: '计算中...',
// FAILED: '上传失败',
// DONE: '上传完成',
// CANCEL: '取消上传'
export const actions = {
    upload ({
        state,
        dispatch
    }) {
        const uploadingList = state.uploadList.filter((file) => {
            return file.isUploading() || file.isCalculating() || file.isPreparing()
        })
        if (uploadingList.length >= state.uploadConfig.concurrency) {
            return
        }
        let tasks = state.uploadList.filter((file) => {
            return file.isPending()
        })
        if (uploadingList.length + tasks.length === 0) {
            // this.commit('files/refresh')
            return
        }
        tasks = tasks.slice(0, state.uploadConfig.concurrency - uploadingList.length)
        tasks.forEach((file) => {
            dispatch('uploadPrepar', file)
        })
    },

    async token (store, file) {
        try {
            const {
                data: {
                    result
                }
            } = await this.app.$http.post('/v1/store/token', {
                hash: file.sha1,
                path: file.puid,
                name: file.name,
                override: file.override
            })
            return result
        } catch (e) {
            return e
        }
    },

    async getHash (store, file) {
        const {
            sha1
        } = await new WUFile(file).getHash()
        return sha1
    },

    async pause ({
        state,
        dispatch,
        commit
    }, file) {
        if (file.isUploading()) {
            commit('PAUSE_TASK', file)
        }
    },

    async resume ({
        state,
        dispatch,
        commit
    }, file) {
        if (file.isPaused()) {
            commit('RESUME_TASK', file)
            dispatch('uploadStart', {
                file: file,
                error: null
            })
        }
    },

    async uploadPrepar ({
        state,
        dispatch,
        commit
    }, file) {
        commit('CALCULATING', file)
        try {
            let hash = await dispatch('getHash', file)
            if (hash && hash instanceof Error === false) {
                commit('SET_HASH', {
                    file: file,
                    hash: hash
                })
            } else {
                throw hash
            }
            commit('PREPARING', file)
            let tokenInfo = await dispatch('token', file)
            if (tokenInfo && tokenInfo instanceof Error === false) {
                commit('SET_TOKEN', {
                    file,
                    tokenInfo
                })
            } else {
                throw tokenInfo
            }
            if (file.isExisted()) {
                commit('UPLOAD_DONE', {
                    file: file
                })
                dispatch('upload')
                return
            }
            if (file.isCancel()) {
                return new Error('Cancel upload!')
            }
            commit('UPLOADING', file)
        } catch (e) {
            commit('UPLOAD_FAILED', {
                file: file,
                error: e
            })
            dispatch('upload')
            return
        }
        dispatch('uploadStart', {
            file: file,
            error: null
        })
    },

    async uploadStart ({
        state,
        dispatch,
        commit
    }, {
        file,
        error
    }) {
        if (file.isCancel()) {
            commit('UPLOAD_FAILED', {
                file,
                error: new Error('Cancel upload!')
            })
            return
        }
        if (file.isTryout()) {
            commit('UPLOAD_FAILED', {
                file,
                error: error || new Error('File upload try out!')
            })
            dispatch('upload')
            return
        }
        if (file.isPaused()) {
            return
        }

        let fileServerInfo = file.getServerInfo()
        try {
            let {
                data
            } = await axios.post(
                fileServerInfo.url,
                file.slice(fileServerInfo.chunk.startByte, fileServerInfo.chunk.endByte), {
                    headers: {
                        Authorization: fileServerInfo.Authorization,
                        UploadBatch: fileServerInfo.UploadBatch,
                        'Content-Type': 'application/octet-stream'
                    },
                    onUploadProgress: (event) => {
                        // if (event.lengthComputable) {
                        // }
                        commit('PROGRESSING', {
                            file,
                            loaded: event.loaded
                        })
                    }
                }
            )
            if (data.code) {
                throw new Error(data.message)
            }
            commit('SET_CTX', {
                file: file,
                ctx: data.ctx,
                chunk: fileServerInfo.chunk
            })
        } catch (e) {
            commit('TRY', file)
            dispatch('uploadStart', {
                file: file,
                error: e
            })
            return
        }

        if (!fileServerInfo.chunk.isFileEnd) {
            commit('SET_POS', {
                file: file,
                index: fileServerInfo.chunk.index + 1
            })
            dispatch('uploadStart', {
                file: file,
                error: null
            })
            return
        }

        let creatServer = file.getCreatFileServerInfo()
        try {
            let {
                data
            } = await axios.post(
                creatServer.url,
                creatServer.ctxList, {
                    headers: {
                        Authorization: creatServer.Authorization,
                        UploadBatch: creatServer.UploadBatch,
                        'Content-Type': 'text/plain;charset=UTF-8'
                    }
                }
            )
            if (data.code) {
                throw new Error(data.message)
            }
            if (data.hash !== file.sha1) {
                throw new Error('文件hash校验失败!')
            }
            // file.setFileInfo(JSON.parse(createFileResult.response).result)
            commit('UPLOAD_DONE', {
                file: file,
                result: JSON.parse(data.response).result
            })
            dispatch('upload')
        } catch (e) {
            commit('TRY', file)
            dispatch('uploadStart', {
                file: file,
                error: e
            })
        }
    }
}

export const mutations = {
    SET_TOKEN (state, {
        file,
        tokenInfo
    }) {
        file.setToken(tokenInfo)
    },
    SET_HASH (state, {
        file,
        hash
    }) {
        file.setHash(hash)
    },
    TRY (state, file) {
        file.markTry()
    },
    SET_POS (state, {
        file,
        index
    }) {
        file.setPos(index)
    },
    SET_CTX (state, {
        file,
        ctx,
        chunk
    }) {
        file.setCtx(ctx, chunk)
    },
    PROGRESSING (state, {
        file,
        loaded
    }) {
        file.setProgress(loaded)
    },
    UPLOADING (state, file) {
        file.setStatus(WUFile.STATUS.UPLOADING)
    },
    PREPARING (state, file) {
        file.setStatus(WUFile.STATUS.PREPARING)
    },
    CALCULATING (state, file) {
        file.setStatus(WUFile.STATUS.CALCULATING)
    },
    UPLOAD_FAILED (state, {
        file,
        error
    }) {
        file.setStatus(WUFile.STATUS.FAILED)
        state.uploadMsg = {
            type: 'error',
            message: '上传' + file.name + '失败:' + getErrorMsg(error)
        }
    },
    UPLOAD_PAUSE (state, {
        file,
        result
    }) {
        file.setStatus(WUFile.STATUS.PAUSE)
    },
    UPLOAD_RESUME (state, {
        file,
        result
    }) {
        file.setStatus(WUFile.STATUS.UPLOADING)
    },
    UPLOAD_DONE (state, {
        file,
        result
    }) {
        if (result) {
            file.setFileInfo(result)
        }
        file.setStatus(WUFile.STATUS.DONE)
        state.uploadMsg = {
            type: 'success',
            message: '上传' + file.name + '成功'
        }
    },

    ADD_TASK (state, {
        tasks,
        path,
        override,
        onStatusChange
    }) {
        const tasksLen = tasks.length
        if (!tasksLen) {
            return
        }
        const list = state.uploadList.filter(item => !item.isDone())
        if (tasksLen + list.length > state.uploadConfig.maxQueueLen) {
            state.uploadMsg = {
                type: 'error',
                message: '超过上传限制，最多允许99个任务'
            }
            return
        }
        state.uploadList = state.uploadList.concat(Array.prototype.slice.call(tasks).map((item) => {
            return new WUFile({
                file: item,
                blockSize: state.uploadConfig.BlockSize,
                chunkSize: state.uploadConfig.ChunkSize,
                uuid: path,
                chunkRetry: state.uploadConfig.ChunkRetry,
                override: override,
                onStatusChange: onStatusChange
            })
        }))
    },

    REMOVE_TASK (state, task) {
        for (let i = 0, len = state.uploadList.length; i < len; i++) {
            if (state.uploadList[i] === task) {
                state.uploadList[i].setStatus(WUFile.STATUS.CANCEL)
                state.uploadList.splice(i, 1)
                break
            }
        }
    },

    PAUSE_TASK (state, task) {
        for (let i = 0, len = state.uploadList.length; i < len; i++) {
            if (state.uploadList[i] === task) {
                state.uploadList[i].setStatus(WUFile.STATUS.PAUSE)
                break
            }
        }
    },

    RESUME_TASK (state, task) {
        for (let i = 0, len = state.uploadList.length; i < len; i++) {
            if (state.uploadList[i] === task) {
                state.uploadList[i].setStatus(WUFile.STATUS.UPLOADING)
                break
            }
        }
    },

    CLEAR_TASK (state) {
        state.uploadList.forEach((file) => {
            file.setStatus(WUFile.STATUS.CANCEL)
        })
        state.uploadList = []
    }
}
