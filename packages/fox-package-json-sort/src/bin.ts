import * as foxUtils from 'fox-utils'
import { bootstrapFunction, lintFunction } from './'

export async function bin() {
	await foxUtils.buildCli(process.argv, {
		moduleName: 'fox-package-json-sort',
		moduleDescription: 'Lints (sorts) the package.json',
		bootstrapFunction,
		actionFunction: lintFunction
	});
}
