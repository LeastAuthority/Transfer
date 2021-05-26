import {Action, ActionContext, createStore, Module, Store} from 'vuex'
import {ClientConfig, Offer, TransferOptions, TransferProgress} from "@/go/wormhole/types";
import {DEFAULT_PROD_CLIENT_CONFIG} from "@/go/wormhole/client";
import {NEW_CLIENT, SAVE_FILE, SEND_FILE} from "@/store/actions";
import ClientWorker from "@/go/wormhole/client_worker";
import {alertController} from "@ionic/vue";
import {AlertOptions} from "@ionic/core";
import {errRelay, errMailbox, errReceiveNoSender} from "@/errors";

let host = 'http://localhost:8080';

let defaultConfig: ClientConfig | undefined;
console.log(`index.ts:6| process.env['NODE_ENV']: ${process.env['NODE_ENV']}`);
if (process.env['NODE_ENV'] === 'production') {
    defaultConfig = DEFAULT_PROD_CLIENT_CONFIG;
    // host = 'https://wormhole.bryanchriswhite.com';
    host = 'https://test.winden.la.bryanchriswhite.com';
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
function setOpenAction(this: Store<any>, {commit}: ActionContext<any, any>, open: boolean): any {
    commit('setOpen', open);
}


function setOfferAction(this: Store<any>, {commit}: ActionContext<any, any>, offer: Offer) {
    commit('setOffer', offer);
}

function setProgressAction(this: Store<any>, {commit}: ActionContext<any, any>, value: number): any {
    commit('setProgress', value);
}

// TODO: more specific types.
function setDoneAction(this: Store<any>, {commit}: ActionContext<any, any>, done: boolean): any {
    commit('setDone', done);
}

function newClientAction(this: Store<any>, {commit}: ActionContext<any, any>, config?: ClientConfig): void {
    // TODO: something better.
    commit('setProgress', -1);
    commit(NEW_CLIENT, config);
}

declare interface SendFilePayload {
    file: File;
    opts?: TransferOptions;
}

async function sendFileAction(this: Store<any>, {commit, dispatch}: ActionContext<any, any>, {
    file,
    opts
}: SendFilePayload): Promise<void> {
    try {
        const {code, cancel, done} = await client.sendFile(file, opts);

        commit(SEND_FILE, {code, cancel});
        done.then(() => {
            commit('setDone', true);
            commit('setOpen', false);
            // TODO: remove!
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
async function saveFileAction(this: Store<any>, {
    commit,
    dispatch
}: ActionContext<any, any>, payload: any): Promise<TransferProgress> {
    const {code, opts} = payload;
    return client.saveFile(code, opts);
}

function acceptOfferAction(this: Store<any>, {state, commit}: ActionContext<any, any>): void {
    if (typeof (state.offer.accept) === 'function') {
        // TODO: handle error returned by accept.
        state.offer.accept();
    }
}

declare interface AlertPayload {
    error: Error;
    opts: AlertOptions;
}

async function alert(this: Store<any>, {state}: ActionContext<any, any>, payload: AlertPayload): Promise<void> {
    const {error, opts} = payload;

    if (errMailbox.matches(error, state.config)) {
        opts.header = errMailbox.name
        opts.message = errMailbox.message
    } else if (errRelay.matches(error, state.config)) {
        opts.header = errRelay.name
        opts.message = errRelay.message
    } else {
        opts.header = error.name;
        opts.message = error.message;
    }


    const alert = await alertController
        .create(opts);
    await alert.present();
    await alert.onWillDismiss();
}

/* --- MUTATIONS --- */

// TODO: more specific types
function setOpenMutation(state: any, open: boolean): void {
    state.open = open;
}

// TODO: more specific types
function setOfferMutation(state: any, offer: Offer): void {
    state.offer = offer;
}

// TODO: more specific types
function setProgressMutation(state: any, percent: any): void {
    state.progress = percent;
}

// TODO: more specific types
function setDoneMutation(state: any, done: boolean): void {
    console.log(`index.ts:62| setting done: ${done}`);
    state.done = done;
}

// TODO: be more specific with types.
function sendFileMutation(state: any, {code, cancel}: any): void {
    state.code = code;
    state.cancel = cancel;
}

// TODO: be more specific with types.
function newClientMutation(state: any, config?: ClientConfig): void {
    let _config = config;
    if (typeof (config) === 'undefined') {
        _config = {...state.config};
    }
    client = new ClientWorker(_config)
}


export default createStore({
    devtools: process.env['NODE_ENV'] !== 'production',
    state() {
        return {
            host,
            config: defaultConfig || {},
            code: '',
            done: false,
            cancel: null,
            offer: {},
            progress: -1,
        }
    },
    mutations: {
        setConfig(state, config: ClientConfig) {
            state.config = config;
        },
        setOpen: setOpenMutation,
        setDone: setDoneMutation,
        setOffer: setOfferMutation,
        setProgress: setProgressMutation,
        [NEW_CLIENT]: newClientMutation,
        [SEND_FILE]: sendFileMutation,
    },
    actions: {
        setConfig({commit, dispatch}, config) {
            commit('setConfig', config);
            dispatch(NEW_CLIENT, config);
        },
        setOpen: setOpenAction,
        setDone: setDoneAction,
        setOffer: setOfferAction,
        acceptOffer: acceptOfferAction,
        setProgress: setProgressAction,
        [NEW_CLIENT]: newClientAction,
        [SEND_FILE]: sendFileAction,
        [SAVE_FILE]: saveFileAction,
        alert,
    },
})
