
import { mapActions, mapState, mapMutations } from 'vuex'

export default {
    computed: {
        ...mapState('files', [
            'pageInfo'
        ])
    },
    methods: {

        ...mapMutations('rightdrawer', {
            togger: 'TOGGER'
        }),

        ...mapActions('files', [
            'createDirectory'
        ]),

        async createDir () {
            let res = await this.$prompt('', {
                buttonTrueText: '确定',
                buttonFalseText: '取消',
                color: 'orange',
                icon: 'info',
                title: '文件夹名',
                property: '$prompt'
            })
            if (res) {
                let result = await this.createDirectory({
                    path: this.pageInfo.info.path,
                    name: res
                })
                if (result) {
                    this.pageInfo.unshift(result)
                }
            }
        }
    }
}
