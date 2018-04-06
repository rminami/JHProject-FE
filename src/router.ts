import Vue from 'vue'
import Router from 'vue-router'

const routerOptions = [
  {
    path: '/',
    redirect: '/files'
  },
  {
    path: '/files*.csv',
    component: 'DataView'
  },
  {
    path: '/files*.(png|jpg|dzi)',
    component: 'ImageView'
  },
  {
    path: '/files*.*',
    component: 'RawFileView'
  },
  {
    path: '/files*',
    component: 'FileBrowse'
  },
  {
    path: '/ml',
    component: 'MachineLearning'
  },
  {
    path: '/admin/console',
    component: 'Admin'
  },
  {
    path: '/login',
    component: 'Login'
  },
  {
    path: '/signup',
    component: 'Signup'
  },
  {
    path: '/settings',
    component: 'Settings'
  },
]

const routes = routerOptions.map(route => ({
  ...route,
  component: () => import(`@/components/${route.component}.vue`) // tslint:disable-line
}))

Vue.use(Router)

export default new Router({ mode: 'history', routes })
