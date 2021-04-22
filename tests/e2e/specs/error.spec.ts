import Go from '../../../src/go'

import {mockClientSend, TEST_HOST} from "../support/util";

before(initGo)
after(() => cy.task('clearDownloads'))

async function initGo() {
    const go = new Go();
    await WebAssembly.instantiateStreaming(fetch(`${TEST_HOST}/assets/wormhole.wasm`), go.importObject).then((result) => {
        go.run(result.instance);
    });
}

const filename = 'large-file.txt';

describe('Sending', () => {
    // NB: mailbox must not be running!
    // TODO: be more specific
    it('should show a specific error when unable to connect to the mailbox', () => {
        cy.viewport('samsung-note9', 'portrait')
        cy.visit('/send')

        UISend(filename)
            .then(() => {
                // TODO: expect error message.
                cy.get('.alert-wrapper').should('exist')
                    .get('.alert-title').should('contain.text', 'Error')
                    .screenshot()
                // .get('.alert-message').should('contain.text', 'unable to connect to the mailbox server')
                // .alert-wrapper
                // & .alert-title
                // & .alert-message
                // & .alert-button
            })
            .catch(error => {
                console.log('error.spec.ts:20| error')
                fail(error);
            });
    });

    // NB: relay must not be running!
    // it.skip('should show a specific error when unable to connect to the relay', () => {
    //     cy.viewport('samsung-note9', 'portrait')
    //     cy.visit('/send')
    //
    //     console.log('error.spec.ts:9| UISend...')
    //     UISend(filename)
    //         .then(() => {
    //             // TODO: expect error message.
    //             console.log('error.spec.ts:12| .then...')
    //             cy.get('.alert-wrapper').should('exist')
    //                 .get('.alert-title').should('contain.text', 'Mailbox Error')
    //                 .screenshot()
    //             // .get('.alert-message').should('contain.text', 'unable to connect to the mailbox server')
    //             // .alert-wrapper
    //             // & .alert-title
    //             // & .alert-message
    //             // & .alert-button
    //         })
    //         .catch(error => {
    //             console.log('error.spec.ts:20| error')
    //             fail(error);
    //         });
    // });
})

describe.only('Receiving', () => {
    // NB: mailbox must not be running!
    it('should show a specific error when unable to connect to the mailbox', () => {
        cy.viewport('samsung-note9', 'portrait')
        cy.fixture(filename).then(async (file: string) => {
            cy.visit('/receive');
            cy.get('input[type="text"]')
                .type('12-not-real')

            cy.get('.receive-next')
                .click()

            cy.get('.alert-wrapper').should('exist')
                .get('.alert-title').should('contain.text', 'Error')
                .screenshot()
        });
    });

    // NB: relay must not be running!
    it.only('should show a specific error when unable to connect to the relay', () => {
        cy.viewport('samsung-note9', 'portrait')
        cy.fixture(filename).then(async (file: string) => {
            const {code, result} = await mockClientSend(filename, file)

            // NB: ignore send-side relay error
            result.catch(() => {})

            cy.visit(`/receive/${code}`)

            cy.get('.download-button').wait(500)
                .click()

            cy.get('.alert-wrapper').should('exist')
                .get('.alert-title').should('contain.text', 'Error')
                .screenshot()
        });
    });
})

async function UISend(filename: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        cy.fixture(filename).then(fileContent => {
            cy.contains('ion-button', 'select')
                .get('input[type="file"]')
                .attachFile({
                    fileName: 'large-file.txt',
                    fileContent,
                }).then(() => {
                    resolve()
                })
        })
    });
}
