import * as foxUtils from "fox-utils";
import { bootstrapFunction, fixFunction } from "./";
import { info } from './info'

export async function cli() {
	await foxUtils.buildCli(process.argv, {
		pluginName: info.name,
		pluginDescription: info.description,
		bootstrapFunction,
		fixFunction
	});
}
AA
