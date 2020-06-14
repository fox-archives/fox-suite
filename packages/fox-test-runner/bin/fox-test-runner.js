#!/usr/bin/env node

const path = require('path')
const jest = require('jest')
const readPkgUp = require('read-pkg-up')

async function cli() {
	const { path: packageJsonPath } = await readPkgUp()
	const foxPluginPath = path.dirname(packageJsonPath)

	process.env.FOX_PLUGIN_DIRECTORY = foxPluginPath
	process.chdir(path.join(__dirname, '..'))
	jest.run([...process.argv, 'fox.test.ts'])
}

cli()
