<template>
    <v-layout px-2>
        <v-spacer></v-spacer>
        <v-menu offset-y>
            <v-btn light slot="activator" small>
                <span>排序</span>
                <v-icon right>sort</v-icon>
            </v-btn>
            <v-list>
                <v-list-tile @click="setPageOrder(orderBy.asc)" class="body-2">
                    <v-list-tile-title>按上传时间正序</v-list-tile-title>
                </v-list-tile>
                <v-list-tile @click="setPageOrder(orderBy.desc)" class="body-2">
                    <v-list-tile-title>按上传时间倒序</v-list-tile-title>
                </v-list-tile>
            </v-list>
        </v-menu>
    </v-layout>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'

export default {
    data () {
        return {
            orderBy: {
                asc: -1,
                desc: 1
            },
            selected: []
        }
    },
    methods: {

        ...mapMutations({
            setOrder: 'SET_ORDER'
        }),

        ...mapActions('recycle', [
            'refresh'
        ]),

        setPageOrder (orderBy) {
            if (orderBy === this.pageInfo.orderBy) {
                return
            }
            this.setOrder(orderBy)
            this.refresh({
                orderBy: orderBy
            })
        }
    }
}
</script>
