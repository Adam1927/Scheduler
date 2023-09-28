import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Login from './views/Login.vue'
import Signup from './views/SignUp.vue'
// import MainPage from './views/MainPage.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/signup',
      name: 'sign up',
      component: Signup
    }
    /*
    ,
    {
      path: '/mainpage',
      name: 'main page',
      component: MainPage
    }
    */
  ]
})
