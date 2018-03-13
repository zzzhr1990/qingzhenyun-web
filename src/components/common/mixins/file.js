import * as types from '@/store/mutation-types'
import Notify from '@/components/common/message/notify'
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
        .then((result) => {
          this.$store.commit(`files/${types.PATH_SUCCESS}`, result.result)
        })
        .catch((res) => {
          this.catchErrorHandler(res, `files/${types.PATH_FAILURE}`)
        })
    },

    pageReFresh () {
      this.getData(this.currentPageInfo)
    },

    moveFile (data) {
      DialogShow()
        .then(selectDir => {
          return this.moveone(
            this.awaysGetArray(data),
            selectDir
          )
        })
        .catch(e => {})
    },

    moveone (data, selectDir = {}) {
      return this
        .$store
        .dispatch(`files/move`, {
          uuid: data.map(item => item.uuid),
          parent: selectDir.uuid || ''
        })
        .then((result) => {
          Notify.FILE_MOVE_SUCCESS()
          this.$store.commit(`files/${types.PATH_MOVE_DONE}`, data)
        })
        .then(done => {
          this.pageReFresh()
        })
        .catch((res) => {
          Notify.FILE_MOVE_FAILED(res)
          this.$store.commit(`files/${types.PATH_MOVE_DONE}`)
        })
    },

    deleteone (data) {
      return this.$store.dispatch(`files/delete`, {
        uuid: data.map(item => item.uuid)
      })
        .then((result) => {
          Notify.FILE_DELETE_SUCCESS()
          this.$store.commit(`files/${types.PATH_DELETE_SUCCESS}`, data)
        })
        .then(() => {
          this.pageReFresh()
        })
        .catch((res) => {
          Notify.FILE_DELETE_ERROR(data.name, res)
          this.$store.commit(`files/${types.PATH_DELETE_FAILURE}`)
        })
    },

    deleteFile (data) {
      this.$confirm('此操作将删除选中文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteone(this.awaysGetArray(data))
      }).catch(_ => {})
    },

    renameone (data, value) {
      this
        .$store
        .dispatch(`files/rename`, {
          uuid: data.uuid,
          name: value
        })
        .then((result) => {
          Notify.FILE_MODIFY_SUCCESS(data.name)
          this.$store.commit(`files/${types.PATH_RENAME_SUCCESS}`, result.result)
        })
        .catch((res) => {
          Notify.FILE_MODIFY_FAILED(data.name, res)
          this.$store.commit(`files/${types.PATH_RENAME_FAILURE}`)
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
        return Promise.all(promiselist)
      })
    }
  }
}
