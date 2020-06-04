import path from 'path'
import htmlhint from 'htmlhint'
import type { IFox } from "fox-types";
import * as foxUtils from "fox-utils";

export { info } from './info'

export async function bootstrapFunction(): Promise<void> {
	const templateFiles = [
		".config/htmlhint.config.js"
	]
	await foxUtils.buildBootstrap({
		templateRoot: path.join(__dirname, '../src/templates'),
		// templateRoot: path.join(foxUtils.__dirname(import.meta), '../src/templates'),
		templateFiles
	})
}

export async function lintFunction(fox: IFox): Promise<void> {

}
