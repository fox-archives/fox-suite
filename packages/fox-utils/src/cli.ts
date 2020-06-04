import minimist from 'minimist'
import  { setup } from './misc'
import { IBuildCli } from "fox-types";
import * as foxUtils from './'
import * as c from 'colorette'

export async function buildCli(nodeArgv: NodeJS.Process["argv"], {
	pluginName,
	pluginDescription,
	bootstrapFunction,
	actionFunction
}: IBuildCli) {
	setup()

	// TODO: change help menu depending on if module has a function for `--bootstrap`
	const argv = minimist(nodeArgv.slice(2));
	const helpText = `Usage:
  ${pluginName}

Description:
  ${pluginDescription}

Options:
  --boostrap   Bootstrap ${pluginName} configuration
  --action     Format or lint files
  --help       Show help

Examples:
  ${pluginName} --bootstrap
  ${pluginName} --help`;

  if (argv.help || Object.keys(argv).length === 1) {
    console.info(helpText)
    process.exitCode = 0
  } else if (argv.bootstrap) {
		try {
			if (!bootstrapFunction) {
				console.info(c.bold(c.blue('this module does not have a bootstrap function')))
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
			await actionFunction(projectData.foxConfig)
		} catch (err) {
			console.error(err)
			process.exitCode = 1
		}
	} else {
		console.log(`Invalid Options. See \`${pluginName} --help\``)
		process.exitCode = 1
	}
}
