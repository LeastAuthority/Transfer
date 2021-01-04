import {client} from '@/go'

export interface ClientConfig {
    rendezvousURL: string;
    transitRelayAddress: string;
    // TODO: int
    passPhraseComponentLength: number;
}

const DEFAULT_PROD_CLIENT_CONFIG: ClientConfig = {
    rendezvousURL: "ws://relay.magic-wormhole.io:4000/v1",
    transitRelayAddress: "transit.magic-wormhole.io:4001",
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

    public async recvText(code: string): Promise<string> {
        return client.recvText(this.goClient, code)
    }

    public free() {
        const err = client.free(this.goClient)
        if (!err) {
            throw err;
        }
    }
}