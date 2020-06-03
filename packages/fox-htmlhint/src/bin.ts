import { bootstrapFunction, lintFunction } from "./";
import * as foxUtils from "fox-utils";

export async function bin() {
	await foxUtils.buildCli(process.argv, {
		moduleName: 'fox-htmlhint',
		moduleDescription: 'Lints the html files of current project',
		bootstrapFunction,
		actionFunction: lintFunction
	});
}
