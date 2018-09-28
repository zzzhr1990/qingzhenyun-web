<template>
    <v-card>
        <v-toolbar card color="#2EC17C" dark class="qz-preview-image-toolbar">

            <v-toolbar-title>{{file.name}} ({{preview.width}}x{{preview.height}})</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="dialogClose">
                <v-icon>close</v-icon>
            </v-btn>

        </v-toolbar>
        <v-layout class="qz-preview-image">
            <v-img :src="preview.url" contain :width="preview.width" :height="preview.height"></v-img>
        </v-layout>
    </v-card>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
    data () {
        return {

        }
    },
    computed: {
        ...mapState('preview', {
            file: 'file',
            preview: 'previewImage'
        })

    },
    methods: {
        ...mapMutations('preview', {
            dialogClose: 'DIALOG_CLOSE'
        })
    }
}
</script>
