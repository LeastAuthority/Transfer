import Chainable = Cypress.Chainable;
import Client from "@/go/wormhole/client";
import {TransferProgress, TransferOptions} from "@/go/wormhole/types";
import Go from "../../../src/go";
import {FileStreamReader} from "@/go/wormhole/streaming";

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

export function expectReceiveConsent(code: string): Chainable<string> {
    return cy.url().then(url => {
        // const _url = new URL(url);
        // expect(_url.hash).to.eq(`#/${code}`)

        cy.contains('ion-label', 'Download')
        cy.contains('ion-label', 'Cancel')
        cy.contains('ion-text', 'Ready to download')
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
            cy.get('ion-button.select-button')
                // TODO: doesn't test button triggers file dialog
                // TODO: can't set / test file size?
                .get('input[type="file"]')
                .attachFile({
                    fileName: 'large-file.txt',
                    fileContent,
                })
                .get('.send-code-input>input')
                .wait(1000)
                .then(el => {
                    const value = (el[0] as HTMLInputElement).value;
                    expect(value).not.match(RegExp(`^(|${TEST_HOST}/#/)$`));
                    resolve(value);
                })
        })
    });
}

export function codeFromURL(url: string): string {
    const urlObj = new URL(url)
    // NB: drop leading `#/`.
    return urlObj.hash.slice(2);
}

export async function mockGetReceiveReader(code: string): Promise<FileStreamReader> {
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
    const reader = await receiver.recvFile(code);

    // TODO: fix
    return new Promise((resolve, reject) => {
        setTimeout(async () => {
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
