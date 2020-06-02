import path from 'path'
import url from 'url';

import chalk from 'chalk'
/**
 * general miscellaneous utility functions
 */

export function setup() {
  process.on('uncaughtException', (err) => console.error(err))
  process.on('unhandledRejection', (err) => console.error(err))
}

export const is = {
  string: (val: any): boolean =>
    typeof val === 'string',
  array: (val: any): boolean =>
    Array.isArray(val),
  object: (val: any): boolean =>
    typeof val === 'object' && !Array.isArray(val),
  function: (val: any): boolean =>
    typeof val === 'function'
}

/**
 * @desc prints text in green color
 */
export function printSuccess(text: string): void {
  console.log(chalk.green(text))
}

/**
 * @desc Resolves an absolute path relative to the current working
 * directory. prepends a './' if it doesn't already exist
 */
export function toRelativePath(absolutePath: string): string {

  let relativePath = path.relative(process.cwd(), absolutePath)

  if (relativePath.slice(0, 2) !== './' && relativePath.slice(0, 3) !== '../')
    relativePath = './' + relativePath
  return relativePath
}

export function __dirname(importMeta: ImportMeta): string {
  return path.dirname(url.fileURLToPath(importMeta.url));
}
