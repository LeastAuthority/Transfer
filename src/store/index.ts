import {Action, ActionContext, createStore, Module, Store} from 'vuex'
import {ClientConfig, Offer, TransferOptions} from "@/go/wormhole/types";
import {DEFAULT_PROD_CLIENT_CONFIG} from "@/go/wormhole/client";
import {NEW_CLIENT, RECV_FILE, SEND_FILE} from "@/store/actions";
import {Reader} from "@/go/wormhole/streaming";
import ClientWorker from "@/go/wormhole/client_worker";

let host = 'http://localhost:8080';

let defaultConfig: ClientConfig | undefined;
console.log(`index.ts:6| process.env['NODE_ENV']: ${process.env['NODE_ENV']}`);
if (process.env['NODE_ENV'] === 'production') {
    defaultConfig = DEFAULT_PROD_CLIENT_CONFIG;
    host = 'https://wormhole.bryanchriswhite.com';
}

let client = new ClientWorker(defaultConfig);

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

function newClientAction(this: Store<any>, {commit}: ActionContext<any, any>, config?: ClientConfig): void {
    // TODO: something better.
    commit('receive/setProgress', -1);
    commit('send/setProgress', -1);
    commit(NEW_CLIENT, config);
}


async function sendFileAction(this: Store<any>, {commit, dispatch}: ActionContext<any, any>, file: File, opts?: TransferOptions): Promise<void> {
    try {
        const {code, cancel, done} = await client.sendFile(file, opts);

        commit(SEND_FILE, {code, done, cancel});
        done.then(() => {
            commit('setDone', true);
            commit('setOpen', false);
            dispatch(NEW_CLIENT);
        }).catch(error => {
            return Promise.reject(error);
        });

        return done;
    } catch (error) {
        return Promise.reject(error);
    }
}

// TODO: be more specific with types.
async function recvFileAction(this: Store<any>, {commit}: ActionContext<any, any>, payload: any): Promise<Reader> {
    const {code, opts} = payload;
    return client.recvFile(code, opts);
}

/* --- MUTATIONS --- */
function setOpenMutation(state: SideState, open: boolean): void {
    state.open = open;
}

function setCodeMutation(state: SideState, code: string): void {
    state.code = code;
}

function setOfferMutation(state: SideState, offer: Offer): void {
    state.offer = offer;
}

function setProgressMutation(state: SideState, percent: any): void {
    state.progress.value = percent;
}

function setDoneMutation(state: SideState, done: boolean): void {
    console.log(`index.ts:62| setting done: ${done}`);
    state.progress.done = done;
}

// TODO: be more specific with types.
function sendFileMutation(state: any, {code, done, cancel}: any): void {
    state.code = code;
    state.done = done;
    state.cancel = cancel;
}

// TODO: be more specific with types.
function newClientMutation(state: any, config?: ClientConfig): void {
    let _config = config;
    if (typeof (config) === 'undefined') {
        _config = state.config;
    }
    client = new ClientWorker(_config)
}


/* --- STATES --- */
const sendState = {
    open: false,
    // code: '',
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
        // setCode: setCodeMutation,
        setOffer: setOfferMutation,
        setProgress: setProgressMutation,
        setDone: setDoneMutation,
    },
    actions: {
        setOpen: setOpenAction,
        // setCode: setCodeAction,
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
            code: '',
            done: null,
            cancel: null,
        }
    },
    mutations: {
        setConfig(state, config: ClientConfig) {
            (state as any).config = config;
        },
        [NEW_CLIENT]: newClientMutation,
        [SEND_FILE]: sendFileMutation,
    },
    actions: {
        setConfig({commit, dispatch}, config) {
            commit('setConfig', config);
            dispatch(NEW_CLIENT, config);
        },
        [NEW_CLIENT]: newClientAction,
        [SEND_FILE]: sendFileAction,
        [RECV_FILE]: recvFileAction,
    },
    modules: {
        send: sendModule,
        receive: recvModule,
    }
})
