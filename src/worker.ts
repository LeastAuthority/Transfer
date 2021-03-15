// import {FileStreamReader} from "../src/go/wormhole/streaming";
import Go from "./go";
import {Client} from "./go/wormhole/client";
import {
    FREE,
    isAction,
    NEW_CLIENT,
    RECV_FILE,
    RECV_TEXT,
    SEND_FILE,
    SEND_TEXT,
    WASM_READY
} from "@/go/wormhole/actions";

console.log("running worker...")

onmessage = async function (event) {
    console.log(event)

    if (!isAction(event.data)) {
        throw new Error(`unexpected event: ${JSON.stringify(event, null, '  ')}`);
    }

    const go = new Go();
    await WebAssembly.instantiateStreaming(fetch("/assets/wormhole.wasm"), go.importObject).then((result) => {
        go.run(result.instance);
    });

    const client = new Client(event.data.config);
    const port = event.ports[0]
    port.postMessage({
        action: WASM_READY,
        goClient: client.goClient,
    });

    const _file = {
        arrayBuffer(): Promise<ArrayBuffer> {
            return event.data.buffer;
        }
    };

    port.onmessage = async function (event) {
        const {action, id} = event.data;
        switch (action) {
            case NEW_CLIENT:
                console.log('port.onmessage NEW_CLIENT')
                console.log(event);
                //     client = new Client(event.data.config);
                //
                //     port.postMessage({
                //         action: WASM_READY,
                //         goClient: client.goClient,
                //     });
                break;
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
                // console.log('send_file')
                // console.log(event);
                // TODO: change signature to expect array buffer?
                // TODO: progressCb...
                client.sendFile(_file as File).then(code => {
                    console.log(`got code: ${code}`)
                    port.postMessage({
                        action: SEND_FILE,
                        id,
                        code,
                    })
                });
                break;
            case RECV_FILE:
                console.log('RECV_FILE not yet implemented!');
                break;
            case FREE:
                client.free();
                break;
            default:
                throw new Error(`unexpected event: ${JSON.stringify(event, null, '  ')}`);
        }
    }
}

// (function() {
//     // TODO: JS -> wasm dependency injection
//     (window as any).FileStreamReader = FileStreamReader;
// }())
//

// export {}
