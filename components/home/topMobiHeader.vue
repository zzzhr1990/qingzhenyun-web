<template>
    <v-layout px-2>
        <v-btn small light color="primary" @click="createDir">
            <span>新建文件夹</span>
            <v-icon right>create_new_folder</v-icon>
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn small icon @click="togger">
            <v-icon>view_module</v-icon>
        </v-btn>
    </v-layout>
</template>

<script>
import topHeaderMixin from './topHeaderMixin.js'

export default {
    mixins: [
        topHeaderMixin
    ]
}
</script>
