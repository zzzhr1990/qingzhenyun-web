<template>
    <v-navigation-drawer
        temporary
        :right="true"
        :value="show"
        fixed
    >
        <v-list>
            <v-list-tile>
                <v-list-tile-sub-title>
                    <v-btn flat small @click="togger">
                        <span>关闭</span>
                        <v-icon right>compare_arrows</v-icon>
                    </v-btn>
                </v-list-tile-sub-title>
                <v-list-tile-sub-title>
                    <v-btn flat small @click="clearTask">清除所有任务</v-btn>
                </v-list-tile-sub-title>
            </v-list-tile>
        </v-list>
        <v-list two-line>
            <template v-for="(item, index) in uploadList">
                <v-list-tile
                    avatar
                    :key="item.batch"
                >
                    <v-list-tile-content>
                        <v-list-tile-title>{{ item.name }}</v-list-tile-title>
                        <v-list-tile-sub-title>
                            <v-progress-linear
                                v-model="item.progress"
                            ></v-progress-linear>
                        </v-list-tile-sub-title>
                    </v-list-tile-content>
                    <v-list-tile-action>
                        <v-list-tile-action-text>{{ item.status }}</v-list-tile-action-text>
                        <v-icon color="yellow darken-2" @click="removeTask(item)">delete</v-icon>
                    </v-list-tile-action>
                </v-list-tile>
                <v-divider v-if="index + 1 < uploadList.length" :key="index"></v-divider>
            </template>
        </v-list>
    </v-navigation-drawer>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
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
    methods: {
        ...mapMutations('rightdrawer', {
            togger: 'TOGGER'
        }),
        ...mapMutations('upload', {
            removeTask: 'REMOVE_TASK',
            clearTask: 'CLEAR_TASK'
        })
    }
}
</script>
