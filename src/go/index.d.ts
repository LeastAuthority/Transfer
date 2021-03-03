import _Client, {ClientConfig, ProgressCallback} from "@/go/wormhole/client";

declare class Go {
    constructor();
    importObject: Record<string, Record<string, RecordValue>>;
    run(instance: any):any;
}
export default Go;

declare interface IWormhole {
    Client: _Client
}

export interface IClient {
    newClient(config?: ClientConfig): number
    sendText(goClient: number, message: string): Promise<string>
    sendFile(goClient: number, fileName: string, fileData: Uint8Array, progressCb?: ProgressCallback): Promise<string>
    recvText(goClient: number, code: string): Promise<string>
    recvFile(goClient: number, code: string): Promise<Uint8Array>
    free(goClient: number): string | undefined
}

// TODO: something better!
// NB: dynamic import workaround
export const wormhole;

// export const Client = Client;
