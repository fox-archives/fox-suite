import * as foxUtils from 'fox-utils'
import * as util from './util'
import type { ParsedArgs } from "minimist"
import { doBootstrap, doFix, doWatch } from './action';
import debug from './debug'
import * as c from 'colorette'

/**
 * @description start `fox` based on cli arguments if any were given
 */
export async function cli(argv: ParsedArgs): Promise<void> {
	debug('activating cli. passed args: %o', argv)
	const projectData = await foxUtils.getProjectData()
	const foxPluginPaths = await util.getFoxPlugins(projectData)
	const foxPlugins = await util.importFoxPlugins(projectData, foxPluginPaths)

	debug('projectData: %o', projectData)
	debug('foxPluginPaths: %o', foxPluginPaths)
	debug('foxPlugins: %o', foxPlugins)

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
		await doBootstrap({
			foxPlugins,
			pluginSelection: -1,
			projectData
		})
	} else if (argv.fix) {
		await doFix({
			foxPluginPaths,
			foxPlugins,
			pluginSelection: -1,
			projectData
		})
	} else if (argv.watch) {
		await doWatch({
			foxPluginPaths,
			foxPlugins,
			pluginSelection: -1,
			projectData
		})
	} else {
		c.bold(c.red('argument(s) or parameter(s) not understood'))
	}
}
