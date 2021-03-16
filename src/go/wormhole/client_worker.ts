import streamSaver from "streamsaver";

import {ClientConfig, ProgressCallback} from "@/go/wormhole/types";
import {
    FREE,
    isAction,
    NEW_CLIENT,
    RECV_FILE,
    RECV_TEXT,
    SEND_FILE,
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
                delete this.pending[id];
                resolve(event.data.code);
                break;
            case RECV_FILE:
                // TODO: delete in done instead?
                delete this.pending[id];

                if (typeof (this.receiving[id]) === 'undefined') {
                    const fileStream = streamSaver.createWriteStream(event.data.name, {
                        size: event.data.size,
                    })

                    const writer = fileStream.getWriter();
                    this.receiving[id] = {writer};
                }

                this.receiving[id].writer.write(new Uint8Array(event.data.buffer.slice(0, event.data.n)));

                if (event.data.done) {
                    this.receiving[id].writer.close();
                    delete this.receiving[id];
                }
                break;
            default:
                throw new Error(`unexpected action: ${event.data.action}`)
        }

        resolve(event.data.code);
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
                this.pending[id] = {message, resolve, reject};
                this.port.postMessage(message, [buffer]);
            });
        })
    }

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
            // TODO: potentially create streamsaver writable stream
            //  here (on user action).
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
