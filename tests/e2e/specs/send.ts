// https://docs.cypress.io/api/introduction/api.html

import Chainable = Cypress.Chainable;
import Go from '../../../src/go'
import Client from '@/go/wormhole/client.ts';

// function largeuint8ArrToString(uint8arr: Uint8Array) {
//     return new Promise((resolve, reject) => {
//         const bb = new Blob([uint8arr]);
//         const f = new FileReader();
//         f.onload = function (event) {
//             resolve(event.target.result);
//         };
//
//         f.readAsText(bb, 'utf-8');
//     })
// }

describe('Sender', () => {
    const filename = 'large-file.txt';

    it('gets a code when a file is selected', async () => {
        cy.viewport('samsung-note9', 'portrait')
        cy.visit('http://localhost:8080/send')

        const sendCode = await UIGetCode(filename);
        const codeParts = sendCode.split('-');
        expect(codeParts).to.have.lengthOf(3);
    })

    // TODO: figure out how to read clipboard for test without document focus
    //  -- maybe there's a browser flag / arg to loosen permissions?
    it.skip('copies a link embedding the code when copy button is clicked', () => {
        cy.viewport('samsung-note9', 'portrait')
        cy.visit('http://localhost:8080/send')

        UIGetCode(filename).then(code => {
            cy.get('.copy-button')
                .should('be.visible')
                // TODO: investigate why not working
                // .should('not.be.enabled')
                .click().then(() => {
                navigator.clipboard.readText().then(actual => {
                    expect(actual).to.eq(code);
                });
            });
        });
    })

    // it('shows send progress when the receiver connects', async () => {
    //     cy.viewport('samsung-note9', 'portrait')
    //     cy.visit('http://localhost:8080/send')
    //
    //     const sendCode = await UIGetCode();
    //     const receivedData = await mockReceive(sendCode);
    //     console.log(receivedData);
    //     const receivedText = await largeuint8ArrToString(receivedData);
    //     console.log('text: ' + receivedText);
    // })
})

function selectTestFile(filename: string): Chainable<unknown> {
    return cy.fixture('large-file.txt').then(fileContent => {
        cy.contains('ion-button', 'select')
            // TODO: doesn't test button triggers file dialog
            // TODO: can't set / test file size?
            .get('input[type="file"]')
            .attachFile({
                fileName: 'large-file.txt',
                fileContent,
            })
    });
}

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
    const metadata = await receiver.recvText(code);
    console.log(atob(metadata))
    const fileCode = JSON.parse(atob(metadata)).fileCode
    return receiver.recvFile(fileCode)
}
