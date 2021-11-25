#!/usr/bin/env node
// NB: loads .env file into respective env vars
// (see: https://github.com/motdotla/dotenv#readme)
const dotenv = require('dotenv')

const {argv, env, exit} = require('process');
const {execSync} = require('child_process');

const {loadEnv} = require('./common');

const stage = argv[2];
if (!stage) {
    console.error("Usage: uncache.js <stage name>")
    exit(1);
}

const envPath = `.${stage}.env`;
loadEnv(envPath);

const dist_id = env['CDF_DISTRIBUTION_ID'];
const command = `aws cloudfront create-invalidation \
 --distribution-id ${dist_id} \
 --paths /index.html \
         /assets/wormhole.wasm \
         /worker/index.umd.js`;

try {
    execSync(command);
} catch (error) {
    console.error(error);
    exit(3);
}

