<template>
  <v-app>
    <v-navigation-drawer
      :clipped="clipped"
      v-model="drawer"
      fixed
      app
    >
      <v-toolbar flat class="transparent">
        <v-list class="pa-0 fullwidth">
          <v-list-tile avatar>
            <!-- <v-list-tile-avatar>
              <img src="/assets/logo.jpg" >
            </v-list-tile-avatar> -->
            <v-list-tile-content>
              <v-list-tile-title>{{user.name}}</v-list-tile-title>
              <v-list-tile-sub-title>{{user.lastLoginTime | timeFilter}}</v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-btn icon @click.stop="drawer = !drawer">
                <v-icon>chevron_left</v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </v-toolbar>
      <v-divider></v-divider>
      <v-list>
        <v-list-tile
          router
          :to="item.to"
          :key="i"
          v-for="(item, i) in items"
          exact
        >
          <v-list-tile-action>
            <v-icon v-html="item.icon"></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar fixed app :clipped-left="clipped">
      <v-toolbar-side-icon @click="drawer = !drawer"></v-toolbar-side-icon>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-content>
      <v-container>
        <v-layout row wrap>
          <v-flex
            xs12
            v-if="!isMobile"
          >
            <v-card>
              <v-layout>
                <span>明天再支持选择列表和bt下载</span>
                <v-btn color="primary" flat @click="download">离线下载</v-btn>
              </v-layout>
            </v-card>
          </v-flex>
          <v-flex
            xs12
          >
            <v-list two-line>
              <v-list-tile v-for="item in pageInfo.list" :key="item.taskHash">
                <v-list-tile-action>
                  <v-icon large color="indigo">{{item.status | getStatus}}</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title>{{item.name}}</v-list-tile-title>
                  <v-list-tile-sub-title>
                    <v-layout>
                      <span>{{ item.createTime | timeFilter }}</span>
                      <v-spacer></v-spacer>
                      <span v-if="item.status !== 200">进度:{{ item.progress }}%</span>
                      <span v-else>下载完成</span>
                    </v-layout>
                  </v-list-tile-sub-title>
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-btn color="error" fab small flat @click="deleteFile(item)">
                    <v-icon>delete</v-icon>
                  </v-btn>
                </v-list-tile-action>
              </v-list-tile>
            </v-list>
          </v-flex>
          <v-flex xs12>
            <div class="text-xs-center">
              <v-pagination :length="pageInfo.totalPage" v-model="pageStart" @input="nextPage"></v-pagination>
            </div>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
    <v-footer :fixed="false" app>
      <span>&copy; 2017</span>
    </v-footer>
    <SelectDir ref="selectDir" @ok="selectedDir"></SelectDir>
  </v-app>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Message from 'vuetify-toast'
import SelectDir from '@/components/SelectDir.vue'
export default {
  middleware: 'auth',
  async asyncData ({ store, params, query }) {
    await store.dispatch('offline/page', {
      orderBy: store.orderBy,
      page: params.page || 1,
      pageSize: store.pageSize
    })
  },
  components: {
    SelectDir
  },
  data () {
    return {
      clipped: false,
      drawer: null,
      items: [
        { icon: 'dashboard', title: '全部文件', to: '/home/' },
        { icon: 'system_update_alt', title: '离线下载', to: '/offline/' },
        { icon: 'delete', title: '回收站', to: '/recycle/' },
        { icon: 'delete', title: '修改密码', to: '/changpassword' },
        { icon: 'exit_to_app', title: '退出', to: '/logout' }
      ],
      title: 'Vuetify.js',
      pageStart: 1
    }
  },
  created () {
    this.pageStart = Number(this.$route.query.page) || 1
  },
  watch: {
    message (msg) {
      Message[msg.type](msg.message)
    },
    // uploadMsg (msg) {
    //   Message[msg.type](msg.message)
    // },
    async '$route' (to, from) {
      await this.page({
        orderBy: this.pageInfo.orderBy,
        page: to.params.page || 1,
        pageSize: this.pageInfo.pageSize
      })
    }
  },
  computed: {
    ...mapState('offline', [
      'pageInfo',
      'fetching',
      'message'
    ]),
    ...mapState('login', ['user']),
    ...mapState([
      'isMobile'
    ])
  },
  filters: {
    timeFilter (date) {
      let d = new Date(date)
      let year = d.getFullYear()
      let month = d.getMonth() + 1
      let day = d.getDate()
      let hours = d.getHours()
      let mins = d.getMinutes()
      let secs = d.getSeconds()
      function plus0 (num) {
        if (num < 10) {
          return '0' + num
        }
        return num + ''
      }
      return `${plus0(year)}.${plus0(month)}.${plus0(day)} ${plus0(hours)}:${plus0(mins)}:${plus0(secs)}`
    },
    getStatus (status) {
      return {
        0: 'cloud_queue',
        10: 'cloud_queue',
        20: 'cloud_download',
        100: 'cloud_download',
        150: 'cloud_upload',
        200: 'cloud_done',
        '-1': 'cloud_off'
      }[status] || 'cloud_queue'
    }
  },
  methods: {
    ...mapActions('offline', [
      'refresh',
      'remove',
      'page',
      'parseTorrent',
      'parseMagnet',
      'start'
    ]),
    selectedDir (opts) {
      if (opts.payload.type === 20) {
        opts.payload.opts.savePath = opts.path
        this.start(opts.payload.opts)
      }
      if (opts.payload.type === 10) {
        opts.payload.opts.savePath = opts.path
        this.start(opts.payload.opts)
      }
    },
    nextPage (page) {
      this.$router.push('/offline/' + page)
    },
    deleteFile (item) {
      this.remove({
        taskHash: [item.taskHash]
      })
    },
    async download () {
      let res = await this.$prompt('', {
        buttonTrueText: '确定',
        buttonFalseText: '取消',
        color: 'primary',
        icon: 'info',
        title: '提示',
        property: '$prompt'
      })
      if (res) {
        let url = res.toLocaleLowerCase()
        if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('ftp://') || url.startsWith('sftp://') || url.startsWith('thunder://')) {
          this.$refs.selectDir.$emit('show', {
            type: 20,
            opts: {
              url: res,
              type: 20,
              savePath: ''
            }
          })
        }
        if (url.startsWith('magnet:')) {
          // 先不做预解析
          let result = await this.parseMagnet({
            url: res
          })
          this.$refs.selectDir.$emit('show', {
            type: 10,
            opts: {
              type: 10,
              savePath: '',
              files: '*',
              taskHash: result.taskHash
            }
          })
        }
      }
    }
  }
}
</script>
