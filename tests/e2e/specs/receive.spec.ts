import Go from '../../../src/go'
import {expectFileDownloaded, expectReceiveConsent, mobileViewport, mockClientSend, TEST_HOST} from "../support/util";
import {SET_CONFIG} from "../support/const";
import {ErrMailbox} from "@/errors";


async function initGo() {
    const go = new Go();
    await WebAssembly.instantiateStreaming(fetch(`${TEST_HOST}/assets/wormhole.wasm`), go.importObject).then((result) => {
        go.run(result.instance);
    });
}

async function UIEnterCode(code: string) {
    cy.get('input[type="text"]')
        .type(code)

    cy.get('.receive-next')
        .click()
}

before(initGo)
after(() => cy.task('clearDownloads'))

describe('Receive', () => {
    const filename = 'large-file.txt';
    // const filename = 'small-file.txt';
    beforeEach(() => cy.task('clearDownloads'))

    it('via typed code', (done) => {
        mobileViewport();

        cy.visit('/#/r')
        cy.fixture(filename).then(async (file: string) => {
            const {code} = await mockClientSend(filename, file)
            UIEnterCode(code).then(() => {
                expectReceiveConsent(code).then(() => {
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
            const {code} = await mockClientSend(filename, file);
            cy.visit(`/#/${code}`)
            expectReceiveConsent(code).then(() => {
                expectFileDownloaded(filename, file).then(() => {
                    done();
                });
            });
        });
    });

    it.only('should show bad code error when the code format is invalid', () => {
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
                    .type('zz-invalid')
                    .blur();

                // cy.get('.receive-next')
                //     .click()

                // const alert = cy.get('.alert-wrapper').should('exist');
                // alert.get('.alert-title').should('contain.text', ErrMailbox.name);
                // alert.get('.alert-message').should('contain.text', ErrMailbox.message);
                // alert.get('.alert-button').should('contain.text', 'OK')
                // TODO: use cli flag or something
                // cy.wait(250).screenshot().then(done);
            });
        });
    });
});
