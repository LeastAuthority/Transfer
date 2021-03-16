import streamSaver from "streamsaver";

import {ClientConfig, ProgressCallback} from "@/go/wormhole/types";
import {
    ActionMessage,
    FREE,
    isAction,
    NEW_CLIENT,
    RECV_FILE, RECV_FILE_DATA,
    RECV_TEXT,
    SEND_FILE, SEND_FILE_PROGRESS,
    SEND_TEXT,
    WASM_READY
} from "@/go/wormhole/actions";
import {FileStreamReader} from "@/go/wormhole/streaming";
import {ClientInterface} from "@/go/wormhole/client";

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
            const timeoutID = setTimeout(() => {
                reject(new Error('timed out waiting for wasm to be ready!'))
            }, 1000);

            this.port.onmessage = (event: MessageEvent) => {
                if (!isAction(event.data)) {
                    reject(new Error(
                        `unexpected event: ${JSON.stringify(event, null, '  ')}`
                    ));
                }

                if (event.data.action === WASM_READY) {
                    this.goClient = event.data.goClient;
                    this.port.onmessage = (...args) => this._onMessage(...args)
                    clearTimeout(timeoutID);
                    resolve();
                    return;
                }
                reject(event.data);
            }
        });
    }

    protected async _onMessage(event: MessageEvent): Promise<void> {
        await this.ready;

        if (!isAction(event.data)) {
            throw new Error(`unexpected error: ${JSON.stringify(event, null, '  ')}`);
        }

        const {action, id, error} = event.data;
        const pending = this.pending[id];
        if (typeof (pending) === 'undefined') {
            throw new Error(`pending message not found for id: ${id}`);
        }

        const {resolve, reject} = pending;
        if (typeof (error) !== 'undefined') {
            reject(error)
        }

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
                if (typeof(pending.progressCb) === 'undefined') {
                    delete this.pending[id];
                }
                // TODO: delete in other case!

                resolve(event.data.code);
                break;
            case SEND_FILE_PROGRESS:
                this.handleSendFileProgress(event.data);
                break;
            case RECV_FILE:
                // NB: don't delete pending until file is read completely.
                this.handleRecvFile(event.data);
                break;
            case RECV_FILE_DATA:
                delete this.pending[id];
                this.handleRecvFileData(event.data);
                break;
            default:
                throw new Error(`unexpected action: ${event.data.action}`)
        }

        resolve(event.data.code);
    }

    private handleRecvFile({id, name, size}: ActionMessage): void {
        const receiving = this.receiving[id];

        // TODO: delete in done instead
        // delete this.pending[id];

        if (typeof (receiving) !== 'undefined') {
            throw new Error(`already receiving file named "${receiving.name}" with id ${id}`);
        }

        const fileStream = streamSaver.createWriteStream(name, {
            size,
        })
        const writer = fileStream.getWriter();
        this.receiving[id] = {writer};

        this.port.postMessage({
            action: RECV_FILE_DATA,
            id,
        });
    }

    private handleRecvFileData({id, buffer, n, done}: ActionMessage): void {
        const {writer} = this.receiving[id];
        // NB: must be Uint8Array.
        const _truncated = new Uint8Array(buffer.slice(0, n));
        writer.write(_truncated);

        if (done) {
            delete this.pending[id];
            writer.close();
            delete this.receiving[id];
        }
    }

    private handleSendFileProgress({id, sentBytes, totalBytes}: ActionMessage): void {
        const {progressCb} = this.pending[id];
        if (typeof(progressCb) === 'undefined') {
            return;
        }
        progressCb(sentBytes, totalBytes);
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

    public async sendFile(file: File, progressCb?: ProgressCallback): Promise<string> {
        await this.ready;
        return new Promise((resolve, reject) => {
            file.arrayBuffer().then(buffer => {
                const id = Date.now()
                const message = {
                    action: SEND_FILE,
                    id,
                    buffer,
                }
                this.pending[id] = {message, progressCb, resolve, reject};
                this.port.postMessage(message, [buffer]);
            });
        })
    }

    // TODO: remove opts
    public async recvFile(code: string, opts?: Record<string, any>): Promise<FileStreamReader> {
        await this.ready;
        return new Promise((resolve, reject) => {
            // TODO: refactor
            if (typeof (opts) === 'undefined') {
                opts = {};
            }

            const id = Date.now()
            const message = {
                action: RECV_FILE,
                id,
                code,
                name: opts.name,
                size: opts.size,
            }
            this.pending[id] = {message, resolve, reject};
            this.port.postMessage(message)
        })
    }

    public async saveFile(code: string, opts?: Record<string, any>): Promise<void> {
        // TODO: refactor
        if (typeof (opts) === 'undefined') {
            opts = {};
        }

        await this.recvFile(code, opts)
        console.log('downloaded!')
    }

    public free(): void {
        this.ready.then(() => {
            this.port.postMessage({
                action: FREE,

            })
        });
    }
}
