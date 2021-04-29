import { createRouter, createWebHashHistory } from '@ionic/vue-router';
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
        path: '/send',
        component: () => import('@/views/Send.vue')
      },
      {
        path: '/receive',
        component: () => import('@/views/Receive.vue')
      },
      {
        path: '/receive/:code',
        component: () => import('@/components/ReceiveConfirm.vue')
      },
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
})

export default router
