#!/usr/bin/env node

const cli = require("../lib/cli");

const options = cli.parse(process.argv);

console.log(options);
