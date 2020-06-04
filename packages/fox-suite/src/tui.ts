import prompts, { Choice } from 'prompts'
import { IPlugin } from "fox-types";
import * as foxUtils from 'fox-utils'
import { doAction } from './action';
import * as util from './util'
import debug from './debug'
import * as c from 'colorette'
/**
 * @description if no command line arguments were given,
 * start (interactive) terminal user interface
 */
export async function tui(): Promise<void> {
	debug('activating tui')
	const [projectData, foxPlugins] = await Promise.all([
		foxUtils.getProjectData(), util.getInstalledFoxPlugins()
	])

	debug('projectData: %o', projectData)
	debug('foxPlugins: %o', foxPlugins)

	if (foxPlugins.length === 0) {
		console.log(c.bold(c.red('no fox-plugins or fox-presets found. please install some to continue')))
		process.exit(0)
	}


	// import all plugins
	const promises: Promise<IPlugin>[] = []
	for (const foxPlugin of foxPlugins) {
		promises.push(import(foxPlugin))
	}

	const bootstrapChoices: prompts.Choice[] = []
	const formatChoices: prompts.Choice[] = []
	const lintChoices: prompts.Choice[] = []
	const foxPluginModules = await Promise.all(promises)
	for (let foxPluginModule of foxPluginModules.filter(Boolean)) {
		debug('processing foxPluginModule %s', foxPluginModule.info.name)
		const foxPlugin: IPlugin = foxPluginModule

		if (!foxPlugin.info) {
			// TODO: make error more specific
			throw new Error(`an installed plugin does not have the 'info' object exported. exiting.`)
		}

		if (foxPlugin.bootstrapFunction) {
			bootstrapChoices.push({
				title: foxPlugin.info.tool,
				description: foxPlugin.info.description,
				value: foxPlugin.bootstrapFunction
			})
		}

		if (foxPlugin.formatFunction) {
			formatChoices.push({
				title: foxPlugin.info.tool,
				description: foxPlugin.info.description,
				value: foxPlugin.formatFunction
			})
		}
		if (foxPlugin.lintFunction) {
			lintChoices.push({
				title: foxPlugin.info.tool,
				description: foxPlugin.info.description,
				value: foxPlugin.lintFunction
			})
		}
	}

	// add 'all' choices, but only if there are two or more elements that already exist
	if (bootstrapChoices.length > 2) bootstrapChoices.unshift({
		title: 'All',
		description: 'Bootstrap all configuration',
		value: util.pickModuleProperty(foxPluginModules, "bootstrapFunction")
	})

	if (formatChoices.length > 2) formatChoices.unshift({
		title: 'All',
		description: 'Format files from all config',
		value: util.pickModuleProperty(foxPluginModules, "formatFunction")
	})

	if (lintChoices.length > 2) lintChoices.unshift({
		title: 'All',
		description: 'Lint files from all config',
		value: util.pickModuleProperty(foxPluginModules, "lintFunction")
	})

	const actionChoices: prompts.Choice[] = []
	if (bootstrapChoices.length > 0) actionChoices.push({ title: 'Bootstrap', description: 'Bootstrap configuration boilerplate', value: 'bootstrap' })
	if (formatChoices.length > 0) actionChoices.push({ title: 'Format', description: 'Format files', value: 'format' })
	if (lintChoices.length > 0) actionChoices.push({ title: 'Lint', description: 'Lint via category', value: 'lint' })

	const { action } = await prompts({
		type: 'select',
		name: 'action',
		message: 'choose action',
		choices: actionChoices
	})

	if (action === 'bootstrap') {
		const { bootstrap }: { bootstrap: IPlugin["bootstrapFunction"] } = await prompts({
			type: 'select',
			name: 'bootstrap',
			message: 'which configuration would you like to bootstrap?',
			choices: bootstrapChoices
		})

		await doAction({
			action: bootstrap,
			projectData
		})

	} else if (action === 'format') {
		const { format }: { format: IPlugin["formatFunction"] } = await prompts({
			type: 'select',
			name: 'format',
			message: 'Which formatter would you like to use?',
			choices: formatChoices
		})

		await doAction({
			action: format,
			projectData
		})
	} else if (action === 'lint') {
		const { lint }: { lint: IPlugin["lintFunction"] } = await prompts({
			type: 'select',
			name: 'lint',
			message: 'run a script',
			choices: lintChoices
		});

		await doAction({
			action: lint,
			projectData
		})
	}

	process.exitCode = 1
}
