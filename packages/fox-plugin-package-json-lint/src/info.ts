import type { IPluginInfo } from 'fox-types'

export const info: IPluginInfo = {
	name: 'fox-plugin-package-json-lint',
	tool: 'PackageJsonLint',
	toolConfig: 'https://npmpackagejsonlint.org/docs/en/rules',
	description: 'Lints the pacakge.json file',
	descriptionLong: 'Lints the package.json file. Has autofix?'
}
