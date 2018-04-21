import Vue from 'vue'
import Router, { Route } from 'vue-router'
import store from './store'

const isLoggedIn = (to: Route, from: Route, next: Function): void => {
  if (store.getters.isAuthenticated) {
    next()
    return
  }
  next('/login')
}

const isNotLoggedIn = (to: Route, from: Route, next: Function): void => {
  if (!store.getters.isAuthenticated) {
    next()
    return
  }
  next('/projects')
}

const routerOptions = [
  {
    path: '/',
    redirect: '/projects'
  },
  {
    path: '/projects',
    component: 'Projects',
    beforeEnter: isLoggedIn
  },
  {
    path: '/projects/:project_name/*.csv',
    component: 'DataView',
    beforeEnter: isLoggedIn
  },
  {
    path: '/projects/:project_name/*.(png|jpg|dzi)',
    component: 'ImageView',
    beforeEnter: isLoggedIn
  },
  {
    path: '/projects/:project_name/*.*',
    component: 'RawFileView',
    beforeEnter: isLoggedIn
  },
  {
    path: '/projects/:project_name/*',
    component: 'FileBrowse',
    beforeEnter: isLoggedIn
  },
  {
    path: '/ml',
    component: 'MachineLearning',
    beforeEnter: isLoggedIn
  },
  {
    path: '/admin/console',
    component: 'Admin',
    beforeEnter: isLoggedIn
  },
  {
    path: '/admin/users',
    component: 'admin/UserControls',
    beforeEnter: isLoggedIn
  },
  {
    path: '/admin/server-settings',
    component: 'settings/ServerSettings',
    beforeEnter: isLoggedIn
  },
  {
    path: '/models',
    component: 'Models',
    beforeEnter: isLoggedIn
  },
  {
    path: '/models/prediction/',
    component: 'Prediction',
    beforeEnter: isLoggedIn
  },
  {
    path: '/login',
    component: 'Login',
    beforeEnter: isNotLoggedIn
  },
  {
    path: '/signup',
    component: 'Signup',
    beforeEnter: isNotLoggedIn
  },
  {
    path: '/settings',
    component: 'Settings'
  }
]

const routes = routerOptions.map(route => ({
  ...route,
  component: () => import(`@/components/${route.component}.vue`) // tslint:disable-line
}))

Vue.use(Router)

export default new Router({ mode: 'history', routes })
