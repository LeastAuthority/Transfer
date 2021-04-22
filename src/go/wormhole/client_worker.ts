import streamSaver from 'streamsaver';

import {ClientConfig} from "@/go/wormhole/types";
import {
    ActionMessage,
    FREE,
    isAction,
    NEW_CLIENT,
    RECV_FILE,
    RECV_FILE_DATA,
    RECV_FILE_OFFER,
    RECV_FILE_OFFER_ACCEPT,
    RECV_FILE_OFFER_REJECT,
    RECV_FILE_PROGRESS, RECV_FILE_READ_ERROR,
    RECV_TEXT,
    SEND_FILE,
    SEND_FILE_ERROR,
    SEND_FILE_PROGRESS, SEND_FILE_RESULT_ERROR,
    SEND_FILE_RESULT_OK,
    SEND_TEXT,
    WASM_READY
} from "@/go/wormhole/actions";
import {Reader} from "@/go/wormhole/streaming";
import {ClientInterface, SendResult, TransferOptions} from "@/go/wormhole/client";

export default class ClientWorker implements ClientInterface {
    public goClient = -1;
    // TODO: be more specific
    protected pending: Record<number, any> = {};
    protected receiving: Record<number, any> = {};
    protected ready: Promise<void>;
    protected port: MessagePort;

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
            // TODO: remove?
            // const timeoutID = setTimeout(() => {
            //     reject(new Error('timed out waiting for wasm to be ready!'))
            // }, 1000);

            this.port.onmessage = (event: MessageEvent) => {
                if (!isAction(event.data)) {
                    reject(new Error(
                        `unexpected event: ${JSON.stringify(event, null, '  ')}`
                    ));
                }

                if (event.data.action === WASM_READY) {
                    this.goClient = event.data.goClient;
                    this.port.onmessage = (...args) => this._onMessage(...args)
                    // clearTimeout(timeoutID);
                    resolve();
                    return;
                }
                reject(event.data);
            }
        });
    }

    protected async _onMessage(event: MessageEvent): Promise<void> {
        await this.ready;
        // console.log(`client_worker:70| _onMessage called with msg: ${JSON.stringify(event, null, '  ')}`)

        if (!isAction(event.data)) {
            throw new Error(`unexpected error: ${JSON.stringify(event, null, '  ')}`);
        }

        const {action, id, error} = event.data;
        const pending = this.pending[id];
        if (typeof (pending) === 'undefined') {
            throw new Error(`pending message not found for id: ${id}
action: ${JSON.stringify(event.data, null, '  ')}`);
        }

        const {resolve, reject} = pending;
        if (typeof (error) !== 'undefined') {
            reject(error)
        }

        // TODO: Branch via union discrimination instead.
        switch (action) {
            case SEND_TEXT:
                delete this.pending[id];
                resolve(event.data.code);
                break;
            case RECV_TEXT:
                delete this.pending[id];
                resolve(event.data.text);
                break;
            case SEND_FILE:
                this._handleSendFile(event.data)
                break;
            case SEND_FILE_PROGRESS:
                this._handleFileProgress(event.data);
                break;
            case SEND_FILE_ERROR:
                this._handleSendFileError(event.data)
                break;
            case SEND_FILE_RESULT_OK:
                this._handleSendFileResultOK(event.data)
                break;
            case SEND_FILE_RESULT_ERROR:
                this._handleSendFileResultError(event.data)
                break;
            case RECV_FILE:
                this._handleRecvFile(event.data);
                break;
            case RECV_FILE_PROGRESS:
                this._handleFileProgress(event.data);
                break;
            case RECV_FILE_OFFER:
                this._handleRecvFileOffer(event.data);
                break;
            case RECV_FILE_DATA:
                this._handleRecvFileData(event.data);
                break;
            case RECV_FILE_READ_ERROR:
                this._handleRecvFileReadError(event.data);
                break;
            default:
                throw new Error(`unexpected action: ${event.data.action}`)
        }

        // resolve(event.data.code);
    }

    private _handleRecvFile({id}: ActionMessage): void {
        this.port.postMessage({
            action: RECV_FILE_DATA,
            id,
        });
    }

    private _handleSendFile({id, code}: ActionMessage): void {
        const {resolve} = this.pending[id];
        resolve({
            code,
            result: new Promise((resolve, reject) => {
                this.pending[id].result = {resolve, reject};
            })
        });
    }

    private _handleSendFileResultOK({id}: ActionMessage): void {
        const {result: {resolve}} = this.pending[id];
        resolve();
    }

    private _handleSendFileResultError({id, error}: ActionMessage): void {
        const {result: {reject}} = this.pending[id];
        reject(error);
    }

    private _handleRecvFileData({id, n, done, buffer}: ActionMessage): void {
        const receiving = this.receiving[id];
        if (typeof (receiving) === 'undefined') {
            throw new Error(`not receiving file with id: ${id}`)
        }

        const {writer} = receiving;
        writer.write(new Uint8Array(buffer).slice(0, n));

        if (done) {
            delete this.receiving[id];
            delete this.pending[id];
            writer.close();
        }
    }

    private _handleFileProgress({id, sentBytes, totalBytes}: ActionMessage): void {
        const {opts} = this.pending[id];
        if (typeof (opts) === 'undefined' || typeof (opts.progressFunc) === 'undefined') {
            return;
        }
        opts.progressFunc(sentBytes, totalBytes);
    }

    private _handleRecvFileOffer({id, offer}: ActionMessage) {
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

        // TODO: fix; currently ignoring error because async
        // const accept = (): Promise<Error> => {
        const accept = () => {
            this.port.postMessage({
                action: RECV_FILE_OFFER_ACCEPT,
                id,
            })
        }
        // TODO: fix; currently ignoring error because async
        // const reject = (): Promise<Error> => {
        const reject = () => {
            this.port.postMessage({
                action: RECV_FILE_OFFER_REJECT,
                id,
            })
        }
        opts.offerCondition({...offer, accept, reject});
    }

    private _handleRecvFileReadError({id, error}: ActionMessage) {
        const {reject} = this.pending[id];
        reject(error);
    }

    private _handleSendFileError({id, error}: ActionMessage) {
        const {reject} = this.pending[id];
        reject(error);
    }

    public async sendText(text: string): Promise<string> {
        await this.ready;
        return new Promise((resolve, reject) => {
            const id = Date.now()
            const message = {
                action: SEND_TEXT,
                id,
                text,
            }
            this.pending[id] = {message, resolve, reject};
            this.port.postMessage(message)
        })
    }

    public async recvText(code: string): Promise<string> {
        await this.ready;
        return new Promise((resolve, reject) => {
            const id = Date.now()
            const message = {
                action: RECV_TEXT,
                id,
                code,
            }
            this.pending[id] = {message, resolve, reject};
            this.port.postMessage(message)
        })
    }

    public async sendFile(file: File, opts?: TransferOptions): Promise<SendResult> {
        await this.ready;
        return new Promise((resolve, reject) => {
            file.arrayBuffer().then(buffer => {
                const id = Date.now()
                const message = {
                    action: SEND_FILE,
                    id,
                    buffer,
                    name: file.name,
                }
                this.pending[id] = {message, opts, resolve, reject};
                this.port.postMessage(message, [buffer]);
            });
        })
    }

    public async recvFile(code: string, opts?: TransferOptions): Promise<Reader> {
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

    public async saveFile(code: string, opts?: TransferOptions): Promise<void> {
        await this.recvFile(code, opts)
    }

    public free(): void {
        this.ready.then(() => {
            this.port.postMessage({
                action: FREE,
            })
        });
    }
}

