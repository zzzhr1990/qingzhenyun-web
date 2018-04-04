<template>
  <v-dialog v-model="show" :max-width="500">
    <v-toolbar dense>
      <v-toolbar-title>选择文件夹</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="close">
        <v-icon>close</v-icon>
      </v-btn>
    </v-toolbar>
    <v-card tile>
      <v-container fluid grid-list-sm style="height: 300px; overflow-y: auto">
        <v-layout v-show="!fetching" row wrap>
          <v-flex xs2 mb-1 v-for="(item, index) in pageInfo" :key="index">
            <v-card class="elevation-0" tile :ripple="true" style="user-select: none" @dblclick="loadData(item.path)">
              <v-layout column style="text-align:center">
                <v-icon large color="orange dark-2">folder</v-icon>
                <div class="text-overflow body-1">{{item.name}}</div>
              </v-layout>
            </v-card>
          </v-flex>
        </v-layout>
        <v-layout v-show="fetching" fill-height column justify-center align-center>
          <v-progress-circular indeterminate :size="50" color="primary"></v-progress-circular>
        </v-layout>
      </v-container>
      <v-container>
        <div class="body-1 grey--text darken-1">已选择路径: {{selected || '根目录'}}</div>
      </v-container>
      <v-card-actions>
        <v-btn flat small color="orange" v-if="selected !== ''" @click="prevPage">上一页</v-btn>
        <v-btn flat small color="primary" @click="createDir">创建文件夹</v-btn>
        <v-spacer></v-spacer>
        <v-btn small color="primary" @click="ok">确定</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import Message from 'vuetify-toast'
export default {
  data () {
    return {
      pageInfo: [],
      selected: '',
      show: false
    }
  },
  watch: {
    message (msg) {
      Message[msg.type](msg.message)
    },
    show (val) {
      if (val) {
        this.initData()
        this.selected = ''
      }
    }
  },
  computed: {
    ...mapState('files', [
      'fetching',
      'message'
    ])
  },
  created () {
    this.$on('show', (payload) => {
      console.log(123)
      this.show = true
      this.payload = payload
    })
    this.$on('hide', () => {
      this.show = false
    })
  },
  methods: {
    ...mapActions('files', [
      'folder',
      'createDirectory'
    ]),
    close () {
      this.show = false
      this.$emit('close')
    },
    ok () {
      this.show = false
      this.$emit('ok', {
        path: this.selected,
        payload: this.payload
      })
    },
    async loadData (path) {
      let result = await this.folder({
        path: path,
        pageSize: 999
      })
      if (result) {
        this.pageInfo = result
        this.selected = path
      }
    },
    initData () {
      this.loadData('')
    },
    async createDir () {
      let res = await this.$prompt('', {
        buttonTrueText: '确定',
        buttonFalseText: '取消',
        color: 'primary',
        icon: 'info',
        title: '文件夹名',
        property: '$prompt'
      })
      if (res) {
        let result = await this.createDirectory({
          path: this.selected,
          name: res
        })
        if (result) {
          this.pageInfo.unshift(result)
        }
      }
    },
    async prevPage () {
      let list = this.selected.split('/')
      let pos = list.length - 1
      this.loadData(list.slice(0, pos).join('/'))
    }
  }
}
</script>
