import type { IAction, IPluginExportIndex, IProject } from 'fox-types'
import chokidar from 'chokidar'
import * as c from 'colorette'
import * as util from './util'
import assert from 'assert'

function transpileConfig() {
	console.log('transpile')
}

/**
 * @description bootstraps, formats, or lints a project
 */
async function doAction({
	actionFunctions,
	projectData
}: IAction): Promise<void> {
	assert(Array.isArray(actionFunctions))

	for (const fixFunction of actionFunctions) {
		if (!fixFunction) continue

		await fixFunction(projectData.foxConfig)
	}
}

async function watchAndDoAction(transpile: () => Promise<void>, {
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

/* --------------------- do[action] --------------------- */

interface IDoBootstrap {
	foxPlugins: IPluginExportIndex[],
	pluginSelection: number,
	projectData: IProject
}

export async function doBootstrap({
	foxPlugins,
	pluginSelection,
	projectData
}: IDoBootstrap): Promise<void> {
	if(pluginSelection === void 0) {
		console.log(c.bold(c.red('exiting tui')))
		return
	}

	await doAction({
		actionFunctions: util.pickSpecificModuleProperty({
			foxPlugins,
			specificIndicesToPick: pluginSelection,
			actionFunction: "bootstrapFunction"
		}),
		projectData
	})

	console.log(c.bold(c.green('bootstrap complete')))
}

interface IDoFix {
	foxPluginPaths: string[],
	foxPlugins: IPluginExportIndex[],
	pluginSelection: number,
	projectData: IProject
}

export async function doFix({
	foxPluginPaths,
	foxPlugins,
	pluginSelection,
	projectData
}: IDoFix): Promise<void> {
	if (pluginSelection === void 0) {
		console.log(c.bold(c.red('exiting tui')))
		return
	}

	await transpileConfig({
		foxPluginPaths: util.pickSpecificFoxPluginPath(foxPluginPaths, pluginSelection),
		projectData
	})

	await doAction({
		actionFunctions: util.pickSpecificModuleProperty({
			foxPlugins,
			specificIndicesToPick: pluginSelection,
			actionFunction: "fixFunction"
		}),
		projectData
	})

	console.log(c.bold(c.green('fix complete')))
}

interface IDoWatch {
	foxPluginPaths: string[],
	foxPlugins: IPluginExportIndex[],
	pluginSelection: number,
	projectData: IProject
}

export async function doWatch({
	foxPluginPaths,
	foxPlugins,
	pluginSelection,
	projectData
}: IDoWatch): Promise<void> {
	if (pluginSelection === void 0) {
		console.log(c.bold(c.red('exiting tui')))
		return
	}

	let transpile = async () => await transpileConfig({
		foxPluginPaths: util.pickSpecificFoxPluginPath(foxPluginPaths, pluginSelection),
		projectData
	})

	await watchAndDoAction(transpile, {
		actionFunctions: util.pickSpecificModuleProperty({
			foxPlugins,
			specificIndicesToPick: pluginSelection,
			actionFunction: "fixFunction"
		}),
		projectData
	})
}
