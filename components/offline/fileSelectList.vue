<template>
    <v-dialog @input="change" value="true" :max-width="width">
        <v-toolbar v-if="!!title" :color="color" dense>
            <v-icon v-if="!!icon">{{ icon }}</v-icon>
            <v-toolbar-title class="white--text" v-text="title"/>
        </v-toolbar>
        <v-card tile class="pa-1">
            <v-data-table
                v-model="selected"
                :items="items"
                select-all
                item-key="path"
                hide-actions
            >
                <template slot="headers" slot-scope="props">
                    <tr>
                        <th>
                            <v-checkbox
                                primary
                                hide-details
                                @click.native="toggleAll"
                                :input-value="props.all"
                                :indeterminate="props.indeterminate"
                            ></v-checkbox>
                        </th>
                        <th></th>
                        <th></th>
                    </tr>
                </template>
                <template slot="items" slot-scope="props">
                    <tr :active="props.selected" @click="props.selected = !props.selected">
                        <td>
                            <v-checkbox
                                primary
                                hide-details
                                :input-value="props.selected"
                            ></v-checkbox>
                        </td>
                        <td>{{ props.item.name }}</td>
                        <td>{{ props.item.length | fileSizeFilter }}</td>
                    </tr>
                </template>
            </v-data-table>
            <v-card-actions>
                <v-spacer/>
                <v-btn
                    :color="buttonTrueColor"
                    flat
                    @click="choose(true)"
                >{{ buttonTrueText }}</v-btn>
                <v-btn
                    :color="buttonFalseColor"
                    flat
                    @click="choose(false)"
                >{{ buttonFalseText }}</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    props: {
        buttonTrueText: {
            type: String,
            default: 'Ok'
        },
        buttonFalseText: {
            type: String,
            default: 'Cancel'
        },
        buttonTrueColor: {
            type: String,
            default: 'primary'
        },
        buttonFalseColor: {
            type: String,
            default: 'grey'
        },
        color: {
            type: String,
            default: 'primary'
        },
        icon: {
            type: String,
            default: 'info'
        },
        title: {
            type: String
        },
        width: {
            type: Number,
            default: 300
        },
        items: {
            type: Array,
            default: () => ([])
        }
    },
    data () {
        return {
            value: false,
            selected: []
        }
    },
    methods: {
        choose (value) {
            if (value) {
                let files = []
                this.selected.forEach((item) => {
                    files.push(this.items.findIndex((ele) => {
                        return ele.path === item.path
                    }))
                })
                if (files.length === this.items.length) {
                    files = '*'
                } else {
                    files = files.toString()
                }
                this.value = files
            }
            this.$destroy()
        },
        change (res) {
            this.$destroy()
        },
        toggleAll () {
            if (this.selected.length) {
                this.selected = []
            } else {
                this.selected = this.items.slice()
            }
        }
    }
}
</script>
