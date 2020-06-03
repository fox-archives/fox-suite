import { bootstrapFunction, formatFunction } from "./";
import * as foxUtils from "fox-utils";

export async function bin() {
	await foxUtils.buildCli(process.argv, {
		moduleName: 'fox-prettier',
		moduleDescription: 'Lints the files of current project',
		bootstrapFunction,
		actionFunction: formatFunction
	});
}
