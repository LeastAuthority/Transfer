// TODO: declare local interface instead of import?
import {Reader} from "@/go/wormhole/streaming";

export type ProgressFunc = (sentBytes: number, totalBytes: number) => void

export interface Offer {
    name: string;
    size: number;
    accept?: () => Promise<Error>;
    reject?: () => Promise<Error>;
}

export type OfferCondition = (offer: Offer) => void

export interface TransferOptions {
    progressFunc?: ProgressFunc;
    offerCondition?: OfferCondition;
    code?: string;

    // TODO: keep?
    bufferSizeBytes?: number;

    // TODO: refactor
    name?: string;
    size?: number;
}

export interface SendResult {
    code: string;
    done: Promise<void>;

    cancel(): void;
}

export interface ClientInterface {
    // TODO: readonly or at least protected.
    goClient: number;

    sendText(msg: string): Promise<string>;

    recvText(code: string): Promise<string>;

    sendFile(file: File, opts?: TransferOptions): Promise<SendResult>;

    recvFile(code: string, opts?: TransferOptions): Promise<Reader>;

    free(): void;
}


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
