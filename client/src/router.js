import Vue from 'vue'
import Router from 'vue-router'
import { Api } from './Api'
import Home from './views/Home.vue'
import Login from './views/Login.vue'
import Signup from './views/SignUp.vue'
import AddTeam from './views/AddTeam.vue'
import TeamDetails from './views/TeamDetails.vue'
import EventDetails from './views/EventDetails.vue'
import OptimalTime from './views/OptimalTime.vue'
import EditProfile from './views/EditProfile.vue'
import Team from './views/TeamsPage.vue'

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
      path: '/teams/:id',
      name: 'team-details',
      component: TeamDetails,
      meta: { requiresAuth: true }
    },
    {
      path: '/events/:id',
      name: 'event-details',
      component: EventDetails,
      meta: { requiresAuth: true }
    },
    {
      path: '/events/:id/optimal',
      name: 'optimal-time',
      component: OptimalTime,
      meta: { requiresAuth: true }
    },
    {
      path: '/edit-profile',
      name: 'edit-profile',
      component: EditProfile,
      meta: { requiresAuth: true }
    },
    {
      path: '/team/:id',
      name: 'team',
      component: Team,
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
