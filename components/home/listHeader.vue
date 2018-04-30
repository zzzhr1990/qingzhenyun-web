<template>
    <v-layout px-3 class="table" caption justify-space-between row>
        <v-checkbox
            :input-value="value"
            :indeterminate="indeterminate"
            @click="checkboxClick"
            hide-details
        ></v-checkbox>
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
            <v-btn icon @click="refresh">
                <v-icon>refresh</v-icon>
            </v-btn>
        </div>
    </v-layout>
</template>

<script>
import listHeaderMixin from './listHeaderMixin.js'
export default {
    mixins: [
        listHeaderMixin
    ],
    computed: {
        value () {
            return Boolean(this.selected.length && this.selected.length === this.pageInfo.list.length)
        },
        indeterminate () {
            return Boolean(this.selected.length && this.selected.length !== this.pageInfo.list.length)
        }
    },
    data () {
        return {
            selected: []
        }
    },
    created () {
        this.$on('selectedArr', (selectedArr) => {
            this.selected = selectedArr
        })
    },
    methods: {
        checkboxClick () {
            if (this.value) {
                this.$emit('selectClick', {
                    payload: {
                        type: 'cancel'
                    }
                })
                return
            }

            this.$emit('selectClick', {
                payload: {
                    type: 'all'
                }
            })
        }
    }
}
</script>
