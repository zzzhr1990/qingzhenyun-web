import { mapActions, mapState, mapMutations } from 'vuex'
import defer from 'defer-promise'
import selectFileList from './fileSelectList.js'
import Message from 'vuetify-toast'

export default {
    data () {
        return {
            orderBy: {
                asc: -1,
                desc: 1
            },
            btPath: ':torrent'
        }
    },
    computed: {
        ...mapState('offline', [
            'pageInfo'
        ])
    },
    methods: {

        ...mapMutations({
            setOrder: 'SET_ORDER'
        }),

        ...mapActions('offline', [
            'refresh',
            'move',
            'start',
            'parseTorrent',
            'parseUrl'
        ]),

        setPageOrder (orderBy) {
            if (orderBy === this.pageInfo.orderBy) {
                return
            }
            this.setOrder(orderBy)
            this.refresh({
                orderBy: orderBy
            })
        },

        ...mapMutations('selectdir', {
            setSelectDirDialogState: 'SET_STATE'
        }),

        tryDownloadLink (url, res) {
            this
                .parseUrl({
                    url: res
                })
                .then((result) => {
                    // 若files为空，下载所有文件
                    if (!result.files) {
                        let deferred = defer()
                        this.setSelectDirDialogState({
                            show: true,
                            payload: {
                                data: {
                                    taskHash: result.taskHash,
                                    copyFile: '*'
                                },
                                defer: deferred
                            }
                        })
                        deferred
                            .promise
                            .then(({path, payload}) => {
                                this.start(Object.assign({}, payload.data, {
                                    savePath: path
                                }))
                            })
                        return
                    }

                    // files不为空的情况
                    selectFileList({
                        buttonTrueText: '确定',
                        buttonFalseText: '取消',
                        color: 'orange',
                        title: '选择要下载的文件',
                        items: result.files
                    })
                        .then((files) => {
                            if (!files) {
                                return
                            }
                            let deferred = defer()
                            this.setSelectDirDialogState({
                                show: true,
                                payload: {
                                    data: {
                                        taskHash: result.taskHash,
                                        copyFile: files
                                    },
                                    defer: deferred
                                }
                            })
                            deferred
                                .promise
                                .then(({path, payload}) => {
                                    this.start(Object.assign({}, payload.data, {
                                        savePath: path
                                    }))
                                })
                        })
                })
        },

        tryDownloadTorrent () {
            this.$refs.fileInput.click()
        },

        async downloadIt () {
            let res = await this.$prompt('', {
                buttonTrueText: '确定',
                buttonFalseText: '取消',
                color: 'orange',
                icon: 'info',
                title: '提示',
                property: '$prompt'
            })

            if (res) {
                let url = res.toLocaleLowerCase()
                this.tryDownloadLink(url, res)
            }
        },

        ...mapActions('upload', [
            'upload'
        ]),

        ...mapMutations('upload', {
            addTask: 'ADD_TASK'
        }),

        uploadIt () {
            this.$refs.fileInput.click()
        },

        fileUpload (evt) {
            let files = evt.target.files
            if (!files || !files[0]) {
                return
            }
            this.addTask({
                path: this.btPath,
                tasks: files,
                override: true,
                onStatusChange: (file) => {
                    if (file.isDone()) {
                        let uuid = file.getUuid()
                        this
                            .parseTorrent({
                                uuid: uuid
                            })
                            .then((result) => {
                                if (!result.files || result.files.length === 0) {
                                    let deferred = defer()
                                    this.setSelectDirDialogState({
                                        show: true,
                                        payload: {
                                            data: {
                                                taskHash: result.taskHash,
                                                copyFile: '*'
                                            },
                                            defer: deferred
                                        }
                                    })
                                    deferred
                                        .promise
                                        .then(({path, payload}) => {
                                            this.start(Object.assign({}, payload.data, {
                                                savePath: path
                                            }))
                                        })
                                    return
                                }

                                selectFileList({
                                    buttonTrueText: '确定',
                                    buttonFalseText: '取消',
                                    color: 'orange',
                                    title: '选择要下载的文件',
                                    items: result.files,
                                    width: 500
                                })
                                    .then((files) => {
                                        if (!files) {
                                            return
                                        }
                                        let deferred = defer()
                                        this.setSelectDirDialogState({
                                            show: true,
                                            payload: {
                                                data: {
                                                    taskHash: result.taskHash,
                                                    copyFile: files
                                                },
                                                defer: deferred
                                            }
                                        })
                                        deferred
                                            .promise
                                            .then(({path, payload}) => {
                                                this.start(Object.assign({}, payload.data, {
                                                    savePath: path
                                                }))
                                            })
                                    })
                            })
                    }
                    if (file.isFailed()) {
                        Message.error('文件上传失败，请重试！')
                    }
                }
            })
            this.upload()
            this.$refs.form.reset()
        }
    }
}
