import {ActionContext, createStore, Store} from 'vuex'
import {alertController, modalController} from "@ionic/vue";
import {AlertOptions} from "@ionic/core";
import Bowser from "bowser";

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
import {ErrRelay, ErrMailbox, ErrInterrupt, ErrBadCode, MatchableErrors} from "@/errors";
import {durationToClosesUnit, sizeToClosestUnit} from "@/util";

const updateProgressETAFrequency = 10;
const defaultAlertOpts: AlertOptions = {
    buttons: ['OK'],
};

let host = 'http://localhost:8080';

let defaultConfig: ClientConfig | undefined;
if (process.env['NODE_ENV'] === 'production') {
    defaultConfig = DEFAULT_PROD_CLIENT_CONFIG;
    host = 'https://w.leastauthority.com';
} else if (process.env['NODE_ENV'] === 'playground') {
    defaultConfig = {
        rendezvousURL: "wss://mailbox.wormhole.bryanchriswhite.com/v1",
        transitRelayURL: "wss://relay.wormhole.bryanchriswhite.com:443",
        passPhraseComponentLength: 2,
    }
    host = 'https://wormhole.bryanchriswhite.com';
}

let client: ClientWorker;

const safariNotSupportedError = Error("We plan to support Safari in future releases. Please try with a different browser.")
const browser = Bowser.getParser(self.navigator.userAgent)
const browserIsProbablySafari = browser.satisfies({
    safari: '>0'
});
if (browserIsProbablySafari) {
    const modal = alertController.create({
        header: 'Safari not supported :\'(',
        message: safariNotSupportedError.message,
        backdropDismiss: false,
    });
    modal.then(m => m.present());
} else {
    client = new ClientWorker(defaultConfig);
}

/* --- ACTIONS --- */

// TODO: more specific types.
async function newClientAction(this: Store<any>, {
    state,
    commit
}: ActionContext<any, any>, config?: ClientConfig): Promise<void> {
    // TODO: something better.
    let _config = config;
    if (typeof (config) === 'undefined') {
        _config = {...state.config};
    }

    await client.free()
    client = new ClientWorker(_config)
}

declare interface SendFilePayload {
    file: File;
    opts?: TransferOptions;
}

async function sendFileAction(this: Store<any>, {
    commit,
    dispatch
}: ActionContext<any, any>, {file, opts}: SendFilePayload): Promise<TransferProgress> {
    // NB: reset code
    commit(SET_CODE, '');

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

    const p = client.sendFile(file, opts);
    p.then(({code, done}) => {
        const {name, size} = file;
        commit(SET_FILE_META, {name, size})
        commit(SEND_FILE, {code});
        done.then(() => {
            commit(SET_PROGRESS, -1)
            // TODO: remove!
            // dispatch(NEW_CLIENT);
        }).catch(error => {
            dispatch(ALERT, {error})
            return Promise.reject(error);
        });
        // return done;
    }).catch((error) => {
        dispatch(ALERT, {error})
        return Promise.reject(error);
    });
    return p;
}

// TODO: be more specific with types.
async function saveFileAction(this: Store<any>, {
    state, commit, dispatch
}: ActionContext<any, any>, code: string): Promise<TransferProgress> {
    const opts = {
        progressFunc: (sentBytes: number, totalBytes: number) => {
            // TODO: refactor
            if (typeof (state.progressTimeoutCancel) === 'function') {
                state.progressTimeoutCancel();
                commit('progressHung', false);
            }

            commit(SET_PROGRESS, sentBytes / totalBytes);
            dispatch(UPDATE_PROGRESS_ETA, {sentBytes, totalBytes});

            // TODO: refactor
            const timeoutID = window.setTimeout(() => {
                commit('progressHung', true);
            }, 500);
            const cancel = () => {
                window.clearTimeout(timeoutID);
            };
            commit('progressTimeoutCancel', cancel);
        },
    }

    const p = client.saveFile(code, opts);
    p
        .then(({name, size, accept, done}) => {
            commit(SET_FILE_META, {name, size, accept, done});
            // TODO: refactor
            done.then(() => {
                commit(RESET_CODE);
                commit(RESET_PROGRESS);
            }).catch((error: string) => {
                dispatch(ALERT, {error});
                return Promise.reject(error);
            });
        })
        .catch((error: string) => {
            dispatch(ALERT, {error});
            return Promise.reject(error);
        });
    return p;

}

// TODO: use more specific types.
function updateProgressETAAction(this: Store<any>, {state, commit}: ActionContext<any, any>, {
    sentBytes,
    totalBytes
}: any): void {
    if (typeof (state.progressTimeoutCancel) !== 'undefined') {
        state.progressTimeoutCancel();
    }

    const now = Date.now()
    const secSinceBegin = (now - state.progressBegin) / 1000;
    const bytesPerSecond = sentBytes / secSinceBegin;
    const bytesRemaining = totalBytes - sentBytes;
    if (state.progressCounter % updateProgressETAFrequency === 0) {
        state.progressETASeconds = Math.ceil(bytesRemaining / bytesPerSecond);
    }
}

async function acceptFileAction(this: Store<any>, {state, dispatch}: ActionContext<any, any>): Promise<void> {
    const p = state.fileMeta.accept()
    p.catch((error: string) => {
        dispatch(ALERT, {error});
    });
    return p;
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

    let matchFound = false;
    for (const err of MatchableErrors) {
        if (err.matches(error, state.config)) {
            opts.header = err.name;
            opts.message = err.message;
            matchFound = true;
        }
    }

    if (!matchFound) {
        opts.header = 'Error';
        opts.message = (error);
    }

    const alert = await alertController.create(opts);
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
    progressTimeoutCancel: () => void | undefined;
    progressHung: boolean;
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
            progressTimeoutCancel: undefined,
            progressHung: false,
        }
    },
    mutations: {
        setConfig(state: any, config: ClientConfig) {
            state.config = config;
        },
        [SET_PROGRESS]: setProgressMutation,
        [SET_FILE_META]: setFileMetaMutation,
        [SEND_FILE]: sendFileMutation,
        [SET_CODE]: setCodeMutation,
        [RESET_CODE]: resetCodeMutation,
        [RESET_PROGRESS]: resetProgressMutation,
        // TODO: refactor
        progressTimeoutCancel: (state: any, cancel: () => void) => {
            state.progressTimeoutCancel = cancel;
        },
        progressHung: (state: any, hung: boolean) => {
            state.progressHung = hung;
        },
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
    getters: {
        progressETA: ({progress, progressETASeconds}) => {
            if (progress >= 1) {
                return '';
            }
            return durationToClosesUnit(progressETASeconds);
        },
    }
})
