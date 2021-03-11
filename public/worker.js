// import {FileStreamReader} from "../src/go/wormhole/streaming";
import Go from "../src/go";
console.log("running worker...");
onmessage = async function (event) {
    console.log(event);
    const port = event.ports[0];
    // port.onmessage = function(event) {
    //
    // }
    const go = new Go();
    await WebAssembly.instantiateStreaming(fetch("/assets/wormhole.wasm"), go.importObject).then((result) => {
        go.run(result.instance);
    });
    port.postMessage('ready:wasm');
};
