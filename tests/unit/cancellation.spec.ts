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

describe('Cacnellation', () => {
    const filename = 'sequential.txt';
    const testFileSize = 1024 * 256 // 256 KiB

    describe('Send-side cancellation', () => {
        it('should do things', async () => {
            const sender = new Client();
            const file = NewTestFile(filename, testFileSize);
            const {code, cancel, done} = await sender.sendFile(file as unknown as File);

            const receiver = new Client();
            const reader = await receiver.recvFile(code);
            const result = new Uint8Array(testFileSize)
            const readByteCount = await reader.readAll(result)

            expect(readByteCount).toEqual(testFileSize);
            expect(result).toEqual(new Uint8Array(file.data.buffer))
        });
    })
})
