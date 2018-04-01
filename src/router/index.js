import Vue from 'vue'
import Router from 'vue-router'

const routerOptions = [
  {
    path: '/',
    redirect: '/files'
  }, {
    path: '/files*',
    component: 'FileBrowse'
  }, {
    path: '/ml',
    component: 'MachineLearning'
  }, {
    path: '/admin/console',
    component: 'Admin'
  }, {
    path: '/settings',
    component: 'Settings'
  }, {
    path: '/hello',
    component: 'HelloWorld'
  }
]

const routes = routerOptions.map(route => ({
  ...route,
  component: () => import (`@/components/${route.component}.vue`)
}))

Vue.use(Router)

export default new Router({mode: 'history', routes})
