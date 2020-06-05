import { PackageJson } from 'type-fest'
import type { Stats } from 'fs'
type option = 'off' | 'cozy' | 'strict' | 'excessive'

/**
 * @description format of the `fox.config.js` file
 */
export interface IFoxConfig {
  all: option,
  monorepo: boolean,
  plugin: {
		eslint: option,
		stylelint: option
  }
}

/**
 * @description used when building a cli
 */
export interface IBuildCli {
	pluginName: string,
	pluginDescription: string,
	bootstrapFunction?: () => Promise<void>,
	actionFunction: (fox: IFoxConfig) => Promise<void>
}

/**
 * @description used when building a bootstrap
 */
export interface IBuildBootstrap {
	dirname: string
}

/**
 * @description used when building a lint
 */
export interface IBuildLint {
	dirname: string,
	fn: () => Promise<void>
}

/**
 * @description used when dealing with user projects (the actual
 * project this tool gets installed to)
 */
export interface IProject {
	packageJson: PackageJson
	packageJsonPath: string,
	foxConfig: IFoxConfig
	foxConfigPath: string,
	location: string
}

/**
 * @private
 */
export interface ITemplateFile {
	absolutePath: string,
	relativePath: string,
	stats: Stats
}

/**
 * @private
 * @description this is when dealing with plugins
 */
export interface IPlugin {
	templateDir: string,
	templateFiles: ITemplateFile[],
	pluginRoot: string,
	packageJson: PackageJson
}

/**
 * @description found in a plugin's `src/index.ts` file
 */
export interface IPluginExportIndex {
	info: IPluginExportInfo,
	bootstrapFunction?: () => Promise<void>
	formatFunction?: (fox: IFoxConfig) => Promise<void>
	lintFunction?: (fox: IFoxConfig) => Promise<void>
}

/**
 * @description found in a plugin's `src/info.ts` file
 */
export interface IPluginExportInfo {
	name: string,
	tool: string,
	toolConfigSchemaHelpUri: string,
	description: string,
	descriptionLong: string
}

