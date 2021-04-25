import Go from "./go";
import Client, {Offer, SendResult} from "./go/wormhole/client";
import {
    ActionMessage,
    FREE,
    isAction,
    RECV_FILE,
    RECV_FILE_DATA,
    RECV_FILE_ERROR,
    RECV_FILE_OFFER,
    RECV_FILE_OFFER_ACCEPT,
    RECV_FILE_OFFER_REJECT,
    RECV_FILE_PROGRESS, RECV_FILE_READ_ERROR,
    RECV_TEXT,
    SEND_FILE, SEND_FILE_CANCEL,
    SEND_FILE_ERROR,
    SEND_FILE_PROGRESS,
    SEND_FILE_RESULT_ERROR,
    SEND_FILE_RESULT_OK,
    SEND_TEXT,
    WASM_READY
} from "@/go/wormhole/actions";

const wasmPromise = fetch("/assets/wormhole.wasm");

const bufferSize = 1024 * 4 // 4KiB
let port: MessagePort;
let client: Client;
// TODO: be more specific
const receiving: Record<number, any> = {};

function handleSendFile({id, name, buffer}: ActionMessage): void {
    const sendProgressCb = (sentBytes: number, totalBytes: number): void => {
        port.postMessage({
            action: SEND_FILE_PROGRESS,
            id,
            sentBytes,
            totalBytes,
        });
    };

    const _file = {
        name,
        arrayBuffer(): Promise<ArrayBuffer> {
            return Promise.resolve(buffer);
        }
    };

    // TODO: change signature to expect array buffer or Uint8Array?
    client.sendFile(_file as File, {progressFunc: sendProgressCb})
        .then(({code, result}: SendResult) => {
            port.postMessage({
                action: SEND_FILE,
                id,
                code,
            });

            result
                .then(() => {
                    port.postMessage({
                        action: SEND_FILE_RESULT_OK,
                        id,
                    })
                })
                .catch((error: Error) => {
                    port.postMessage({
                        action: SEND_FILE_RESULT_ERROR,
                        id,
                        error,
                    });
                });
        })
        .catch(error => {
            port.postMessage({
                action: SEND_FILE_ERROR,
                id,
                error,
            })
        });
}

function handleSendFileCancel({id}: ActionMessage): void {
    const {reader} = receiving[id];
    reader.close()
}

function handleReceiveFile({id, code}: ActionMessage): void {
    const recvProgressCb = (sentBytes: number, totalBytes: number): void => {
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

    // TODO: cleanup / refactor!
    const offerCondition = function (offer: Offer): void {
        receiving[id] = {
            ...receiving[id],
            offer,
        };

        // NB: don't send `accept` or `reject`.
        const {name, size} = offer;
        port.postMessage({
            action: RECV_FILE_OFFER,
            id,
            offer: {
                name,
                size
            },
        })
    }
    const opts = {
        progressFunc: recvProgressCb,
        offerCondition,
    };
    client.recvFile(code, opts)
        .then(reader => {
            receiving[id] = {
                ...receiving[id],
                reader,
            };
        })
        .catch(error => {
            port.postMessage({
                action: RECV_FILE_ERROR,
                id,
                error,
            })
        });
}

function handleReceiveOfferAccept({id}: ActionMessage): void {
    const _receiving = receiving[id]
    if (typeof (_receiving) === 'undefined') {
        throw new Error(`not currently receiving file with id ${id}`);
    }

    const {offer: {accept}} = _receiving;
    // TODO: handle error
    accept().then(() => {
        handleReceiveFileData({id} as ActionMessage);
    });
}

function handleReceiveOfferReject({id}: ActionMessage): void {
    const _receiving = receiving[id]
    if (typeof (_receiving) === 'undefined') {
        throw new Error(`not currently receiving file with id ${id}`);
    }

    const {offer: {reject}} = _receiving;
    // TODO: currently ignoring error.
    reject();
}

async function handleReceiveFileData({id}: ActionMessage): Promise<void> {
    const _receiving = receiving[id];
    if (typeof (_receiving) === 'undefined') {
        throw new Error(`not currently receiving file with id ${id}`);
    }

    const {reader} = _receiving;
    try {
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
    } catch (error) {
        port.postMessage({
            action: RECV_FILE_READ_ERROR,
            id,
            error,
        })
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
        const {action, id} = event.data;

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
                handleSendFile(event.data);
                break;
            case SEND_FILE_CANCEL:
                handleSendFileCancel(event.data)
                break;
            case RECV_FILE:
                handleReceiveFile(event.data);
                break;
            case RECV_FILE_DATA:
                handleReceiveFileData(event.data);
                break;
            case RECV_FILE_OFFER_ACCEPT:
                handleReceiveOfferAccept(event.data);
                break;
            case RECV_FILE_OFFER_REJECT:
                handleReceiveOfferReject(event.data);
                break;
            case FREE:
                client.free();
                break;
            default:
                throw new Error(`unexpected event: ${JSON.stringify(event, null, '  ')}`);
        }
    }
}
