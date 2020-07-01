import type { IPluginExportInfo } from 'fox-types'

export const info: IPluginExportInfo = {
	name: 'fox-plugin-editorconfig',
	tool: 'editorconfig',
	toolName: 'EditorConfig',
	toolConfigSchemaHelpUri: 'https://editorconfig.org/#file-format-details',
	description: 'Language agnostic code / text formatting styles',
	descriptionLong: 'EditorConfig helps maintain consistent coding styles for multiple developers working on the same project across various editors and IDEs. The EditorConfig project consists of a file format for defining coding styles and a collection of text editor plugins that enable editors to read the file format and adhere to defined styles. EditorConfig files are easily readable and they work nicely with version control systems.',
}
