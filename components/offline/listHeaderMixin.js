import { mapState, mapActions } from 'vuex'
export default {
    computed: {
        ...mapState('offline', [
            'pageInfo'
        ]),
        paginateString () {
            let nums = this.pageInfo.pageSize * this.pageInfo.page
            if (nums > this.pageInfo.totalCount) {
                nums = this.pageInfo.totalCount
            }
            let startNum = this.pageInfo.pageSize * (this.pageInfo.page - 1) + 1
            return startNum + '-' + nums + ' of ' + this.pageInfo.totalCount
        },
        prevBtnDisabled () {
            return this.pageInfo.page === 1
        },
        nextBtnDisabled () {
            return this.pageInfo.pageSize * this.pageInfo.page >= this.pageInfo.totalCount
        },
        pageStates () {
            var arr = new Array(this.pageInfo.totalPage).fill(0)
            return arr.map((item, index) => index + 1)
        }
    },
    methods: {
        ...mapActions('offline', [
            'refresh'
        ]),
        prevPage () {
            this.$router.push({
                path: '/offline/' + encodeURIComponent(this.pageInfo.info.path),
                query: {
                    page: this.pageInfo.page - 1
                }
            })
        },
        nextPage () {
            this.$router.push({
                path: '/offline/' + encodeURIComponent(this.pageInfo.info.path),
                query: {
                    page: this.pageInfo.page + 1
                }
            })
        },
        jumpToPage (page) {
            if (page === this.pageInfo.page) {
                return
            }
            this.$router.push({
                path: '/offline/' + encodeURIComponent(this.pageInfo.info.path),
                query: {
                    page: page
                }
            })
        }
    }
}
