import minimist from 'minimist'
import prompts from 'prompts'
import { getInstalledFoxPlugins } from './util'
import { IPlugin } from "fox-types";
import * as foxUtils from 'fox-utils'

export async function runFoxSuite() {
  const argv = minimist(process.argv.slice(2))


	const [projectData, foxPlugins] = await Promise.all([
		foxUtils.getProjectData(), getInstalledFoxPlugins()
	])

	// import all plugins
	const foxPluginModulesPromise = []
	for (const foxPlugin of foxPlugins) {
		foxPluginModulesPromise.push(import(foxPlugin))
	}

	const bootstrapChoices: prompts.Choice[] = []
	const formatChoices: prompts.Choice[] = []
	const lintChoices: prompts.Choice[] = []
	for (let plugin of await Promise.all(foxPluginModulesPromise)) {
		const foxPlugin: IPlugin = plugin

		if(!foxPlugin.info) {
			// TODO: make error more specific
			throw new Error(`an installed plugin does not have the 'info' object exported. exiting.`)
		}

		if(foxPlugin.bootstrapFunction) {
			bootstrapChoices.push({
				title: foxPlugin.info.tool,
				description: foxPlugin.info.description,
				value: foxPlugin.bootstrapFunction
			})
		}

		if(foxPlugin.formatFunction) {
			formatChoices.push({
				title: foxPlugin.info.tool,
				description: foxPlugin.info.description,
				value: foxPlugin.formatFunction
			})
		}
		if(foxPlugin.lintFunction) {
			lintChoices.push({
				title: foxPlugin.info.tool,
				description: foxPlugin.info.description,
				value: foxPlugin.lintFunction
			})
		}
	}
	const actionChoices = []
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

		if(bootstrap) await bootstrap()
		else process.exitCode = 1
	} else if (action === 'format') {
		const { format }: { format: IPlugin["formatFunction"] } = await prompts({
			type: 'select',
			name: 'format',
			message: 'Which formatter would you like to use?',
			choices: formatChoices
		})

		if (format) await format(projectData.foxConfig)
		else process.exitCode = 1
	} else if (action === 'lint') {
    const { lint }: { lint: IPlugin["lintFunction"] } = await prompts({
      type: 'select',
      name: 'lint',
      message: 'run a script',
      choices: lintChoices
    });

		if(lint) await lint(projectData.foxConfig)
		else process.exitCode = 1
	}

	process.exitCode = 1
}
