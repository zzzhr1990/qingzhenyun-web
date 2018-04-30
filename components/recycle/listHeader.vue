<template>
    <v-layout px-3 class="table" caption justify-space-between row>
        <div class="d-flex"></div>
        <div class="d-flex datatable__actions">
            <div>{{paginateString}}</div>
            <v-layout class="datatable__actions__select">
                <v-select
                  :items="pageStates"
                  :value="pageInfo.page"
                  single-line
                  auto
                  color="primary"
                  hide-details
                  dense
                  flat
                  @change="jumpToPage"
                ></v-select>
            </v-layout>
            <v-btn icon :disabled="prevBtnDisabled" @click="prevPage">
                <v-icon>chevron_left</v-icon>
            </v-btn>
            <v-btn icon :disabled="nextBtnDisabled" @click="nextPage">
                <v-icon>chevron_right</v-icon>
            </v-btn>
        </div>
    </v-layout>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
    computed: {
        ...mapState('recycle', [
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
        ...mapActions('recycle', [
            'refresh'
        ]),
        prevPage () {
            this.$router.push({
                path: '/recycle/' + encodeURIComponent(this.pageInfo.info.path),
                query: {
                    page: this.pageInfo.page - 1
                }
            })
        },
        nextPage () {
            this.$router.push({
                path: '/recycle/' + encodeURIComponent(this.pageInfo.info.path),
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
</script>
