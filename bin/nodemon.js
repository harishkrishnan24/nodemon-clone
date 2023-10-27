#!/usr/bin/env node

import cli from "../lib/cli";

const options = cli.parse(process.argv);

console.log(options);
