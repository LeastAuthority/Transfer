import Chainable = Cypress.Chainable;
import Client from "@/go/wormhole/client";
import {Offer, TransferProgress, TransferOptions} from "@/go/wormhole/types";
import Go from "../../../src/go";
import {Reader} from "@/go/wormhole/streaming";

export const TEST_DOWNLOAD_DIR = 'cypress/downloads'

// TODO: move / automate
export const TEST_HOST = 'http://localhost:8080'
const TEST_BUFFER_SIZE = 1024 * 4 // 4 KiB

export function mobileViewport() {
    cy.viewport('samsung-note9', 'portrait')
}

export function expectFileDownloaded(filename: string, expected: string): Chainable<undefined> {
    cy.get('ion-text.filename').should('have.text', filename);
    cy.get('ion-text.size').should('have.text', '(1022.6 kB)');

    // TODO: get rid of wait.
    return cy.get('.download-button').wait(500).click().then(() => {
        const path = `${TEST_DOWNLOAD_DIR}/${filename}`
        return cy.readFile(path, 'utf-8', {timeout: 3000})
            .should((actual) => {
                expect(actual).to.eq(expected, 'file contents are not equal')
            });
    });
}

export function expectReceiveConfirm(code: string): Chainable<string> {
    return cy.url().then(url => {
        const _url = new URL(url);
        expect(_url.hash).to.eq(`#/receive/${code}`)

        cy.contains('ion-text', 'download')
        cy.contains('ion-text', 'cancel')
        cy.contains('ion-text', 'Ready to download:')
    });
}

export async function mockClientSend(name: string, data: string, opts?: TransferOptions): Promise<TransferProgress> {
    const sender = new Client();
    const file = {
        name,
        arrayBuffer(): Promise<ArrayBuffer> {
            const enc = new TextEncoder();
            return Promise.resolve(enc.encode(data));
        }
    } as File;
    return sender.sendFile(file, opts);
}

export function largeUint8ArrToString(uint8arr: Uint8Array) {
    return new Promise((resolve, reject) => {
        const bb = new Blob([uint8arr]);
        const f = new FileReader();
        f.onload = function (event) {
            resolve(event.target.result);
        };

        f.readAsText(bb, 'utf-8');
    })
}

// TODO: refactor (application actions / page objects?)
export async function UIGetCode(filename: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
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
                    resolve((el[0] as HTMLInputElement).value);
                })
        })
    });
}

export async function mockGetReceiveReader(code: string): Promise<Reader> {
    const go = new Go();
    await WebAssembly.instantiateStreaming(fetch("http://localhost:8080/assets/wormhole.wasm"), go.importObject).then((result) => {
        go.run(result.instance);
    });

    const receiver = new Client();
    return receiver.recvFile(code);
}

export async function mockClientReceive(code: string): Promise<Uint8Array> {
    const go = new Go();
    await WebAssembly.instantiateStreaming(fetch("http://localhost:8080/assets/wormhole.wasm"), go.importObject).then((result) => {
        go.run(result.instance);
    });

    const receiver = new Client();
    // TODO: cleanup
    let size: number;
    const offerCondition = (offer: Offer): void => {
        // NB: save for assertion later
        size = offer.size;
        if (typeof (offer.accept) !== 'undefined') {
            offer.accept();
        }
    }
    const reader = await receiver.recvFile(code, {
        offerCondition,
    });

    // TODO: fix
    return new Promise(async (resolve, reject) => {
        setTimeout(async () => {
            // @ts-ignore
            const result = new Uint8Array(size)
            await reader.readAll(result);
            resolve(result);
        }, 100)
    });
}

export function NewTestFile(name: string, fileSizeBytes: number): TestFile {
    const data = new DataView(new ArrayBuffer(fileSizeBytes));
    data.buffer
    for (let i = 0; i < data.byteLength; i++) {
        data.setUint8(i, i);
    }

    return {
        name,
        size: fileSizeBytes,
        data,
        arrayBuffer(): ArrayBuffer {
            return data.buffer;
        },
    }
}

export interface TestFile {
    name: string;
    size: number;
    data: DataView;

    arrayBuffer(): ArrayBuffer;
}

export function mockReadFn (file: TestFile, bufSizeBytes: number) {
    let counter = 0;
    return jest.fn().mockImplementation((buf) => {
        const dataView = new DataView(buf);
        for (let i = 0; i <  bufSizeBytes; i++) {
            dataView.setUint8(i, file.data.getUint8(( bufSizeBytes * counter) + i));
            if (( bufSizeBytes * counter) + i === file.data.byteLength - 1) {
                return Promise.resolve([i + 1, true]);
            }
        }
        counter++;
        return Promise.resolve([ bufSizeBytes, false]);
    })
}
