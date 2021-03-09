import Client from '@/go/wormhole/client'
import {initGo, newTestFile} from './util';

describe('Send progress', () => {
    beforeAll(initGo)

    it('increments from 0 to total size', async () => {
        const sender = new Client()
        const sizeBytes = 1024 ** 2 // 1MiB
        const file = newTestFile('test-file', sizeBytes)

        const progressCb = jest.fn()
        const code = await sender.sendFile(file, progressCb)

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
