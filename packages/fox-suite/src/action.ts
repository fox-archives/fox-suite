import type { IActionFunction } from '../@types/index'

/**
 * @description bootstraps, formats, or lints a project
 */
export async function doAction({
	action: actionFunctions,
	projectData
}: IActionFunction): Promise<void> {
	if (Array.isArray(actionFunctions)) {
		for (const fixFunction of actionFunctions) {
			if (!fixFunction) continue

			await fixFunction(projectData.foxConfig)
		}
	} else if (actionFunctions) {
		await actionFunctions(projectData.foxConfig)
	}

	process.exit(1)
}

export async function watchAndDoAction({
	action: actionFunctions,
	projectData
}: IActionFunction): Promise<void> {
	// test for watchers and then do action
	console.log('fake watching')

	await doAction({
		action: actionFunctions,
		projectData
	})
}
