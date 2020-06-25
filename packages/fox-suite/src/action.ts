import type { IAction, IPluginExportIndex, IProject } from 'fox-types'
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
}: IAction): Promise<void> {
	if (pluginSelection === void 0) {
		log.info("exiting tui");

		return;
	}

	let name =
		actionFunctionName === "bootstrapFunction"
			? "bootstrap"
			: actionFunctionName === "fixFunction"
			? "fix"
			: "action";

	// console.log(foxPlugins)
	// const actionFunctions = util.pickSpecificModuleProperty({
	// 	foxPlugins,
	// 	specificIndicesToPick: pluginSelection,
	// 	actionFunction: actionFunctionName,
	// });

	// debug('actionFunctions: %o', actionFunctions)

	// assert(Array.isArray(actionFunctions));

	type fn = IPluginExportIndex["bootstrapFunction"] | IPluginExportIndex["fixFunction"]
	const pickedFunctions: { fn: fn, name: string }[] = []
	for (let i = 0; i < foxPlugins.length; ++i) {
		const foxPlugin = foxPlugins[i]
		if (Array.isArray(pluginSelection)) {

			for(const indice of pluginSelection) {
				if (indice === i) {
					pickedFunctions.push({
						fn: foxPlugin[actionFunctionName],
						name: foxPlugin.info.toolName
					})
				}
			}
		} else {
			if (pluginSelection === i || pluginSelection === -1) {
				pickedFunctions.push({
					fn: foxPlugin[actionFunctionName],
					name: foxPlugin.info.toolName
				})
			}
		}
	}

	for(const obj of pickedFunctions) {
		if (!obj.fn) continue

		log.info(`running ${obj.name}`)
		await obj.fn(projectData.foxConfig)
	}

	log.info(`${name} complete`)
}

interface IDoWatch {
	foxPluginPaths: string[]
	foxPlugins: IPluginExportIndex[]
	pluginSelection: number | number[]
	projectData: IProject
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
