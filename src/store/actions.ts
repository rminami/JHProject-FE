import axios from 'axios'

export const AUTH_REQUEST = 'AUTH_REQUEST'
export const AUTH_SUCCESS = 'AUTH_SUCCESS'
export const AUTH_ERROR = 'AUTH_ERROR'
export const AUTH_LOGOUT = 'AUTH_LOGOUT'


export const USER_REQUEST = 'USER_REQUEST'
export const USER_SUCCESS = 'USER_SUCCESS'
export const USER_ERROR = 'USER_ERROR'

export const actions = {
  [AUTH_REQUEST]: ({ commit, dispatch }: any, user: any) => {
    return new Promise((resolve, reject) => {
      commit(AUTH_REQUEST)
      axios({
        url: '',
        data: user,
        method: 'post'
      })
      .then(res => {
        const token = res.data.token
        localStorage.setItem('user-token', token)
        commit(AUTH_SUCCESS, token)

        dispatch(USER_REQUEST)
        resolve(res)
      })
      .catch(err => {
        commit(AUTH_ERROR, err)
        // any tokens that do not work should be removed
        localStorage.removeItem('user-token')
        reject(err)
      })
    })
  },
  [AUTH_LOGOUT]: ({ commit, dispatch }: any, user: any) => {
    return new Promise((resolve, reject) => {
      commit(AUTH_LOGOUT)
      localStorage.removeItem('user-token')
      resolve()
    })
  }
}