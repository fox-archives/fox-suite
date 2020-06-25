import type { IDoAction, IDoWatch, actionFunction } from '../@types/index'
import * as foxUtils from 'fox-utils'
import chokidar from 'chokidar'
import * as util from './util'
import assert from 'assert'
import debug from './debug'

const { log } = foxUtils

/**
 * @description bootstraps, formats, or lints a project
 */
export async function doAction({
	foxPlugins,
	foxPluginPaths,
	projectData,
	pluginSelection,
	actionFunctionName,
}: IDoAction): Promise<void> {
	if (pluginSelection === void 0) {
		log.info("exiting tui");
		return;
	}

	const pickedFunctions: { fn: actionFunction, name: string }[] = []
	for (let i = 0; i < foxPlugins.length; ++i) {
		const foxPlugin = foxPlugins[i]
		if (pluginSelection === -1) {
			pickedFunctions.push({
				fn: foxPlugin[actionFunctionName],
				name: foxPlugin.info.toolName
			})
		} else if (Array.isArray(pluginSelection)) {
			for(const indice of pluginSelection) {
				if (indice === i) {
					pickedFunctions.push({
						fn: foxPlugin[actionFunctionName],
						name: foxPlugin.info.toolName
					})
				}
			}
		} else {
			log.error('pluginSelection not an expected value. exiting.')
			return
		}
	}

	for(const obj of pickedFunctions) {
		if (!obj.fn) continue

		await obj.fn(projectData.foxConfig)
	}

	let actionFunctionNameNice =
		actionFunctionName === "bootstrapFunction"
		? "bootstrap"
		: actionFunctionName === "fixFunction"
		? "fix"
		: "unknown";

	log.success(`'${actionFunctionNameNice}' complete`)
}


/**
 * @description watch files and perform fixFunction on all files
 * if changes are detected
 */
export async function doWatch({
	foxPluginPaths,
	foxPlugins,
	pluginSelection,
	projectData,
}: IDoWatch): Promise<void> {
	if (pluginSelection === void 0) {
		log.info('exiting tui')
		return
	}

	// test for watchers and then do action
	const watcher = await chokidar.watch('**/**', {
		ignored: [
			'**/node_modules/**',
			'**/web_modules/**',
			'**/.git/**',
			'**/.hg/**',
		],
		persistent: true,
		cwd: projectData.location,
	})

	let totalFiles = 0
	watcher.on('add', (path) => totalFiles++)
	watcher.on('unlink', (path) => totalFiles--)
	watcher.on('change', async (path) => {
		if (path.includes('.config/build')) return

		console.log(
			`${path} of ${totalFiles} files changed. recompiling config files and executing fixers`,
		)

		await doAction({
			foxPlugins,
			foxPluginPaths,
			projectData,
			pluginSelection,
			actionFunctionName: "fixFunction",
		});
	})

	log.info('starting watcher')
}
