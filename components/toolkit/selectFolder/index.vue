<template>
    <v-dialog v-model="show" max-width="576">
        <v-card class="qz-dialog">
            <v-card-title class="justify-center text-xs-center">
                <template v-if="type==='move'">移动至</template>
                <template v-if="type==='copy'">复制至</template>
                <v-btn class="qz-dialog-close" absolute small icon right @click="close">
                    <v-icon>close</v-icon>
                </v-btn>
            </v-card-title>

            <v-container class="qz-dirlist" fluid grid-list-sm>
                <v-layout v-show="!fetching" row wrap>
                    <v-list>
                        <v-list-tile v-for="item in pageInfo" :key="item.uuid" avatar @click="selected = item.path" v-if="isNeedShow(item)" :style="{'padding-left': (item.level-1)*16 + 'px'}" class="qz-list-tile" :class="{'qz-list-tile-active': selected == item.path}">
                            <v-list-tile-action class="qz-dirlist-expand" @click="toggleExpand(item)">
                                <i class="v-icon qz-icon qz-expand" :class="{'qz-active': loadedPath[item.path].expand}"></i>
                            </v-list-tile-action>

                            <v-list-tile-action class="qz-dirlist-avatar">
                                <i class="v-icon qz-icon qz-icon-dir-move"></i>
                            </v-list-tile-action>
                            <v-list-tile-content @click.stop="selected = item.path">
                                <v-list-tile-title>{{item.name}}</v-list-tile-title>
                            </v-list-tile-content>
                        </v-list-tile>
                    </v-list>
                </v-layout>
            </v-container>

            <v-card-actions>
                <v-dialog v-model="createDirDialog.show" width="464">
                    <v-btn slot="activator" class="qz-btn qz-btn-primary qz-btn-create-dir" outline color="#2EC17C">
                        <span>新建文件夹</span>
                    </v-btn>
                    <v-card class="qz-dialog">
                        <v-card-title class="justify-center text-xs-center">
                            创建文件夹
                        </v-card-title>

                        <v-text-field class="qz-dirname" v-model="createDirDialog.name" placeholder="请输入文件夹名称..." solo flat color="#2EC17C" hide-details @keyup.enter="createDir(createDirDialog.name); createDirDialog.reset()"></v-text-field>

                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn class="qz-btn" depressed @click="createDirDialog.reset();">
                                取 消
                            </v-btn>
                            <v-btn class="qz-btn qz-btn-primary" color="#2EC17C" depressed @click="createDir(createDirDialog.name); createDirDialog.reset();">
                                确 认
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
                <v-spacer></v-spacer>
                <v-btn class="qz-btn" depressed @click="close();">
                    取 消
                </v-btn>
                <v-btn class="qz-btn qz-btn-primary" color="#2EC17C" @click="ok();">
                    确 认
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import FolderList from '@/components/toolkit/selectFolder/list.vue'
import { mapActions, mapState, mapMutations } from 'vuex'
export default {
    components: {
        FolderList
    },
    data () {
        return {
            pageInfo: [
                {
                    name: '根目录',
                    path: '',
                    uuid: '',
                    length: 1
                }
            ],
            loadedPath: {
                '': {
                    loaded: false,
                    expand: true
                }
            },
            createDirDialog: {
                name: '',
                show: false,
                reset () {
                    this.show = false
                    this.name = ''
                }
            },
            selected: ''
        }
    },
    watch: {
        show (val) {
            if (val) {
                this.initData()
                this.selected = ''
            }
        }
    },
    computed: {
        ...mapState('files', [
            'fetching'
        ]),
        ...mapState('selectdir', [
            'show',
            'type',
            'payload'
        ])
    },
    methods: {
        ...mapActions('files', [
            'folder',
            'createDirectory'
        ]),
        ...mapMutations('selectdir', {
            setState: 'SET_STATE'
        }),
        close () {
            this.setState({
                show: false,
                payload: {}
            })
        },
        ok () {
            if (this.payload.defer) {
                this.payload.defer.resolve({
                    path: this.selected,
                    payload: Object.assign({}, this.payload, {
                        defer: null
                    })
                })
            }
            this.setState({
                show: false,
                payload: {}
            })
        },
        toggleExpand (item) {
            this.loadedPath[item.path].expand = !this.loadedPath[item.path].expand
            if (this.loadedPath[item.path].expand) {
                this.loadData(item)
            }
        },
        isNeedShow (item) {
            var vm = this
            var pathArray = item.path.split('/')

            for (var i = pathArray.length - 1; i > 0; i--) {
                var path = pathArray.slice(0, i).join('/')
                if (!vm.loadedPath[path].expand) {
                    return false
                }
            }
            return true
        },
        async loadData (parent) {
            var vm = this
            if (!parent) {
                parent = {
                    path: '',
                    uuid: ''
                }
            }

            if (!vm.loadedPath[parent.path].loaded) {
                vm.loadedPath[parent.path].loaded = true

                var level = parent.path.split('/').length + 1
                let result = await this.folder({
                    path: parent.path,
                    pageSize: 999
                })

                result = result.map(r => {
                    vm.$set(vm.loadedPath, r.path, {
                        expand: false,
                        loaded: false
                    })

                    r.level = level
                    r.parentPath = parent.path
                    return r
                })

                if (result) {
                    let parentIndex = this.pageInfo.findIndex(e => {
                        return e.uuid === parent.uuid
                    }) + 1
                    vm.pageInfo = vm.pageInfo.slice(0, parentIndex).concat(result).concat(vm.pageInfo.slice(parentIndex))
                }
            }
            if (parent) {
                this.selected = parent.path
            }
        },

        async reloadData (parent) {
            var vm = this

            if (!vm.loadedPath[parent.path].loaded) {
                vm.loadedPath[parent.path].expand = true
                return vm.loadData(parent)
            }

            if (!parent) {
                parent = {
                    path: '',
                    uuid: ''
                }
            }

            let result = await this.folder({
                path: parent.path,
                pageSize: 999
            })

            result = result.filter(e => {
                return !vm.loadedPath[e.path]
            })

            result.map(r => {
                vm.$set(vm.loadedPath, r.path, {
                    expand: false,
                    loaded: false
                })
                r.level = parent.level + 1
                r.parentPath = parent.path

                return r
            })

            let parentIndex = this.pageInfo.findIndex(e => {
                return e.uuid === parent.uuid
            }) + 1
            vm.pageInfo = vm.pageInfo.slice(0, parentIndex).concat(result).concat(vm.pageInfo.slice(parentIndex))
        },
        initData () {
            this.loadData()
        },

        ...mapActions('files', [
            'createDirectory'
        ]),

        async createDir (name) {
            var vm = this
            if (name) {
                let result = await this.createDirectory({
                    path: vm.selected,
                    name: name
                })
                if (result) {
                    vm.reloadData(this.pageInfo.find(e => {
                        return e.path === vm.selected
                    }))
                }
            }
        }
    }
}
</script>
