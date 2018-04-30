<template>
    <v-layout px-2>
        <v-btn small @click="uploadIt" color="primary">
            <span>上传</span>
            <v-icon right>file_upload</v-icon>
        </v-btn>
        <form ref="form" style="display: none">
            <input type="file" ref="fileInput" @change="fileUpload($event)" multiple="true">
        </form>
        <v-btn small v-show="showBtnGroup" @click="deleteAll" light>
            <span>删除</span>
            <v-icon right>delete</v-icon>
        </v-btn>
        <v-btn small v-show="showBtnGroup" @click="moveAll" light>
            <span>移动</span>
            <v-icon right>swap_horiz</v-icon>
        </v-btn>
        <v-btn small @click="createDir" light>
            <span>新建文件夹</span>
            <v-icon right>create_new_folder</v-icon>
        </v-btn>
        <v-spacer></v-spacer>
        <v-menu offset-y>
            <v-btn light slot="activator" small>
                <span>排序</span>
                <v-icon right>sort</v-icon>
            </v-btn>
            <v-list>
                <v-list-tile @click="setPageOrder(orderBy.asc)" class="body-2">
                    <v-list-tile-title>按上传时间正序排列</v-list-tile-title>
                </v-list-tile>
                <v-list-tile @click="setPageOrder(orderBy.desc)" class="body-2">
                    <v-list-tile-title>按上传时间倒序排列</v-list-tile-title>
                </v-list-tile>
            </v-list>
        </v-menu>
        <v-btn small @click="togger" light>
            <span>传输列表</span>
            <v-icon right>view_module</v-icon>
        </v-btn>
    </v-layout>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'
import defer from 'defer-promise'
import topHeaderMixin from './topHeaderMixin.js'

export default {
    mixins: [
        topHeaderMixin
    ],
    data () {
        return {
            orderBy: {
                asc: -1,
                desc: 1
            },
            selected: []
        }
    },
    computed: {
        showBtnGroup () {
            return this.selected.length
        }
    },
    created () {
        this.$on('selectedArr', (selectedArr) => {
            this.selected = selectedArr
        })
    },
    methods: {

        ...mapMutations({
            setOrder: 'SET_ORDER'
        }),

        ...mapActions('files', [
            'refresh',
            'recycle',
            'move'
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

        deleteAll () {
            this.recycle({
                path: this.selected,
                recycle: 1
            })
        },

        ...mapMutations('selectdir', {
            setSelectDirDialogState: 'SET_STATE'
        }),

        moveAll () {
            let deferred = defer()
            this.setSelectDirDialogState({
                show: true,
                payload: {
                    data: this.selected,
                    defer: deferred
                }
            })
            deferred
                .promise
                .then(({path, payload}) => {
                    this.move({
                        path: payload.data,
                        destPath: path
                    })
                })
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
                path: this.pageInfo.info.path,
                tasks: files
            })
            this.upload()
            this.$refs.form.reset()
        }
    }
}
</script>
