import {largeUint8ArrToString, mockClientReceive, TEST_HOST, UIGetCode} from "../support/util";

describe('Sending', () => {
    const filename = 'large-file.txt';
    // const filename = 'small-file.txt';

    it('should get a code when a file is selected', (done) => {
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
    it('should copy a link, embedding the code, when copy button is clicked', (done) => {
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

    // TODO: actually assert things.
    it('should show send progress when the receiver connects', (done) => {
        cy.viewport('samsung-note9', 'portrait')
        cy.visit('/send')

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
                    const sendCode = (el[0] as HTMLInputElement).value;
                    mockClientReceive(sendCode).then(receivedData => {
                        largeUint8ArrToString(receivedData).then(receivedText => {
                            // TODO: why?
                            // expect(receivedText).equal(fileContent);

                            done();
                        });
                    });
                })
        })
    })
})

