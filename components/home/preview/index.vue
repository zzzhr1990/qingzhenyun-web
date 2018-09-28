<template>
    <v-dialog :value="dialog" lazy transition="dialog-bottom-transition" max-height="100%" :width="dialogWidth()" persistent dense>
        <component ref="dialogComponent" v-if="components" v-bind:is="components"></component>
    </v-dialog>
</template>

<script>
import imagePreview from '@/components/home/preview/image.vue'
import videoPreview from '@/components/home/preview/video.vue'
import { mapState, mapMutations } from 'vuex'
export default {
    computed: {
        ...mapState('preview', [
            'dialog',
            'components'
        ])
    },
    components: {
        imagePreview,
        videoPreview
    },
    watch: {
        dialog (val) {
            this.$nextTick(function () {
                // Code that will run only after the
                // entire view has been rendered
                var c = this.$refs.dialogComponent
                if (!c) {
                    return false
                }
                if (val && c.init) {
                    c.init()
                } else if (c.quit) {
                    c.quit()
                }
            })
        }
    },
    methods: {
        ...mapMutations('preview', {
            setDialog: 'DIALOG'
        }),
        dialogWidth () {
            if (this.components === 'videoPreview') {
                return 1280
            }
        },
        dialogHeight () {
            if (this.components === 'videoPreview') {
                return 720
            }
        },
        dialogClose () {
            this.setDialog(false)
        }
    }
}
</script>
