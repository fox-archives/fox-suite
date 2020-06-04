import type { IPluginExportIndex, IProject } from 'fox-types'

interface IAction {
	projectData: IProject
}

interface IActionBootstrap extends IAction {
	action: IPluginExportIndex["bootstrapFunction"] | IPluginExportIndex["bootstrapFunction"][]
}

interface IActionFormat extends IAction {
	action: IPluginExportIndex["formatFunction"] | IPluginExportIndex["formatFunction"][],
}

interface IActionLint extends IAction {
	action: IPluginExportIndex["lintFunction"] | IPluginExportIndex["lintFunction"][]
}

export type IActionFunction = IActionBootstrap | IActionFormat | IActionLint
