import type { IAction } from 'fox-types'
import chokidar from 'chokidar'
import throttle from 'lodash.throttle'
import * as c from 'colorette'

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
		console.log(c.bold(c.red('no choice was made. exiting interface')))
		process.exit(1)
	}
}

export async function watchAndDoAction(transpile: () => Promise<void>, {
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
		if (path.includes('.config/build')) return

		console.log(`${path} of ${totalFiles} files changed. recompiling config files and executing fixers`)


		await transpile()
		await doAction({
			actionFunctions,
			projectData
		})
	})

	console.log('starting watcher')
}
