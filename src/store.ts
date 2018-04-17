import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    beEndpoint: 'http://127.0.0.1:4000',
    mlEndpoint: 'http://127.0.0.1:7000'
    // mlEndpoint: 'https://to26.host.cs.st-andrews.ac.uk/JH-Project/machine-learning-api/1.0/'
  },
  mutations: {

  },
  actions: {

  },
});
