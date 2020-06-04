import * as foxUtils from 'fox-utils'
import * as util from './util'
import { doAction } from './action';
import type { ParsedArgs } from "minimist"
import type { IActionFunction } from './action'
import { IPlugin } from 'fox-types';

/**
 * @description start `fox` based on cli arguments if any were given
 */
export async function cli(argv: ParsedArgs) {
	const [projectData, foxPlugins] = await Promise.all([
		foxUtils.getProjectData(), util.getInstalledFoxPlugins()
	])

	const promises: Promise<IPlugin>[] = []
	for (const foxPluginPath of foxPlugins) {
		promises.push(import(foxPluginPath))
	}
	const foxPluginModules = await Promise.all(promises)

	if (argv.help) {
		console.log('--bootstrap, --format, --lint')
	} else if(argv.bootstrap) {
		await doAction({
			action: util.pickModuleProperty(foxPluginModules, "bootstrapFunction"),
			projectData
		})
		console.log('did bootstrap')
	} else if (argv.format) {
		await doAction({
			action: util.pickModuleProperty(foxPluginModules, "formatFunction"),
			projectData
		})
		console.log('did format')
	} else if (argv.lint) {
		await doAction({
			action: util.pickModuleProperty(foxPluginModules, "lintFunction"),
			projectData
		})
		console.log('did lint')
	}
}
