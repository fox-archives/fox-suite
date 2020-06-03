import path from 'path'
import prettier from 'prettier'
import { IFox } from "fox-types";
import * as foxUtils from "fox-utils";

export { info } from './info'

export async function bootstrapFunction(): Promise<void> {
	const templateFiles = [
		".config/prettier.config.js",
		".config/prettierignore"
	]
	await foxUtils.useBootstrapTemplate({
		templateRoot: path.join(__dirname, '../src/templates'),
		// templateRoot: path.join(foxUtils.__dirname(import.meta), '../src/templates'),
		templateFiles
	})
}

export async function formatFunction(fox: IFox): Promise<void> {

}
