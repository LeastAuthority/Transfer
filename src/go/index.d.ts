import {ClientConfig} from "@/go/wormhole/client";

declare class Go {
    constructor();
    importObject: Record<string, Record<string, RecordValue>>;
    run(instance: any):any;
}
export = Go;

// export function newWormholeClient(config?: ClientConfig): number;
// export function ObjectSet(obj: Object, exportName: string, propertyName: string)
// export function clientSendText(message: string): Promise<string>;
// export function clientRecvText(code: string): Promise<string>;
// export function clientFree(): void;
declare interface ClientInterface {
    newClient(config?: ClientConfig): number
    sendText(goClient: number, message: string): Promise<string>
    recvText(goClient: number, code: string): Promise<string>
    free(goClient: number): string | undefined
}
export const client: ClientInterface;
