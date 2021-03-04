import fs from 'fs';
import path from 'path';

import Go from "@/go";
import Client from '@/go/wormhole/client'

async function initGo() {
    const go = new Go();
    const wasmPath = path.join(__dirname, '..', '..', 'public', 'assets', 'wormhole.wasm');
    await WebAssembly.instantiate(fs.readFileSync(wasmPath), go.importObject).then((result) => {
        go.run(result.instance);
    });
}

describe('Send progress', () => {
    beforeAll(initGo)

    it('increments from 0 to total size', async () => {
        const sender = new Client()
        const sizeBytes = 1024 ** 2 // 1MiB

        const progressCb = jest.fn()

        const file = {
            arrayBuffer() {
                return new ArrayBuffer(sizeBytes)
            }
        }

        const code = await sender.sendFile(file, (sentBytes: number, totalBytes: number) => {
            progressCb(sentBytes, totalBytes);
        })

        const receiver = new Client();
        await receiver.recvFile(code);
        expect(progressCb).toHaveBeenCalled();
        expect(progressCb.mock.calls.length).toBeGreaterThan(10);

        progressCb.mock.calls.reduce((prevSentBytes, curr, i, arr) => {
            const [sentBytes, totalBytes] = curr;
            expect(sentBytes).toBeGreaterThan(prevSentBytes)
            expect(totalBytes).toEqual(sizeBytes)

            return sentBytes;
        }, 0)
    })
})
