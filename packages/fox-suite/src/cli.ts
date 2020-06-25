import * as foxUtils from 'fox-utils'
import * as util from './util'
import type { ParsedArgs } from 'minimist'
import { doAction, doWatch } from './action'
import debug from './debug'
import rimraf from 'rimraf'
import path from 'path'

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
    this opens the terminal user interface
	${pluginName} --bootstrap
    this bootstraps configuration of all plugins
  ${pluginName} --bootstrap eslint,stylelint
  ${pluginName} --help`
		console.info(helpText)
	} else if (argv.list) {
		console.info(foxPluginPaths.map(util.getPluginNameFromPath).join('\n'))
	} else if (argv.bootstrap) {
		if (argv.bootstrap !== "") {
			const plugins = argv.bootstrap.split(',')
			await doAction({
				foxPlugins,
				foxPluginPaths,
				pluginSelection: getPluginSelectionFromList(foxPluginPaths, plugins),
				projectData,
				actionFunctionName: 'bootstrapFunction'
			})

			return
		}

		await doAction({
			foxPlugins,
			foxPluginPaths,
			pluginSelection: -1,
			projectData,
			actionFunctionName: 'bootstrapFunction'
		})
	} else if (argv.fix) {
		if (argv.fix !== "") {
			const plugins = argv.fix.split(',')
			await doAction({
				foxPlugins,
				foxPluginPaths,
				pluginSelection: getPluginSelectionFromList(foxPluginPaths, plugins),
				projectData,
				actionFunctionName: 'fixFunction'
			})
			return
		}
		await doAction({
			foxPlugins,
			foxPluginPaths,
			pluginSelection: -1,
			projectData,
			actionFunctionName: 'fixFunction'
		})
	} else if (argv.watch) {
		if (argv.watch !== "") {
			const plugins = argv.watch.split(',')
			await doWatch({
				foxPlugins,
				foxPluginPaths,
				pluginSelection: getPluginSelectionFromList(foxPluginPaths, plugins),
				projectData
			})
			return
		}
		await doWatch({
			foxPluginPaths,
			foxPlugins,
			pluginSelection: -1,
			projectData,
		})
	} else if (argv.clearCache) {
		const cacheDir = path.join(projectData.location, '.config', '.cache')
		rimraf(cacheDir, (err) => {
			if (err) {
				log.error('there was an error removing the cache directory')
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
