import path from 'path'
import fs from 'fs'
import { IPluginExportIndex, IPluginExportInfo } from 'fox-types'
import { getPluginInfo, loadModule, readPackageJson, getBinDirents, readBinFile } from './test.util'
import 'jest-extended'

const { pluginName } = getPluginInfo()

let infoModule: { info: IPluginExportInfo }
let pluginModule: IPluginExportIndex
beforeEach(async () => {
	[ infoModule, pluginModule ] = await Promise.all([
	 	loadModule('src/info.ts'),
	 	loadModule('src/index.ts')
	]) as [ { info: IPluginExportInfo }, IPluginExportIndex ]
})

describe(`testing module: '${pluginName}' using the 'fox-test' jest autorunner`, () => {
	test("`src/info.ts` exports an 'info' object that conforms to the IPluginExportInfo schema", async () => {
		expect(infoModule).toBeObject()
		// src/info.ts must include `export const info = { name: '' }'`
		expect(infoModule).toHaveProperty('info')
		const info = infoModule.info

		expect(info).toHaveProperty('name')
		expect(info.name).toBeString()
		expect(info).toHaveProperty('tool')
		expect(info.tool).toBeString()
		expect(info).toHaveProperty('toolConfigSchemaHelpUri')
		expect(info.toolConfigSchemaHelpUri).toBeString()
		expect(info).toHaveProperty('description')
		expect(info.description).toBeString()
		expect(info).toHaveProperty('descriptionLong')
		expect(info.descriptionLong).toBeString()
	})

	test('`src/index.ts` contains all the required exports', () => {
		expect(pluginModule).toBeObject()
		// src/index.ts must include `export { info } from './info'`
		expect(pluginModule).toHaveProperty('info')
		const info = pluginModule.info
		expect(info).toBeObject()
	})

	test("`package.json` and `src/info` 'name' property are the same", async () => {
		const { pluginPath } = getPluginInfo()
		const packageJson = await readPackageJson(pluginPath)

		const namePackageJson = packageJson.name
		const nameSrcInfo = infoModule.info.name

		expect(namePackageJson).toBe(nameSrcInfo)
	})

	test("`bin/fox-plugin-*.js` has a filename equivalent to package.json 'name'", async () => {
		const { pluginPath } = getPluginInfo()
		const packageJson = await readPackageJson(pluginPath)

		let binDirHasFilename = false
		for (const dirent of (await getBinDirents(pluginPath))) {
			if (dirent.name === `${packageJson.name}.js`) {
				binDirHasFilename = true
			}
		}
		// if packageName is 'fox-plugin-eslint', must have bin called 'bin/fox-plugin-eslint.js`
		expect(binDirHasFilename).toBe(true)
	})

	test("`bin/fox-plugin-*.js` has a shebang", async () => {
		const { pluginPath } = getPluginInfo()
		const binFileContents = await readBinFile(pluginPath)

		expect(
			binFileContents.startsWith('#!/usr/bin/env node\n')
		).toBe(true)
	})

	test("`bin/fox-plugin-*.js` requires 'fox-esm'", async () => {
		const { pluginPath } = getPluginInfo()
		const binFileContents = await readBinFile(pluginPath)

		expect(
			binFileContents.includes("\nrequire = require('fox-esm')(module)") ||
			binFileContents.includes(`\nrequire = require("fox-esm")(module)`)
		).toBe(true)
		// bin/fox-plugin-*.js must include `require = require('fox-esm')(module)`
	})

	test("ensure the templates folder is called 'templates' and not 'template'", async () => {
		const { pluginPath } = getPluginInfo()

		expect(fs.existsSync(path.join(pluginPath, 'template'))).toBe(false)
	})

	test("ensure there is a 'templates' folder if a `src/index.ts` exports a `buildTemplates` function", async () => {
		const { pluginPath } = getPluginInfo()

		if (pluginModule.bootstrapFunction) {
			const templateFileLocation = path.join(pluginPath, 'templates')
			if (!fs.existsSync(templateFileLocation)) {
				expect(true).toBe(false)
			}
		}

	})

	test("ensure `src/index.ts` exports a buildTemplates function if a 'templates' folder exists", async () => {
		const { pluginPath } = getPluginInfo()
			const templateFileLocation = path.join(pluginPath, 'templates')
			if (fs.existsSync(templateFileLocation)) {
				expect(pluginModule).toHaveProperty('bootstrapFunction')
			}
	})
})
