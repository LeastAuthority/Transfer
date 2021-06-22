import Go from '../../../src/go'
import {expectFileDownloaded, expectReceiveConsent, mobileViewport, mockClientSend, TEST_HOST} from "../support/util";


before(initGo)
after(() => cy.task('clearDownloads'))
async function initGo() {
    const go = new Go();
    await WebAssembly.instantiateStreaming(fetch(`${TEST_HOST}/assets/wormhole.wasm`), go.importObject).then((result) => {
        go.run(result.instance);
    });
}

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
            console.log(code);
            cy.visit(`/#/${code}`)
            expectReceiveConsent(code).then(() => {
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
