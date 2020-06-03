import { bootstrapFunction, lintFunction } from "./";
import * as foxUtils from "fox-utils";

export async function bin() {
	await foxUtils.buildCli(process.argv, {
		moduleName: 'fox-stylelint',
		moduleDescription: 'Lints the css files of current project',
		bootstrapFunction,
		actionFunction: lintFunction
	});
}
