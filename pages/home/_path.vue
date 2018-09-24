<template>
    <HomeWrap>
        <v-layout wrap row>
            <v-flex xs12>
                <HomeCtlHeader ref="ctrl" @rename="renameIt" @listTypeChange="$refs.list.listType = $event"></HomeCtlHeader>
            </v-flex>
            <v-flex xs12>
                <HomeBreadCrumbs :breadcrumbs="breadcrumbs"></HomeBreadCrumbs>
            </v-flex>
        </v-layout>
        <HomeList @selectInput="selectedInput" ref="list"></HomeList>
        <SelectDir></SelectDir>
        <UploadList></UploadList>
        <ImagePreview></ImagePreview>
    </HomeWrap>
</template>

<script>
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex'
// import Message from 'vuetify-toast'
import SelectDir from '@/components/toolkit/selectFolder/index.vue'
import HomeWrap from '@/components/Wrap.vue'
import HomeBreadCrumbs from '@/components/Breadcrumbs.vue'
import HomeList from '@/components/home/list.vue'
import UploadList from '@/components/home/uploadList.vue'
import HomeCtlHeader from '@/components/home/topHeader.vue'
import HomeListHeader from '@/components/home/listHeader.vue'
import ImagePreview from '@/components/home/imagePreview.vue'
export default {
    middleware: 'auth',
    // async asyncData ({ store, params, query }) {
    //     await store.dispatch('files/page', {
    //         path: params.path || '',
    //         page: query.page || 1
    //     })
    // },
    data () {
        return {
            currentListComponent: 'HomeList'
        }
    },
    components: {
        SelectDir,
        HomeWrap,
        HomeBreadCrumbs,
        HomeList,
        UploadList,
        HomeCtlHeader,
        HomeListHeader,
        ImagePreview
    },
    watch: {
        // react to route changes...

        '$route': {
            // koukuko: this watcher will not work when the browser refresh.
            // add `immediate` : trigger on initialization
            immediate: true,
            async handler (to, from) {
                await this.page({
                    path: to.params.path || '',
                    orderBy: -1,
                    page: 1
                })
            }
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

        renameIt (item) {
            this.$refs.list.renameIt(item)
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
