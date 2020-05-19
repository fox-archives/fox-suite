import minimist from 'minimist'

interface ICli {
  helpText: string
  runFunction: () => Promise<void> | void
}

export function cli(nodeArgv: NodeJS.Process["argv"], {
  helpText,
  runFunction
}: ICli) {
  const argv = minimist(nodeArgv.slice(2));

  if (argv.help || argv.h) {
    console.info(helpText)
    process.exitCode = 0
  } else {
    const result = runFunction()
    if (result instanceof Promise) {
      result
        .catch(err => {
          console.error(err)
        })
    }
  }
}
