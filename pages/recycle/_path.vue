<template>
    <Wrap>
        <v-layout slot="extension" wrap row>
            <v-flex xs12>
                <TopHeader></TopHeader>
            </v-flex>
            <v-flex xs12>
                <BreadCrumbs :breadcrumbs="breadcrumbs"></BreadCrumbs>
            </v-flex>
            <v-flex xs12>
                <ListHeader></ListHeader>
            </v-flex>
        </v-layout>
        <List></List>
    </Wrap>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import Wrap from '@/components/Wrap.vue'
import BreadCrumbs from '@/components/Breadcrumbs.vue'
import List from '@/components/recycle/list.vue'
import TopHeader from '@/components/recycle/topHeader.vue'
import ListHeader from '@/components/recycle/listHeader.vue'
export default {
    middleware: 'auth',
    async asyncData ({ store, params, query }) {
        await store.dispatch('recycle/page', {
            path: params.path || '',
            page: query.page || 1
        })
    },
    components: {
        Wrap,
        BreadCrumbs,
        List,
        TopHeader,
        ListHeader
    },
    watch: {
        async '$route' (to, from) {
            // react to route changes...
            await this.page({
                path: to.params.path || '',
                page: to.query.page || 1
            })
        }
    },
    computed: {
        ...mapState([
            'isMobile'
        ]),
        ...mapGetters('recycle', [
            'breadcrumbs'
        ])
    },
    methods: {
        ...mapActions('recycle', [
            'page'
        ])
    }
}
</script>
