import Go from '../../../src/go'
import Client from '@/go/wormhole/client.ts';
import {TEST_HOST} from "../support/util";
import {largeUint8ArrToString} from "../support/util";

describe('Sender', () => {
    const filename = 'large-file.txt';
    // const filename = 'small-file.txt';

    it('gets a code when a file is selected', (done) => {
        cy.viewport('samsung-note9', 'portrait')
        cy.visit('/send')

        UIGetCode(filename).then(sendCode => {
            const codeParts = sendCode.split('-');
            expect(codeParts).to.have.lengthOf(3);
            done();
        })
    })

    // TODO: figure out how to read clipboard for test without document focus
    //  -- maybe there's a browser flag / arg to loosen permissions?
    it('copies a link embedding the code when copy button is clicked', (done) => {
        cy.viewport('samsung-note9', 'portrait')
        cy.visit('/send')

        UIGetCode(filename).then(code => {
            cy.get('.copy-button')
                .should('be.visible')
                // TODO: investigate why not working as expected
                // .should('not.be.enabled')
                .click()
                .task('readClipboard').then(actual => {
                expect(actual).to.eq(`${TEST_HOST}/receive/${code}`);
                done();
            })
        });
    });

    it.skip('shows send progress when the receiver connects', (done) => {
        cy.viewport('samsung-note9', 'portrait')
        cy.visit('/send')

        UIGetCode(filename).then(sendCode => {
            mockReceive(sendCode).then(receivedData => {
                console.log(receivedData);
                largeUint8ArrToString(receivedData).then(receivedText => {
                    // TODO: add assertions!
                    console.log('text: ' + receivedText);
                    done();
                });
            });
        });
    })
})

// function selectTestFile(filename: string): Chainable<unknown> {
//     return cy.fixture('large-file.txt').then(fileContent => {
//         cy.contains('ion-button', 'select')
//             // TODO: doesn't test button triggers file dialog
//             // TODO: can't set / test file size?
//             .get('input[type="file"]')
//             .attachFile({
//                 fileName: 'large-file.txt',
//                 fileContent,
//             })
//     });
// }

// TODO: refactor (application actions / page objects?)
async function UIGetCode(filename: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        cy.fixture(filename).then(fileContent => {
            cy.contains('ion-button', 'select')
                // TODO: doesn't test button triggers file dialog
                // TODO: can't set / test file size?
                .get('input[type="file"]')
                .attachFile({
                    fileName: 'large-file.txt',
                    fileContent,
                })
                .get('.send-code-input>input')
                .should('not.have.value', '')
                .then(el => {
                    resolve((el[0] as HTMLInputElement).value);
                })
        })
    });
}

async function mockReceive(code: string): Promise<Uint8Array> {
    const go = new Go();
    await WebAssembly.instantiateStreaming(fetch("http://localhost:8080/assets/wormhole.wasm"), go.importObject).then((result) => {
        go.run(result.instance);
    });

    const receiver = new Client();
    // TODO: cleanup
    let size: number;
    const offerCondition = (offer: Record<string, any>, accept: ()=>void, reject: ()=>Error): void => {
        size = offer.size;
    }
    const reader = await receiver.recvFile(code, {
        offerCondition,
    });
    // @ts-ignore
    const result = new Uint8Array(size)
    for (let n = 0, accBytes = 0, done = false; !done;) {
        const buffer = new Uint8Array(new ArrayBuffer(1024 * 4));
        [n, done] = await reader.read(buffer);
        console.log(`mockReceive| n: ${n} | done: ${done}`);
        result.set(buffer.slice(0, n), accBytes);
        accBytes += n - 1;
    }
    return result;
}
