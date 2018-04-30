import { mapState, mapActions } from 'vuex'
import Message from 'vuetify-toast'

export default {
    watch: {
        message (msg) {
            Message[msg.type](msg.message)
        }
    },
    computed: {
        ...mapState('offline', [
            'pageInfo',
            'fetching',
            'message'
        ])
    },
    methods: {

        /**
         * 混入方法
         */
        ...mapActions('offline', [
            'refresh',
            'remove'
        ]),

        deleteIt (item) {
            this.remove({
                taskHash: [item.taskHash]
            })
        }
    }
}
