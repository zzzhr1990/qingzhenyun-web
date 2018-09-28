import getErrorMsg from '@/utils/getErrorMsg'

export const state = () => {
    return {
        fetching: false,
        message: null,
        pageInfo: {
            list: [],
            info: {
                path: ''
            },
            page: 0,
            pageSize: 0,
            totalCount: 0,
            totalPage: 0
        },

        // recent request
        path: '',
        orderBy: -1
    }
}

// result: {
//   page: 0,
//   pageSize: types.HOME_PAGE_SIZE,
//   totalCount: 0,
//   totalPage: 0,
//   list: [],
//   path: [],
//   info: {
//     uuid: ''
//   }
// },
// page: 1,
// requestStatus: 'waiting'

const RECYCLE = 1

export const getters = {
    breadcrumbs (state) {
        let rawPath = state.pageInfo.info.path.trim()

        let paths = rawPath === '/' ? ['/'] : rawPath.split('/')
        let length = paths.length - 1
        return paths.map((item, index, arr) => {
            return {
                text: index === 0 ? '全部文件' : item,
                path: arr.slice(0, index + 1).join('/'),
                disabled: index === length
            }
        })
    }
}

export const mutations = {
    REQUEST (state) {
        state.fetching = true
    },
    RESPONSE_SUCCESS (state) {
        state.fetching = false
    },
    RESPONSE_FAILED (state, result) {
        state.fetching = false
        state.message = {
            type: 'error',
            message: result
        }
    },
    SET_PAGE_INFO (state, result) {
        state.fetching = false
        state.orderBy = result.orderBy
        state.pageInfo = result
    },
    APPEND_PAGE_INFO (state, result) {
        state.fetching = false
        result.list = state.pageInfo.list.concat(result.list)
        state.pageInfo = result
    },
    ADD_FILE (state, result) {
        state.fetching = false
        let parentPath = result.path.split('/').slice(0, -1).join('/') || '/'
        if (state.pageInfo.info.path !== parentPath) {
            return false
        }

        // koukuko: when creating a folder with a duplicate name,
        // it will return the existing folder
        let oldIndex = state.pageInfo.list.findIndex(element => {
            return element.uuid === result.uuid
        })
        if (oldIndex < 0) {
            state.pageInfo.list.unshift(result)
        } else {
            state.pageInfo.list[oldIndex] = result
        }
    },
    FAKE_REMOVE (state, opts) {
        state.fetching = false
        state.pageInfo.list = state.pageInfo.list.filter(el => {
            if ('path' in opts) {
                for (var i in opts.path) {
                    let item = opts.path[i]
                    if (item === el.path) {
                        return false
                    }
                }
            }

            if ('uuid' in opts) {
                for (var j in opts.uuid) {
                    let item = opts.uuid[j]
                    if (item === el.uuid) {
                        return false
                    }
                }
            }

            return true
        })
    },

    FAKE_RENAME (state, opts) {
        state.fetching = false
        var targetIndex = state.pageInfo.list.findIndex(el => {
            return el.uuid === opts.uuid || el.path === opts.path
        })
        state.pageInfo.list[targetIndex].name = opts.name
    },

    FAKE_MOVE (state, opts) {
        state.fetching = false

        if (opts.parent === state.pageInfo.info.uuid || opts.destPath === state.pageInfo.info.path) {
            return false
        }

        state.pageInfo.list = state.pageInfo.list.filter(el => {
            if ('path' in opts) {
                for (var i in opts.path) {
                    let item = opts.path[i]
                    if (item === el.path) {
                        return false
                    }
                }
            }

            if ('uuid' in opts) {
                for (var j in opts.uuid) {
                    let item = opts.uuid[j]
                    if (item === el.uuid) {
                        return false
                    }
                }
            }

            return true
        })
    }
}

