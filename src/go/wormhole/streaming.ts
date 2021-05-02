export type ReadFn = (buf: ArrayBuffer) => Promise<[number, boolean]>;

export class Reader {
    readonly read: ReadFn;
    readonly cancel?: () => void;
    readonly bufferSizeBytes: number;

    constructor(bufferSizeBytes: number, read: ReadFn, cancel?: () => void) {
        this.bufferSizeBytes = bufferSizeBytes;
        this.read = read;
        this.cancel = cancel;
    }

    async readAll(result: Uint8Array): Promise<number> {
        let readByteCount = 0;
        for (let n = 0, done = false; !done;) {
            const buffer = new Uint8Array(new ArrayBuffer(1024 * 4));
            [n, done] = await this.read(buffer);
            result.set(buffer.slice(0, n), readByteCount);
            readByteCount += n;
        }
        return readByteCount;
    }
}
