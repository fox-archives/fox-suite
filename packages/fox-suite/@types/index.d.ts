import type { IPluginExportIndex, IProject } from 'fox-types'

export type actionFunction =
	| IPluginExportIndex["bootstrapFunction"]
	| IPluginExportIndex["fixFunction"]

/**
 * @description basically a single unit that has information
 * about the stuff we want to do to a specific project
 */
export interface IDoAction {
	foxPlugins: IPluginExportIndex[];
	foxPluginPaths: string[];
	projectData: IProject;
	pluginSelection: -1 | number[];
	actionFunctionName: "bootstrapFunction" | "fixFunction";
}

export interface IDoWatch {
	foxPluginPaths: string[]
	foxPlugins: IPluginExportIndex[]
	pluginSelection: -1 | number[]
	projectData: IProject
}
