import path from 'path'
import htmlhint from 'htmlhint'

import * as foxUtils from "fox-utils";

export async function bootstrapFunction(): Promise<void> {
	const templateFiles = [
		".config/htmlhint.config.js"
	]
	await foxUtils.useBootstrapTemplate({
		templateRoot: path.join(__dirname, '../src/templates'),
		// templateRoot: path.join(foxUtils.__dirname(import.meta), '../src/templates'),
		templateFiles
	})
}
