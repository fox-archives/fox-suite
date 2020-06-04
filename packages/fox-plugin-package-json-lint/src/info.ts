import type { IPluginExportInfo } from 'fox-types'

export const info: IPluginExportInfo = {
	name: 'fox-plugin-package-json-lint',
	tool: 'npm-package-json-lint',
	toolConfigSchemaHelpUri: 'https://npmpackagejsonlint.org/docs/en/rules',
	description: 'Lints the pacakge.json file',
	descriptionLong: 'Lints the package.json file. Has autofix?'
}
