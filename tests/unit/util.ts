import Go from "@/go";
import path from "path";
import fs from "fs";

export interface TestFile {
    name: string;
    size: number;
    arrayBuffer(): ArrayBuffer;
}

export function newTestFile(name: string, size = 1024): TestFile {
    return {
        name,
        size,
        arrayBuffer(): ArrayBuffer {
            return new ArrayBuffer(size);
        }
    }
}

export async function initGo() {
    const go = new Go();
    const wasmPath = path.join(__dirname, '..', '..', 'public', 'assets', 'wormhole.wasm');
    await WebAssembly.instantiate(fs.readFileSync(wasmPath), go.importObject).then((result) => {
        go.run(result.instance);
    });
}
