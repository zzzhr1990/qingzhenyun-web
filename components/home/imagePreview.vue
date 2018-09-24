<template>
    <v-dialog :value="previewImage.dialog" fullscreen transition="dialog-bottom-transition" :overlay="false" scrollable dense>
        <v-card>
            <v-toolbar card>
                <v-btn icon @click="dialogClose">
                    <v-icon>close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-responsive :src="previewImage.url" height="100%"></v-responsive>
        </v-card>
    </v-dialog>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
    computed: {
        ...mapState('preview', [
            'previewImage'
        ])
    },
    methods: {
        ...mapMutations('preview', {
            dialog: 'DIALOG'
        }),
        dialogClose () {
            this.dialog(false)
        }
    }
}
</script>
