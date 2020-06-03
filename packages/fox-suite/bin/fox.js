#!/usr/bin/env node

require = require("esm")(module, {

})

// import { bin } from '../build/bin.js'
const { bin } = require('../build/bin')

bin()
