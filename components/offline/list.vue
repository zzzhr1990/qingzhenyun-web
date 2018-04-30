<template>
    <v-flex xs12>
        <v-progress-linear v-show="fetching" :indeterminate="fetching" class="ma-0"></v-progress-linear>
        <v-data-table
            :items="pageInfo.list"
            :headers="headers"
            hide-actions
            item-key="taskHash"
        >
            <template slot="items" slot-scope="props">
                <tr>

                    <td>
                        <v-icon class="mr-1">{{ props.item.status | cloudStatusFilter }}</v-icon>
                        <span>{{ props.item.name }}</span>
                    </td>
                    <td>{{ props.item.path || '根目录' }}</td>
                    <td>{{ props.item.progress }}%</td>
                    <td>{{ props.item.createTime | timeFilter }}</td>
                    <td class="justify-center layout px-0">
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
import listMixin from './listMixin.js'
export default {
    mixins: [
        listMixin
    ],
    data () {
        return {
            headers: [
                {
                    text: '文件名',
                    sortable: false
                },
                {
                    text: '存储路径',
                    sortable: false
                },
                {
                    text: '下载进度',
                    sortable: false
                },
                {
                    text: '创建时间',
                    sortable: false
                },
                {
                    text: '操作',
                    sortable: false
                }
            ],
            timer: null,
            interval: 30000
        }
    },
    mounted () {
        this.timer = setInterval(() => {
            this.refresh()
        }, this.interval)
    },
    beforeDestroy () {
        clearInterval(this.timer)
    }
}
</script>
