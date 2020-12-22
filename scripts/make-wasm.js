#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const process = require('process');
const execSync = require('child_process').execSync;

const wasmOutPath = path.join(__dirname, '..', 'public', 'assets', 'wormhole.wasm');
const wormholeDir = path.join(__dirname, '..', 'wormhole-william');
const wasmBuildPath = path.join(wormholeDir, 'wasm_server', 'wormhole.wasm');
// TODO: error handling!
const output = execSync('go build -o ../public/assets/wormhole.wasm',
    {
        cwd: wormholeDir,
        env: {
            ...process.env,
            'GOOS': 'js',
            'GOARCH': 'wasm',
        }
    },
);
console.log(output);
fs.rename(wasmBuildPath, wasmOutPath, () => {});
