import fs from 'fs'
import { default as lintPackageJsonConfig } from '../src/index'
// @ts-ignore
import { NpmPackageJsonLint } from 'npm-package-json-lint'

let newNpmPackageLint = (packageJson: any) => new NpmPackageJsonLint({
  cwd: process.cwd(),
  packageJsonObject: packageJson,
  packageJsonFilePath: './packaffge.json',
  config: lintPackageJsonConfig,
  // configFile: '',
  // patterns: ['**/package.json'],
  quiet: false,
  // ignorePath: ''
})

test('loading npmpacakgejsonlintrc config does not throw', async () => {
  const packageJson = JSON.parse(await fs.promises.readFile('../package.json', { encoding: 'utf8' }))

  expect(() => newNpmPackageLint(packageJson)).not.toThrow(Error)
})

// TODO: actually get value that this ensures the lint config is valid like eslint
test('npmpacakgejsonlintrc config loads', async () => {
  const packageJson = JSON.parse(await fs.promises.readFile('../package.json', { encoding: 'utf8' }))

  const npmPackageLint = newNpmPackageLint(packageJson)


  const lintResults = npmPackageLint.lint()

  expect(lintResults).toHaveProperty('results')
  expect(lintResults).toHaveProperty('warningCount')
  expect(lintResults).toHaveProperty('errorCount')
})
