import * as foxUtils from 'fox-utils'
import * as util from './util'
import type { ParsedArgs } from 'minimist'
import { doAction, doWatch } from './action'
import debug from './debug'
import rimraf from 'rimraf'

const { log } = foxUtils

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
  --listPlugins  List all installed plugins. Note that plugins
                 installed multiple times may only be shown once
  --bootstrap    Bootstraps configuration
  --fix          Fixes all files with all formatters
  --clearCache   Nukes cache in \`.config/.cache\`
  --help         Show help

Notes:
  Not passing any options opens the tui

Examples:
  ${pluginName}
    opens the terminal user interface
  ${pluginName} --bootstrap
    bootstraps configuration of all plugins
  ${pluginName} --bootstrap eslint,stylelint
    bootstraps configuration for the eslint and stylelint plugins
  ${pluginName} --fix stylelint
    runs the linter for stylelint
  ${pluginName} --help`
		console.info(helpText)
	} else if (argv.list) {
		console.info(foxPluginPaths.map(util.getPluginNameFromPath).join('\n'))
	} else if (argv.bootstrap) {
		if (argv.bootstrap === "") {
			await doAction({
				foxPlugins,
				pluginSelection: -1,
				projectData,
				actionFunctionName: "bootstrapFunction",
			});

			return
		}

		const foxPluginNames = argv.bootstrap.split(",");
		await doAction({
			foxPlugins,
			pluginSelection: getPluginSelectionFromList(foxPluginPaths, foxPluginNames),
			projectData,
			actionFunctionName: "bootstrapFunction",
		});
	} else if (argv.fix) {
		if (argv.fix === "") {
			await doAction({
				foxPlugins,
				pluginSelection: -1,
				projectData,
				actionFunctionName: "fixFunction",
			});

			return
		}

		const foxPluginNames = argv.fix.split(",");
		await doAction({
			foxPlugins,
			pluginSelection: getPluginSelectionFromList(
				foxPluginPaths,
				foxPluginNames
			),
			projectData,
			actionFunctionName: "fixFunction",
		});

	} else if (argv.watch) {
		if (argv.watch === "") {
			await doWatch({
				foxPlugins,
				pluginSelection: -1,
				projectData,
			});

			return
		}

		const foxPluginNames = argv.watch.split(",");
		await doWatch({
			foxPlugins,
			pluginSelection: getPluginSelectionFromList(
				foxPluginPaths,
				foxPluginNames
			),
			projectData,
		});
	} else if (argv.clearCache) {
		rimraf(projectData.cachePath, (err) => {
			if (err) {
				log.error('unexpected error when removing the cache directory')
				console.error(err)
				return
			}
			log.success('cache directory nuked')
		})
	} else {
		log.warn('argument(s) or parameter(s) not understood')
	}
}

/**
 * @description this gets the plugin selection from a human readable list
 * @example
 * ```
 * getPluginSelectionFromList(['fox-plugin-eslint'])
 * ```
 */
function getPluginSelectionFromList(foxPluginPaths: string[], plugins: string): number[] {
	debug('pluginSelectionFromList: foxPluginPaths: %o', foxPluginPaths)
	debug('pluginSelectionFromList: plugins: %o', plugins)

	const pluginSelection: number[] = []
	const foxPluginNames = foxPluginPaths.map(util.getPluginNameFromPath)
	for (const plugin of plugins) {
		let found = false
		for (let i = 0; i < foxPluginNames.length; ++i) {
			const foxPluginName = foxPluginNames[i]
			const name = foxPluginName.slice('fox-plugin-'.length)
			if (name === plugin) {
				pluginSelection.push(i)
				found = true
			}
		}

		if (found === false) {
			log.error(`plugin ${plugin} not found`)
			process.exit(1)
		}
	}

	if (pluginSelection.length === 0) {
		log.info('no plugin selections were made')
		process.exit(1)
	}

	debug('pluginSelectionFromList: pluginSelection: %o', pluginSelection)
	return pluginSelection
}
