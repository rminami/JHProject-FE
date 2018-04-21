import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    /**
     * States used for user authentication.
     */
    accessToken: localStorage.getItem('access-token') || '',
    refreshToken: localStorage.getItem('refresh-token') || '',

    // status is set to 'success', 'error', or 'loading' depending on authentication state.
    status: '',

    /**
     * States used for projects.
     */
    currentProject: 'helloworld',

    /**
     * States used for connectivity.
     */
    // beEndpoint: 'http://127.0.0.1:4000',
    // beEndpoint: 'https://jm354.host.cs.st-andrews.ac.uk', // Jordan's backend
    beEndpoint: 'https://rw86.host.cs.st-andrews.ac.uk/be/hci1', // Ryan's backend
    // mlEndpoint: 'http://e0248507.ngrok.io/JH-Project/machine-learning-api/1.0/' // Daphne's ML
    mlEndpoint: 'http://127.0.0.1:7000'
    // mlEndpoint: 'https://to26.host.cs.st-andrews.ac.uk/JH-Project/machine-learning-api/1.0/' // Tom's ML
  },
  getters: {
    isAuthenticated: state => !!state.accessToken
  },
  /**
   * Mutations change the state and are handled synchronously. Most of the time
   * they should be called by actions.
   */
  mutations: {
    authRequest(state) {
      state.status = 'loading'
    },
    authSuccess(state, accessToken) {
      state.accessToken = accessToken
      state.status = 'success'
    },
    authError(state) {
      state.accessToken = ''
      state.status = 'error'
    },
    authLogout(state) {
      state.accessToken = ''
    },
    switchProject(state, payload) {
      state.currentProject = payload.project
    }
  },
  /**
   * Actions call mutations and do not change the state directly. They are
   * handled asynchronously and can handle multiple mutation calls.
   */
  actions: {
    authRequest({ commit, state }, payload) {
      return new Promise((resolve, reject) => {
        commit('authRequest')
        /**
         * Sends a request to the OAuth endpoint to get an access token.
         * Object 'payload' should have attributes 'username' and 'password'.
         */
        const formData = new FormData()
        formData.append('username', payload.username)
        formData.append('password', payload.password)
        formData.append('grant_type', 'password')
        axios({
          method: 'post',
          baseURL: state.beEndpoint,
          url: '/oauth/token',
          data: formData
        })
        .then(res => {
          console.log(res.data)
          const accessToken = res.data.access_token

          // Store the token in local storage
          localStorage.setItem('access-token', accessToken)

          commit('authSuccess', accessToken)
          // dispatch('userRequest')
          resolve(res.data)
        })
        .catch(err => {
          commit('authError')
          console.log(err.response.data)
          // If login fails, any existing token should also be wiped
          localStorage.removeItem('access-token')
          reject(err)
        })
      })
    },
    authLogout({ commit, state }) {
      return new Promise((resolve, reject) => {
        commit('authLogout')
        localStorage.removeItem('access-token')
        resolve()
      })
    },
    switchProject({ commit, state }, payload) {
      commit('switchProject', payload)
    }
  },
})
