import minimist from 'minimist'
import  { setup } from './util'
import { IFox, ICli } from "fox-types";
import * as foxUtils from './'

export async function buildCli(nodeArgv: NodeJS.Process["argv"], {
	pluginName,
	pluginDescription,
	bootstrapFunction,
	actionFunction
}: ICli) {
	setup()

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