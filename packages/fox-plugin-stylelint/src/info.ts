import type { IPluginExportInfo } from 'fox-types'

export const info: IPluginExportInfo = {
	name: 'fox-plugin-stylelint',
	tool: 'stylelint',
	toolName: 'Stylelint',
	toolConfigSchemaHelpUri: 'https://stylelint.io/user-guide/rules/list',
	description: 'Formats CSS files',
	descriptionLong: 'Formats CSS files, and performs some autofixing',
}
