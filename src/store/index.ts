import {Action, ActionContext, ActionHandler, createStore, Module, Store} from 'vuex'
import {ClientConfig} from "@/go/wormhole/types";
import {DEFAULT_PROD_CLIENT_CONFIG, Offer} from "@/go/wormhole/client";

let defaultConfig: ClientConfig | undefined;
if (process.env['NODE_ENV'] === 'production') {
    defaultConfig = DEFAULT_PROD_CLIENT_CONFIG;
}

// TODO: refactor
let host = 'http://localhost:8080';
if (process.env.NODE_ENV === 'production') {
    host = 'https://wormhole.bryanchriswhite.com';
}

declare interface PeerState {
    open: boolean;
    code: string;
    progress: {
        value: number;
        done: boolean;
    };
    offer: Offer;
}

/* --- ACTIONS --- */
function setOpenAction(this: Store<PeerState>, {commit}: ActionContext<PeerState, any>, open: boolean): any {
    commit('setOpen', open);
}

function setCodeAction(this: Store<PeerState>, {commit}: ActionContext<PeerState, any>, code: string): any {
    commit('setCode', code);
}

function setOfferAction(this: Store<PeerState>, {commit}: ActionContext<PeerState, any>, offer: Offer) {
    commit('setOffer', offer);
}

function setProgressAction(this: Store<PeerState>, {commit}: ActionContext<PeerState, any>, payload?: Record<string, any>): any {
    commit('setProgress', payload);
}

function setDoneAction(this: Store<PeerState>, {commit}: ActionContext<PeerState, any>, done: boolean): any {
    commit('setDone', done);
}

/* --- MUTATIONS --- */
function setOpenMutation(state: PeerState, open: boolean) {
    state.open = open;
}

function setCodeMutation(state: PeerState, code: string) {
    state.code = code;
}

function setOfferMutation(state: PeerState, offer: Offer) {
    state.offer = offer;
}

function setProgressMutation(state: PeerState, percent: any) {
    state.progress.value = percent;
}

function setDoneMutation(state: PeerState, done: boolean) {
    state.progress.done = done;
}


/* --- STATES --- */
const peerState = {
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
const peerModule: Module<any, any> = {
    namespaced: true,
    state: () => peerState,
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
}

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
        }
    },
    actions: {
        setConfig({commit}, config) {
            commit('setConfig', config);
        },
    },
    modules: {
        send: peerModule,
        receive: peerModule,
    }
})
