import Chainable = Cypress.Chainable;
import Client from "@/go/wormhole/client";

const downloadDir = 'cypress/downloads'

// TODO: move / automate
export const TEST_HOST = 'http://localhost:8080'

export function mobileViewport() {
    cy.viewport('samsung-note9', 'portrait')
}

export function expectFileDownloaded(filename: string, expected: string): Chainable<undefined> {
    // NB: `cy.wait` for text msg with metadata.
    return cy.wait(500).get('.download-button').click().then(() => {
        const path = `${downloadDir}/${filename}`
        return cy.readFile(path, 'utf-8', {timeout: 3000})
            .should((actual) => {
                expect(actual).to.eq(expected, 'file contents are not equal')
            });
    });
}

export function expectReceiveConfirm(code: string): Chainable<string> {
    return cy.url().then(url => {
        const _url = new URL(url);
        expect(_url.pathname).to.eq(`/receive/${code}`)

        cy.contains('ion-text', 'download')
        cy.contains('ion-text', 'cancel')
        cy.contains('ion-text', 'Ready to download:')
    });
}

export async function mockClientSend(name: string, data: string): Promise<string> {
    const sender = new Client();
    const file = {
        arrayBuffer() {
            const enc = new TextEncoder();
            return enc.encode(data);
        }
    }
    const fileCode = await sender.sendFile(file);

    const fileStats = btoa(JSON.stringify({
        name,
        fileCode,
    }));
    return sender.sendText(fileStats)
}

// TODO: use cypress-promise?
// (see: https://github.com/cypress-io/cypress/issues/1417)
// (see: https://www.npmjs.com/package/cypress-promise)
// NB: cypress chainables **are not** promises!
// export async function withFile(filename: string): Promise<string> {
//     return new Promise((resolve, reject) => {
//         cy.fixture(filename).then(async (file: string) => {
//             resolve(file);
//         });
//     });
// }

// export function largeUint8ArrToString(uint8arr: Uint8Array) {
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
