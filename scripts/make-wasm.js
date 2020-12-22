#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const process = require('process');
const execSync = require('child_process').execSync;

const wormholeDir = path.join(__dirname, '..', 'wormhole-william');
// TODO: error handling!
const output = execSync('go build -o ../public/assets/wormhole.wasm ./wasm/module',
    {
        cwd: wormholeDir,
        env: {
            ...process.env,
            'GOOS': 'js',
            'GOARCH': 'wasm',
        }
    },
);
console.log(output.toString());
