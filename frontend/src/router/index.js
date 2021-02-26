import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import New from '../views/New.vue'
import Orders from '../views/Orders.vue'
import Admin from "../views/Admin.vue"
import Remaining from "../views/Remaining.vue"

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
    {
    path: '/new/:place',
    name: 'New',
    component: New
  },
  {
    path: '/orders',
    name: 'Orders',
    component: Orders
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin
  },
  {
    path: '/remaining',
    name: 'Remaining',
    component: Remaining
  }
]

const router = new VueRouter({
  routes
})

export default router
