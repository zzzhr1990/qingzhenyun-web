<template>
    <v-navigation-drawer temporary v-show="uploadList.length > 0" :value="show" @input="$event != show && toggle()" fixed hide-overlay width="720" height="400" class="qz-upload-list">
        <v-toolbar height="47" flat color="#FFFFFF">
            <v-toolbar-title>正在上传（{{ uploadList.filter(e => (e.isDone() || e.isFailed() || e.isCancel()) ).length }}/{{ uploadList.length }}）</v-toolbar-title>

            <v-spacer></v-spacer>

            <v-btn icon @click="toggle">
                <v-icon>unfold_less</v-icon>
            </v-btn>

            <v-btn icon @click="clearTask(); hideUploadList()">
                <v-icon>close</v-icon>
            </v-btn>

            <v-toolbar-title slot="extension">{{uploadList.filter(e => e.isDone() ).length }}个文件传输完成</v-toolbar-title>
        </v-toolbar>
        <v-list class="qz-list" height="320">
            <template v-for="(item, index) in uploadList">
                <v-list-tile avatar :key="item.batch">
                    <v-progress-linear v-if="item.isUploading() || item.isPaused()" v-model="item.progress" color="#E8F5E9"></v-progress-linear>
                    <v-list-tile-avatar tile size="30">
                        <i class="v-icon qz-icon" :class="['qz-icon-'+fileTypeFilter(item)]"></i>
                    </v-list-tile-avatar>
                    <v-list-tile-content class="qz-name">
                        <v-list-tile-title>{{ item.name }}</v-list-tile-title>
                    </v-list-tile-content>
                    <v-list-tile-content class="qz-size">
                        <v-list-tile-title>{{ item.size | fileSizeFilter }}</v-list-tile-title>
                    </v-list-tile-content>
                    <v-list-tile-content class="qz-target">
                        <v-list-tile-title>
                            <router-link :to="'/home' + item.puid" class="href-link">
                                {{item.puid}}
                            </router-link>
                            <template v-if="item.isUploading()">
                                {{item.progress.toFixed(2)}}%({{item.bytesPreSecond | fileSizeFilter }}/s)
                            </template>
                            <template v-else-if="item.isDone()">
                                OK
                            </template>
                        </v-list-tile-title>
                    </v-list-tile-content>
                    <v-list-tile-action>
                        <v-btn icon @click="resume(item)" v-if="item.isPaused()">
                            <v-icon>play_arrow</v-icon>
                        </v-btn>
                        <v-btn icon @click="pause(item)" v-if="item.isUploading()">
                            <v-icon>pause</v-icon>
                        </v-btn>
                        <v-btn icon @click="removeTask(item)">
                            <v-icon>close</v-icon>
                        </v-btn>
                    </v-list-tile-action>

                </v-list-tile>
                <v-divider v-if="index + 1 < uploadList.length" :key="index"></v-divider>
            </template>
        </v-list>
    </v-navigation-drawer>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import listMixins from './listMixins.js'
import Message from 'vuetify-toast'

export default {
    watch: {
        uploadMsg (msg) {
            Message[msg.type](msg.message)
        }
    },
    computed: {
        ...mapState('upload', [
            'uploadList',
            'uploadMsg'
        ]),
        ...mapState('rightdrawer', [
            'show'
        ])
    },
    mixins: [
        listMixins
    ],
    methods: {
        ...mapMutations('rightdrawer', {
            toggle: 'TOGGLE',
            showUploadList: 'SHOW',
            hideUploadList: 'HIDE'
        }),
        ...mapActions('upload', [
            'pause',
            'resume'
        ]),

        ...mapMutations('upload', {
            removeTask: 'REMOVE_TASK',
            clearTask: 'CLEAR_TASK'

        })
    }
}
</script>
