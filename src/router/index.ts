import { createRouter, createWebHashHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import Tabs from '../views/Tabs.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/s'
  },
  {
    path: '/',
    component: Tabs,
    children: [
      {
        path: '',
        redirect: '/s'
      },
      {
        path: '/s',
        component: () => import('@/views/Send.vue')
      },
      {
        path: '/r',
        component: () => import('@/views/Receive.vue')
      },
      {
        path: '/r/:code',
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
