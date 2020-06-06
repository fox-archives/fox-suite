import * as foxUtils from 'fox-utils'
import { transpileConfig } from 'fox-transpiler'
import * as util from './util'
import { doAction, watchAndDoAction } from './action';
import type { ParsedArgs } from "minimist"
import { IPluginExportIndex } from 'fox-types';
import debug from './debug'
import * as c from 'colorette'

/**
 * @description start `fox` based on cli arguments if any were given
 */
export async function cli(argv: ParsedArgs): Promise<void> {
	debug('activating cli. passed args: %o', argv)
	const [projectData, foxPluginPaths] = await Promise.all([
		foxUtils.getProjectData(), util.getInstalledFoxPlugins()
	])

	const promises: Promise<IPluginExportIndex>[] = []
	for (const foxPluginPath of foxPluginPaths) {
		promises.push(import(foxPluginPath))
	}
	const foxPlugins = await Promise.all(promises)

	if (argv.help) {
		const pluginName = 'fox'
		const helpText = `Usage:
  ${pluginName}

Description:
  A sly suite of tools for web development

Options:
  --boostrap   Bootstrap all configuration
  --format     Format files with all formatters
  --lint       Lint files with all linters
  --help       Show help

Notes:
  Not passing any options opens the tui

Examples:
  ${pluginName}
  ${pluginName} --bootstrap
  ${pluginName} --help`;
	console.info(helpText)
	} else if(argv.bootstrap) {
		await transpileConfig({
			foxPluginPaths,
			projectData
		})
		await doAction({
			actionFunctions: util.pickModuleProperty(foxPlugins, "bootstrapFunction"),
			projectData
		})
		console.log(c.bold(c.green('bootstrap complete')))
	} else if (argv.fix) {
		await transpileConfig({
			foxPluginPaths,
			projectData
		})
		await doAction({
			actionFunctions: util.pickModuleProperty(foxPlugins, "fixFunction"),
			projectData
		})
		console.log(c.bold(c.green('fix complete')))
	} else if (argv.watch) {
		await transpileConfig({
			foxPluginPaths,
			projectData
		})
		await watchAndDoAction({
			actionFunctions: util.pickModuleProperty(foxPlugins, "fixFunction"),
			projectData
		})
	}
}
