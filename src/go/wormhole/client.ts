import {client} from '@/go'

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
    transitRelayAddress: "wss://relay.wormhole.bryanchriswhite.com",
    passPhraseComponentLength: 2,
}

export default class Client {
    public goClient: number;

    constructor(config?: ClientConfig) {
        if (!config && process.env.NODE_ENV === 'production') {
            config = DEFAULT_PROD_CLIENT_CONFIG;
        }

        this.goClient = client.newClient(config)
    }

    public async sendText(message: string): Promise<string> {
        return client.sendText(this.goClient, message);
    }

    public async sendFile(file: File): Promise<string> {
        const data = new Uint8Array(await file.arrayBuffer());
        return client.sendFile(this.goClient, file.name, data);
    }

    public async recvText(code: string): Promise<string> {
        return client.recvText(this.goClient, code)
    }

    public async recvFile(code: string): Promise<Uint8Array> {
        return client.recvFile(this.goClient, code)
    }

    public free() {
        const err = client.free(this.goClient)
        if (!err) {
            throw err;
        }
    }
}