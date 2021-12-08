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

// NB: cancellation is currently a workaroudn implemented in ClientWorker and
// requires a `Worker` to test. Therefore it is an e2e test until cancellation
// gets properly integrated with wormhole-william.
describe('Cancellation', () => {
    const filename = 'sequential.txt';
    const testFileSize = 1024 * 256 // 256 KiB
    const testBufferSize = 1024 * 4

    describe('Send-side cancellation', () => {
        it('should do things', async () => {
            const readLimit = 1024 * 4; // 8 KiB
            const sender = new Client();
            const file = NewTestFile(filename, testFileSize);
            // const {code, cancel, done} = await sender.sendFile(file as unknown as File);
            const senderObj = await sender.sendFile(file as unknown as File);
            const receiver = new Client();
            const reader = await receiver.recvFile(senderObj.code);
            const result = new Uint8Array(testFileSize)

            let readByteCount = 0;
            for (let n = 0, rxDone = false; !rxDone;) {
                const buffer = new Uint8Array(new ArrayBuffer(1024 * 4));
                try {
                    [n, rxDone] = await reader.read(buffer);
                    result.set(buffer.slice(0, n), readByteCount);
                    readByteCount += n;

                    if (readByteCount >= readLimit) {
                        break;
                    }
                } catch (error) {
                    console.log(`ERROR | n: ${n} | rxdone: ${rxDone}`);
                    console.error(error);
                }
            }

            try {
                senderObj.cancel();
            } catch (error) {
                console.log("ERROR");
                console.error(error);
            }

            const buffer = new Uint8Array(new ArrayBuffer(testBufferSize));
            expect(readByteCount).toEqual(readLimit);

            await expect(senderObj.done).rejects.toBe('context canceled');
            // console.log(senderObj.done);
            // TODO: get reader to reject with context cancellation error
            // expect(reader.read(buffer)).rejects.toThrow('context cancelled');
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
            let rxDone = false;
            for (let n = 0, rxDone = false; !rxDone;) {
                const buffer = new Uint8Array(new ArrayBuffer(1024 * 4));
                try {
                    [n, rxDone] = await reader.read(buffer);
                    result.set(buffer.slice(0, n), readByteCount);
                    readByteCount += n;

                    if (readByteCount >= readLimit) {
                        break;
                    }
                } catch (error) {
                    console.error("got an error in this place", error);
                }
            }

            expect(readByteCount).toEqual(readLimit);
            reader.cancel!();

            const buffer = new Uint8Array(new ArrayBuffer(1024 * 20));
            await expect(reader.read(buffer)).rejects.toBe("context canceled")

            // // Send-side should be cancelled as well.
            // // TODO: use `toThrow(<err msg>)`
            await expect(done).rejects.toEqual("failed to read: WebSocket closed: status = StatusAbnormalClosure and reason = \"\"");

        });
    })
})
