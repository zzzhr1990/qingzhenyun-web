import {
    mapActions,
    mapState,
    mapMutations
} from 'vuex'

export default {
    computed: {
        ...mapState('files', [
            'pageInfo'
        ])
    },
    methods: {

        ...mapMutations('rightdrawer', {
            toggle: 'TOGGLE'
        }),

        ...mapActions('files', [
            'createDirectory'
        ]),

        async createDir (name) {
            if (name) {
                let result = await this.createDirectory({
                    path: this.pageInfo.info.path,
                    name: name
                })
                if (result) {
                    // this.pageInfo.unshift(result)
                }
            }
        }
    }
}
