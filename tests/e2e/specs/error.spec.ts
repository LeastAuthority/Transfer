import Go from '../../../src/go'

import {
    mockClientSend,
    mockGetReceiveReader,
    TEST_HOST,
    UIGetCode
} from "../support/util";
import {SET_CONFIG} from "../support/const";

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
                    rendezvousURL: 'ws://localhost:10000',
                }
            }, '*')
            cy.wait(100)
            UISend(filename)
                .then(() => {
                    // TODO: expect error message.
                    cy.get('.alert-wrapper').should('exist')
                        .get('.alert-title').should('contain.text', 'Error')
                        // TODO: use cli flag or something
                        // .wait(250)
                        // .then(() => {
                        //     cy.screenshot()
                        // })
                    // .get('.alert-message').should('contain.text', 'unable to connect to the mailbox server')
                    // .alert-wrapper
                    // & .alert-title
                    // & .alert-message
                    // & .alert-button
                })
        });
    });

    it('should show a specific error when unable to connect to the relay', () => {
        cy.viewport('samsung-note9', 'portrait')
        cy.visit('/send')

        cy.window().then(window => {
            window.postMessage({
                // TODO: reference constant.
                action: 'test/set_config',
                config: {
                    transitRelayURL: 'ws://localhost:10000',
                }
            }, '*')
            cy.wait(100)
            UIGetCode(filename)
                .then((code) => {
                    mockGetReceiveReader(code)
                    cy.wait(100)

                    cy.get('.alert-wrapper').should('exist')
                        .get('.alert-title').should('contain.text', 'Mailbox Error')
                        // TODO: use cli flag or something
                        // .wait(250)
                        // .then(() => {
                        //     cy.screenshot()
                        // })
                })
        })
    });
})

describe('Receiving', () => {
    it('should show a specific error when unable to connect to the mailbox', () => {
        cy.viewport('samsung-note9', 'portrait')
        cy.fixture(filename).then(async (file: string) => {
            cy.visit('/receive');

            cy.window().then(window => {
                window.postMessage({
                    // TODO: reference constant.
                    action: 'test/set_config',
                    config: {
                        rendezvousURL: 'ws://localhost:10000',
                    }
                }, '*')
                cy.wait(100)

                cy.get('input[type="text"]')
                    .type('12-not-real');

                cy.get('.receive-next')
                    .click()

                cy.get('.alert-wrapper').should('exist')
                    .get('.alert-title').should('contain.text', 'Error')
                    // TODO: use cli flag or something
                    // .wait(250)
                    // .then(() => {
                    //     cy.screenshot()
                    // })
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
                            action: SET_CONFIG,
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
                            // TODO: use cli flag or something
                            // .wait(250)
                            // .then(() => {
                            //     cy.screenshot()
                            // })
                    });
                });
        });
    });

    it.skip('should show a specific error when the transfer is interrupted on the send-side', () => {
        cy.viewport('samsung-note9', 'portrait')
        cy.fixture(filename).then(async (file: string) => {
            const {code, result} = await mockClientSend(filename, file)

            cy.visit(`/receive/${code}`)

            cy.get('.download-button').wait(500)
                .click()
                // TODO: use cli flag or something
                // .wait(250)
                // .then(() => {
                //     result.cancel();
                // })

            cy.get('.alert-wrapper').should('exist')
                .get('.alert-title').should('contain.text', 'Error')
                // TODO: use cli flag or something
                // .wait(250)
                // .then(() => {
                //     cy.screenshot()
                // })

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
