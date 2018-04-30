<template>
    <v-layout caption justify-space-between row>
        <v-breadcrumbs divider="/">
            <v-breadcrumbs-item
                v-for="item in breadcrumbs"
                :key="item.text"
                :disabled="item.disabled"
                :href="getHref(item)"
            >
                {{ item.text }}
            </v-breadcrumbs-item>
        </v-breadcrumbs>
        <v-btn flat color="gray" small v-show="breadcrumbs.length > 1" @click="back">上一页</v-btn>
    </v-layout>
</template>

<script>
export default {
    props: {
        breadcrumbs: {
            type: Array,
            default: () => ([])
        }
    },
    methods: {
        getHref (item) {
            return `/home/${encodeURIComponent(item.path)}`
        },
        back () {
            this.$router.back(-1)
        }
    }
}
</script>
