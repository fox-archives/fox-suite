import prompts from 'prompts'
import * as foxUtils from 'fox-utils'
import { doBootstrap, doFix, doWatch } from './action';
import * as util from './util'
import debug from './debug'
import * as c from 'colorette'

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

	const bootstrapChoices: prompts.Choice[] = []
	const fixChoices: prompts.Choice[] = []

	// if a plugin exports a bootstrapFunction or fixPlugin (or both),
	// add them to the selection menu so the user can see
	for (let i = 0; i < foxPlugins.length; ++i) {
		const foxPluginPath = foxPluginPaths[i]
		const foxPlugin = foxPlugins[i]

		debug('processing foxPluginModule %s', foxPlugin.info.name)

		if (!foxPlugin.info.name || !foxPlugin.info) {
			throw new Error(
				`plugin located at ${foxPluginPath} does not have exported info object. exiting.`
			)
		}

		if (foxPlugin.bootstrapFunction) {
			bootstrapChoices.push({
				title: foxPlugin.info.tool,
				description: foxPlugin.info.description,
				value: i
			})
		}

		if (foxPlugin.fixFunction) {
			fixChoices.push({
				title: foxPlugin.info.tool,
				description: foxPlugin.info.description,
				value: i
			})
		}
	}

	// add 'all' choices, but only if there are two or more elements that already exist
	if (bootstrapChoices.length > 2) bootstrapChoices.unshift({
		title: 'All',
		description: 'Bootstrap all configuration',
		value: -1
	})

	if (fixChoices.length > 2) fixChoices.unshift({
		title: 'All',
		description: 'Format files from all config',
		value: -1
	})

	const actionChoices: prompts.Choice[] = []
	if (bootstrapChoices.length > 0) actionChoices.push({
		title: 'Bootstrap',
		description: 'Bootstrap configuration boilerplate',
		value: 'bootstrap'
	})
	if (fixChoices.length > 0) actionChoices.push({
		title: 'Fix',
		description: 'Fix files and show errors, if any',
		value: 'fix'
	})
	if (fixChoices.length > 0) actionChoices.push({
		title: 'Watch',
		description: "Same as 'fix', but watches files and rebuilds on changes",
		value: 'watch'
	})

	const { action } = await prompts({
		type: 'select',
		name: 'action',
		message: 'choose action',
		choices: actionChoices
	})

	if (action === 'bootstrap') {
		const { pluginSelection }: { pluginSelection: number } = await prompts({
			type: 'select',
			name: 'pluginSelection',
			message: 'which configuration would you like to bootstrap?',
			choices: bootstrapChoices
		})

		await doBootstrap({
			foxPlugins,
			pluginSelection,
			projectData
		})
	} else if (action === 'fix') {
		const { pluginSelection }: { pluginSelection: number } = await prompts({
			type: 'select',
			name: 'pluginSelection',
			message: 'Which formatter would you like to use?',
			choices: fixChoices
		})

		await doFix({
			foxPluginPaths,
			foxPlugins,
			pluginSelection,
			projectData
		})
	} else if (action === 'watch') {
		const { pluginSelection }: { pluginSelection: number } = await prompts({
			type: 'select',
			name: 'pluginSelection',
			message: 'Which formatter would you like to use?',
			choices: fixChoices
		})

		await doWatch({
			foxPluginPaths,
			foxPlugins,
			pluginSelection,
			projectData
		})
	} else {
		console.info(c.bold(c.red('exiting tui')))
	}
}


