import {ClientConfig, ProgressCallback, wormhole} from "@/go/wormhole/types";
import {FileStreamReader} from '@/go/wormhole/streaming';
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

const DEFAULT_PROD_CLIENT_CONFIG: ClientConfig = {
    // rendezvousURL: "wss://relay.magic-wormhole.io:4000/v1",
    // transitRelayAddress: "transit.magic-wormhole.io:4001",
    rendezvousURL: "wss://mailbox.wormhole.bryanchriswhite.com/v1",
    transitRelayAddress: "wss://relay.wormhole.bryanchriswhite.com:443",
    passPhraseComponentLength: 2,
}

export interface ClientInterface {
    // TODO: readonly or at least protected.
    goClient: number;

    sendText(msg: string): Promise<string>;

    recvText(code: string): Promise<string>;

    sendFile(file: File, progressCb?: ProgressCallback): Promise<string>;

    recvFile(code: string): Promise<FileStreamReader>;

    free(): void;
}

export default class ClientWorker implements ClientInterface {
    public goClient = -1;
    protected pending: Record<number, any> = {};
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
                resolve(event.data.code);
                break;
            case RECV_TEXT:
                resolve(event.data.text);
                break;
            case SEND_FILE:
                resolve(event.data.code);
                break;
            case RECV_FILE:
                console.log('RECV_FILE not yet implemented in client.ts');
                // resolve(event.data.code);
                break;
            // case FREE:
            //     resolve();
            //     break;
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

    public async recvFile(code: string): Promise<FileStreamReader> {
        await this.ready;
        return new Promise((resolve, reject) => {
            const id = Date.now()
            const message = {
                action: RECV_FILE,
                id,
            }
            // TODO: potentially create streamsaver writable stream
            //  here (on user action).
            this.pending[id] = {message, resolve, reject};
            this.port.postMessage(message)
        })
    }

    public free(): void {
        this.ready.then(() => {
            this.port.postMessage({
                action: FREE,

            })
        });
    }
}

export class Client implements ClientInterface {
    public goClient: number;

    constructor(config?: ClientConfig) {
        if (!config && process.env.NODE_ENV === 'production') {
            config = DEFAULT_PROD_CLIENT_CONFIG;
        }

        this.goClient = wormhole.Client.newClient(config)
    }

    public async sendText(message: string): Promise<string> {
        return wormhole.Client.sendText(this.goClient, message);
    }

    public async sendFile(file: File, progressCb?: ProgressCallback): Promise<string> {
        const data = new Uint8Array(await file.arrayBuffer());
        return wormhole.Client.sendFile(this.goClient, file.name, data, progressCb);
    }

    public async recvText(code: string): Promise<string> {
        return wormhole.Client.recvText(this.goClient, code)
    }

    public async recvFile(code: string): Promise<FileStreamReader> {
        return wormhole.Client.recvFile(this.goClient, code)
    }

    public free() {
        const err = wormhole.Client.free(this.goClient)
        if (!err) {
            throw err;
        }
    }
}
