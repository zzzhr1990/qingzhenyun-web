import * as types from '@/store/mutation-types'
import Notify from '@/components/common/message/notify'

export default {
  methods: {
    getOfflineData (options) {
      if (!options) {
        options = {
          page: 1,
          pageSize: types.HOME_PAGE_SIZE,
          order: this.order
        }
      }
      this
        .$store
        .dispatch('offline/page', options)
        .then(res => {
          this.$store.commit(`offline/${types.OFFLINE_PATH_SUCCESS}`)
          this.$store.commit(`offline/${types.OFFLINE_PATH_SET_PAGE}`, res.result)
        })
        .catch(e => {
          Notify.COMMON_WARNING(e)
          this.$store.commit(`offline/${types.OFFLINE_PATH_FAILURE}`)
        })
    }
  }
}
