import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: localStorage.getItem('user-token') || '',
    status: '',
    beEndpoint: 'http://127.0.0.1:4000',
    // beEndpoint: 'https://jm354.host.cs.st-andrews.ac.uk', // Jordan's backend
    // beEndpoint: 'https://rw86.host.cs.st-andrews.ac.uk/be/hci1', // Ryan's backend
    // mlEndpoint: 'http://e0248507.ngrok.io/JH-Project/machine-learning-api/1.0/' // Daphne's ML
    mlEndpoint: 'http://127.0.0.1:7000'
    // mlEndpoint: 'https://to26.host.cs.st-andrews.ac.uk/JH-Project/machine-learning-api/1.0/' // Tom's ML
  },
  mutations: {

  },
  actions: {
    
  },
})
