// TODO: declare local interface instead of import?
import {Reader} from "@/go/wormhole/streaming";
import {SendResult, TransferOptions} from "@/go/wormhole/client";

export interface WindowWormhole {
    Client: WindowClient;
}

export interface WindowClient {
    newClient(config?: ClientConfig): number;

    sendText(goClient: number, message: string): Promise<string>;

    sendFile(goClient: number, fileName: string, fileData: Uint8Array, opts?: TransferOptions): Promise<SendResult>;

    recvText(goClient: number, code: string): Promise<string>;

    recvFile(goClient: number, code: string, opts?: TransferOptions): Promise<Reader>;

    free(goClient: number): string | undefined;
}

export interface ClientConfig {
    rendezvousURL: string;
    transitRelayURL: string;
    // TODO: int
    passPhraseComponentLength: number;
}

export const wormhole: WindowWormhole = new Proxy({Client: {} as WindowClient}, {
    get(target, prop, receiver) {
        switch (prop) {
            case 'Client':
                return (globalThis as any).Wormhole.Client
        }
    }
});
