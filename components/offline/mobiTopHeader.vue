<template>
    <v-layout px-1 py-4>
        <v-btn small @click="downloadIt" color="primary">
            <span>链接</span>
            <v-icon right>file_download</v-icon>
        </v-btn>
        <v-btn small @click="tryDownloadTorrent" color="primary">
            <span>BT</span>
            <v-icon right>file_download</v-icon>
        </v-btn>
        <form ref="form" style="display: none">
            <input type="file" ref="fileInput" @change="fileUpload($event)" multiple="true">
        </form>
        <v-spacer></v-spacer>
        <v-menu offset-y>
            <v-btn light slot="activator" small>
                <span>排序</span>
                <v-icon right>sort</v-icon>
            </v-btn>
            <v-list>
                <v-list-tile @click="setPageOrder(orderBy.asc)" class="body-2">
                    <v-list-tile-title>按时间正序排列</v-list-tile-title>
                </v-list-tile>
                <v-list-tile @click="setPageOrder(orderBy.desc)" class="body-2">
                    <v-list-tile-title>按时间倒序排列</v-list-tile-title>
                </v-list-tile>
            </v-list>
        </v-menu>
    </v-layout>
</template>

<script>
import topHeaderMixin from './topHeaderMixin.js'
export default {
    mixins: [
        topHeaderMixin
    ]
}
</script>
