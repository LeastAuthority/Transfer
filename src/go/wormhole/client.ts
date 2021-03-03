import type {IClient} from '..'
import {wormhole} from '..'

export interface ClientConfig {
    rendezvousURL: string;
    transitRelayAddress: string;
    // TODO: int
    passPhraseComponentLength: number;
}

const DEFAULT_PROD_CLIENT_CONFIG: ClientConfig = {
    // rendezvousURL: "wss://relay.magic-wormhole.io:4000/v1",
    // transitRelayAddress: "transit.magic-wormhole.io:4001",
    rendezvousURL: "wss://mailbox.wormhole.bryanchriswhite.com/v1",
    transitRelayAddress: "wss:relay.wormhole.bryanchriswhite.com:443",
    passPhraseComponentLength: 2,
}

let _Client: IClient;
export default class Client {
    public goClient: number;

    constructor(config?: ClientConfig) {
        _Client = wormhole.Client

        if (!config && process.env.NODE_ENV === 'production') {
            config = DEFAULT_PROD_CLIENT_CONFIG;
        }

        this.goClient = _Client.newClient(config)
    }

    public async sendText(message: string): Promise<string> {
        return _Client.sendText(this.goClient, message);
    }

    public async sendFile(file: File): Promise<string> {
        const data = new Uint8Array(await file.arrayBuffer());
        return client.sendFile(this.goClient, file.name, data);
    }

    public async recvText(code: string): Promise<string> {
        return _Client.recvText(this.goClient, code)
    }

    public async recvFile(code: string): Promise<Uint8Array> {
        return _Client.recvFile(this.goClient, code)
    }

    public free() {
        const err = _Client.free(this.goClient)
        if (!err) {
            throw err;
        }
    }
}