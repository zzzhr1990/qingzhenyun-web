import * as types from '@/store/mutation-types'
import Notify from '@/components/common/message/notify'
import Message from '@/components/common/message/message'
import Vue from 'vue'
import DialogShow from '@/components/dirSelectDialog'
export default {
  methods: {
    getData (opts) {
      if (!opts) {
        opts = {}
        opts.page = 1
        opts.pageSize = types.HOME_PAGE_SIZE
        opts.parent = ''
        if (this.uuid) {
          opts.parent = this.uuid
        }
      }
      this
        .$store
        .dispatch(`files/page`, opts)
        .then((res) => {
          const result = res.body
          if (result.success) {
            this.$store.commit(`files/${types.PATH_SET_PAGE}`, result.result)
          } else {
            this.$message(Message.COMMON_WARNING(result))
          }
          this.$store.commit(`files/${types.PATH_SUCCESS}`, result.result.page)
        })
        .catch((res) => {
          this.catchErrorHandler(res, `files/${types.PATH_FAILURE}`)
        })
    },

    pageReFresh () {
      this.getData(this.currentPageInfo)
    },

    moveFile (data) {
      let d = this.awaysGetArray(data)
      DialogShow()
        .then(selectDir => {
          let promiselist = []
          for (const selected of d) {
            promiselist.push(this.moveone(selected, selectDir))
          }
          return Vue.Promise.all(promiselist)
        })
        .then(done => {
          this.pageReFresh()
        })
    },

    moveone (data, selectDir = {}) {
      this
        .$store
        .dispatch(`files/move`, {
          uuid: data.uuid,
          parent: selectDir.uuid || ''
        })
        .then((res) => {
          const result = res.body
          if (result.success) {
            this.$notify(Notify.FILE_MOVE_SUCCESS(data.name))
            this.$store.commit(`files/${types.PATH_MOVE_DONE}`, data)
            return 1
          } else {
            this.$notify(Notify.FILE_MOVE_FAILED(data.name, result.code || result.message))
            this.$store.commit(`files/${types.PATH_MOVE_DONE}`)
            return 0
          }
        })
        .catch((res) => {
          const result = Message.COMMON(res)
          this.$notify(Notify.FILE_MOVE_FAILED(data.name, result.code || result.message))
          this.$store.commit(`files/${types.PATH_MOVE_DONE}`)
          return 0
        })
    },

    deleteone (data) {
      return this.$store.dispatch(`files/delete`, {uuid: data.uuid})
        .then((res) => {
          const result = res.body
          if (result.success) {
            this.$notify(Notify.FILE_DELETE_SUCCESS(data.name))
            this.$store.commit(`files/${types.PATH_DELETE_SUCCESS}`, data)
            return 1
          } else {
            this.$notify(Notify.FILE_DELETE_ERROR(data.name, result.code || result.message))
            this.$store.commit(`files/${types.PATH_DELETE_FAILURE}`)
            return 0
          }
        })
        .catch((res) => {
          const result = Message.COMMON(res)
          this.$notify(Notify.FILE_DELETE_ERROR(data.name, result.code || result.message))
          this.$store.commit(`files/${types.PATH_DELETE_FAILURE}`)
          return 0
        })
    },

    deleteFile (data) {
      this.$confirm('此操作将删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteone(data)
          .then(() => {
            this.pageReFresh()
          })
      }).catch(_ => {})
    },

    renameone (data, value) {
      this
        .$store
        .dispatch(`files/rename`, {
          uuid: data.uuid,
          name: value
        })
        .then((res) => {
          const result = res.body
          if (result.success) {
            this.$notify(Notify.FILE_MODIFY_SUCCESS(data.name))
            this.$store.commit(`files/${types.PATH_RENAME_SUCCESS}`, result.result)
            return 1
          } else {
            this.$notify()
            this.$store.commit(`files/${types.PATH_RENAME_FAILURE}`)
            return 0
          }
        })
        .catch((res) => {
          const result = Message.COMMON(res)
          this.$notify(Notify.FILE_MODIFY_FAILED(data.name, result.code || result.message))
          this.$store.commit(`files/${types.PATH_RENAME_FAILURE}`)
          return 0
        })
    },
    getNameExt (name = '') {
      const rExt = /\.([^.]+)$/
      let ext = rExt.exec(name) ? RegExp.$1.toLowerCase() : ''
      let filename = ext ? name.replace(new RegExp('\\.' + ext + '$'), '') : name
      return {
        ext: '.' + ext,
        name: filename
      }
    },
    renameFile (data) {
      const sources = this.awaysGetArray(data)
      this.$prompt('请输入新的文件名称', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: (sources[0] && sources[0].name)
      }).then(({ value }) => {
        let promiselist = []
        if (sources.length === 1) {
          promiselist = [this.renameone(sources[0], value)]
        } else {
          let num = 1
          let ne = this.getNameExt(value)
          for (const selected of sources) {
            promiselist.push(this.renameone(selected, ne.name + ('_' + num++) + ne.ext))
          }
        }
        return Vue.Promise.all(promiselist)
      })
    }
  }
}
