// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import store from './store/index'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'vue2-animate/dist/vue2-animate.min.css'
// import userStore from './store/modules/user'
// import api from '@/api'

Vue.use(ElementUI)

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
