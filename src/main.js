// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import store from './store/index'
import router from './router'
import {
  Input,
  Container,
  Aside,
  Header,
  Main,
  Footer,
  Loading,
  Card,
  Progress,
  Icon,
  Tree,
  Table,
  TableColumn,
  Button,
  ButtonGroup,
  Menu,
  Popover,
  Pagination,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  MenuItem,
  Dialog
} from 'element-ui'
import 'vue2-animate/dist/vue2-animate.min.css'
// import userStore from './store/modules/user'
// import api from '@/api'

Vue.use(Input)
Vue.use(Container)
Vue.use(Aside)
Vue.use(Header)
Vue.use(Main)
Vue.use(Footer)
Vue.use(Loading)
Vue.use(Card)
Vue.use(Progress)
Vue.use(Icon)
Vue.use(Tree)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Button)
Vue.use(ButtonGroup)
Vue.use(Menu)
Vue.use(Popover)
Vue.use(Pagination)
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.use(MenuItem)
Vue.use(Dialog)

const JUMP_PAGE = ['Welcome', 'Login']

router.beforeEach((to, from, next) => {
  if (JUMP_PAGE.indexOf(to.name) !== -1 && store.state.login.token) {
    next({
      path: '/home'
    })
  } else if (to.meta.requireAuth && !store.state.login.token) {
    next({
      path: '/login'
    })
  } else {
    next()
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
