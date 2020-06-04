import minimist from 'minimist'
import { cli } from './cli'
import { tui } from './tui'

export async function fox(): Promise<void> {
  const argv = minimist(process.argv.slice(2))

	const cliArgsWereGiven = (argvv: minimist.ParsedArgs): boolean => Object.keys(argvv).length > 1

	if(cliArgsWereGiven(argv)) {
		await cli(argv)
	} else {
		await tui()
	}
}
