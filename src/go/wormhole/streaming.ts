declare type ReadFn = (buf: ArrayBuffer) => Promise<[number, boolean]>;

// TODO: JS -> wasm dependency injection
export class FileStreamReader {
    // NB: read function is replaced in the constructor.
    read(_: ArrayBuffer): Promise<[number, boolean]> {
        return Promise.resolve([0, true]);
    }

    constructor(bufSize: number, readFn: ReadFn) {
        this.read = readFn;
    }
}
