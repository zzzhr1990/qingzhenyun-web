import Vue from 'vue'
import Router from 'vue-router'
import Welcome from '@/components/Welcome'
import Login from '@/components/pages/Login'
import Home from '@/components/pages/Home/Index'
import Offline from '@/components/pages/Home/Offline'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Welcome',
      component: Welcome
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/home',
      name: 'Home',
      component: Home,
      meta: {
        requireAuth: true
      }
    },
    {
      path: '/offline',
      name: 'Offline',
      component: Offline,
      meta: {
        requireAuth: true
      }
    }
  ]
})

export default router
