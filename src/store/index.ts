import {Action, ActionContext, ActionHandler, createStore, Module, Store} from 'vuex'
import {ClientConfig} from "@/go/wormhole/types";
import {DEFAULT_PROD_CLIENT_CONFIG, Offer} from "@/go/wormhole/client";

let defaultConfig: ClientConfig | undefined;
let host = 'http://localhost:8080';
console.log(`index.ts:6| process.env['NODE_ENV']: ${process.env['NODE_ENV']}`);
if (process.env['NODE_ENV'] === 'production') {
    defaultConfig = DEFAULT_PROD_CLIENT_CONFIG;
    host = 'https://wormhole.bryanchriswhite.com';
}

declare interface SideState {
    open: boolean;
    code: string;
    progress: {
        value: number;
        done: boolean;
    };
    offer: Offer;
}

/* --- ACTIONS --- */
function setOpenAction(this: Store<SideState>, {commit}: ActionContext<SideState, any>, open: boolean): any {
    commit('setOpen', open);
}

function setCodeAction(this: Store<SideState>, {commit}: ActionContext<SideState, any>, code: string): any {
    commit('setCode', code);
}

function setOfferAction(this: Store<SideState>, {commit}: ActionContext<SideState, any>, offer: Offer) {
    commit('setOffer', offer);
}

function setProgressAction(this: Store<SideState>, {commit}: ActionContext<SideState, any>, payload?: Record<string, any>): any {
    commit('setProgress', payload);
}

function setDoneAction(this: Store<SideState>, {commit}: ActionContext<SideState, any>, done: boolean): any {
    commit('setDone', done);
}

/* --- MUTATIONS --- */
function setOpenMutation(state: SideState, open: boolean) {
    state.open = open;
}

function setCodeMutation(state: SideState, code: string) {
    state.code = code;
}

function setOfferMutation(state: SideState, offer: Offer) {
    state.offer = offer;
}

function setProgressMutation(state: SideState, percent: any) {
    state.progress.value = percent;
}

function setDoneMutation(state: SideState, done: boolean) {
    console.log(`index.ts:62| setting done: ${done}`);
    state.progress.done = done;
}


/* --- STATES --- */
const sendState = {
    open: false,
    code: '',
    progress: {
        value: -1,
        done: false,
    },
    offer: {
        name: '',
        size: 0,
    },
};

const recvState = {
    open: false,
    code: '',
    progress: {
        value: -1,
        done: false,
    },
    offer: {
        name: '',
        size: 0,
    },
};

/* --- MODULES --- */
const sendModule: Module<any, any> = {
    namespaced: true,
    state: () => sendState,
    mutations: {
        setOpen: setOpenMutation,
        setCode: setCodeMutation,
        setOffer: setOfferMutation,
        setProgress: setProgressMutation,
        setDone: setDoneMutation,
    },
    actions: {
        setOpen: setOpenAction,
        setCode: setCodeAction,
        setOffer: setOfferAction,
        setProgress: setProgressAction,
        setDone: setDoneAction,
    },
};

const recvModule: Module<any, any> = {
    namespaced: true,
    state: () => recvState,
    mutations: {
        setOpen: setOpenMutation,
        setCode: setCodeMutation,
        setOffer: setOfferMutation,
        setProgress: setProgressMutation,
        setDone: setDoneMutation,
    },
    actions: {
        setOpen: setOpenAction,
        setCode: setCodeAction,
        setOffer: setOfferAction,
        setProgress: setProgressAction,
        setDone: setDoneAction,
    },
};

export default createStore({
    devtools: process.env['NODE_ENV'] !== 'production',
    state() {
        return {
            host,
            config: defaultConfig || {},
        }
    },
    mutations: {
        setConfig(state, config: ClientConfig) {
            (state as any).config = config;
        },
    },
    actions: {
        setConfig({commit}, config) {
            commit('setConfig', config);
        },
    },
    modules: {
        send: sendModule,
        receive: recvModule,
    }
})
