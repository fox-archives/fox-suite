import * as foxUtils from 'fox-utils';
import { bootstrapFunction, lintFunction } from '.'
import { info } from './info'

export async function bin() {
	await foxUtils.buildCli(process.argv, {
		moduleName: info.name,
		moduleDescription: info.description,
		bootstrapFunction,
		actionFunction: lintFunction
	});
}
