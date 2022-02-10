#!/usr/bin/env node
const {argv, env, exit} = require('process');
const {execSync} = require('child_process');

const {loadEnv} = require('./common');

const stage = argv[2];
if (!stage) {
    console.error("Usage: build.js <stage name>")
    exit(1);
}

const envPath = `.${stage}.build.env`;
loadEnv(envPath);

const host = env['STAGE_HOSTNAME'];
const relayURL = env['STAGE_RELAY_URL'];
const mailboxURL = env['STAGE_MAILBOX_URL'];

console.log(`host: ${host}`)
console.log(`relayURL: ${relayURL}`)
console.log(`mailboxURL: ${mailboxURL}`)

const command = `NODE_ENV=playground yarn build:worker && NODE_ENV=playground vue-cli-service build`;

try {
    execSync(command);
} catch (error) {
    console.error(error);
    exit(3);
}

