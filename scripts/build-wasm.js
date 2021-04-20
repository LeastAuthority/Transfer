#!/usr/bin/env node

const path = require('path');
const process = require('process');
const execSync = require('child_process').execSync;

const wormholeDir = path.join(__dirname, '..', 'wormhole-william');
// TODO: error handling!
// TODO: fix (and support asdf)!
const output = execSync('/usr/bin/env go build -o ../public/assets/wormhole.wasm ./wasm/module',
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
