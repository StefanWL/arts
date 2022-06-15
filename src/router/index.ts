import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: 'bubbles',
  },
  {
    path: '/bubbles',
    name: 'bubbles',
    component: () => import(/* webpackChunkName: "about" */ '../views/BubblesView.vue')
  },
  {
    path: '/draw',
    name: 'draw',
    component: () => import(/* webpackChunkName: "about" */ '../views/DrawView.vue')
  },
  {
    path: '/rotor',
    name: 'rotor',
    component: () => import(/* webpackChunkName: "about" */ '../views/RotorView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
