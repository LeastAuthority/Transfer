import {createRouter, createWebHashHistory} from '@ionic/vue-router';
import {RouteRecordRaw} from 'vue-router';
import Tabs from '../views/Tabs.vue'
import Main from "@/views/Main.vue";
import Send from "@/views/Send.vue";
import SendContainer from "@/views/SendContainer.vue";
import Receive from "@/views/Receive.vue";
import ReceiveConfirm from "@/views/ReceiveConfirm.vue";
import {defineComponent} from "vue";
import {SET_CODE} from "@/store/actions";

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        redirect: '/s'
    },
    {
        path: '',
        redirect: '/s'
    },
    {
        path: '/s',
        component: () => import('@/views/Send.vue'),
        // component: Send,
        meta: {transition: 'slide-left'},
    },
    {
        path: '/r',
        component: () => import('@/views/Receive.vue'),
        // component: Receive,
        meta: {transition: 'slide-right'},
    },
    {
        path: '/:code',
        redirect: '/r',
        // meta: {transition: 'slide-right'},
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

import store from '@/store';

router.beforeEach((to, from) => {
    if (typeof (to.redirectedFrom) !== 'undefined' &&
        typeof (to.redirectedFrom.params.code) !== 'undefined') {
        store.commit(SET_CODE, to.redirectedFrom.params.code);
        // router.replace('/r');
    }
})

export default router
