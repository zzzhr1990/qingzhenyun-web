<template>
    <v-flex xs12 class="pt-2">
        <v-progress-linear v-show="fetching" :indeterminate="fetching" class="ma-0"></v-progress-linear>
        <v-data-table
            :items="pageInfo.list"
            hide-headers
            hide-actions
            item-key="path"
        >
            <template slot="items" slot-scope="props">
                <td class="px-1" @click="userOperation(props.item)">
                    <v-layout column>
                        <v-flex>
                            <v-icon :color="getColor(props.item)" class="mr-1">{{fileTypeFilter(props.item)}}</v-icon>
                            <span>{{ props.item.name }}</span>
                        </v-flex>
                        <v-flex class="d-flex">
                            <div class="text-xs-left">{{ props.item.ctime | timeFilter }}</div>
                            <div class="text-xs-right">{{ props.item.size | fileSizeFilter }}</div>
                        </v-flex>
                    </v-layout>
                </td>
                <td class="justify-center layout px-1">
                    <v-menu bottom left>
                        <v-btn icon slot="activator">
                            <v-icon>more_vert</v-icon>
                        </v-btn>
                        <v-list>
                            <v-list-tile @click="downloadIt(props.item)">
                                <v-list-tile-title class="body-2">下载</v-list-tile-title>
                            </v-list-tile>
                            <v-list-tile @click="editIt(props.item)">
                                <v-list-tile-title class="body-2">修改文件名</v-list-tile-title>
                            </v-list-tile>
                            <v-list-tile @click="deleteIt(props.item)">
                                <v-list-tile-title class="body-2">删除</v-list-tile-title>
                            </v-list-tile>
                        </v-list>
                    </v-menu>
                </td>
            </template>
        </v-data-table>
    </v-flex>
</template>

<script>
import listMixins from './listMixins.js'
export default {
    mixins: [
        listMixins
    ]
}
</script>
