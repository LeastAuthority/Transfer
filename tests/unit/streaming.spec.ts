import Client from '@/go/wormhole/client'
import {FileStreamReader} from "@/go/wormhole/streaming";
import {initGo, newTestFile} from './util';

// TODO: test weird file sizes!
// const testFileSize = 1024 * 256 // 256KiB
const testFileSize = (1024 ** 2) * 3 // 256KiB
const testBufferSize = 1024 * 4 // 4KiB

describe('Client', () => {
    beforeAll(initGo)
    beforeAll(() => {
        // TODO: JS -> wasm dependency injection
        (global as any).FileStreamReader = FileStreamReader;
    })

    describe('#recvFile', () => {
        it('returns a reader', async () => {
            const sender = new Client()
            const file = new DataView(new ArrayBuffer(testFileSize))
            for (let i = 0; i < file.byteLength; i++) {
                file.setUint8(i, i % 255);
            }

            const _file = {
                name,
                size: testFileSize,
                arrayBuffer(): ArrayBuffer {
                    return file.buffer;
                }
            }
            const code = await sender.sendFile(_file)

            const receiver = new Client();
            const reader: FileStreamReader = await receiver.recvFile(code);

            let buf = new Uint8Array(new ArrayBuffer(testBufferSize));
            let readBytes = 0;
            for (let n = 0, done = false; !done;) {
                [n, done] = await reader.read(buf)
                let _buf = buf.subarray(0, n);

                // NB: expect buffer matches respective input subarray.
                const expected = (new Uint8Array(file.buffer)).subarray(readBytes, readBytes + n)
                expect(new Uint8Array(_buf)).toEqual(expected)

                readBytes + n === testFileSize ?
                    expect(done).toEqual(true) :
                    expect(done).toEqual(false)

                readBytes += n;
            }

            expect(readBytes).toEqual(testFileSize)
        })
    })

    describe('#saveFile', () => {
        it.skip('should ', async () => {
            const sender = new Client()
            const file = new DataView(new ArrayBuffer(testFileSize))
            for (let i = 0; i < file.byteLength; i++) {
                file.setUint8(i, i % 255);
            }
            // const file = newTestFile('test-file', testFileSize)
            // const fileBuffer = new DataView(file.arrayBuffer())
            // const tmpDir = tmp.dir();
            const tmpFile = tmp.file();
            const testFilePath = tmpFile.path;
            // const testFilePath = path.join(tmpDir, '')
            const _file = {
                name,
                size: testFileSize,
                arrayBuffer(): ArrayBuffer {
                    return file.buffer;
                }
            }
            const code = await sender.sendFile(_file)

            const receiver = new Client();
            await receiver.saveFile(code, testFilePath);

        });
    })
});

describe('FileStreamReader', () => {
    describe('#read', () => {
        it('should call the read function passed to the constructor and set done', async () => {
            const file = new DataView(new ArrayBuffer(testFileSize))
            for (let i = 0; i < file.byteLength; i++) {
                file.setUint8(i, i);
            }

            let counter = 0;
            const readFn = jest.fn().mockImplementation((buf) => {
                const dataView = new DataView(buf);
                for (let i = 0; i < testBufferSize; i++) {
                    dataView.setUint8(i, file.getUint8((testBufferSize * counter) + i));
                    if ((testBufferSize * counter) + i === file.byteLength - 1) {
                        return Promise.resolve([i + 1, true]);
                    }
                }
                counter++;
                return Promise.resolve([testBufferSize, false]);
            })

            const reader = new FileStreamReader(testBufferSize, readFn);

            const buf = new ArrayBuffer(testBufferSize);
            let readBytes = 0;
            for (let n = 0, done = false; !done;) {
                [n, done] = await reader.read(buf)

                // NB: expect buffer matches respective `file` subarray.
                const expected = (new Uint8Array(file.buffer)).subarray(readBytes, readBytes + n)
                expect(new Uint8Array(buf)).toEqual(expected)
                n < testBufferSize || readBytes + n === testFileSize ?
                    expect(done).toEqual(true) :
                    expect(done).toEqual(false)

                readBytes += n;
            }

            const bufRat = (testFileSize / testBufferSize);
            expect(readFn).toHaveBeenCalledTimes(
                Math.floor(bufRat) +
                (bufRat % 1 === 0 ? 0 : 1)
            )
            expect(readBytes).toEqual(file.byteLength)
        });
    });
})
