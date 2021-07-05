import streamSaver from 'streamsaver';

import {
    RPCMessage,
    FREE,
    isRPCMessage,
    NEW_CLIENT,
    RECV_FILE,
    RECV_FILE_DATA,
    RECV_FILE_PROGRESS, RECV_FILE_READ,
    RECV_TEXT,
    SEND_FILE,
    SEND_FILE_PROGRESS,
    SEND_FILE_RESULT_ERROR,
    SEND_FILE_RESULT_OK,
    SEND_TEXT,
    WASM_READY
} from "@/store/actions";
import {FileStreamReader} from "@/go/wormhole/streaming";
import {ClientConfig, ClientInterface, TransferProgress, TransferOptions, wormhole} from "@/go/wormhole/types";
import {ErrBadCode} from "@/errors";
import {RpcProvider} from "worker-rpc";
import {SENDER_TIMEOUT} from "@/util";

export default class ClientWorker implements ClientInterface {
    public goClient = -1;
    // TODO: be more specific
    protected pending: Record<number, any> = {};
    protected receiving: Record<number, any> = {};
    protected ready: Promise<void>;
    protected port: MessagePort;
    protected rpc: RpcProvider | undefined = undefined;
    protected worker: Worker | undefined = undefined;

    constructor(config?: ClientConfig) {
        this.worker = new Worker(`${window.location.origin}/worker/index.umd.js`);

        const channel = new MessageChannel();
        this.port = channel.port1;

        // NB: send client config and remote channel port to worker.
        this.worker.postMessage({
            action: NEW_CLIENT,
            id: Date.now(),
            config,
        }, [channel.port2])

        // NB: wait for wasm module to be ready before listening to all events.
        this.ready = new Promise((resolve, reject) => {
            this.port.onmessage = (event: MessageEvent) => {
                if (!isRPCMessage(event.data)) {
                    reject(new Error(
                        `unexpected event: ${JSON.stringify(event, null, '  ')}`
                    ));
                }

                if (event.data.action === WASM_READY) {
                    this.goClient = event.data.goClient;

                    // TODO: look into timeout.
                    this.rpc = new RpcProvider((message, transfer) => {
                        typeof (transfer) === 'undefined' ?
                            this.port.postMessage(message) :
                            this.port.postMessage(message, transfer);
                    })
                    this._registerRPCHandlers();
                    this._registerSignalHandlers();
                    this.port.onmessage = (event) => this.rpc!.dispatch(event.data);

                    resolve();
                    return;
                }
                reject(event.data);
            }
        });
    }

    protected _registerRPCHandlers() {
        this.rpc!.registerRpcHandler<RPCMessage, void>(SEND_FILE_PROGRESS, this._handleFileProgress.bind(this));
        this.rpc!.registerRpcHandler<RPCMessage, void>(RECV_FILE_PROGRESS, this._handleFileProgress.bind(this));
        this.rpc!.registerRpcHandler<RPCMessage, void>(RECV_FILE_DATA, this._handleRecvFileData.bind(this));
    }

    protected _registerSignalHandlers() {
        this.rpc!.registerSignalHandler<RPCMessage>(SEND_FILE_RESULT_OK, this._handleSendFileResultOK.bind(this));
        this.rpc!.registerSignalHandler<RPCMessage>(SEND_FILE_RESULT_ERROR, this._handleSendFileResultError.bind(this));
    }

//     protected async _onMessage(event: MessageEvent): Promise<void> {
//         await this.ready;
//
//         if (!isAction(event.data)) {
//             throw new Error(`unexpected error: ${JSON.stringify(event, null, '  ')}`);
//         }
//
//         const {action, id, error} = event.data;
//         const pending = this.pending[id];
//         if (typeof (pending) === 'undefined') {
//             throw new Error(`pending message not found for id: ${id}
// action: ${JSON.stringify(event.data, null, '  ')}`);
//         }
//
//         const {resolve, reject} = pending;
//         if (typeof (error) !== 'undefined') {
//             reject(error)
//         }
//
//         // TODO: Branch via union discrimination instead.
//         switch (action) {
//             case SEND_TEXT:
//                 delete this.pending[id];
//                 resolve(event.data.code);
//                 break;
//             case RECV_TEXT:
//                 delete this.pending[id];
//                 resolve(event.data.text);
//                 break;
//             case SEND_FILE:
//                 this._handleSendFile(event.data)
//                 break;
//             case SEND_FILE_PROGRESS:
//                 this._handleFileProgress(event.data);
//                 break;
//             case SEND_FILE_ERROR:
//                 this._handleSendFileError(event.data)
//                 break;
//             case SEND_FILE_RESULT_OK:
//                 this._handleSendFileResultOK(event.data)
//                 break;
//             case SEND_FILE_RESULT_ERROR:
//                 this._handleSendFileResultError(event.data)
//                 break;
//             case RECV_FILE:
//                 this._handleRecvFile(event.data);
//                 break;
//             case RECV_FILE_PROGRESS:
//                 this._handleFileProgress(event.data);
//                 break;
//             case RECV_FILE_OFFER:
//                 this._handleRecvFileOffer(event.data);
//                 break;
//             case RECV_FILE_DATA:
//                 this._handleRecvFileData(event.data);
//                 break;
//             case RECV_FILE_READ_ERROR:
//                 this._handleRecvFileReadError(event.data);
//                 break;
//             default:
//                 throw new Error(`unexpected action: ${event.data.action}`)
//         }
//     }

