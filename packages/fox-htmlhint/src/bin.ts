import { bootstrapFunction, lintFunction } from "./";
import { info } from './info'
import * as foxUtils from "fox-utils";

export async function bin() {
	await foxUtils.buildCli(process.argv, {
		pluginName: info.name,
		pluginDescription: info.description,
		bootstrapFunction,
		actionFunction: lintFunction
	});
}
