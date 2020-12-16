import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import Tabs from '../views/Tabs.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/send'
  },
  {
    path: '/',
    component: Tabs,
    children: [
      {
        path: '',
        redirect: '/send'
      },
      {
        path: 'sending/:code',
        component: () => import('@/views/Sending.vue')
      },
      {
        path: 'send',
        component: () => import('@/views/Send.vue')
      },
      {
        path: 'receive',
        component: () => import('@/views/Receive.vue')
      },
      {
        path: 'receive/:code',
        component: () => import('@/views/ReceiveConfirm.vue')
      },
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
