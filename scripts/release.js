#!/usr/bin/env node
const {argv, env, exit} = require('process');
const {execSync} = require('child_process');

const {loadEnv} = require('./common');

const version = argv[2];

if (!version) {
    console.error("Usage: release.js <version>")
    exit(1);
}

const command = `towncrier build --yes --version=${version}`;

try {
    execSync(command, {stdio: 'pipe'});
} catch (error) {
    console.error(error);
    exit(3);
}
