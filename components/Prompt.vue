<template>
    <v-dialog @input="change" value="true" :max-width="width">
        <v-toolbar v-if="!!title" dark :color="color" dense>
            <v-icon v-if="!!icon">{{ icon }}</v-icon>
            <v-toolbar-title class="white--text" v-text="title"/>
        </v-toolbar>
        <v-card tile class="pa-1">
            <div>
                <v-text-field
                    :label="label"
                    v-model="name"
                    :hint="hint"
                    required
                ></v-text-field>
            </div>
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
        label: {
            type: String,
            default: '请输入'
        },
        hint: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            value: false,
            name: ''
        }
    },
    methods: {
        choose (value) {
            this.$emit('result', this.name)
            this.value = this.name
            this.$destroy()
        },
        change (res) {
            this.$destroy()
        }
    }
}
</script>
