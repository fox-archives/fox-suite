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
