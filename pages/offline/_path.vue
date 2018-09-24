<template>
    <HomeWrap>
        <v-layout slot="extension" wrap row>
            <v-flex xs12>
                <TopHeader v-if="!isMobile"></TopHeader>
                <MobiTopHeader v-if="isMobile"></MobiTopHeader>
            </v-flex>
            <v-flex xs12>
                <OfflineListHeader v-if="!isMobile"></OfflineListHeader>
                <OfflineMobiListHeader v-if="isMobile"></OfflineMobiListHeader>
            </v-flex>
        </v-layout>
        <OfflineList v-if="!isMobile"></OfflineList>
        <OfflineMobiList v-if="isMobile"></OfflineMobiList>
        <SelectDir></SelectDir>
    </HomeWrap>
</template>

<script>
import { mapState } from 'vuex'
import SelectDir from '@/components/toolkit/selectFolder/index.vue'
import HomeWrap from '@/components/Wrap.vue'
import OfflineListHeader from '@/components/offline/listHeader.vue'
import OfflineMobiListHeader from '@/components/offline/mobiListHeader.vue'
import OfflineList from '@/components/offline/list.vue'
import OfflineMobiList from '@/components/offline/mobiList.vue'
import TopHeader from '@/components/offline/topHeader.vue'
import MobiTopHeader from '@/components/offline/mobiTopHeader.vue'

export default {
    middleware: 'auth',
    async asyncData ({ store, params, query }) {
        await store.dispatch('offline/page', {
            page: params.page || 1
        })
    },
    components: {
        SelectDir,
        HomeWrap,
        OfflineListHeader,
        TopHeader,
        OfflineList,
        OfflineMobiList,
        OfflineMobiListHeader,
        MobiTopHeader
    },
    watch: {
        async '$route' (to, from) {
            await this.page({
                page: to.params.page || 1
            })
        }
    },
    computed: {
        ...mapState([
            'isMobile'
        ]),
        ...mapState('offline', [
            'pageInfo'
        ])
    },
    methods: {
        toggerSelectList ({ payload: { type } }) {
            if (this.$refs.list) {
                switch (type) {
                case 'cancel':
                    this.$refs.list.$emit('selectedAll', false)
                    break
                case 'all':
                    this.$refs.list.$emit('selectedAll', true)
                    break
                default:
                    break
                }
            }
        }
    }
}
</script>
