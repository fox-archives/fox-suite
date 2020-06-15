import type { IAction, IPluginExportIndex, IProject } from 'fox-types'
import chokidar from 'chokidar'
import * as c from 'colorette'
import * as util from './util'
import assert from 'assert'

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
	const getPluginName = (pluginPath: string) =>  {
		let str = pluginPath.slice(pluginPath.lastIndexOf('fox-plugin-'))
		return str.slice(0, str.indexOf('/'))
	}

	if (pluginSelection === void 0) {
		console.log(c.bold(c.red("exiting tui")));
		return;
	}

	let name =
		actionFunctionName === "bootstrapFunction"
			? "bootstrap"
			: actionFunctionName === "fixFunction"
			? "fix"
			: "action";

	const actionFunctions = util.pickSpecificModuleProperty({
		foxPlugins,
		specificIndicesToPick: pluginSelection,
		actionFunction: actionFunctionName,
	});

	assert(Array.isArray(actionFunctions));

	for (let i = 0; i < actionFunctions.length; ++i) {
		const fixFunction = actionFunctions[i]
		if (!fixFunction) continue;
		console.log(c.bold(c.blue(`running ${getPluginName(foxPluginPaths[i])}`)))
		await fixFunction(projectData.foxConfig);
	}

	console.log(c.bold(c.blue(`${name} complete`)));
}

interface IDoWatch {
	foxPluginPaths: string[]
	foxPlugins: IPluginExportIndex[]
	pluginSelection: number
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
		console.log(c.bold(c.red('exiting tui')))
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

	console.log('starting watcher')
}
