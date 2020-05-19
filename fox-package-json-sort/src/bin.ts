import * as foxUtils from 'fox-utils'

import { sortPackageJsonFileAuto } from '../src/main'

const helpText = `fox-util-sort-package-json

Usage:
  sort-package-json

Description:
  Sorts the package.json of the current project

Options:
  --help  show help
  -h      show help

Examples:
  sort-package-json --help
  sort-package-json`


foxUtils.cli(process.argv, {
  helpText
})

run()
async function run() {
  const resultObj = await sortPackageJsonFileAuto()
  const relativePackageJsonPath = foxUtils.toRelativePath(resultObj.projectPackageJsonPath)

  foxUtils.printSuccess(`sorted packageJson at ${relativePackageJsonPath}`)
}
