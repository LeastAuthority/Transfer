declare class Go {
    constructor();
    importObject: Record<string, Record<string, RecordValue>>;
    run(instance: any):any;
}
export = Go;

export function sendTextMsg(message: string): string;
export function receiveTextMsg(code: string): string;
