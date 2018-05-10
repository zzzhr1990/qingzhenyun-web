<template>
    <v-flex xs12>
        <v-progress-linear v-show="fetching" :indeterminate="fetching" class="ma-0"></v-progress-linear>
        <v-data-table
            :items="pageInfo.list"
            hide-headers
            hide-actions
            select-all
            v-model="selected"
            item-key="path"
            @input="input"
            ref="dataTable"
        >
            <template slot="items" slot-scope="props">
                <tr>
                    <td @click="props.selected = !props.selected">
                        <v-checkbox
                            primary
                            hide-details
                            :input-value="props.selected"
                        ></v-checkbox>
                    </td>
                    <td @click="pcUserOperation(props.item)" class="pointer">
                        <template v-if="canPreview(props.item)">
                            <router-link :to="getRouterPath(props.item)" class="href-link" target="_blank">
                                <v-icon :color="getColor(props.item)" class="mr-1">{{fileTypeFilter(props.item)}}</v-icon>
                                <span>{{ props.item.name }}</span>
                            </router-link>
                        </template>
                        <template v-else>
                            <v-icon :color="getColor(props.item)" class="mr-1">{{fileTypeFilter(props.item)}}</v-icon>
                            <span>{{ props.item.name }}</span>
                        </template>
                    </td>
                    <td class="text-xs-right">{{ props.item.size | fileSizeFilter }}</td>
                    <td class="text-xs-right">{{ props.item.ctime | timeFilter }}</td>
                    <td class="justify-end layout px-0">
                        <v-btn class="mx-0" v-if="props.item.mime !== 'application/x-directory'" icon @click="downloadIt(props.item)">
                            <v-icon>file_download</v-icon>
                        </v-btn>
                        <v-btn icon class="mx-0" @click="moveIt(props.item)">
                            <v-icon>swap_horiz</v-icon>
                        </v-btn>
                        <v-btn icon class="mx-0" @click="editIt(props.item)">
                            <v-icon>edit</v-icon>
                        </v-btn>
                        <v-btn icon class="mx-0" @click="deleteIt(props.item)">
                            <v-icon color="pink">delete</v-icon>
                        </v-btn>
                    </td>
                </tr>
            </template>
        </v-data-table>
    </v-flex>
</template>

<script>
import { mapMutations } from 'vuex'
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
        pageInfo () {
            this.selected = []
            this.$emit('selectInput', [])
        }
    },
    mixins: [
        listMixins
    ],
    data () {
        return {
            selected: []
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
                payload: {
                    data: [item],
                    defer: deferred
                }
            })
            deferred
                .promise
                .then(({path, payload}) => {
                    this.move({
                        path: payload.data.map(item => item.path),
                        destPath: path
                    })
                })
        },

        input (items) {
            this.$emit('selectInput', items.map(item => item.path))
        }
    }
}
</script>
