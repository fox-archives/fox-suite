import type { IActionFunction } from '../@types/index'

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
