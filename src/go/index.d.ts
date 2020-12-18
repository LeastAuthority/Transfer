declare class Go {
    constructor();
    importObject: Record<string, Record<string, RecordValue>>;
    run(instance: any):any;
}
export = Go;

export interface PromiseObject {
    resolve(value?: (PromiseLike<T> | T)): void;
    reject(reason?: any): void;
}

export function sendTextMsg(message: string, p: PromiseObject): void;
export function receiveTextMsg(code: string, p: PromiseObject): void;
