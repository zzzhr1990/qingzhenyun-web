<template>
    <v-layout class="qz-toolbar-layout">
        <v-btn class="v-button-custom v-button-primary-custom qz-upload m-r-16" @click="uploadIt" depressed color="#2EC17C">
            <i class="v-icon qz-icon qz-icon-upload"></i>
            <span>上传</span>
        </v-btn>

        <v-dialog v-model="createDirDialog.show" width="464">
            <v-btn slot="activator" class="v-button-custom qz-new-folder m-r-16" depressed>
                <i class="v-icon qz-icon qz-icon-newdir"></i>
                <span>新建文件夹</span>
            </v-btn>
            <v-card class="qz-dialog">
                <v-card-title class="justify-center text-xs-center">
                    创建文件夹
                </v-card-title>

                <v-text-field class="qz-dirname" v-model="createDirDialog.name" placeholder="请输入文件夹名称..." solo flat color="#2EC17C" hide-details @keyup.enter="createDir(createDirDialog.name); createDirDialog.reset()"></v-text-field>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn class="qz-btn" depressed @click="createDirDialog.reset();">
                        取 消
                    </v-btn>
                    <v-btn class="qz-btn qz-btn-primary" color="#2EC17C" depressed @click="createDir(createDirDialog.name); createDirDialog.reset();">
                        确 认
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <form ref="form" style="display: none">
            <input type="file" ref="fileInput" @change="fileUpload($event)" multiple="true">
        </form>
        <div class="v-button-group">
            <v-btn class="v-button-custom" :disabled="selected.length != 1 || (selected[0] && selected[0].mime == 'application/x-directory')" depressed>
                <i class="v-icon qz-icon qz-icon-download"></i>
                <span>下载</span>
            </v-btn>
            <v-btn class="v-button-custom" :disabled="selected.length < 1" @click="deleteAll" depressed>
                <i class="v-icon qz-icon qz-icon-delete"></i>
                <span>删除</span>
            </v-btn>
            <v-btn class="v-button-custom" :disabled="selected.length < 1" depressed @click="copyAll">
                <span>复制到</span>
            </v-btn>
            <v-btn class="v-button-custom" :disabled="selected.length != 1" depressed @click="renameIt(selected[0])">
                <span>重命名</span>
            </v-btn>
            <v-btn class="v-button-custom" :disabled="selected.length < 1" @click="moveAll" depressed>
                <span>移动到</span>
            </v-btn>
        </div>
        <v-spacer></v-spacer>
        <v-text-field disabled class="v-input-text-custom" placeholder="搜索您的文件" append-icon="search" solo flat width="224" color="#2EC17C" hide-details></v-text-field>
        <v-btn class="v-button-custom v-icon-button-custom" depressed @click="toggleListType('list')" :input-value="listType == 'list'">
            <i class="v-icon qz-icon qz-icon-list"></i>
        </v-btn>
        <v-btn class="v-button-custom v-icon-button-custom" depressed @click="toggleListType('thumb')" :input-value="listType == 'thumb'">
            <i class="v-icon qz-icon qz-icon-thumb"></i>
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
            createDirDialog: {
                name: '',
                show: false,
                reset () {
                    this.show = false
                    this.name = ''
                }
            },
            listType: 'list',
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
            'move',
            'copy'
        ]),

        toggleListType (listType) {
            this.listType = listType
            this.$emit('listTypeChange', listType)
        },

        deleteAll () {
            this.recycle({
                path: this.selected.map(item => item.path),
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
                type: 'move',
                payload: {
                    data: this.selected,
                    defer: deferred
                }
            })
            deferred
                .promise
                .then(({ path, payload }) => {
                    this.move({
                        path: payload.data.map(item => item.path),
                        destPath: path
                    })
                })
        },

        copyAll () {
            let deferred = defer()
            this.setSelectDirDialogState({
                show: true,
                type: 'copy',
                payload: {
                    data: this.selected,
                    defer: deferred
                }
            })
            deferred
                .promise
                .then(({ path, payload }) => {
                    this.copy({
                        path: payload.data.map(item => item.path),
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

        ...mapMutations('rightdrawer', {
            showUploadList: 'SHOW'
        }),

        uploadIt () {
            this.$refs.fileInput.click()
        },

        renameIt (item) {
            this.$emit('rename', item)
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
            this.showUploadList()
            this.$refs.form.reset()
        }
    }
}
</script>
