import * as foxUtils from 'fox-utils'
import * as util from './util'
import { doAction } from './action';
import type { ParsedArgs } from "minimist"
import { IPluginExportIndex } from 'fox-types';
import debug from './debug'
import * as c from 'colorette'

/**
 * @description start `fox` based on cli arguments if any were given
 */
export async function cli(argv: ParsedArgs): Promise<void> {
	debug('activating cli. passed args: %o', argv)
	const [projectData, foxPlugins] = await Promise.all([
		foxUtils.getProjectData(), util.getInstalledFoxPlugins()
	])

	const promises: Promise<IPluginExportIndex>[] = []
	for (const foxPluginPath of foxPlugins) {
		promises.push(import(foxPluginPath))
	}
	const foxPluginModules = await Promise.all(promises)

	if (argv.help) {
		const pluginName = 'fox-suite'
		const helpText = `Usage:
  ${pluginName}

Description:
  A sly suite of tools for web development

Options:
  --boostrap   Bootstrap all configuration
  --format     Format files with all formatters
  --lint       Lint files with all linters
  --help       Show help

Examples:
  ${pluginName} --bootstrap
  ${pluginName} --help`;
	console.info(helpText)
	} else if(argv.bootstrap) {
		await doAction({
			action: util.pickModuleProperty(foxPluginModules, "bootstrapFunction"),
			projectData
		})
		console.log(c.bold(c.green('bootstrap complete')))
	} else if (argv.format) {
		await doAction({
			action: util.pickModuleProperty(foxPluginModules, "formatFunction"),
			projectData
		})
		console.log(c.bold(c.green('format complete')))
	} else if (argv.lint) {
		await doAction({
			action: util.pickModuleProperty(foxPluginModules, "lintFunction"),
			projectData
		})
		console.log(c.bold(c.green('lint complete')))
	}
}
