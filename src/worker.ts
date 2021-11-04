import Go from "./go";
import Client from "./go/wormhole/client";
import {TransferProgress} from "./go/wormhole/types";
import {
    FREE,
    isRPCMessage,
    RECV_FILE,
    RECV_FILE_DATA,
    RECV_FILE_PROGRESS,
    RECV_TEXT,
    RPCMessage,
    SEND_FILE,
    SEND_FILE_CANCEL,
    SEND_FILE_ERROR,
    SEND_FILE_PROGRESS, SEND_FILE_RESULT_ERROR,
    SEND_FILE_RESULT_OK,
    SEND_TEXT,
    WASM_READY
} from "@/store/actions";
import {RpcProvider} from "worker-rpc";

const wasmPromise = fetch("/assets/wormhole.wasm");
let rpc: RpcProvider | undefined = undefined;

const bufferSize = 1024 * 4 // 4KiB
// const bufferSize = (1024 ** 2) * 2 // 2MiB
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
            .then(({code, cancel, done}: TransferProgress) => {
		receiving[id] = {cancel};

                done.then(() => {
                    console.log("DONE.THEN")
                    rpc!.signal(SEND_FILE_RESULT_OK, {id});
                }).catch(error => {
                    console.log("CATCH ERROR")
                    rpc!.signal(SEND_FILE_RESULT_ERROR, {id, error});
                });
                resolve({code});
            })
            .catch(error => {
                reject(error)
            });
    });
}

function handleSendFileCancel({id}: RPCMessage): void {
    const {cancel} = receiving[id];
    cancel();
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

    const opts = {
        progressFunc: recvProgressCb,
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
        try {
            [n, done] = await reader.read(buffer)
        } catch (error) {
            return Promise.reject(error)
        }
        await rpc!.rpc(RECV_FILE_DATA, {
            id,
            n,
            done,
            buffer: buffer.buffer,
        }, [buffer.buffer]);
    }
}

onmessage = async function (event) {
    if (!isRPCMessage(event.data)) {
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
    // TODO: be more specific with types!
    rpc.registerRpcHandler<RPCMessage, Record<string, any>>(SEND_FILE, handleSendFile);
    rpc.registerRpcHandler<RPCMessage, void>(SEND_FILE_CANCEL, handleSendFileCancel);
    // TODO: be more specific with types!
    rpc.registerRpcHandler<RPCMessage, Record<string, any>>(RECV_FILE, handleReceiveFile);
    rpc.registerRpcHandler<RPCMessage, void>(RECV_FILE_DATA, handleReceiveFileData);
    rpc.registerRpcHandler<RPCMessage, void>(FREE, () => client.free());

    port.onmessage = (event: MessageEvent) => rpc!.dispatch(event.data);
}
