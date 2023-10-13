import Vue from 'vue'
import Router from 'vue-router'
import { Api } from './Api'
import Home from './views/Home.vue'
import Login from './views/Login.vue'
import Signup from './views/SignUp.vue'
import AddTeam from './views/AddTeam.vue'
import TeamsPage from './views/TeamsPage.vue'
import SchedulePage from './views/SchedulePage.vue'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/signup',
      name: 'sign-up',
      component: Signup
    },
    {
      path: '/teams/new',
      name: 'add-team',
      component: AddTeam,
      meta: { requiresAuth: true }
    },
    {
      // adds the team page router. Id is intended to be the teamID but authentication isn't dependent on whether the user is actually part of the team yet.
      path: '/teams/:id',
      name: 'teams page',
      component: TeamsPage,
      meta: { requiresAuth: true }
    },
    {
      // adds the team page router. Id is intended to be the teamID but authentication isn't dependent on whether the user is actually part of the team yet.
      path: '/schedule',
      name: 'schedule',
      component: SchedulePage,
      meta: { requiresAuth: true }
    }

  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    Api.get('/session').then(response => {
      if (response.status === 200 && sessionStorage.getItem('id') !== null) {
        next()
      } else {
        next('/login')
      }
    }).catch(error => {
      console.log(error)
      next('/login')
    })
  } else {
    next()
  }
})

export default router
