import Go from '../../../src/go'

import {
    TEST_DOWNLOAD_DIR,
    expectFileDownloaded,
    mockClientSend,
    mockGetReceiveReader,
    TEST_HOST,
    codeFromURL,
    UIGetCode, NewTestFile, largeUint8ArrToString
} from "../support/util";
import {SET_CONFIG} from "../support/const";
import Client from "@/go/wormhole/client";
import {FileStreamReader} from "@/go/wormhole/streaming";
import {ErrMailbox, ErrRelay} from "@/errors";

before(initGo)
after(() => cy.task('clearDownloads'))

async function initGo() {
    const go = new Go();
    await WebAssembly.instantiateStreaming(fetch(`${TEST_HOST}/assets/wormhole.wasm`), go.importObject).then((result) => {
        go.run(result.instance);
    });
}

const filename = 'large-file.txt';

describe('Error messaging', () => {
    describe('Sending', () => {
        // TODO: be more specific
        it('should alert mailbox server is unavailable', (done) => {
            cy.viewport('samsung-note9', 'portrait')
            cy.visit('/#/s')

            cy.window().then(window => {
                window.postMessage({
                    action: SET_CONFIG,
                    config: {
                        rendezvousURL: 'ws://localhost:10000',
                        transitRelayURL: 'ws://localhost:4002',
                    }
                }, '*')
                cy.wait(100)
                UISend(filename)
                    .then(() => {
                        const alert = cy.get('.alert-wrapper').should('exist');
                        alert.get('.alert-title').should('contain.text', ErrMailbox.name);
                        alert.get('.alert-message').should('contain.text', ErrMailbox.message);
                        alert.get('.alert-button').should('contain.text', 'OK')
                            .then(() => {
                                // TODO: use cli flag or something
                                cy.wait(250).screenshot().then(() => done())
                                // done();
                            });
                    })
            });
        });

        it('should alert when relay server is unavailable', (done) => {
            cy.viewport('samsung-note9', 'portrait')
            cy.visit('/#/s')

            cy.window().then(window => {
                window.postMessage({
                    action: SET_CONFIG,
                    config: {
                        rendezvousURL: 'ws://localhost:4000/v1',
                        transitRelayURL: 'ws://localhost:10000',
                    }
                }, '*')
                cy.wait(100)
                UIGetCode(filename)
                    .then((url) => {

                        const code = codeFromURL(url);
                        console.log(`error.spec.ts:73| code: ${code}`)
                        mockGetReceiveReader(code)//.then(() => console.log("THEN")).catch(() => console.log("ERROR"));
                        cy.wait(500)

                        const alert = cy.get('.alert-wrapper').should('exist');
                        alert.get('.alert-title').should('contain.text', ErrRelay.name);
                        alert.get('.alert-message').should('contain.text', ErrRelay.message);
                        alert.get('.alert-button').should('contain.text', 'OK')
                            .then(() => {
                                // TODO: use cli flag or something
                                cy.wait(250).screenshot().then(() => done())
                                // done();
                            });
                    })
            })
        });
    })

    describe('Receiving', () => {
        it('should alert mailbox server is unavailable', () => {
            cy.viewport('samsung-note9', 'portrait')
            cy.fixture(filename).then(async (file: string) => {
                cy.visit('/#/r');

                cy.window().then(window => {
                    window.postMessage({
                        action: SET_CONFIG,
                        config: {
                            rendezvousURL: 'ws://localhost:10000/v1',
                        }
                    }, '*')
                    cy.wait(100)

                    cy.get('input[type="text"]')
                        .type('12-not-real');

                    cy.get('.receive-next')
                        .click()

                    const alert = cy.get('.alert-wrapper').should('exist');
                    alert.get('.alert-title').should('contain.text', ErrMailbox.name);
                    alert.get('.alert-message').should('contain.text', ErrMailbox.message);
                    alert.get('.alert-button').should('contain.text', 'OK')
                        // TODO: use cli flag or something
                        .then(() => {
                            cy.wait(250).screenshot()
                        });
                });
            });
        });

        it('should alert relay server is unavailable', () => {
            cy.viewport('samsung-note9', 'portrait')
            cy.fixture(filename).then(async (file: string) => {
                const {code, done} = await mockClientSend(filename, file)

                // NB: ignore send-side relay error
                done.catch(() => {
                })

                cy.visit(`/#/r`)
                cy.window().then(window => {
                    window.postMessage({
                        action: SET_CONFIG,
                        config: {
                            rendezvousURL: 'ws://localhost:4000/v1',
                            transitRelayURL: 'ws://localhost:10000',
                        }
                    }, '*')
                    cy.wait(100)

                    cy.get('input[type="text"]')
                        .type(code as string);

                    cy.get('.receive-next')
                        .click().wait(500)

                    cy.contains('ion-text.basename', 'large-file');
                    cy.contains('ion-text.extension', '.txt');
                    cy.contains('ion-text.size', /\(\d+(\.\d+)? [kKmMgG]B\)/);
                    cy.get('.download-button').click()

                    const alert = cy.get('.alert-wrapper').should('exist');
                    alert.get('.alert-title').should('contain.text', ErrRelay.name);
                    alert.get('.alert-message').should('contain.text', ErrRelay.message);
                    alert.get('.alert-button').should('contain.text', 'OK')
                        // TODO: use cli flag or something
                        .then(() => {
                            cy.wait(250).screenshot()
                        })
                });
            });
        });

        const testFileSize = (1024 ** 2) * 25;
        // const testFileSize = 140;
        it.skip('should show a specific error when the transfer is interrupted on the send-side', async (testDone) => {
            cy.viewport('samsung-note9', 'portrait')

            const sender = new Client();
            const file = NewTestFile(filename, testFileSize);
            const expected = await largeUint8ArrToString(new Uint8Array(file.arrayBuffer()));
            const {code, cancel, done} = await sender.sendFile(file as unknown as File)
            done.catch(err => {
                console.error(err);
            })
            cy.visit(`/#/r/${code}`)

            cy.get('ion-text.filename').should('have.text', filename);
            // cy.get('ion-text.size').should('have.text', '(1022.6 kB)');

            cy.get('.download-button')
                .wait(500)
                // .then(() => {
                //     cancel();
                // })
                .click()
                // .wait(0)
                .then(() => {
                    cancel();
                })
                .then(() => {
                    const path = `${TEST_DOWNLOAD_DIR}/${filename}`
                    cy.readFile(path, 'utf-8', {timeout: 5000})
                        .should(async (actual) => {
                            // console.log("ACTUAL:");
                            // console.log(actual);
                            // console.log("EXPECTED:")
                            // console.log(expected)
                            // expect(actual).to.eq(expected);
                            // NB: *not* a reliable test.
                            expect(actual == expected).to.be.false;
                        })
                        .then(() => testDone());
                })
            // TODO: use cli flag or something
            // cy.wait(250).screenshot()
        });
    })
})

async function UISend(filename: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        try {
            cy.fixture(filename).then(fileContent => {
                cy.get('ion-button.select-button')
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
