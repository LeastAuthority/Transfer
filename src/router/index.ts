import {createRouter, createWebHashHistory} from '@ionic/vue-router';
import {RouteRecordRaw} from 'vue-router';
import Tabs from '../views/Tabs.vue'
import Main from "@/views/Main.vue";
import Send from "@/views/Send.vue";
import SendContainer from "@/views/SendContainer.vue";
import Receive from "@/views/Receive.vue";
import ReceiveConfirm from "@/views/ReceiveConfirm.vue";

const routes: Array<RouteRecordRaw> = [
    // {
    //     path: '/',
    //     redirect: '/s'
    // },
    // {
    //   path: '/',
    //   component: Main,
    //   children: [
    // {
    //     path: '',
    //     redirect: '/s'
    // },
    {
        path: '/s',
        component: Send,
        meta: {transition: 'slide-left'},
    },
    {
        path: '/r',
        component: () => import('@/views/Receive.vue'),
        meta: {transition: 'slide-right'},
    },
    // {
    //   path: 'r/:code',
    //   component: ReceiveConfirm,
    // },
    // ]
    // }
]

const router = createRouter({
    history: createWebHashHistory(process.env.BASE_URL),
    routes
})

export default router
