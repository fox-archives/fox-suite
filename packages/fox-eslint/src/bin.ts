import { bootstrapFunction, lintFunction } from "./";
import * as foxUtils from "fox-utils";
import { info } from './info'

export async function bin() {
	await foxUtils.buildCli(process.argv, {
		moduleName: info.name,
		moduleDescription: info.description,
		bootstrapFunction,
		actionFunction: lintFunction
	});
}
