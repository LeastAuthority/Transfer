#!/usr/bin/env node
const {argv, env, exit} = require('process');
const {execSync} = require('child_process');
const Fs = require('fs')

const {loadEnv} = require('./common');

const stage = argv[2];
if (!stage) {
    console.error("Usage: build.js <stage name>")
    exit(1);
}

const envPath = `.${stage}.build.env`;
if (Fs.existsSync(envPath)) {
    loadEnv(envPath);
}
const command1 = `NODE_ENV=${stage} yarn build:worker`;

try {
    execSync(command1);
} catch (error) {
    console.error(error);
    exit(3);
}

const command2 = `NODE_ENV=${stage} vue-cli-service build`
try {
    execSync(command2);
} catch (error) {
    console.error(error);
    exit(3);
}
