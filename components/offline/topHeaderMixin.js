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
            type: {
                link: 20,
                ed2k: 40,
                magnet: 10,
                bt: 0
            },
            btPath: ':TORRENT'
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
            'parseMagnet',
            'parseTorrent'
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
            if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('ftp://') || url.startsWith('sftp://') || url.startsWith('thunder://')) {
                if (!this.isMobile) {
                    let deferred = defer()
                    this.setSelectDirDialogState({
                        show: true,
                        payload: {
                            data: {
                                url: res,
                                type: this.type.link
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

                this.start({
                    savePath: '',
                    url: res,
                    type: this.type.link
                })
            }
        },

        tryDownloadEd2k (url, res) {
            if (url.startsWith('ed2k:')) {
                alert('暂不支持电驴下载')
            }
        },

        tryDownloadMagnet (url, res) {
            if (url.startsWith('magnet:')) {
                this
                    .parseMagnet({
                        url: res
                    })
                    .then((result) => {
                        if (this.isMobile) {
                            this.start({
                                savePath: '',
                                taskHash: result.taskHash,
                                files: '*',
                                type: this.type.magnet
                            })
                            return
                        }

                        if (!result.files) {
                            let deferred = defer()
                            this.setSelectDirDialogState({
                                show: true,
                                payload: {
                                    data: {
                                        taskHash: result.taskHash,
                                        files: '*',
                                        type: this.type.magnet
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
                                            files: files,
                                            type: this.type.magnet
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
                this.tryDownloadEd2k(url, res)
                this.tryDownloadMagnet(url, res)
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
                        let fileInfo = file.getFileInfo()
                        this
                            .parseTorrent({
                                path: fileInfo.path
                            })
                            .then((result) => {
                                if (this.isMobile) {
                                    this.start({
                                        savePath: '',
                                        taskHash: result.taskHash,
                                        files: '*',
                                        type: this.type.bt
                                    })
                                    return
                                }

                                if (!result.files) {
                                    let deferred = defer()
                                    this.setSelectDirDialogState({
                                        show: true,
                                        payload: {
                                            data: {
                                                taskHash: result.taskHash,
                                                files: '*',
                                                type: this.type.bt
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
                                                    files: files,
                                                    type: this.type.bt
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
