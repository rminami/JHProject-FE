import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

const CHANGE_BE = 'CHANGE_BE'
const CHANGE_ML = 'CHANGE_ML'
const SWITCH_PROJECT = 'SWITCH_PROJECT'
const AUTH_REQUEST = 'AUTH_REQUEST'
const AUTH_SUCCESS = 'AUTH_SUCCESS'
const AUTH_ERROR = 'AUTH_ERROR'
const AUTH_LOGOUT = 'AUTH_LOGOUT'

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
    currentProject: 'data',

    /**
     * States used for connectivity.
     */
    beEndpoint: 'http://127.0.0.1:4000',
    mlEndpoint: 'http://127.0.0.1:7000'
  },
  getters: {
    isAuthenticated: state => !!state.accessToken
  },
  /**
   * Mutations change the state and are handled synchronously. Most of the time
   * they should be called by actions.
   */
  mutations: {
    [AUTH_REQUEST]: state => {
      state.status = 'loading'
    },
    [AUTH_SUCCESS]: (state, tokens) => {
      state.accessToken = tokens.accessToken
      state.refreshToken = tokens.refreshToken
      state.status = 'success'
    },
    [AUTH_ERROR]: state => {
      state.accessToken = ''
      state.status = 'error'
    },
    [AUTH_LOGOUT]: state => {
      state.accessToken = ''
    },
    [SWITCH_PROJECT]: (state, project: string) => {
      state.currentProject = project
    },
    [CHANGE_BE]: (state, newBeEndpoint: string) => {
      state.beEndpoint = newBeEndpoint
    },
    [CHANGE_ML]: (state, newMlEndpoint: string) => {
      state.mlEndpoint = newMlEndpoint
    }
  },
  /**
   * Actions call mutations and do not change the state directly. They are
   * handled asynchronously and can handle multiple mutation calls.
   */
  actions: {
    [CHANGE_BE]: ({ commit, state }, newBeEndpoint: string) => {
      return new Promise((resolve, reject) => {
        commit(CHANGE_BE, newBeEndpoint)
        resolve()
      })
    },
    [CHANGE_ML]: ({ commit, state }, newMlEndpoint: string) => {
      return new Promise((resolve, reject) => {
        commit(CHANGE_ML, newMlEndpoint)
        resolve()
      })
    },
    [AUTH_REQUEST]: ({ commit, state }, payload) => {
      return new Promise((resolve, reject) => {
        commit(AUTH_REQUEST)
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
          // const accessToken = res.data.data.access_token
          const accessToken = res.data.access_token
          const refreshToken = res.data.refresh_token

          // Store the token in local storage
          localStorage.setItem('access-token', accessToken)
          localStorage.setItem('refresh-token', refreshToken)

          commit(AUTH_SUCCESS, { accessToken, refreshToken })
          resolve(res.data)
        })
        .catch(err => {
          commit(AUTH_ERROR)
          console.log(err.response.data)
          // If login fails, any existing token should also be wiped
          localStorage.removeItem('access-token')
          reject(err)
        })
      })
    },
    authLogout({ commit, state }) {
      return new Promise((resolve, reject) => {
        commit(AUTH_LOGOUT)
        localStorage.removeItem('access-token')
        resolve()
      })
    },
    [SWITCH_PROJECT]: ({ commit, state }, project: string) => {
      return new Promise((resolve, reject) => {
        commit(SWITCH_PROJECT, project)
        resolve()
      })
    }
  },
})
