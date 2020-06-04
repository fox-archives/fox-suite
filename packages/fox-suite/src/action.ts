import type { IProject, IPlugin } from 'fox-types'

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

/**
 * @description bootstraps, formats, or lints a project
 */
export async function doAction({
	action: actionFunctions,
	projectData
}: IActionFunction): Promise<void> {
	if (Array.isArray(actionFunctions)) {
		for (const actionFunction of actionFunctions) {
			if (!actionFunction) continue

			await actionFunction(projectData.foxConfig)
		}
	} else if (actionFunctions) {
		await actionFunctions(projectData.foxConfig)
	}

	process.exit(1)
}
