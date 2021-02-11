import Chainable = Cypress.Chainable;

const downloadDir = 'cypress/downloads'

export function mobileViewport() {
    cy.viewport('samsung-note9', 'portrait')
}

export function expectFileDownloaded(filename: string, expected: string): Chainable<undefined> {
    return cy.wait(1000).get('.download-button').click().then(() => {
        const path = `${downloadDir}/${filename}`
        return cy.readFile(path, 'utf-8', {timeout: 500})
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