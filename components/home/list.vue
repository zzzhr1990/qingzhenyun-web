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
                    <td @click="userOperation(props.item)" class="pointer">
                        <v-icon :color="getColor(props.item)" class="mr-1">{{fileTypeFilter(props.item)}}</v-icon>
                        <span>{{ props.item.name }}</span>
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
