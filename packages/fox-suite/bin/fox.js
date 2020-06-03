#!/usr/bin/env node

require = require("fox-esm")(module)

const { bin } = require('../build/bin')
bin()
