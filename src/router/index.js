import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import FileBrowse from '@/components/FileBrowse'

Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'HelloWorld',
            component: HelloWorld,
        },
        {
            path: '/files*',
            name: 'FileBrowse',
            component: FileBrowse,
        },
    ],
})
