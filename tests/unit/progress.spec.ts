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
        const data = 'testing 123'

        const progressCb = jest.fn()

        const file = {
            arrayBuffer() {
                const enc = new TextEncoder();
                return enc.encode(data);
            }
        }

        const code = await sender.sendFile(file, (sentBytes: number, totalBytes: number) => {
            progressCb(sentBytes, totalBytes);
        })

        const receiver = new Client();
        await receiver.recvFile(code);
        expect(progressCb).toHaveBeenCalled();
    })
})

async function mockSend(name: string, data: string): Promise<string> {
    const sender = new Client();
    const file = {
        arrayBuffer() {
            const enc = new TextEncoder();
            return enc.encode(data);
        }
    }
    return await sender.sendFile(file);
}
