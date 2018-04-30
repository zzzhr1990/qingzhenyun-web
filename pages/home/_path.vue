<template>
    <HomeWrap>
        <v-layout slot="extension" wrap row>
            <v-flex xs12>
                <HomeCtlHeader ref="ctrl" v-if="!isMobile"></HomeCtlHeader>
                <HomeMobiCtlHeader v-if="isMobile"></HomeMobiCtlHeader>
            </v-flex>
            <v-flex xs12>
                <HomeBreadCrumbs :breadcrumbs="breadcrumbs"></HomeBreadCrumbs>
            </v-flex>
            <v-flex xs12>
                <HomeListHeader
                    @selectClick="toggerSelectList"
                    ref="listhead"
                    v-if="!isMobile"
                ></HomeListHeader>
                <HomeMobiListHeader
                    v-if="isMobile"
                ></HomeMobiListHeader>
            </v-flex>
            <template v-if="isMobile">
                <v-btn
                    absolute
                    fab
                    bottom
                    left
                    small
                    color="pink"
                     @click="uploadIt"
                >
                    <v-icon>file_upload</v-icon>
                </v-btn>
                <form ref="form" style="display: none">
                    <input type="file" ref="fileInput" @change="fileUpload($event)" multiple="true">
                </form>
            </template>
        </v-layout>
        <HomeList v-if="!isMobile" @selectInput="selectedInput" ref="list"></HomeList>
        <HomeMobiList v-if="isMobile"></HomeMobiList>
        <SelectDir></SelectDir>
        <UploadList></UploadList>
        <ImagePreview></ImagePreview>
    </HomeWrap>
</template>

<script>
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex'
// import Message from 'vuetify-toast'
import SelectDir from '@/components/SelectDir.vue'
import HomeWrap from '@/components/Wrap.vue'
import HomeBreadCrumbs from '@/components/Breadcrumbs.vue'
import HomeList from '@/components/home/list.vue'
import UploadList from '@/components/home/uploadList.vue'
import HomeMobiList from '@/components/home/mobiList.vue'
import HomeCtlHeader from '@/components/home/topHeader.vue'
import HomeMobiCtlHeader from '@/components/home/topMobiHeader.vue'
import HomeListHeader from '@/components/home/listHeader.vue'
import HomeMobiListHeader from '@/components/home/mobiListHeader.vue'
import ImagePreview from '@/components/home/imagePreview.vue'
export default {
    middleware: 'auth',
    async asyncData ({ store, params, query }) {
        await store.dispatch('files/page', {
            path: params.path || '',
            page: query.page || 1
        })
    },
    components: {
        SelectDir,
        HomeWrap,
        HomeBreadCrumbs,
        HomeList,
        UploadList,
        HomeMobiList,
        HomeCtlHeader,
        HomeMobiCtlHeader,
        HomeListHeader,
        HomeMobiListHeader,
        ImagePreview
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
        ...mapState('files', [
            'pageInfo'
        ]),
        ...mapGetters('files', [
            'breadcrumbs'
        ])
    },
    methods: {
        ...mapActions('files', [
            'page'
        ]),
        selectedInput (selectedArr) {
            if (this.$refs.ctrl) {
                this.$refs.ctrl.$emit('selectedArr', selectedArr)
            }
            if (this.$refs.listhead) {
                this.$refs.listhead.$emit('selectedArr', selectedArr)
            }
        },
        toggerSelectList ({ payload: {type} }) {
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
        },

        ...mapActions('upload', [
            'upload'
        ]),

        ...mapMutations('upload', {
            addTask: 'ADD_TASK'
        }),

        uploadIt () {
            this.$refs.fileInput.click()
        },

        fileUpload (evt) {
            let files = evt.target.files
            if (!files || !files[0]) {
                return
            }
            this.addTask({
                path: this.pageInfo.info.path,
                tasks: files
            })
            this.upload()
            this.$refs.form.reset()
        }
    }
}
</script>
