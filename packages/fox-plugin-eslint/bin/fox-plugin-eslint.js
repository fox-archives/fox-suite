#!/usr/bin/env node

require = require('fox-esm')(module);

const { cli } = require('../build/bin');

cli();
