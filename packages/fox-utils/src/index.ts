import util from 'util'
import glob from 'glob'

const globP = util.promisify(glob)

export * as c from 'colorette'

/** @desc promisified glob */
export { globP as glob }

export * from "./bootstrap.js";
export * from "./cli.js";
export * from './fix.js';
export * from './misc';
export * from './plugin.js'
export * from './project.js'
export { debug } from './debug'
