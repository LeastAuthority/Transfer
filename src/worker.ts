import {FileStreamReader} from "./go/wormhole/streaming";

console.log(`NODE_ENV: ${process.env.NODE_ENV}`);

(function () {
    // TODO: JS -> wasm dependency injection
    (globalThis as any).FileStreamReader = FileStreamReader;
}())

const wasmPromise = fetch("/assets/wormhole.wasm");

import Go from "./go";
import Client from "./go/wormhole/client";
import {
    ActionMessage,
    FREE,
    isAction,
    RECV_FILE,
    RECV_FILE_DATA,
    RECV_FILE_PROGRESS,
    RECV_TEXT,
    SEND_FILE,
    SEND_FILE_PROGRESS,
    SEND_TEXT,
    WASM_READY
} from "@/go/wormhole/actions";

// const bufferSize = 1024 * 4 // 4KiB
const bufferSize = 1024 * 256 // 4KiB
// const bufferSize = (1024 ** 2) * 2 // 2MiB
let port: MessagePort;
let client: Client;
// TODO: be more specific
const receiving: Record<number, any> = {};

function handleReceiveFile({id, name, size, code}: ActionMessage): void {
    const recvProgressCb = (sentBytes: number, totalBytes: number): void => {
        console.log(`worker.ts:38| sentBytes: ${sentBytes}; totalBytes: ${totalBytes}`);
        port.postMessage({
            action: RECV_FILE_PROGRESS,
            id,
            sentBytes,
            totalBytes,
        });
    };

    const _receiving = receiving[id];
    if (typeof (_receiving) !== 'undefined') {
        throw new Error(`already receiving file with named "${_receiving.name}" with id ${id}`);
    }

    // TODO: cleanup!
    const opts = {progressCb: recvProgressCb};
    console.log(`worker.ts:54| `)
    console.log(opts);
    client.recvFile(code, opts).then(reader => {
        receiving[id] = {
            name,
            size,
            reader,
        };

        port.postMessage({
            action: RECV_FILE,
            id,
            name,
            size
        });
    });
}

async function handleReceiveFileData({id, done}: ActionMessage): Promise<void> {
    const _receiving = receiving[id];
    if (typeof (_receiving) === 'undefined') {
        throw new Error(`not currently receiving file with id ${id}`);
    }

    const {reader} = _receiving;
    for (let n = 0, done = false; !done;) {
        const buffer = new Uint8Array(bufferSize);
        [n, done] = await reader.read(buffer);
        port.postMessage({
            action: RECV_FILE_DATA,
            id,
            n,
            done,
            buffer: buffer.buffer,
        }, [buffer.buffer]);
    }
}

onmessage = async function (event) {
    // NB: unregister worker message handler.
    //  (use message channel port instead)
    onmessage = () => {
        // NB: noop
    };
    // console.log(event)

    if (!isAction(event.data)) {
        throw new Error(`unexpected event: ${JSON.stringify(event, null, '  ')}`);
    }

    const go = new Go();
    await WebAssembly.instantiateStreaming(wasmPromise, go.importObject).then((result) => {
        go.run(result.instance);
    });

    client = new Client(event.data.config);
    port = event.ports[0]
    port.postMessage({
        action: WASM_READY,
        goClient: client.goClient,
    });

    port.onmessage = async function (event) {
        const _file = {
            arrayBuffer(): Promise<ArrayBuffer> {
                return Promise.resolve(event.data.buffer);
            }
        };

        const {action, id} = event.data;

        const sendProgressCb = (sentBytes: number, totalBytes: number): void => {
            port.postMessage({
                action: SEND_FILE_PROGRESS,
                id,
                sentBytes,
                totalBytes,
            });
        };

        switch (action) {
            case SEND_TEXT:
                client.sendText(event.data.text).then(code => {
                    port.postMessage({
                        action: SEND_TEXT,
                        id,
                        code,
                    })
                })
                break;
            case RECV_TEXT:
                client.recvText(event.data.code).then(text => {
                    port.postMessage({
                        action: RECV_TEXT,
                        id,
                        text,
                    })
                });
                break;
            case SEND_FILE:
                // TODO: change signature to expect array buffer or Uint8Array?
                client.sendFile(_file as File, sendProgressCb).then(code => {
                    port.postMessage({
                        action: SEND_FILE,
                        id,
                        code,
                    })
                });
                break;
            case RECV_FILE:
                handleReceiveFile(event.data);
                break;
            case RECV_FILE_DATA:
                handleReceiveFileData(event.data);
                break;
            case FREE:
                client.free();
                break;
            default:
                throw new Error(`unexpected event: ${JSON.stringify(event, null, '  ')}`);
        }
    }
}
