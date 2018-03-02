import Vue from 'vue'
import Vuex from 'vuex'
import login from './modules/login'
import files from './modules/files'
import pagefileselect from './modules/pagefileselect'
import upload from './modules/upload'
import offline from './modules/offline'
// import upload from './modules/upload'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    // path,
    // upload
    login,
    files,
    pagefileselect,
    upload,
    offline
  }
})
