<template>
    <v-layout class="qz-breadcrumbs" caption row v-show="breadcrumbs.length > 1">
        <v-btn class="qz-breadcrumbs-back" flat color="#2EC17C" small v-show="breadcrumbs.length > 1" :to="back()" active-class="qz-breadcrumbs-back-active">返回上一级</v-btn>
        <div class="qz-breadcrumbs-back-divider-icon" v-show="breadcrumbs.length > 1">|
        </div>
        <div class="qz-breadcrumbs-back-divider-prefix" v-show="breadcrumbs.length > 4">...</div>
        <div class="qz-breadcrumbs-back-divider" v-show="breadcrumbs.length > 4">
            <v-icon>chevron_right</v-icon>
        </div>
        <v-breadcrumbs>
            <v-icon slot="divider">chevron_right</v-icon>
            <v-breadcrumbs-item v-for="item in breadcrumbs.slice(-3)" :key="item.text" :disabled="item.disabled" :to="getHref(item)" exact>
                {{ item.text }}
            </v-breadcrumbs-item>
        </v-breadcrumbs>
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
            return this.getHref(this.breadcrumbs.slice(-2).shift())
        }
    }
}
</script>
