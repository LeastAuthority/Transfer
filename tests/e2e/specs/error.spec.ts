import Go from '../../../src/go'

import {mockClientReceive, mockClientSend, TEST_HOST, UIGetCode} from "../support/util";

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
    // TODO: be more specific
    it('should show a specific error when unable to connect to the mailbox', () => {
        cy.viewport('samsung-note9', 'portrait')
        cy.visit('/send')

        cy.window().then(window => {
            window.postMessage({
                // TODO: reference constant.
                action: 'test/set_config',
                config: {
                    rendezvousURL: 'ws://localhost:1',
                }
            }, '*')
            cy.wait(100)
            UISend(filename)
                .then(() => {
                    // TODO: expect error message.
                    cy.get('.alert-wrapper').should('exist')
                        .get('.alert-title').should('contain.text', 'Error')
                    // .get('.alert-message').should('contain.text', 'unable to connect to the mailbox server')
                    // .alert-wrapper
                    // & .alert-title
                    // & .alert-message
                    // & .alert-button
                })
                .catch(error => {
                    fail(error);
                });
        });
    });

    it.skip('should show a specific error when unable to connect to the relay', () => {
        cy.viewport('samsung-note9', 'portrait')
        cy.visit('/send')

        window.postMessage({
            // TODO: reference constant.
            action: 'test/set_config',
            config: {
                transitRelayURL: 'ws://localhost:1',
            }
        }, '*')
        cy.wait(100)
        UIGetCode(filename)
            .then((code) => {
                mockClientReceive(code)

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
})

describe('Receiving', () => {
    // NB: mailbox must not be running!
    it('should show a specific error when unable to connect to the mailbox', () => {
        cy.viewport('samsung-note9', 'portrait')
        cy.fixture(filename).then(async (file: string) => {
            cy.visit('/receive');

            cy.window().then(window => {
                window.postMessage({
                    // TODO: reference constant.
                    action: 'test/set_config',
                    config: {
                        rendezvousURL: 'ws://localhost:1',
                    }
                }, '*')
                cy.wait(100)

                cy.get('input[type="text"]')
                    .type('12-not-real');

                cy.get('.receive-next')
                    .click()

                cy.get('.alert-wrapper').should('exist')
                    .get('.alert-title').should('contain.text', 'Error')
            });
        });
    });

    it('should show a specific error when unable to connect to the relay', () => {
        cy.viewport('samsung-note9', 'portrait')
        cy.fixture(filename).then(async (file: string) => {
            const {code, result} = await mockClientSend(filename, file)

            // NB: ignore send-side relay error
            result.catch(() => {})

            cy.visit(`/receive`)
                .wait(500)
                .then(() => {
                    cy.window().then(window => {
                        window.postMessage({
                            // TODO: reference constant.
                            action: 'test/set_config',
                            config: {
                                transitRelayURL: 'ws://localhost:1',
                            }
                        }, '*')
                        cy.wait(100)

                        cy.get('input[type="text"]')
                            .type(code);

                        cy.get('.receive-next')
                            .click().wait(500)

                        cy.get('.download-button').wait(500)
                            .click()

                        cy.get('.alert-wrapper').should('exist')
                            .get('.alert-title').should('contain.text', 'Error')
                    });
                });
        });
    });

    // NB: relay must be running!
    it.skip('should show a specific error when the transfer is interrupted on the receive-side', () => {
        cy.viewport('samsung-note9', 'portrait')
        cy.fixture(filename).then(async (file: string) => {
            const {code} = await mockClientSend(filename, file)

            cy.visit(`/receive/${code}`)

            cy.get('.download-button').wait(500)
                .click()

            cy.get('.alert-wrapper').should('exist')
                .get('.alert-title').should('contain.text', 'Error')
        });
    });
})

async function UISend(filename: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        try {
            cy.fixture(filename).then(fileContent => {
                cy.contains('ion-button', 'select')
                    .get('input[type="file"]')
                    .attachFile({
                        fileName: 'large-file.txt',
                        fileContent,
                    }).then(() => {
                    resolve()
                })
            });
        } catch (err) {
            reject(err);
        }
    });
}
