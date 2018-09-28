<template>
    <v-flex xs12 :class="['qz-listtype-'+listType]">
        <v-progress-linear v-show="fetching" :indeterminate="fetching" color="#2EC17C" class="ma-0"></v-progress-linear>
        <v-data-table id="qz-table" :headers="headers" :items="pageInfo.list" :pagination.sync="pagination" hide-actions :hide-headers="listType == 'thumb'" disable-initial-sort select-all="#2EC17C" v-model="selected" item-key="path" @input="input" ref="dataTable" v-infinite-scroll="loadMore" infinite-scroll-disabled="fetching">
            <template slot="no-data">
                <v-layout column wrap align-center justify-center class="qz-no-data">
                    <i class="v-icon qz-icon qz-icon-no-data"></i>
                    <div class="qz-title">暂无文件</div>
                    <div class="qz-subtitle">快把他塞满吧</div>
                </v-layout>
            </template>
            <template slot="items" slot-scope="props">
                <v-flex class="qz-thumb-item" :class="{'qz-active': props.selected}" @click="!props.item.locking && (props.selected = !props.selected)" v-if="listType == 'thumb'" @dblclick="pcUserOperation(props.item)">
                    <v-card flat>
                        <i class="v-icon qz-icon qz-icon-check" :class="{'qz-active': props.selected}"></i>
                        <i class="v-icon qz-icon qz-icon-2x" :class="['qz-icon-'+fileTypeFilter(props.item)]"></i>

                        <template v-if="renaming.uuid == props.item.uuid" class="qz-inline-edit">
                            <v-text-field @click.stop class="qz-rename" v-model="renaming.value" solo flat width="120" color="#2EC17C" hide-details @keyup.enter="editIt(props.item, renaming.value); renaming.uuid = undefined;"></v-text-field>
                        </template>

                        <template v-else>
                            <div class="qz-filename">{{ props.item.name }}</div>
                        </template>
                    </v-card>
                </v-flex>

                <tr :class="{'v-tr-active': props.selected}" v-if="listType == 'list'">
                    <td @click="!props.item.locking && (props.selected = !props.selected)">
                        <v-checkbox color="#2EC17C" hide-details :input-value="props.selected" :disabled="props.item.locking"></v-checkbox>
                    </td>
                    <td @click="renaming.uuid != props.item.uuid && pcUserOperation(props.item)" class="qz-td-file">
                        <v-layout>

                            <i class="v-icon qz-icon" :class="['qz-icon-'+fileTypeFilter(props.item)]"></i>

                            <template v-if="renaming.uuid == props.item.uuid" class="qz-inline-edit">
                                <v-text-field class="qz-rename" v-model="renaming.value" solo flat width="120" color="#2EC17C" hide-details @keyup.enter="editIt(props.item, renaming.value); renaming.uuid = undefined;"></v-text-field>
                                <v-btn depressed class="qz-rename-btn qz-rename-btn-submit" @click.stop="editIt(props.item, renaming.value); renaming.uuid = undefined;">
                                    <v-icon>check</v-icon>
                                </v-btn>
                                <v-btn depressed class="qz-rename-btn qz-rename-btn-cancel" @click.stop="renaming.uuid = undefined">
                                    <v-icon>close</v-icon>
                                </v-btn>
                            </template>

                            <template v-else>
                                <div @click="preview(props.item)" class="qz-filename" :title="props.item.name">{{ props.item.name}}</div>
                            </template>

                            <v-layout class="qz-td-file-btn-group" :class="{'qz-active ': props.show_menu}" align-center align-content-center justify-end @click.stop>
                                <i class="v-icon qz-icon qz-icon-file-download" v-if="props.item.mime !== 'application/x-directory'" @click="downloadIt(props.item)"></i>

                                <v-menu offset-y lazy content-class="qz-file-menu" v-if="!props.item.locking" v-model="props.show_menu" min-width="80px" max-width="80px">
                                    <i slot="activator" class="v-icon qz-icon qz-icon-file-more"></i>
                                    <v-list>
                                        <v-list-tile @click="moveIt(props.item)">
                                            <v-list-tile-title>移动到</v-list-tile-title>
                                        </v-list-tile>
                                        <v-list-tile @click="copyIt(props.item)">
                                            <v-list-tile-title>复制到</v-list-tile-title>
                                        </v-list-tile>
                                        <v-list-tile @click="renameIt(props.item)">
                                            <v-list-tile-title>重命名</v-list-tile-title>
                                        </v-list-tile>
                                        <v-list-tile @click="deleteIt(props.item)">
                                            <v-list-tile-title>删除</v-list-tile-title>
                                        </v-list-tile>
                                    </v-list>
                                </v-menu>
                            </v-layout>
                        </v-layout>
                    </td>
                    <td>{{ props.item.size | fileSizeFilter }}</td>
                    <td>{{ props.item.ctime | timeFilter }}</td>
                </tr>
            </template>
        </v-data-table>
    </v-flex>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
