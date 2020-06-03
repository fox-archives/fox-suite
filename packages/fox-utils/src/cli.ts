import minimist from 'minimist'
import  { setup } from './util'
import { IFox } from "fox-types";
import * as foxUtils from './'

interface ICli {
	moduleName: string,
	moduleDescription: string,
	bootstrapFunction: () => Promise<void>,
	actionFunction: (fox: IFox) => Promise<void>
}

export async function buildCli(nodeArgv: NodeJS.Process["argv"], {
	moduleName,
	moduleDescription,
	bootstrapFunction,
	actionFunction
}: ICli) {
	setup()

	const argv = minimist(nodeArgv.slice(2));
	const helpText = `Usage:
  ${moduleName}

Description:
  ${moduleDescription}

Options:
  --boostrap   Bootstrap ${moduleName} configuration
  --action     Format or lint files
  --help       Show help

Examples:
  ${moduleName} --bootstrap
  ${moduleName} --help`;

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
		console.log(`Invalid Options. See \`${moduleName} --help\``)
		process.exitCode = 1
	}
}
