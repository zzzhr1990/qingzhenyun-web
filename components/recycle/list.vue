<template>
    <v-flex xs12>
        <v-progress-linear v-show="fetching" :indeterminate="fetching" class="ma-0"></v-progress-linear>
        <v-data-table
            :items="pageInfo.list"
            hide-headers
            hide-actions
            item-key="path"
        >
            <template slot="items" slot-scope="props">
                <td class="px-1">
                    <v-layout column>
                        <v-flex>
                            <v-icon :color="getColor(props.item)" class="mr-1">{{fileTypeFilter(props.item)}}</v-icon>
                            <span>{{ props.item.name }}</span>
                        </v-flex>
                        <v-flex class="d-flex">
                            <div class="text-xs-left">{{ props.item.ctime | timeFilter }}</div>
                            <div class="text-xs-right">{{ props.item.size | fileSizeFilter }}</div>
                        </v-flex>
                    </v-layout>
                </td>
                <td class="justify-end layout px-1">
                    <v-icon small @click="recovery({path: props.item.path})" class="pointer">replay</v-icon>
                    <v-icon small @click="remove({path: props.item.path})" class="pointer">close</v-icon>
                </td>
            </template>
        </v-data-table>
    </v-flex>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import Message from 'vuetify-toast'
export default {
    watch: {
        message (msg) {
            Message[msg.type](msg.message)
        }
    },
    computed: {
        ...mapState('recycle', [
            'pageInfo',
            'message',
            'fetching'
        ])
    },
    methods: {
        ...mapActions('recycle', [
            'recovery',
            'remove'
        ]),
        fileTypeFilter (data) {
            if (data.mime === 'application/x-directory') {
                return 'folder'
            }

            const name = data.name
            if (/\.(pdf)$/i.test(name)) {
                return 'picture_as_pdf'
            }
            if (/\.(txt|html|htm|docx|doc|xml|js|hjson|geojson|yml|config|ini|yaml|vtt|vcard|uri|uris|urls|ttl|t|tr|roff|man|me|ms|styl|stylus|rtf|rtx|conf|list|text|md|markdown|less|jsx|jade|shtml|csv|css|coffee|litcoffee|ics|ifb|manifest|appcache)$/i.test(name)) {
                return 'description'
            }
            if (/\.(jpe?g|png|bmp|gif|tiff|webp|apng|svg|fpx|svg|xbm|ico|heif)$/i.test(name)) {
                return 'image'
            }
            if (/\.(mp4|avi|rm|rmvb|mov|mtv|3gp|amv|flv|mpg|swf|f4v|m4v|mkv|mts|webm|h264|h263|h261|3gpp|)$/i.test(name)) {
                return 'movie'
            }
            if (/\.(zip|rar|cab|arj|lzh|ace|uue|z|7z|iso|jar|gz|gz2|gza|tar|bz2|bz|bza|7za|bzip)$/i.test(name)) {
                return 'archive'
            }
            if (/\.(wav|mp3|wmv|ogg|ape|aac|flac|mka|m4a|au|mpc|alac|tta|midi|dff)$/i.test(name)) {
                return 'music_video'
            }
            return 'note'
        },

        getColor (item) {
            let color = ''
            switch (this.fileTypeFilter(item)) {
            case 'folder':
                color = 'orange darken-2'
                break
            case 'description':
                color = 'blue darken-2'
                break
            case 'image':
                color = 'light-green darken-2'
                break
            case 'movie':
                color = 'blue-grey darken-2'
                break
            case 'archive':
                color = 'amber darken-2'
                break
            case 'music_video':
                color = 'light-blue darken-2'
                break
            case 'picture_as_pdf':
                color = 'red lighten-1'
                break
            default:
                color = 'grey lighten-5'
                break
            }
            return color
        }
    }
}
</script>
