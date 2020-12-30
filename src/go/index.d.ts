import {ClientConfig} from "@/go/wormhole/client";

declare class Go {
    constructor();
    importObject: Record<string, Record<string, RecordValue>>;
    run(instance: any):any;
}
export = Go;

declare interface ClientInterface {
    newClient(config?: ClientConfig): number
    sendText(goClient: number, message: string): Promise<string>
    recvText(goClient: number, code: string): Promise<string>
    free(goClient: number): string | undefined
}
export const client: ClientInterface;
