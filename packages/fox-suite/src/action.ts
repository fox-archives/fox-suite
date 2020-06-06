import type { IAction } from 'fox-types'
import chokidar from 'chokidar'
import throttle from 'lodash.throttle'

/**
 * @description bootstraps, formats, or lints a project
 */
export async function doAction({
	actionFunctions,
	projectData
}: IAction): Promise<void> {
	if (Array.isArray(actionFunctions)) {
		for (const fixFunction of actionFunctions) {
			if (!fixFunction) continue

			await fixFunction(projectData.foxConfig)
		}
	} else if (actionFunctions) {
		await actionFunctions(projectData.foxConfig)
	} else {
		throw new Error('passed parameter was not as expected')
	}
}

export async function watchAndDoAction({
	actionFunctions,
	projectData
}: IAction): Promise<void> {
	// test for watchers and then do action
	const watcher = await chokidar.watch('**/**', {
		ignored: [
			'**/node_modules/**',
			'**/web_modules/**',
			'**/.git/**',
			'**/.hg/**'
		],
		persistent: true,
		cwd: projectData.location
	})

	let totalFiles = 0
	watcher.on('add', path => totalFiles++)
	watcher.on('unlink', path => totalFiles--)
	watcher.on('change', async path => {
		console.log(`${path} of ${totalFiles} files changed. recompiling config files and executing fixers`)

		await doAction({
			actionFunctions,
			projectData
		})
	})

	console.log('starting watcher')
}
