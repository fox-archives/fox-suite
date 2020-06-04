import type { IPlugin, IProject } from 'fox-types'

interface IAction {
	projectData: IProject
}

interface IActionBootstrap extends IAction {
	action: IPlugin["bootstrapFunction"] | IPlugin["bootstrapFunction"][]
}

interface IActionFormat extends IAction {
	action: IPlugin["formatFunction"] | IPlugin["formatFunction"][],
}

interface IActionLint extends IAction {
	action: IPlugin["lintFunction"] | IPlugin["lintFunction"][]
}

export type IActionFunction = IActionBootstrap | IActionFormat | IActionLint
