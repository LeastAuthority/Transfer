import streamSaver from 'streamsaver';

import {
    RPCMessage,
    FREE,
    isAction,
    NEW_CLIENT,
    RECV_FILE,
    RECV_FILE_DATA,
    RECV_FILE_OFFER,
    RECV_FILE_OFFER_ACCEPT,
    RECV_FILE_OFFER_REJECT,
    RECV_FILE_PROGRESS, RECV_FILE_READ,
    RECV_FILE_READ_ERROR,
    RECV_TEXT,
    SEND_FILE,
    SEND_FILE_CANCEL,
    SEND_FILE_ERROR,
    SEND_FILE_PROGRESS,
    SEND_FILE_RESULT_ERROR,
    SEND_FILE_RESULT_OK,
    SEND_TEXT,
    WASM_READY
} from "@/store/actions";
import {FileReader} from "@/go/wormhole/streaming";
import {ClientConfig, ClientInterface, TransferProgress, TransferOptions, wormhole} from "@/go/wormhole/types";
import {errReceiveNoSender} from "@/errors";
import {RpcProvider} from "worker-rpc";

export default class ClientWorker implements ClientInterface {
    public goClient = -1;
    // TODO: be more specific
    protected pending: Record<number, any> = {};
    protected receiving: Record<number, any> = {};
    protected ready: Promise<void>;
    protected port: MessagePort;
    protected rpc: RpcProvider | undefined = undefined;

    constructor(config?: ClientConfig) {
        const wasmWorker = new Worker(`${window.location.origin}/worker/index.umd.js`);

        const channel = new MessageChannel();
        this.port = channel.port1;

        // NB: send client config and remote channel port to worker.
        wasmWorker.postMessage({
            action: NEW_CLIENT,
            id: Date.now(),
            config,
        }, [channel.port2])

        // NB: wait for wasm module to be ready before listening to all events.
        this.ready = new Promise((resolve, reject) => {
            this.port.onmessage = (event: MessageEvent) => {
                if (!isAction(event.data)) {
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
                    this.port.onmessage = (event) => this.rpc!.dispatch(event.data);

                    // this.port.onmessage = (...args) => this._onMessage(...args)
                    resolve();
                    return;
                }
                reject(event.data);
            }
        });
    }

    protected _registerRPCHandlers() {
        // rpc.registerRpcHandler<RPCMessage, void>(SEND_FILE, this._handleSendFile)
        this.rpc!.registerRpcHandler<RPCMessage, void>(SEND_FILE_PROGRESS, this._handleFileProgress.bind(this));
        // rpc.registerRpcHandler<RPCMessage, void>(SEND_FILE_ERROR, this._handleSendFileError)
        this.rpc!.registerSignalHandler<RPCMessage>(SEND_FILE_RESULT_OK, this._handleSendFileResultOK.bind(this));
        this.rpc!.registerSignalHandler<RPCMessage>(SEND_FILE_RESULT_ERROR, this._handleSendFileResultError.bind(this));
        // rpc.registerRpcHandler<RPCMessage, void>(RECV_FILE, this._handleRecvFile)
        this.rpc!.registerRpcHandler<RPCMessage, void>(RECV_FILE_PROGRESS, this._handleFileProgress.bind(this));
        // this.rpc!.registerRpcHandler<RPCMessage, void>(RECV_FILE_OFFER, this._handleRecvFileOffer)
        this.rpc!.registerRpcHandler<RPCMessage, void>(RECV_FILE_DATA, this._handleRecvFileData.bind(this));
        // rpc.registerRpcHandler<RPCMessage, void>(RECV_FILE_READ_ERROR, this._handleRecvFileReadError)
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

    private _handleSendFile({id, code}: RPCMessage): void {
        const {resolve} = this.pending[id];
        resolve({
            code,
            cancel: () => {
                this.port.postMessage({
                    action: SEND_FILE_CANCEL,
                    id,
                })
            },
            done: new Promise((resolve, reject) => {
                this.pending[id].result = {resolve, reject};
            })
        });
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

    private async _handleRecvFileOffer({id, offer}: RPCMessage): Promise<void> {
        const {opts} = this.pending[id];
        // this.pending[id].offer = offer;
        const {name, size} = offer;
        const writer = streamSaver.createWriteStream(name, {
            size,
        }).getWriter();
        this.receiving[id] = {writer};
        if (typeof (opts) === 'undefined' || typeof (opts.offerCondition) === 'undefined') {
            return;
        }

        return new Promise((resolve, reject) => {
            // TODO: fix; currently ignoring error because async
            // const accept = (): Promise<Error> => {
            const accept = async () => {
                await this.rpc!.rpc(RECV_FILE_OFFER_ACCEPT)
                resolve();
                // this.port.postMessage({
                //     action: RECV_FILE_OFFER_ACCEPT,
                //     id,
                // })
            }
            // TODO: fix; currently ignoring error because async
            // const reject = (): Promise<Error> => {
            const rejectTransfer = (reason: any) => {
                reject(reason)
                // this.port.postMessage({
                //     action: RECV_FILE_OFFER_REJECT,
                //     id,
                // })
            }
            opts.offerCondition({...offer, accept, reject: rejectTransfer});
        });
    }

    private _handleRecvFileReadError({id, error}: RPCMessage) {
        const {reject} = this.pending[id].done;
        reject(error);
    }

    private _handleSendFileError({id, error}: RPCMessage) {
        const {reject} = this.pending[id];
        reject(error);
    }

    private _handleRecvFile({id, bufferSize}: RPCMessage) {
        const {resolve} = this.pending[id];
        resolve()
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
            this.rpc!.rpc<any, any>(SEND_FILE, {
                id,
                buffer,
                name: file.name,
            }, [buffer])
                .then(({code}) => {
                    resolve({code, done: doneProxy});
                })
                .catch(reject)
        });
        // return new Promise((resolve, reject) => {
        //     file.arrayBuffer().then(buffer => {
        //         const id = Date.now()
        //         const message = {
        //             action: SEND_FILE,
        //             id,
        //             buffer,
        //             name: file.name,
        //         }
        //         this.pending[id] = {message, opts, resolve, reject};
        //         this.port.postMessage(message, [buffer]);
        //     });
        // })
    }

    public async recvFile(code: string, opts?: TransferOptions): Promise<FileReader> {
        await this.ready;
        return new Promise((resolve, reject) => {
            const id = Date.now()
            const message = {
                action: RECV_FILE,
                id,
                code,
            }
            this.pending[id] = {message, opts, resolve, reject};
            this.port.postMessage(message)
        })
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
                reject(errReceiveNoSender);
            }, 2000)
            const _resolve = (...args: any[]) => {
                window.clearTimeout(timeoutID);
                resolve(...args)
            }

            // this.pending[id] = {
            //     ...this.pending[id],
            //     opts, resolve, reject
            // };
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
        console.log(`assigning this.receiving[${id}]`);

        const done: Promise<void> = new Promise((resolve, reject) => {
            this.pending[id].done = {resolve, reject};
        });
        const accept = async (): Promise<Error> => {
            return this.rpc!.rpc(RECV_FILE_DATA, {id});
        }
        return {name, size, done, accept}
    }

    public async free(): Promise<void> {
        await this.ready
        return this.rpc!.rpc(FREE);
    }
}

