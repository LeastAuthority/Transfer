import {NewTestFile} from "../e2e/support/util";
import Client from "@/go/wormhole/client";
import Go from "@/go";

import fs from 'fs';
import path from 'path';

beforeAll(async () => {
    const go = new Go();
    const wasmData = fs.readFileSync(path.join(__dirname, '..', '..', 'public', 'assets', 'wormhole.wasm'));
    await WebAssembly.instantiate(wasmData, go.importObject).then((result) => {
        go.run(result.instance);
    });
})

describe.skip('Cancellation', () => {
    const filename = 'sequential.txt';
    const testFileSize = 1024 * 256 // 256 KiB
    const testBufferSize = 1024 * 4

    describe('Send-side cancellation', () => {
        it('should do things', async () => {
            const readLimit = 1024 * 8; // 16 KiB
            const sender = new Client();
            const file = NewTestFile(filename, testFileSize);
            const {code, cancel, done} = await sender.sendFile(file as unknown as File);

            const receiver = new Client();
            const reader = await receiver.recvFile(code);
            const result = new Uint8Array(testFileSize)

            let readByteCount = 0;
            for (let n = 0, done = false; !done;) {
                const buffer = new Uint8Array(new ArrayBuffer(testBufferSize));
                try {
                    [n, done] = await reader.read(buffer);
                    result.set(buffer.slice(0, n), readByteCount);
                    readByteCount += n;

                    if (readByteCount >= readLimit) {
                        cancel();
                        break;
                    }
                } catch (error) {
                    console.error(error);
                }
            }

            await new Promise((resolve, reject) => {
                expect(readByteCount).toEqual(readLimit);

                try {
                const buffer = new Uint8Array(new ArrayBuffer(testBufferSize));
                expect(reader.read(buffer)).rejects.toThrow('unexpected EOF');
                expect(done).rejects.toThrow('context cancelled');
                } catch (error) {
                    reject(error);
                }
                resolve();
            });
        });
    })

    describe('Receive-side cancellation', () => {
        it('should do things', async () => {
            // NB: must be multiples of read buffer size.
            const readLimit = 1024 * 8; // 8 KiB
            const sender = new Client();
            const file = NewTestFile(filename, testFileSize);
            const {code, done} = await sender.sendFile(file as unknown as File);

            const receiver = new Client();
            const reader = await receiver.recvFile(code);
            const result = new Uint8Array(testFileSize)
            // const readByteCount = await reader.readAll(result)

            let readByteCount = 0;
            for (let n = 0, done = false; !done;) {
                const buffer = new Uint8Array(new ArrayBuffer(1024 * 4));
                try {
                    [n, done] = await reader.read(buffer);
                    result.set(buffer.slice(0, n), readByteCount);
                    readByteCount += n;

                    if (readByteCount >= readLimit) {
                        reader.cancel!();
                        break;
                    }
                } catch (error) {
                    console.error(error);
                }
            }

            expect(readByteCount).toEqual(readLimit);


            const buffer = new Uint8Array(new ArrayBuffer(1024 * 4));
            await expect(reader.read(buffer)).rejects.toThrow('unexpected EOF')

            // Send-side should be cancelled as well.
            // TODO: use `toThrow(<err msg>)`
            await expect(done).rejects.toBeDefined();

        });
    })
})
