import {ClientConfig, ClientInterface, TransferProgress, TransferOptions, wormhole} from "@/go/wormhole/types";
import {FileReader} from '@/go/wormhole/streaming';
import Send from "@/views/Send.vue";

export const DEFAULT_PROD_CLIENT_CONFIG: ClientConfig = {
    // rendezvousURL: "wss://relay.magic-wormhole.io:4000/v1",
    // transitRelayURL: "transit.magic-wormhole.io:4001",
    // rendezvousURL: "wss://mailbox.wormhole.bryanchriswhite.com/v1",
    // transitRelayURL: "wss://relay.wormhole.bryanchriswhite.com:443",
    rendezvousURL: "wss://mailbox.winden.la.bryanchriswhite.com/v1",
    transitRelayURL: "wss://relay.winden.la.bryanchriswhite.com:443",
    passPhraseComponentLength: 2,
}

// TODO: move to own client wrapper lib


export default class Client implements ClientInterface {
    public goClient: number;

    constructor(config?: ClientConfig) {
        this.goClient = wormhole.Client.newClient(config)
    }

    public async sendText(message: string): Promise<string> {
        return wormhole.Client.sendText(this.goClient, message);
    }

    public async sendFile(file: File, opts?: TransferOptions): Promise<TransferProgress> {
        const data = new Uint8Array(await file.arrayBuffer());
        return wormhole.Client.sendFile(this.goClient, file.name, data, opts);
    }

    public async recvText(code: string): Promise<string> {
        return wormhole.Client.recvText(this.goClient, code)
    }

    public async recvFile(code: string, opts?: TransferOptions): Promise<FileReader> {
            const readerObj = await wormhole.Client.recvFile(this.goClient, code, opts);
            let bufferSizeBytes = readerObj.bufferSizeBytes;
            if (typeof (opts) !== 'undefined' && opts.bufferSizeBytes) {
                bufferSizeBytes = opts.bufferSizeBytes;
            }
            return new FileReader(bufferSizeBytes, readerObj);
    }

    public free() {
        const err = wormhole.Client.free(this.goClient)
        if (!err) {
            throw err;
        }
    }
}
