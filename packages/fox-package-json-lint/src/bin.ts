import * as foxUtils from 'fox-utils';
import { bootstrapFunction, lintFunction } from '.'

export async function bin() {
	await foxUtils.buildCli(process.argv, {
		moduleName: 'fox-htmlhint',
		moduleDescription: 'Lints the `package.json`',
		bootstrapFunction,
		actionFunction: lintFunction
	});
}
