type option = 'off' | 'cozy' | 'strict' | 'excessive'

export interface IFox {
  all: option,
  monorepo: boolean,
  plugin: {
		eslint: option,
		stylelint: option
  }
}

export interface IPlugin {
	info: IPluginInfo,
	bootstrapFunction?: () => Promise<void>
	formatFunction?: (fox: IFox) => Promise<void>
	lintFunction?: (fox: IFox) => Promise<void>
}

export interface IPluginInfo {
	name: string,
	tool: string,
	toolConfig: string,
	description: string,
	descriptionLong: string
}

export interface ICli {
	pluginName: string,
	pluginDescription: string,
	bootstrapFunction: () => Promise<void>,
	actionFunction: (fox: IFox) => Promise<void>
}

export interface IProject {
	packageJson: Record<string, any>
	packageJsonPath: string,
	foxConfig: IFox
	foxConfigPath: string,
	location: string
}
