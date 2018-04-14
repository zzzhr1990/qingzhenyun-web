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
      <v-btn
        icon
        @click.stop="rightDrawer = !rightDrawer"
      >
        <v-icon>file_upload</v-icon>
      </v-btn>
    </v-toolbar>
    <v-content>
      <v-container grid-list-lg fluid>
        <v-layout row wrap>
          <v-flex
            xs12
            v-if="!isMobile"
          >
            <v-card>
              <v-layout>
                <v-checkbox
                  v-model="ex3"
                  color="secondary"
                  hide-details
                  :value="tmpClickVal"
                  @change="selectAll"
                  class="ml-3 mt-1"
                ></v-checkbox>
                <v-spacer>
                </v-spacer>
                <v-btn color="primary" flat v-if="ex4.length" @click="deleteItAll">删除全部</v-btn>
                <v-btn color="primary" flat v-if="ex4.length" @click="moveItAll">移动全部</v-btn>
                <v-btn color="primary" flat v-if="!ex4.length">离线下载</v-btn>
                <v-btn color="primary" flat v-if="!ex4.length" @click="uploadIt">上传文件</v-btn>
                <v-btn color="primary" flat v-if="!ex4.length" @click="createIt">创建文件夹</v-btn>
                <form ref="form" style="display: none">
                  <input type="file" ref="fileInput" @change="fileUpload($event)" multiple="true">
                </form>
              </v-layout>
            </v-card>
          </v-flex>
          <v-flex
            xs12
            v-for="item in pageInfo.list"
            :key="item.uuid"
          >
            <v-card :ripple="true">
              <v-card-title primary-title>
                <v-layout class="fullwidth">
                  <div class="type">
                    <v-icon medium :color="getColor(item)" class="mr-1">{{fileTypeFilter(item)}}</v-icon>
                  </div>
                  <div class="headline text-overflow" @click="preview(item)">{{item.name}}</div>
                </v-layout>
              </v-card-title>
              <v-card-text>
                <v-layout>
                  <span>{{ item.ctime | timeFilter }}</span>
                  <v-spacer></v-spacer>
                  <span>{{ item.size | fileSizeFilter }}</span>
                </v-layout>
              </v-card-text>
              <v-card-actions>
                <v-checkbox
                  v-model="ex4"
                  color="secondary"
                  :value="item.path"
                  hide-details
                  @change="checkboxChanged"
                ></v-checkbox>
                <v-spacer></v-spacer>
                <v-btn v-if="item.mime !== 'application/x-directory'" icon @click.stop="downloadIt(item)">
                  <v-icon>file_download</v-icon>
                </v-btn>
                <v-btn icon @click.stop="moveIt(item)" v-if="!isMobile">
                  <v-icon>keyboard_backspace</v-icon>
                </v-btn>
                <v-btn icon @click.stop="editIt(item)">
                  <v-icon>edit</v-icon>
                </v-btn>
                <v-btn icon @click.stop="deleteIt(item)">
                  <v-icon>delete</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
          <v-flex xs12>
            <div class="text-xs-center">
              <v-pagination :length="pageInfo.totalPage" v-model="pageStart" @input="nextPage"></v-pagination>
            </div>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
    <v-navigation-drawer
      temporary
      :right="true"
      v-model="rightDrawer"
      fixed
    >
      <v-list>
        <v-list-tile @click.native="right = !right">
          <v-list-tile-action>
            <v-icon light>compare_arrows</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>Switch drawer (click me)</v-list-tile-title>
        </v-list-tile>
      </v-list>
      <!-- uploadList -->
      <v-list two-line>
        <template v-for="(item, index) in uploadList">
          <v-list-tile
            avatar
            :key="item.batch"
          >
            <v-list-tile-content>
              <v-list-tile-title>{{ item.name }}</v-list-tile-title>
              <!-- <v-list-tile-sub-title class="text--primary">{{ item.status }}</v-list-tile-sub-title> -->
              <v-list-tile-sub-title>
                <v-progress-linear
                  v-model="item.progress"
                ></v-progress-linear>
              </v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-list-tile-action-text>{{ item.status }}</v-list-tile-action-text>
              <v-icon
                color="yellow darken-2"
              >delete</v-icon>
            </v-list-tile-action>
          </v-list-tile>
          <v-divider v-if="index + 1 < uploadList.length" :key="index"></v-divider>
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-footer :fixed="false" app>
      <span>&copy; 2017</span>
    </v-footer>
    <SelectDir ref="selectDir" @ok="selectedDir"></SelectDir>
    <!-- show picture -->
    <v-dialog
      v-model="previewImage.dialog"
      fullscreen
      transition="dialog-bottom-transition"
      :overlay="false"
      scrollable
    >
      <v-card>
        <v-toolbar card dark color="primary">
          <v-btn icon @click="closePreviewDialog" dark>
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-media :src="previewImage.url" height="100%" contain></v-card-media>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import Message from 'vuetify-toast'
import SelectDir from '@/components/SelectDir.vue'
export default {
  middleware: 'auth',
  async asyncData ({ store, params, query }) {
    await store.dispatch('files/page', {
      orderBy: store.orderBy,
      path: params.path || '',
      page: query.page || 1,
      pageSize: store.pageSize
    })
  },
  components: {
    SelectDir
  },
  data () {
    return {
      ex4: [],
      ex3: [],
      tmpClickVal: true,
      clipped: false,
      drawer: null,
      items: [
        { icon: 'dashboard', title: '全部文件', to: '/home/' },
        { icon: 'system_update_alt', title: '离线下载', to: '/offline/' },
        { icon: 'delete', title: '回收站', to: '/recycle/' },
        { icon: 'delete', title: '修改密码', to: '/changpassword' },
        { icon: 'exit_to_app', title: '退出', to: '/logout' }
      ],
      miniVariant: false,
      rightDrawer: false,
      title: 'Vuetify.js',
      showSelectDir: false,
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
    uploadMsg (msg) {
      Message[msg.type](msg.message)
    },
    previewMsg (msg) {
      Message[msg.type](msg.message)
    },
    async '$route' (to, from) {
      // react to route changes...
      await this.page({
        orderBy: this.pageInfo.orderBy,
        path: to.params.path || '',
        page: to.query.page || 1,
        pageSize: this.pageInfo.pageSize
      })
    }
  },
  computed: {
    ...mapState('files', [
      'pageInfo',
      'fetching',
      'message'
    ]),
    ...mapState('login', ['user']),
    ...mapState([
      'isMobile'
    ]),
    ...mapGetters('files', [
      'breadcrumbs'
    ]),
    ...mapState('upload', [
      'uploadList',
      'uploadMsg'
    ]),
    ...mapState('preview', [
      'previewMsg',
      'previewImage'
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
    fileSizeFilter (size) {
      let p = Math.pow(1024, 3)
      let unit = 'B'
      if (size > p) {
        unit = 'GB'
      } else if (size > (p /= 1024)) {
        unit = 'MB'
      } else if (size > (p /= 1024)) {
        unit = 'KB'
      } else if (size > (p /= 1024)) {
        unit = 'B'
      }
      return (size / p).toFixed(1) + unit
    }
  },
  methods: {
    ...mapActions('files', [
      'refresh',
      'move',
      'rename',
      'recycle',
      'remove',
      'page',
      'get',
      'createDirectory',
      'download'
    ]),
    ...mapActions('upload', [
      'upload'
    ]),
    ...mapActions('preview', [
      'image'
    ]),
    fileUpload (evt) {
      let files = evt.target.files
      if (!files || !files[0]) {
        return
      }
      this.$store.commit('upload/ADD_TASK', {
        path: this.pageInfo.info.path,
        tasks: files
      })
      this.upload()
    },
    selectedDir (opts) {
      this.move({
        path: opts.payload.map(item => item.path),
        destPath: opts.path
      })
    },
    async preview (item) {
      // 先完成功能再说
      if (item.mime === 'application/x-directory') {
        this.$router.push('/home/' + encodeURIComponent(item.path))
      }

      let type = item.preview / 100
      // 如果是pdf
      if (type === 3) {
        this.$router.push('/p/' + encodeURIComponent(item.path) + '?type=pdf')
      }

      // 如果是图片
      if (type === 4) {
        this.image({
          path: item.path
        })
      }

      if (type === 1) {
        this.$router.push('/v/' + encodeURIComponent(item.path) + '?type=video')
      }

      if (type === 2) {
        this.$router.push('/v/' + encodeURIComponent(item.path) + '?type=audio')
      }
    },
    closePreviewDialog () {
      this.$store.commit('preview/DIALOG', false)
    },
    open (url) {
      // let a = document.createElement('a')
      // a.href = url
      // a.target = '_blank'
      // document.body.appendChild(a)
      // a.click()
      // setTimeout(() => {
      //   document.body.removeChild(a)
      // }, 10)
      // chrome ban了所有非用户触发的跳转形式
      window.open(url)
    },
    nextPage (page) {
      this.$router.push('/home/' + encodeURIComponent(this.pageInfo.info.path) + '?page=' + page)
      // this.$router.push({
      //   path: '/home/',
      //   params: {
      //     path: encodeURIComponent(this.pageInfo.info.path)
      //   },
      //   query: {
      //     page: page
      //   }
      // })
    },
    create () {
      this.createDirectory({
        name: Math.random().toString(16),
        path: this.pageInfo.info.path
      })
    },
    async createIt () {
      let res = await this.$prompt('', {
        buttonTrueText: '确定',
        buttonFalseText: '取消',
        color: 'primary',
        icon: 'info',
        title: '提示',
        property: '$prompt'
      })
      if (res) {
        this.createDirectory({
          name: res,
          path: this.pageInfo.info.path
        })
      }
    },
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
    filterTime (time) {
      const t = new Date(time)
      const year = t.getFullYear()
      let month = t.getMonth()
      let day = t.getDate()
      let hours = t.getHours()
      let min = t.getMinutes()
      let sec = t.getSeconds()
      if (month <= 9) {
        month = '0' + month
      }
      if (day <= 9) {
        day = '0' + day
      }
      if (hours <= 9) {
        hours = '0' + hours
      }
      if (min <= 9) {
        min = '0' + min
      }
      if (sec <= 9) {
        sec = '0' + sec
      }
      return `${year}-${month}-${day} ${hours}:${min}:${sec}`
    },
    opendir () {},
    async downloadIt (item) {
      let result = await this.download({path: item.path})
      if (result) {
        this.openDownloadSource(result)
      }
    },
    openDownloadSource (result) {
      var a = document.createElement('a')
      a.setAttribute('href', result.url)
      a.setAttribute('download', result.name)
      a.style.visibility = 'hidden'
      document.body.appendChild(a)
      a.click()
      setTimeout(() => {
        try {
          document.body.removeChild(a)
        } catch (e) {}
      }, 10)
    },
    async editIt (item) {
      let res = await this.$prompt('', {
        buttonTrueText: '确定',
        buttonFalseText: '取消',
        color: 'primary',
        icon: 'info',
        title: '提示',
        property: '$prompt'
      })
      if (res) {
        this.rename({
          path: item.path,
          name: res
        })
      }
    },
    deleteIt (item) {
      this.remove({
        path: item.path
      })
    },
    deleteItAll () {
      this.remove({
        path: this.ex4
      })
    },
    moveIt (item) {
      this.$refs.selectDir.$emit('show', [item])
    },
    moveItAll () {
      this.$refs.selectDir.$emit('show', this.ex4.map(item => ({path: item})))
    },
    uploadIt () {
      this.$refs.fileInput.click()
    },
    videoPreview () {},
    pageChange () {},
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
        default:
          color = 'grey darken-2'
          break
      }
      return color
    },
    checkboxChanged () {
    },
    selectAll () {
      if (this.ex3.length) {
        this.ex4 = this.pageInfo.list.map((item) => {
          return item.path
        })
      } else {
        this.ex4 = []
      }
    }
  }
}
</script>
