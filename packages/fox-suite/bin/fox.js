#!/usr/bin/env node

// import { cli } from '../build/bin.js'

require = require("fox-esm")(module);

const { cli } = require("../build/bin.js");

cli();
