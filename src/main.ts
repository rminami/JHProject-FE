import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import axios from 'axios'

Vue.use(Vuetify)

Vue.config.productionTip = false

const accessToken = localStorage.getItem('access-token')
if (accessToken) {
  // Using both British and American spellings just in case
  axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`
  axios.defaults.headers.common.Authorisation = `Bearer ${accessToken}`
  axios.defaults.headers.common['X-Backend-Server-Url'] = 'http://127.0.0.1:4000'
}

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
