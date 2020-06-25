import prompts from 'prompts'
import * as foxUtils from 'fox-utils'
import { doAction, doWatch } from './action'
import * as util from './util'
import debug from './debug'
import { IPluginExportIndex } from 'fox-types'

const { log } = foxUtils

/**
 * @description if no command line arguments were given,
 * start (interactive) terminal user interface
 */
export async function tui(): Promise<void> {
	debug('activating tui')
	const projectData = await foxUtils.getProjectData()
	const foxPluginPaths = await util.getFoxPlugins(projectData)
	const foxPlugins = await util.importFoxPlugins(projectData, foxPluginPaths)

	debug('projectData: %o', projectData)
	debug('foxPluginPaths: %o', foxPluginPaths)
	debug('foxPlugins: %o', foxPlugins)

	const [ bootstrapChoices, fixChoices ] = createActionFunctionPrompts(foxPlugins, foxPluginPaths)
	const rootChoices = createRootPrompt(bootstrapChoices, fixChoices)

	const { action } = await prompts({
		type: 'select',
		name: 'action',
		message: 'Choose Action',
		choices: rootChoices,
	})

	if (action === 'bootstrap') {
		const { pluginSelection }: { pluginSelection: number[] } = await prompts({
			type: 'multiselect',
			name: 'pluginSelection',
			message: 'which configuration would you like to bootstrap?',
			choices: bootstrapChoices,
		})

		await doAction({
			foxPlugins,
			pluginSelection,
			projectData,
			actionFunctionName: 'bootstrapFunction'
		})
	} else if (action === 'fix') {
		const { pluginSelection }: { pluginSelection: number[] } = await prompts({
			type: 'multiselect',
			name: 'pluginSelection',
			message: 'Which formatter would you like to use?',
			choices: fixChoices,
		})

		await doAction({
			foxPlugins,
			pluginSelection,
			projectData,
			actionFunctionName: 'fixFunction'
		})
	} else if (action === 'watch') {
		const { pluginSelection }: { pluginSelection: number[] } = await prompts({
			type: 'multiselect',
			name: 'pluginSelection',
			message: 'Which formatter would you like to use?',
			choices: fixChoices,
		})

		await doWatch({
			foxPlugins,
			pluginSelection,
			projectData,
		})
	} else {
		log.info('exiting tui')
	}
}

/**
 * @description creates the root prompt
 */
function createRootPrompt(bootstrapChoices: prompts.Choice[], fixChoices: prompts.Choice[]): prompts.Choice[] {
	const actionChoices: prompts.Choice[] = []

	if (bootstrapChoices.length > 0)
		actionChoices.push({
			title: 'Bootstrap',
			description: 'Bootstrap configuration boilerplate',
			value: 'bootstrap',
		})
	if (fixChoices.length > 0)
		actionChoices.push({
			title: 'Fix',
			description: 'Fix files and show errors, if any',
			value: 'fix',
		})
	if (fixChoices.length > 0)
		actionChoices.push({
			title: 'Watch',
			description:
				"Same as 'fix', but watches files and rebuilds on changes",
			value: 'watch',
		})

	return actionChoices
}

/**
 * @description if a plugin exports a bootstrapFunction or fixPlugin (or both),
 * add them to the selection menu so the user can see
 */
function createActionFunctionPrompts(foxPlugins: IPluginExportIndex[], foxPluginPaths: string[]):
	[ prompts.Choice[], prompts.Choice[] ] {
	const bootstrapChoices: prompts.Choice[] = []
	const fixChoices: prompts.Choice[] = []

	for (let i = 0; i < foxPlugins.length; ++i) {
		const foxPluginPath = foxPluginPaths[i]
		const foxPlugin = foxPlugins[i]

		debug('processing foxPluginModule %s', foxPlugin.info.name)

		if (!foxPlugin.info.name || !foxPlugin.info) {
			throw new Error(
				`plugin located at ${foxPluginPath} does not have exported info object. exiting.`,
			)
		}

		if (foxPlugin.bootstrapFunction) {
			bootstrapChoices.push({
				title: foxPlugin.info.toolName,
				description: foxPlugin.info.description,
				value: i,
			})
		}

		if (foxPlugin.fixFunction) {
			fixChoices.push({
				title: foxPlugin.info.toolName,
				description: foxPlugin.info.description,
				value: i,
			})
		}
	}

	return [
		bootstrapChoices,
		fixChoices
	]
}
