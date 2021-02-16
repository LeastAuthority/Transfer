import Go from '../../../src/go'
import Client from '@/go/wormhole/client.ts';
import {expectFileDownloaded, expectReceiveConfirm, mobileViewport} from "../support/util";
import {TEST_HOST} from "../support/util";


before(initGo)
after(() => cy.task('clearDownloads'))
async function initGo() {
    const go = new Go();
    await WebAssembly.instantiateStreaming(fetch("http://localhost:8080/assets/wormhole.wasm"), go.importObject).then((result) => {
        go.run(result.instance);
    });
}

describe('Receive', () => {
    const filename = 'small-file.txt';
    beforeEach(() => cy.task('clearDownloads'))

    it('via typed code', (done) => {
        mobileViewport();

        cy.visit('/receive')
        cy.fixture(filename).then(async (file: string) => {
            const code = await mockSend(filename, file)
            UIEnterCode(code).then(() => {
                expectReceiveConfirm(code).then(() => {
                    expectFileDownloaded(filename, file).then(() => {
                        done();
                    });
                });
            });
        });
    });

    it('via code URL', (done) => {
        mobileViewport();

        cy.fixture(filename).then(async (file: string) => {
            const code = await mockSend(filename, file);
            console.log(code);
            cy.visit(`/receive/${code}`)
            expectReceiveConfirm(code).then(() => {
                expectFileDownloaded(filename, file).then(() => {
                    done();
                });
            });
        });
    });
});

async function UIEnterCode(code: string) {
    cy.get('input[type="text"]')
        .type(code)

    cy.get('.receive-next')
        .click()
}

async function mockSend(name: string, data: string): Promise<string> {
    const sender = new Client();
    // const _file = {
    //     arrayBuffer() {
    //         console.log('encoding...')
    //         const enc = new TextEncoder();
    //         return enc.encode(data);
    //     }
    // }
    // return sender.sendFile(_file);

    const fileCode = await sender.sendText(`data:text/plain;base64,${btoa(data)}`);
    const fileStats = btoa(JSON.stringify({
        name,
        // size: this.file.size,
        fileCode,
    }));
    return sender.sendText(fileStats)
}
