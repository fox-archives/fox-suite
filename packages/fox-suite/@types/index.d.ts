import type { IPluginExportIndex, IProject } from 'fox-types'

interface IAction {
	projectData: IProject
}

interface IActionBootstrap extends IAction {
	action: IPluginExportIndex["bootstrapFunction"] | IPluginExportIndex["bootstrapFunction"][]
}

interface IActionFix extends IAction {
	action: IPluginExportIndex["fixFunction"] | IPluginExportIndex["fixFunction"][],
}

export type IActionFunction = IActionBootstrap | IActionFix
