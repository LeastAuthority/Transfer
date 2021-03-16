import {ClientConfig, ProgressCallback, wormhole} from "@/go/wormhole/types";
import {FileStreamReader} from '@/go/wormhole/streaming';

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

    recvFile(code: string, opts?: Record<string, any>): Promise<FileStreamReader>;

    free(): void;
}


export default class Client implements ClientInterface {
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

    public async recvFile(code: string, opts?: Record<string, any>): Promise<FileStreamReader> {
        return wormhole.Client.recvFile(this.goClient, code)
    }

    public free() {
        const err = wormhole.Client.free(this.goClient)
        if (!err) {
            throw err;
        }
    }
}
