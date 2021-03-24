export type ReadFn = (buf: ArrayBuffer) => Promise<[number, boolean]>;

export class Reader {
    readonly read: ReadFn;
    readonly bufferSizeBytes: number;

    constructor(bufferSizeBytes: number, read: ReadFn) {
        this.bufferSizeBytes = bufferSizeBytes;
        this.read = read;
    }
}
