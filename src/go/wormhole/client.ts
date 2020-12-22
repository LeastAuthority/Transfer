import {client} from '@/go'

export interface ClientConfig {
    rendezvousURL: string;
    transitRelayAddress: string;
    // TODO: int
    passPhraseComponentLength: number;
}

export default class Client {
    public goClient: number;

    public sendText(message: string): Promise<string> {
        return client.sendText(this.goClient, message);
    }

    public recvText(code: string): Promise<string> {
        return client.recvText(this.goClient, code)
    }

    public free() {
        const err = client.free(this.goClient)
        if (!err) {
            throw err;
        }
    }

    constructor(config?: ClientConfig) {
        this.goClient = client.newClient(config)
    }

}