export const actions = {
    refresh ({
        state,
        dispatch
    }, {
        orderBy
    } = {}) {
        dispatch('page', {
            page: 1,
            path: state.pageInfo.info.path,
            orderBy: state.orderBy
        })
    },

    async move ({
        commit,
        dispatch
    }, opts) {
        commit('REQUEST')
        try {
            await this.app.$http.post('/v1/files/move', opts)
            dispatch('refresh')
        } catch (e) {
            commit('RESPONSE_FAILED', getErrorMsg(e))
        }
    },

    async copy ({
        commit,
        dispatch
    }, opts) {
        commit('REQUEST')
        try {
            await this.app.$http.post('/v1/files/copy', opts)
            dispatch('refresh')
        } catch (e) {
            commit('RESPONSE_FAILED', getErrorMsg(e))
        }
    },

    async rename ({
        commit,
        dispatch
    }, opts) {
        commit('REQUEST')
        try {
            await this.app.$http.post('/v1/files/rename', opts)
            commit('FAKE_RENAME', opts)
        } catch (e) {
            commit('RESPONSE_FAILED', getErrorMsg(e))
        }
    },

    async recycle ({
        commit,
        dispatch
    }, opts) {
        commit('REQUEST')
        try {
            await this.app.$http.post('/v1/files/remove', Object.assign({}, opts, {
                recycle: RECYCLE
            }))
            commit('FAKE_REMOVE', opts)
            return true
        } catch (e) {
            commit('RESPONSE_FAILED', getErrorMsg(e))
        }
    },

    async page ({
        commit,
        state
    }, opts) {
        commit('REQUEST')
        try {
            const {
                data: {
                    result
                }
            } = await this.app.$http.post('/v1/files/page', Object.assign({}, opts, {
                path: 'path' in opts ? opts.path : state.pageInfo.info.path,
                pageSize: this.state.pageSize,
                orderBy: opts.orderBy || this.state.orderBy
            }))
            result.orderBy = opts.orderBy || this.state.orderBy
            commit('SET_PAGE_INFO', result, opts)
        } catch (e) {
            commit('RESPONSE_FAILED', getErrorMsg(e))
        }
    },

    async loadMore ({
        commit,
        state
    }, opts) {
        commit('REQUEST')
        try {
            if ((state.pageInfo.page + 1) > state.pageInfo.totalPage) {
                commit('RESPONSE_SUCCESS')
                return false
            }

            const {
                data: {
                    result
                }
            } = await this.app.$http.post('/v1/files/page', Object.assign({}, opts, {
                // 使用index.js的全局设置
                pageSize: this.state.pageSize,
                orderBy: state.orderBy,
                path: state.pageInfo.info.path,
                page: state.pageInfo.page + 1
            }))
            commit('APPEND_PAGE_INFO', result)
        } catch (e) {
            commit('RESPONSE_FAILED', getErrorMsg(e))
        }
    },

    async get ({
        commit
    }, opts) {
        commit('REQUEST')
        try {
            const {
                data: {
                    result
                }
            } = await this.app.$http.post('/v1/files/get', opts)
            commit('RESPONSE_SUCCESS')
            return result
        } catch (e) {
            commit('RESPONSE_FAILED', getErrorMsg(e))
        }
    },

    async getPreviewImage ({
        commit
    }, opts) {
        commit('REQUEST')
        try {
            const {
                data: {
                    result
                }
            } = await this.app.$http.post('/v1/preview/image', opts)
            commit('RESPONSE_SUCCESS')
            return result
        } catch (e) {
            commit('RESPONSE_FAILED', getErrorMsg(e))
        }
    },

    async createDirectory ({
        commit
    }, opts) {
        commit('REQUEST')
        try {
            const {
                data: {
                    result
                }
            } = await this.app.$http.post('/v1/files/createDirectory', opts)
            commit('ADD_FILE', result)
            // state.message = {
            //     type: 'success',
            //     message: `文件夹"${result.name}"创建成功｝"`
            // }
            return result
        } catch (e) {
            commit('RESPONSE_FAILED', getErrorMsg(e))
        }
    },

    async download ({
        commit
    }, opts) {
        try {
            let {
                data: {
                    result
                }
            } = await this.app.$http.post('/v1/files/download', opts)
            return result
        } catch (e) {
            commit('RESPONSE_FAILED', getErrorMsg(e))
        }
    },

    async folder ({
        commit
    }, opts) {
        try {
            let {
                data: {
                    result
                }
            } = await this.app.$http.post('/v1/files/list', Object.assign({}, opts, {
                type: 1,
                size: 999
            }))
            return result
        } catch (e) {
            commit('RESPONSE_FAILED', getErrorMsg(e))
        }
    }
}
