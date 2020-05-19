import { runLintPackageJson } from './index'
import * as foxUtils from 'fox-utils';
import { setup } from 'fox-utils'

setup()

const helpText = `fox-package-json-lint

Usage:
  fox-package-json-lint

Description:
  Lints the package.json of the current project

Options:
  --help  show help
  -h      show helpf

Examples:
  fox-package-json-lint --help
  fox-package-json-lint`

async function runFunction() {
  await runLintPackageJson()
}

foxUtils.cli(process.argv, {
  helpText,
  runFunction
})
