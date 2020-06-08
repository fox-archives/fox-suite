import prompts from 'prompts'
import { IPluginExportIndex } from "fox-types";
import * as foxUtils from 'fox-utils'
import { doAction, watchAndDoAction } from './action';
import * as util from './util'
import debug from './debug'
import * as c from 'colorette'
import { transpileConfig } from 'fox-transpiler'

/**
 * @description if no command line arguments were given,
 * start (interactive) terminal user interface
 */
export async function tui(): Promise<void> {
	debug('activating tui')
	const [projectData, foxPluginPaths] = await Promise.all([
		foxUtils.getProjectData(), util.getInstalledFoxPlugins()
	])

	// TODO: less temporary fix
	foxUtils.setFoxOptionsToEnv(projectData.foxConfig)


	debug('projectData: %o', projectData)
	debug('foxPlugins: %o', foxPluginPaths)

	if (foxPluginPaths.length === 0) {
		console.log(c.bold(c.red('no fox-plugins or fox-presets found. please install some to continue')))
		process.exit(0)
	}

	// convert the array of objects with properties 'bootstrapFunction' and 'fixFunction'
	// to two arrays, each for either 'bootstrapFunction' or 'fixFunction'
	const promises: Promise<IPluginExportIndex>[] = []
	for (const foxPluginPath of foxPluginPaths) {
		promises.push(import(foxPluginPath))
	}

	const bootstrapChoices: prompts.Choice[] = []
	const fixChoices: prompts.Choice[] = []

	const foxPlugins = (await Promise.all(promises)).filter(Boolean)

	// if a plugin exports a bootstrapFunction or fixPlugin (or both), add them
	// to the selection menu so the user can see
	for (let i = 0; i < foxPlugins.length; ++i) {
		const foxPlugin = foxPlugins[i]
		const foxPluginPath = foxPluginPaths[i]

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
		const { bootstrapFunctions }: { bootstrapFunctions: IPluginExportIndex["bootstrapFunction"] } = await prompts({
			type: 'select',
			name: 'bootstrapFunctions',
			message: 'which configuration would you like to bootstrap?',
			choices: bootstrapChoices
		})

		if(typeof bootstrapFunctions === void 0) {
			console.log(c.bold(c.red('value is undefined. exciting')))
			process.exit(1)
		}

		await doAction({
			actionFunctions: util.pickSpecificModuleProperty({
				foxPlugins,
				// @ts-ignore
				specificIndicesToPick: bootstrapFunctions,
				actionFunction: "bootstrapFunction"
			}),
			projectData
		})

	} else if (action === 'fix') {
		const { fixFunctions }: { fixFunctions: IPluginExportIndex["fixFunction"] } = await prompts({
			type: 'select',
			name: 'fixFunctions',
			message: 'Which formatter would you like to use?',
			choices: fixChoices
		})

		if (typeof fixFunctions === void 0) {
			console.log(c.bold(c.red('value is undefined. exciting')))
			process.exit(1)
		}

		await transpileConfig({
			// @ts-ignore
			foxPluginPaths: util.pickSpecificFoxPluginPath(foxPluginPaths, fixFunctions),
			projectData
		})
		await doAction({
			actionFunctions: util.pickSpecificModuleProperty({
				foxPlugins,
				// @ts-ignore
				specificIndicesToPick: fixFunctions,
				actionFunction: "fixFunction"
			}),
			projectData
		})
	} else if (action === 'watch') {
		const { fixFunctions }: { fixFunctions: IPluginExportIndex["fixFunction"] } = await prompts({
			type: 'select',
			name: 'fixFunctions',
			message: 'Which formatter would you like to use?',
			choices: fixChoices
		})

		if (typeof fixFunctions === void 0) {
			console.log(c.bold(c.red('value is undefined. exciting')))
			process.exit(1)
		}

		let transpile = async () => await transpileConfig({
			// @ts-ignore
			foxPluginPaths: util.pickSpecificFoxPluginPath(foxPluginPaths, fixFunctions),
			projectData
		})
		await watchAndDoAction(transpile, {
			actionFunctions: util.pickSpecificModuleProperty({
				foxPlugins,
				// @ts-ignore
				specificIndicesToPick: fixFunctions,
				actionFunction: "fixFunction"
			}),
			projectData
		})
	}

	process.exitCode = 1
}
