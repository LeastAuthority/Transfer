import Go from "./go";
import Client from "./go/wormhole/client";
import {Offer, TransferProgress} from "./go/wormhole/types";
import {
    FREE,
    isAction,
    RECV_FILE,
    RECV_FILE_DATA,
    RECV_FILE_ERROR,
    RECV_FILE_OFFER,
    RECV_FILE_OFFER_ACCEPT,
    RECV_FILE_OFFER_REJECT,
    RECV_FILE_PROGRESS,
    RECV_FILE_READ_ERROR,
    RECV_TEXT,
    RPCMessage,
    SEND_FILE,
    SEND_FILE_CANCEL,
    SEND_FILE_ERROR,
    SEND_FILE_PROGRESS,
    SEND_FILE_RESULT_ERROR,
    SEND_FILE_RESULT_OK,
    SEND_TEXT,
    WASM_READY
} from "@/store/actions";
import {RpcProvider} from "worker-rpc";

const wasmPromise = fetch("/assets/wormhole.wasm");
let rpc: RpcProvider | undefined = undefined;

const bufferSize = 1024 * 4 // 4KiB
let port: MessagePort;
let client: Client;
// TODO: be more specific
const receiving: Record<number, any> = {};

// TODO: be more specific about types!
async function handleSendFile({id, name, buffer}: RPCMessage): Promise<Record<string, any>> {
    const sendProgressCb = (sentBytes: number, totalBytes: number): void => {
        rpc!.rpc(SEND_FILE_PROGRESS, {
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
    return new Promise((resolve, reject) => {
        client.sendFile(_file as File, {progressFunc: sendProgressCb})
            .then(({code, done}: TransferProgress) => {
                // TODO:
                done.then(() => {
                    rpc!.signal(SEND_FILE_RESULT_OK, {id});
                }).catch(error => {
                    rpc!.signal(SEND_FILE_ERROR, {id, error});
                });
                resolve({code});
                //     port.postMessage({
                //         action: SEND_FILE,
                //         id,
                //         code,
                //     });
                //
                //     done
                //         .then(() => {
                //             port.postMessage({
                //                 action: SEND_FILE_RESULT_OK,
                //                 id,
                //             })
                //         })
                //         .catch((error: Error) => {
                //             port.postMessage({
                //                 action: SEND_FILE_RESULT_ERROR,
                //                 id,
                //                 error,
                //             });
                //         });
            })
            .catch(error => {
                reject(error)
                // port.postMessage({
                //     action: SEND_FILE_ERROR,
                //     id,
                //     error,
                // })
            });
    });
}

function handleSendFileCancel({id}: RPCMessage): void {
    const {reader} = receiving[id];
    reader.close()
}

// TODO: be more specific with types!
async function handleReceiveFile({id, code}: RPCMessage): Promise<Record<string, any>> {
    const recvProgressCb = (sentBytes: number, totalBytes: number): void => {
        rpc!.rpc(RECV_FILE_PROGRESS, {
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
    // const offerCondition = function (offer: Offer): void {
    //     receiving[id] = {
    //         ...receiving[id],
    //         offer,
    //     };
    //
    //     // NB: don't send `accept` or `reject`.
    //     const {name, size} = offer;
    //     rpc!.rpc(RECV_FILE_OFFER, {
    //         id,
    //         offer: {
    //             name,
    //             size
    //         }
    //     }).catch((error) => {
    //         rpc!.rpc(RECV_FILE_ERROR)
    //     });
    // }
    const opts = {
        progressFunc: recvProgressCb,
        // offerCondition,
    };
    return new Promise((resolve, reject) => {
        client.recvFile(code, opts)
            .then(reader => {
                receiving[id] = {
                    ...receiving[id],
                    reader,
                };
                const {name, size} = reader;
                resolve({name, size});
            })
            .catch(reject);
    });
}

async function handleReceiveFileData({id}: RPCMessage): Promise<void> {
    const _receiving = receiving[id];
    if (typeof (_receiving) === 'undefined') {
        throw new Error(`not currently receiving file with id ${id}`);
    }

    const {reader} = _receiving;
    for (let n = 0, done = false; !done;) {
        const buffer = new Uint8Array(bufferSize);
        [n, done] = await reader.read(buffer);
        await rpc!.rpc(RECV_FILE_DATA, {
            id,
            n,
            done,
            buffer: buffer.buffer,
        }, [buffer.buffer]);
    }
}

async function handleReceiveOfferAccept({id}: RPCMessage): Promise<void> {
    const _receiving = receiving[id]
    if (typeof (_receiving) === 'undefined') {
        throw new Error(`not currently receiving file with id ${id}`);
    }

    const {offer: {accept}} = _receiving;
    // TODO: handle error
    await accept()
    handleReceiveFileData({id} as RPCMessage);
}

onmessage = async function (event) {
    if (!isAction(event.data)) {
        throw new Error(`unexpected event: ${JSON.stringify(event, null, '  ')}`);
    }

    // NB: unregister worker message handler.
    //  (use message channel port instead)
    onmessage = () => {
        // NB: noop
    };

    const go = new Go();
    let wasm: { instance: WebAssembly.Instance };
    if (typeof (WebAssembly.instantiateStreaming) === 'undefined') {
        const wasmData = await (await wasmPromise).arrayBuffer();
        wasm = await WebAssembly.instantiate(wasmData, go.importObject);
    } else {
        wasm = await WebAssembly.instantiateStreaming(wasmPromise, go.importObject)
    }
    go.run(wasm.instance);

    client = new Client(event.data.config);
    port = event.ports[0]
    port.postMessage({
        action: WASM_READY,
        goClient: client.goClient,
    });

    rpc = new RpcProvider((message: any, transfer: any[] | undefined) => {
        typeof (transfer) === 'undefined' ?
            port.postMessage(message) :
            port.postMessage(message, transfer);
    });

    rpc.registerRpcHandler<RPCMessage, string>(SEND_TEXT, async ({text}) => {
        return client.sendText(text);
    })
    rpc.registerRpcHandler<RPCMessage, string>(RECV_TEXT, async ({code}) => {
        return client.recvText(code);
    })
    rpc.registerRpcHandler<RPCMessage, Record<string, any>>(SEND_FILE, handleSendFile);
    rpc.registerRpcHandler<RPCMessage, void>(SEND_FILE_CANCEL, handleSendFileCancel);
    rpc.registerRpcHandler<RPCMessage, Record<string, any>>(RECV_FILE, handleReceiveFile);
    rpc.registerRpcHandler<RPCMessage, void>(RECV_FILE_DATA, handleReceiveFileData);
    // rpc.registerRpcHandler<RPCMessage, void>(RECV_FILE_OFFER_ACCEPT, handleReceiveOfferAccept);
    // rpc.registerRpcHandler<RPCMessage, void>(RECV_FILE_OFFER_REJECT, handleReceiveOfferReject);
    rpc.registerRpcHandler<RPCMessage, void>(FREE, () => client.free());

    port.onmessage = (event: MessageEvent) => rpc!.dispatch(event.data);
    // port.onmessage = async function (event) {
    //     const {action, id} = event.data;
    //
    //     switch (action) {
    //         case SEND_TEXT:
    //             client.sendText(event.data.text).then(code => {
    //                 port.postMessage({
    //                     action: SEND_TEXT,
    //                     id,
    //                     code,
    //                 })
    //             })
    //             break;
    //         case RECV_TEXT:
    //             client.recvText(event.data.code).then(text => {
    //                 port.postMessage({
    //                     action: RECV_TEXT,
    //                     id,
    //                     text,
    //                 })
    //             });
    //             break;
    //         case SEND_FILE:
    //             handleSendFile(event.data);
    //             break;
    //         case SEND_FILE_CANCEL:
    //             handleSendFileCancel(event.data)
    //             break;
    //         case RECV_FILE:
    //             handleReceiveFile(event.data);
    //             break;
    //         case RECV_FILE_DATA:
    //             handleReceiveFileData(event.data);
    //             break;
    //         case RECV_FILE_OFFER_ACCEPT:
    //             handleReceiveOfferAccept(event.data);
    //             break;
    //         case RECV_FILE_OFFER_REJECT:
    //             handleReceiveOfferReject(event.data);
    //             break;
    //         case FREE:
    //             client.free();
    //             break;
    //         default:
    //             throw new Error(`unexpected event: ${JSON.stringify(event, null, '  ')}`);
    //     }
    // }
}
