// export = global;
// export interface global {
//     Go
// }
export = Go;
declare class Go {
    constructor();
    importObject: Record<string, Record<string, RecordValue>>;
    run(instance: any):any;
}