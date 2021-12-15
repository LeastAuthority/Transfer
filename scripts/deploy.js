#!/usr/bin/env node
const {argv, env, exit} = require('process');
const {execSync} = require('child_process');

const {loadEnv} = require('./common');

const stage = argv[2];
if (!stage) {
    console.error("Usage: deploy.js <stage name>")
    exit(1);
}

const envPath = `.${stage}.env`;
loadEnv(envPath);

const bucket = env['S3_BUCKET'];
const command = `aws s3 sync ./dist ${bucket}`;

try {
    execSync(command, {stdio: 'pipe'});
} catch (error) {
    console.error(error);
    exit(3);
}
