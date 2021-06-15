import {Action, ActionContext, createStore, Module, Store} from 'vuex'
import {ClientConfig, TransferOptions, TransferProgress} from "@/go/wormhole/types";
import {DEFAULT_PROD_CLIENT_CONFIG} from "@/go/wormhole/client";
import {
    ACCEPT_FILE,
    NEW_CLIENT,
    RESET_CODE,
    RESET_PROGRESS,
    SAVE_FILE,
    SEND_FILE,
    SET_CODE,
    SET_FILE_META,
    SET_PROGRESS
} from "@/store/actions";
import ClientWorker from "@/go/wormhole/client_worker";
import {alertController} from "@ionic/vue";
import {AlertOptions} from "@ionic/core";
import {errRelay, errMailbox} from "@/errors";

const defaultAlertOpts: AlertOptions = {
    buttons: ['OK'],
};

let host = 'http://localhost:8080';

let defaultConfig: ClientConfig | undefined;
if (process.env['NODE_ENV'] === 'production') {
    defaultConfig = DEFAULT_PROD_CLIENT_CONFIG;
    host = 'https://wormhole.bryanchriswhite.com';
    // host = 'https://test.winden.la.bryanchriswhite.com';
}

let client = new ClientWorker(defaultConfig);

/* --- ACTIONS --- */

// TODO: more specific types.
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
        const {code, done} = await client.sendFile(file, opts);

        const {name, size} = file;
        commit(SET_FILE_META, {name, size})
        commit(SEND_FILE, {code});
        done.then(() => {
            commit(SET_PROGRESS, -1)
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
}: ActionContext<any, any>, code: string): Promise<void> {
    const opts = {
        progressFunc: (sentBytes: number, totalBytes: number) => {
            commit(SET_PROGRESS, sentBytes/totalBytes);
        },
    }
    try {
        const p = client.saveFile(code, opts);
        const {name, size, accept, done} = await p;
        commit(SET_FILE_META, {name, size, accept, done});
        done.then(() => {
            commit(RESET_CODE);
            commit(RESET_PROGRESS);
        }).catch(async (error: string) => {
            dispatch('alert', {error});
        });
        return done;
    } catch (error) {
        dispatch('alert', {error})
        return Promise.reject(error);
    }

}

async function acceptFileAction(this: Store<any>, ctx: ActionContext<any, any>): Promise<void> {
    return this.state.fileMeta.accept();
}


declare interface AlertPayload {
    error: string;
    opts?: AlertOptions;
}

async function alert(this: Store<any>, {state}: ActionContext<any, any>, payload: AlertPayload): Promise<void> {
    // TODO: types!
    // NB: error is a string
    const {error} = payload;
    let {opts} = payload;
    if (typeof(opts) === 'undefined') {
        opts = defaultAlertOpts;
    }

    if (errMailbox.matches(error, state.config)) {
        opts.header = errMailbox.name
        opts.message = errMailbox.message
    } else if (errRelay.matches(error, state.config)) {
        opts.header = errRelay.name
        opts.message = errRelay.message
    } else {
        opts.header = 'Error';
        opts.message = (error);
    }


    const alert = await alertController
        .create(opts);
    await alert.present();
    await alert.onWillDismiss();
}

/* --- MUTATIONS --- */

// TODO: more specific types
function setFileMetaMutation(state: any, fileMeta: Record<string, any>): void {
    state.fileMeta = fileMeta;
}

// TODO: more specific types
function setProgressMutation(state: any, percent: any): void {
    state.progress = percent;
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

// TODO: be more specific with types.
function setCodeMutation(state: any, code: string): void {
    state.code = code;
}

// TODO: be more specific with types.
function resetCodeMutation(state: any): void {
    state.code = '';
}

// TODO: be more specific with types.
function resetProgressMutation(state: any): void {
    state.progress = -1;
}

export interface FileMeta {
    name: string;
    size: number;
    accept?: () => Promise<void>;
    done?: Promise<void>;
}

export interface AppState {
    host: string;
    config: ClientConfig | Record<never, never>;
    code: string;
    done: boolean;
    fileMeta: FileMeta;
    progress: number;
}

export default createStore({
    devtools: process.env['NODE_ENV'] !== 'production',
    state(): AppState {
        return {
            host,
            config: defaultConfig || {},
            code: '',
            done: false,
            // cancel: null,
            fileMeta: {
                name: '',
                size: 0,
                accept: undefined,
                done: undefined,
            },
            progress: -1,
        }
    },
    mutations: {
        setConfig(state, config: ClientConfig) {
            state.config = config;
        },
        [SET_PROGRESS]: setProgressMutation,
        [SET_FILE_META]: setFileMetaMutation,
        [NEW_CLIENT]: newClientMutation,
        [SEND_FILE]: sendFileMutation,
        [SET_CODE]: setCodeMutation,
        [RESET_CODE]: resetCodeMutation,
        [RESET_PROGRESS]: resetProgressMutation,
    },
    actions: {
        setConfig({commit, dispatch}, config) {
            commit('setConfig', config);
            dispatch(NEW_CLIENT, config);
        },
        [NEW_CLIENT]: newClientAction,
        [SEND_FILE]: sendFileAction,
        [SAVE_FILE]: saveFileAction,
        [ACCEPT_FILE]: acceptFileAction,
        alert,
    },
})
