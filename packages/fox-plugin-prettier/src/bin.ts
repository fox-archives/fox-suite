import { bootstrapFunction, formatFunction } from ".";
import * as foxUtils from "fox-utils";
import { info } from './info'

export async function bin() {
	await foxUtils.buildCli(process.argv, {
		pluginName: info.name,
		pluginDescription: info.description,
		bootstrapFunction,
		fixFunction: formatFunction
	});
}
