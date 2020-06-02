// @ts-ignore
import { NpmPackageJsonLint } from 'npm-package-json-lint'
import * as foxUtils from 'fox-utils'

export async function runLintPackageJson() {
  const { projectPackageJson,projectPackageJsonPath, projectPath } = await foxUtils.getProjectData();
  const packageJsonLintConfig = await foxUtils.getAndCreateConfig(projectPath, 'fox-package-json-lint');
  if (!packageJsonLintConfig) return

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