import listMixins from './listMixins.js'
import defer from 'defer-promise'
const CanPreviewEnum = {
    pdf: 3,
    audio: 2,
    video: 1,
    1: 'pdf',
    2: 'audio',
    3: 'video'
}
export default {
    watch: {
        'pageInfo.info.path': {
            async handler (to, from) {
                this.selected = []
                this.$emit('selectInput', [])
            }
        },
        pagination: {
            async handler (to, from) {
                if ('sortBy' in from && 'descending' in from) {
                    if (to.sortBy !== from.sortBy || to.descending !== from.descending) {
                        let orderBy = -1

                        if (to.sortBy === 'name' && !to.descending) {
                            orderBy = 2
                        } else if (to.sortBy === 'name' && to.descending) {
                            orderBy = 3
                        } else if (to.sortBy === 'size' && !to.descending) {
                            orderBy = 12
                        } else if (to.sortBy === 'size' && to.descending) {
                            orderBy = 13
                        } else if (to.sortBy === 'ctime' && !to.descending) {
                            orderBy = 1
                        } else if (to.sortBy === 'ctime' && to.descending) {
                            orderBy = -1
                        }

                        await this.page({
                            page: 1,
                            orderBy: orderBy
                        })
                    }
                }
            },
            deep: true
        }
    },
    mixins: [
        listMixins
    ],
    data () {
        return {
            headers: [
                {
                    text: '文件名',
                    value: 'name',
                    width: '480px'
                },
                {
                    text: '大小',
                    value: 'size',
                    width: '280px'
                },
                {
                    text: '修改时间',
                    value: 'ctime'
                }
            ],
            pagination: {
                rowsPerPage: -1
            },
            selected: [],
            renaming: {
                uuid: '',
                value: ''
            },
            listType: 'list'
        }
    },
    mounted () {
        this.$on('selectedAll', (value) => {
            this.$refs.dataTable.toggle(value)
        })
    },
    methods: {

        ...mapMutations('selectdir', {
            setSelectDirDialogState: 'SET_STATE'
        }),

        ...mapActions('preview', {
            preview: 'preview'
        }),

        canPreview (item) {
            if (item.preview < 100) {
                return false
            }
            return Boolean(CanPreviewEnum[item.preview / 100])
        },

        getRouterPath (item) {
            var type = item.preview / 100
            if (type === CanPreviewEnum.pdf) {
                return '/p/' + encodeURIComponent(item.path) + '?type=pdf'
            }
            if (type === CanPreviewEnum.audio) {
                return '/v/' + encodeURIComponent(item.path) + '?type=audio'
            }
            if (type === CanPreviewEnum.video) {
                return '/v/' + encodeURIComponent(item.path) + '?type=video'
            }
            return '/'
        },

        pcUserOperation (item) {
            let type = item.preview / 100
            this.tryOpenDir(item)
            // 如果是图片
            this.tryOpenImage(type, item)
            // // 如果是视频
            // this.tryOpenVideo(type, item)
            // // 如果是音频
            // this.tryOpenAudio(type, item)
            // // 如果是pdf
            // this.tryOpenPdf(type, item)
        },

        /**
         * 移动方法，需要selectDir支持
         * @param  {Object} item 单个文件描述
         * @return {[type]}      [description]
         */
        moveIt (item) {
            let deferred = defer()
            this.setSelectDirDialogState({
                show: true,
                type: 'move',
                payload: {
                    data: [item],
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

        copyIt (item) {
            let deferred = defer()
            this.setSelectDirDialogState({
                show: true,
                type: 'copy',
                payload: {
                    data: [item],
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

        renameIt (item) {
            this.renaming.uuid = item.uuid
            this.renaming.value = String(item.name)
        },

        input (items) {
            this.$emit('selectInput', items)
        }
    }
}
</script>
