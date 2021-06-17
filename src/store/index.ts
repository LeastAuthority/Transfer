import {Action, ActionContext, createStore, Module, Store} from 'vuex'
import {ClientConfig, TransferOptions, TransferProgress} from "@/go/wormhole/types";
import {DEFAULT_PROD_CLIENT_CONFIG} from "@/go/wormhole/client";
import {
    ACCEPT_FILE, ALERT,
    NEW_CLIENT,
    RESET_CODE,
    RESET_PROGRESS,
    SAVE_FILE,
    SEND_FILE,
    SET_CODE,
    SET_FILE_META,
    SET_PROGRESS,
    UPDATE_PROGRESS_ETA
} from "@/store/actions";
import ClientWorker from "@/go/wormhole/client_worker";
import {alertController} from "@ionic/vue";
import {AlertOptions} from "@ionic/core";
import {errRelay, errMailbox} from "@/errors";
import {sizeToClosestUnit} from "@/util";

const updateProgressETAFrequency = 10;
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
    commit(NEW_CLIENT, config);
}

declare interface SendFilePayload {
    file: File;
    opts?: TransferOptions;
}

async function sendFileAction(this: Store<any>, {
    commit,
    dispatch
}: ActionContext<any, any>, {file, opts}: SendFilePayload): Promise<TransferProgress> {
    const progressFunc = (sentBytes: number, totalBytes: number) => {
        commit(SET_PROGRESS, sentBytes / totalBytes);
        dispatch(UPDATE_PROGRESS_ETA, {sentBytes, totalBytes});
    };

    if (typeof (opts) === 'undefined') {
        opts = {progressFunc};
    } else if (typeof (opts.progressFunc) !== 'function') {
        opts.progressFunc = progressFunc;
    } else {
        const _progressFunc = opts.progressFunc;
        opts.progressFunc = (sentBytes: number, totalBytes: number): void => {
            _progressFunc(sentBytes, totalBytes);
            progressFunc(sentBytes, totalBytes);
        }
    }

    try {
        const p = client.sendFile(file, opts);
        p.then(({code, done}) => {
            const {name, size} = file;
            commit(SET_FILE_META, {name, size})
            commit(SEND_FILE, {code});
            done.then(() => {
                commit(SET_PROGRESS, -1)
                // TODO: remove!
                dispatch(NEW_CLIENT);
            }).catch(error => {
                dispatch(ALERT, {error})
                // return Promise.reject(error);
            });
            // return done;
        });
        return p;
    } catch (error) {
        dispatch(ALERT, {error})
        return Promise.reject(error);
    }
}

// TODO: be more specific with types.
async function saveFileAction(this: Store<any>, {
    commit,
    dispatch
}: ActionContext<any, any>, code: string): Promise<TransferProgress> {
    const opts = {
        progressFunc: (sentBytes: number, totalBytes: number) => {
            commit(SET_PROGRESS, sentBytes / totalBytes);
            dispatch(UPDATE_PROGRESS_ETA, {sentBytes, totalBytes});
        },
    }
    try {
        const p = client.saveFile(code, opts);
        p.then(({name, size, accept, done}) => {
            commit(SET_FILE_META, {name, size, accept, done});
            done.then(() => {
                commit(RESET_CODE);
                commit(RESET_PROGRESS);
            }).catch(async (error: string) => {
                await dispatch('alertAction', {error});
            });
            // return done;
        });
        return p;
    } catch (error) {
        dispatch('alertAction', {error});
        return Promise.reject(error);
    }

}

// TODO: use more specific types.
function updateProgressETAAction(this: Store<any>, {state, commit}: ActionContext<any, any>, {
    sentBytes,
    totalBytes
}: any): void {
    const now = Date.now()
    const secSinceBegin = (now - state.progressBegin) / 1000;
    const bytesPerSecond = sentBytes / secSinceBegin;
    const bytesRemaining = totalBytes - sentBytes;
    if (state.progressCounter % updateProgressETAFrequency === 0) {
        state.progressETASeconds = Math.ceil(bytesRemaining / bytesPerSecond);
    }
}

async function acceptFileAction(this: Store<any>, {state, dispatch}: ActionContext<any, any>): Promise<void> {
    return state.fileMeta.accept().catch((error: string) => {
        dispatch('alertAction', {error});
    });
}


declare interface AlertPayload {
    error: string;
    opts?: AlertOptions;
}

async function alertAction(this: Store<any>, {state}: ActionContext<any, any>, payload: AlertPayload): Promise<void> {
    // TODO: types!
    // NB: error is a string
    const {error} = payload;
    console.error(error);
    let {opts} = payload;
    if (typeof (opts) === 'undefined') {
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
function setProgressMutation(state: any, sentRatio: number): void {
    if (state.progressBegin === 0) {
        state.progressBegin = Date.now();
    }

    state.progress = sentRatio;
    state.progressCounter++;
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
    state.progressCounter = 0;
    state.progressBegin = 0;
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
    progressCounter: number;
    progressBegin: number;
    progressETASeconds: number;
}

export default createStore({
    devtools: process.env['NODE_ENV'] !== 'production',
    state(): any {
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
            progressCounter: 0,
            progressBegin: 0,
            progressETASeconds: 0,
        }
    },
    mutations: {
        setConfig(state: any, config: ClientConfig) {
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
        [UPDATE_PROGRESS_ETA]: updateProgressETAAction,
        [ALERT]: alertAction,
    },
})
