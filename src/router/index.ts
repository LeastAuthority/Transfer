import {createRouter, createWebHashHistory} from '@ionic/vue-router';
import {RouteRecordRaw} from 'vue-router';
import {RESET_CODE, SET_CODE, SET_FILE_META} from "@/store/actions";

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
        meta: {transition: 'slide-left'},
    },
    {
        path: '/r',
        component: () => import('@/views/Receive.vue'),
        meta: {transition: 'slide-right'},
    },
    {
        path: '/:code',
        redirect: (_): string => {
            return `/r?hasCode`
        },
        // meta: {transition: 'slide-right'},
    },
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
    } else if (to.path !== from.path) {
        store.commit(RESET_CODE);
        store.commit(SET_FILE_META, {name: '', size: 0});
    }
})

export default router
