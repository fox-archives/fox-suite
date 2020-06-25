import minimist from 'minimist'
import { IBuildCli } from 'fox-types'
import { log } from './misc'

export async function buildCli(
	nodeArgv: NodeJS.Process['argv'],
	{
		pluginName,
		pluginDescription,
		bootstrapFunction,
		fixFunction,
	}: IBuildCli,
) {
	process.on('uncaughtException', (err) => console.error(err))
	process.on('unhandledRejection', (err) => console.error(err))

	// TODO: change help menu depending on if module has a function for `--bootstrap`
	const argv = minimist(nodeArgv.slice(2))
	const helpText = `Usage:
  ${pluginName}

Description:
  ${pluginDescription}

Options:
  --boostrap   Bootstrap ${pluginName} configuration
	--fix        Fix Files as per tool
  --watch      Same as fix, but creates a watcher (recommended)
  --help       Show help

Examples:
  ${pluginName} --bootstrap
  ${pluginName} --help`

	if (argv.help || Object.keys(argv).length === 1) {
		console.info(helpText)
		process.exitCode = 0
	} else if (argv.bootstrap) {
		try {
			if (!bootstrapFunction) {
				log.info('this module does not have a bootstrap function')
				return
			}
			await bootstrapFunction()
		} catch (err) {
			console.error(err)
			process.exitCode = 1
		}
	} else if (argv.action) {
		try {
			const projectData = await foxUtils.getProjectData()
			await fixFunction(projectData.foxConfig)
		} catch (err) {
			console.error(err)
			process.exitCode = 1
		}
	} else {
		log.error(`Invalid Options. See \`${pluginName} --help\``)
		process.exitCode = 1
	}
}
