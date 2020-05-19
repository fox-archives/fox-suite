import minimist from 'minimist'

interface ICli {
  helpText: string
}

export function cli(nodeArgv: NodeJS.Process["argv"], cliData: ICli) {
  const argv = minimist(nodeArgv.slice(2));

  if (argv.help || argv.h) {
    console.info(cliData.helpText)
    process.exitCode = 0
  }
}
