import { PackageJson } from 'type-fest'
type option = 'off' | 'cozy' | 'strict' | 'excessive'

export interface IFox {
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
	actionFunction: (fox: IFox) => Promise<void>
}

/**
 * @description used when building a bootstrap
 */
export interface IBuildBootstrap {
	dirname: string
}

/**
 * @description used when dealing with user projects (the actual
 * project this tool gets installed to)
 */
export interface IProject {
	packageJson: PackageJson
	packageJsonPath: string,
	foxConfig: IFox
	foxConfigPath: string,
	location: string
}

/**
 * @description found in a plugin's `src/index.ts` file
 */
export interface IPlugin {
	info: IPluginInfo,
	bootstrapFunction?: () => Promise<void>
	formatFunction?: (fox: IFox) => Promise<void>
	lintFunction?: (fox: IFox) => Promise<void>
}

/**
 * @description found in a plugin's `src/info.ts` file
 */
export interface IPluginInfo {
	name: string,
	tool: string,
	toolConfigSchemaHelpUri: string,
	description: string,
	descriptionLong: string
}

/**
 * @private
 * @description this is used internally when dealing with plugins
 */
export interface IPluginPrivateInfo {
	templateDir: string,
	pluginRoot: string
}
