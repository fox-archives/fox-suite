import * as foxUtils from 'fox-utils'
import { sortPackageJsonFileAuto } from './main'

const helpText = `fox-package-json-sort-json

Usage:
  fox-sort-package-json

Description:
  Sorts the package.json of the current project

Options:
  --help  show help
  -h      show help

Examples:
  fox-package-json-sort --help
  fox-package-json-sort`

async function runFunction() {
  const resultObj = await sortPackageJsonFileAuto()
  const relativePackageJsonPath = foxUtils.toRelativePath(resultObj.projectPackageJsonPath)

  foxUtils.printSuccess(`sorted packageJson at ${relativePackageJsonPath}`)
}

foxUtils.cli(process.argv, {
  helpText,
  runFunction
})
