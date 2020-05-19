// @ts-ignore
import { NpmPackageJsonLint } from 'npm-package-json-lint'
import * as foxUtils from 'fox-utils'

export async function lintPackageJson() {
  const { projectPackageJson,projectPackageJsonPath, projectPath } = await foxUtils.getProjectData()
  const packageJsonLintConfig = await foxUtils.getConfig(projectPath, 'npmpackagejsonlintrc.config.js')

  console.log(packageJsonLintConfig)
  const npmPackageLint = new NpmPackageJsonLint({
    cwd: process.cwd(),
    packageJsonObject: projectPackageJson,
    packageJsonFilePath: projectPackageJsonPath,
    config: packageJsonLintConfig,
    // configFile: '',
    // patterns: ['**/package.json'],
    quiet: false,
    // ignorePath: ''
  })

  const lintedPackageJson = npmPackageLint.lint()
  console.log(lintedPackageJson)
}

process.on('uncaughtException', (err) => console.error(err))
process.on('unhandledRejection', (err) => console.error(err))
