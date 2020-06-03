import path from 'path'
import url from 'url';
import chalk from 'chalk'

import { IFox } from 'fox-types'

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

/**
 * @description serialize foxOptions to and from the environment
 * @summary in some cases, we don't have control of when
 * a module is executed (ex. we pass in the path of `stylelint-config-fox`
 * in our `fox-plugin-stylelint` package directly to `stylelint` (we don't execute)
 * the module outselves and pass _that_ to `stylelint`). so do ensure
 * the module gets access to all `IFox` fox options, we pass it as an environment
 * variable
 */
export function setFoxOptionsToEnv(fox: IFox): void {
  process.env.FOX_SUITE_FOX_OPTIONS = JSON.stringify(fox)
}

export function getFoxOptionsFromEnv(): IFox {
  let foxOptions = process.env.FOX_SUITE_FOX_OPTIONS
  foxOptions = foxOptions || "{ error: 'process.env.FOX_SUITE_FOX_OPTIONS is falsey' }"
  return JSON.parse(foxOptions)
}
