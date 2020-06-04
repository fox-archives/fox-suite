import * as c from 'colorette';
import { IFoxConfig } from "fox-types";

/**
 * functions that can't be put in other categories
 */

/**
 * @description serialize foxOptions to and from the environment
 * @summary in some cases, we don't have control of when
 * a module is executed (ex. we pass in the path of `stylelint-config-fox`
 * in our `fox-plugin-stylelint` package directly to `stylelint` (we don't execute)
 * the module outselves and pass _that_ to `stylelint`). so do ensure
 * the module gets access to all `IFoxConfig` fox options, we pass it as an environment
 * variable
 */
export function setFoxOptionsToEnv(fox: IFoxConfig): void {
	process.env.FOX_SUITE_FOX_OPTIONS = JSON.stringify(fox)
}

/**
 * @description serialize foxOptions to and from the environment
 * @summary see foxUtils.setFoxOptionsToEnv for details on when to use this
 */
export function getFoxOptionsFromEnv(): IFoxConfig {
	let foxOptions = process.env.FOX_SUITE_FOX_OPTIONS
	foxOptions = foxOptions || "{ error: 'process.env.FOX_SUITE_FOX_OPTIONS is falsey' }"
	console.error(c.bold(c.red('process.env.FOX_SUITE_FOX_OPTIONS is falsey. your configuration may not be what you expect')))
	return JSON.parse(foxOptions)
}

/**
 * @description create handlers for uncaughtException
 * and unhandledRejections
 */
export function setup() {
	process.on('uncaughtException', (err) => console.error(err))
	process.on('unhandledRejection', (err) => console.error(err))
}
