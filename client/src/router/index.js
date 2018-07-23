import Vue from 'vue'
import Router from 'vue-router'
import VueSession from 'vue-session'

import Login from '@/components/Login'
import ChatProfile from '@/components/ChatProfile'
import RegisterUser from '@/components/RegisterUser'

Vue.use(Router)
Vue.use(VueSession)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/ChatProfile',
      name: 'ChatProfile',
      component: ChatProfile
    },
    {
      path: '/RegisterUser',
      name: 'RegisterUser',
      component: RegisterUser
    }
  ]
})
