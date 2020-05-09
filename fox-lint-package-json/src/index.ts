import fs from 'fs'
// @ts-ignore
import { NpmPackageJsonLint } from 'npm-package-json-lint'

async function lintPackageJson() {
  const packageJson = JSON.parse(await fs.promises.readFile('./package.json', { encoding: 'utf8' }))
  const lintPackageJsonConfig = JSON.parse(await fs.promises.readFile('./.npmpackagejsonlintrc.json', { encoding: 'utf8' }))

  const npmPackageLint = new NpmPackageJsonLint({
    cwd: process.cwd(),
    packageJsonObject: packageJson,
    packageJsonFilePath: './packageee.json',
    config: lintPackageJsonConfig,
    // configFile: '',
    // patterns: ['**/package.json'],
    quiet: false,
    // ignorePath: ''
  })

  const lintedPackageJson = npmPackageLint.lint()
  console.log(lintedPackageJson)
}

(async () => await lintPackageJson())()

process.on('uncaughtException', (err) => console.error(err))
process.on('unhandledRejection', (err) => console.error(err))
