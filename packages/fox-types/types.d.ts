type option = 'off' | 'cozy' | 'strict' | 'excessive'

export interface IFox {
  all: option,
  monorepo: boolean,
  module: {
    eslint: option
  }
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
