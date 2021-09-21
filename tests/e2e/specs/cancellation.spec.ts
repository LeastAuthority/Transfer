import {NewTestFile, TEST_HOST} from "../support/util";
import ClientWorker from "@/go/wormhole/client_worker";
import Client from "@/go/wormhole/client";
import Go from "../../../src/go";
import fs from "fs";
import path from "path";

before(initGo)

async function initGo() {
    const go = new Go();
    await WebAssembly.instantiateStreaming(fetch(`${TEST_HOST}/assets/wormhole.wasm`), go.importObject).then((result) => {
        go.run(result.instance);
    });
}

describe('Cancellation', () => {
    describe('Send-side cancellation', () => {
        const filename = 'sequential.txt';
        const testFileSize = 1024 * 256 // 256 KiB
        const testBufferSize = 1024 * 4

        describe('Send-side cancellation', () => {
            it('should do things', async () => {
                const readLimit = 1024 * 8; // 16 KiB
                const sender = new ClientWorker();
                const file = NewTestFile(filename, testFileSize);
                const {code, cancel, done} = await sender.sendFile(file as unknown as File);
                cancel();

                expect(code).to.be.ok;

                const receiver = new Client();
                const reader = await receiver.recvFile(code!);
                const result = new Uint8Array(testFileSize)

                let readByteCount = 0;
                for (let n = 0, done = false; !done;) {
                    const buffer = new Uint8Array(new ArrayBuffer(testBufferSize));
                    try {
                        [n, done] = await reader.read(buffer);
                        result.set(buffer.slice(0, n), readByteCount);
                        readByteCount += n;

                        console.log("reading...");
                        if (readByteCount >= readLimit) {
                            console.log("cancelling!");
                            // cancel();
                            break;
                        }
                    } catch (error) {
                        console.error(error);
                    }
                }

                await new Promise(async (resolve, reject) => {
                    expect(readByteCount).to.equal(readLimit);
                    const shouldReject = function() {
                        console.log(Array.prototype.slice.apply(arguments))
                        assert(false, 'promise should be rejected');
                };

                    try {
                        const buffer = new Uint8Array(new ArrayBuffer(testBufferSize));
                        reader.read(buffer)
                            .then(shouldReject)
                            .catch((err) => {
                                expect(err.message).to.equal('unexpected EOF');
                            })
                        done
                            .then(shouldReject)
                            .catch((err) => {
                                expect(err.message).to.equal('context cancelled');
                            })
                        // await expect(reader.read(buffer)).rejects.toThrow('unexpected EOF');
                        // await expect(done).rejects.toThrow('context cancelled');
                    } catch (error) {
                        reject(error);
                    }
                    resolve();
                });
            });
        })
    })
})