    private _handleRecvFileData({id, n, done, buffer}: RPCMessage): void {
        // TODO: combine receiving and pending?
        const receiving = this.receiving[id];
        if (typeof (receiving) === 'undefined') {
            throw new Error(`not receiving file with id: ${id}`)
        }
        const {done: {resolve, reject}} = this.pending[id];

        try {
            const {writer} = receiving;
            writer.write(new Uint8Array(buffer).slice(0, n));

            if (done) {
                resolve();
                delete this.receiving[id];
                delete this.pending[id];
                writer.close();
            }
        } catch (error) {
            reject(error);
        }
    }

    private _handleSendFileResultOK({id}: RPCMessage): void {
        const {result: {resolve}} = this.pending[id];
        resolve();
    }

    private _handleSendFileResultError({id, error}: RPCMessage): void {
        const {result: {reject}} = this.pending[id];
        reject(error);
    }

    private _handleFileProgress({id, sentBytes, totalBytes}: RPCMessage): void {
        const {opts} = this.pending[id];
        if (typeof (opts) === 'undefined' || typeof (opts.progressFunc) === 'undefined') {
            return;
        }
        opts.progressFunc(sentBytes, totalBytes);
    }

    public async sendText(text: string): Promise<string> {
        await this.ready;
        return this.rpc!.rpc(SEND_TEXT, {text});

        // return new Promise((resolve, reject) => {
        //     const id = Date.now()
        //     const message = {
        //         action: SEND_TEXT,
        //         id,
        //         text,
        //     }
        //     this.pending[id] = {message, resolve, reject};
        //     this.port.postMessage(message)
        // })
    }

    public async recvText(code: string): Promise<string> {
        await this.ready;
        return this.rpc!.rpc(RECV_TEXT, {code});

        // return new Promise((resolve, reject) => {
        //     const id = Date.now()
        //     const message = {
        //         action: RECV_TEXT,
        //         id,
        //         code,
        //     }
        //     this.pending[id] = {message, resolve, reject};
        //     this.port.postMessage(message)
        // })
    }

    public async sendFile(file: File, opts?: TransferOptions): Promise<TransferProgress> {
        await this.ready;
        const id = Date.now()
        const buffer = await file.arrayBuffer();
        const doneProxy = new Promise<void>((resolve, reject) => {
            this.pending[id] = {
                ...this.pending[id],
                opts,
                result: {
                    resolve,
                    reject,
                }
            };
        })
        return new Promise<TransferProgress>((resolve, reject) => {
            // TODO: be more specific with types!
            this.rpc!.rpc<RPCMessage, any>(SEND_FILE, {
                id,
                buffer,
                name: file.name,
            }, [buffer])
                .then(({code}) => {
                    resolve({code, done: doneProxy});
                })
                .catch((reason) => {
                    reject(reason);
                })
        });
    }

    public async recvFile(code: string, opts?: TransferOptions): Promise<FileStreamReader> {
        return Promise.reject(new Error('not implemented'));
        // await this.ready;
        // return new Promise((resolve, reject) => {
        //     const id = Date.now()
        //     const message = {
        //         action: RECV_FILE,
        //         id,
        //         code,
        //     }
        //     this.pending[id] = {message, opts, resolve, reject};
        //     this.port.postMessage(message)
        // })
    }

    public async saveFile(code: string, opts?: TransferOptions): Promise<TransferProgress> {
        await this.ready;

        const id = Date.now()
        this.pending[id] = {
            ...this.pending[id],
            opts
        };
        const {name, size} = await new Promise((resolve, reject) => {
            const timeoutID = window.setTimeout(() => {
                reject(ErrBadCode);
            }, SENDER_TIMEOUT)
            const _resolve = (...args: any[]) => {
                window.clearTimeout(timeoutID);
                resolve(...args)
            }

            this.rpc!.rpc(RECV_FILE, {id, code})
                .then((result) => {
                    _resolve(result);
                })
                .catch(reject);
        });

        const writer = streamSaver.createWriteStream(name, {
            size,
        }).getWriter();
        this.receiving[id] = {writer};

        const done: Promise<void> = new Promise((resolve, reject) => {
            this.pending[id].done = {resolve, reject};
        });
        const accept = async (): Promise<void> => {
            return this.rpc!.rpc(RECV_FILE_DATA, {id});
        }
        return {name, size, done, accept}
    }

    public async free(): Promise<void> {
        await this.ready
        return this.rpc!.rpc(FREE);
        // await this.rpc!.rpc(FREE);
        // this.worker?.terminate();
        // return Promise.resolve();
    }
}

