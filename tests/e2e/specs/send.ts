// https://docs.cypress.io/api/introduction/api.html

import Go from '../../../src/go'
import Client from '@/go/wormhole/client.ts';

// describe('Mobile portrait', () => {
//     cy.visit('http://localhost:8080/send')
//     cy.viewport('samsung-note9', 'portrait')
// })
function largeuint8ArrToString(uint8arr: Uint8Array) {
    return new Promise((resolve, reject) => {
        const bb = new Blob([uint8arr]);
        const f = new FileReader();
        f.onload = function (event) {
            resolve(event.target.result);
        };

        f.readAsText(bb, 'utf-8');
    })
}


describe('Sender', () => {
    it('gets a code when a file is selected', async () => {
        cy.viewport('samsung-note9', 'portrait')
        cy.visit('http://localhost:8080/send')

        const sendCode = await UIGetCode();
        const codeParts = sendCode.split('-');
        expect(codeParts).to.have.lengthOf(3);
    })

    it.skip('shows send progress when the receiver connects', async () => {
        cy.viewport('samsung-note9', 'portrait')
        cy.visit('http://localhost:8080/send')

        const sendCode = await UIGetCode();
        const receivedData = await mockReceive(sendCode);
        console.log(receivedData);
        const receivedText = await largeuint8ArrToString(receivedData);
        console.log('text: ' + receivedText);
    })
})

async function UIGetCode(): Promise<string> {
    // TODO: figure out what curse cypress has put on their async api such
    //  that `cy.x().then(y => {...})` is not equivalent to `const y = await cy.x()`
    return new Promise<string>((resolve, reject) => {
        cy.fixture('large-file.txt').then(fileContent => {
            cy.contains('ion-button', 'select')
                // TODO: doesn't test button triggers file dialog
                // TODO: can't set / test file size?
                .get('input[type="file"]')
                .attachFile({
                    fileName: 'large-file.txt',
                    fileContent,
                })
                .get('.send-code-input>input')
                .then(el => {
                    const _el = el[0] as HTMLInputElement;
                    // TODO: refactor
                    const id = setInterval(() => {
                        const sendCode = _el.value;
                        if (sendCode !== '') {
                            clearInterval(id)
                            resolve(sendCode);
                        }
                    }, 50)
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
