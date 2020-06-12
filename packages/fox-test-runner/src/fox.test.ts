import path from 'path'
import fs from 'fs'
import { IPluginExportIndex, IPluginExportInfo } from 'fox-types'
import { getPluginInfo, loadModule, readPackageJson, getBinDirents, readBinFile, babelTraverse } from './test.util'
import 'jest-extended'
import type { Node } from '@babel/core'
// TODO: fix type integration
// import { Node2 } from "bt";

const { pluginName } = getPluginInfo()

let infoModule: { info: IPluginExportInfo }
let pluginModule: IPluginExportIndex
beforeEach(async () => {
	[ infoModule, pluginModule ] = await Promise.all([
	 	loadModule('src/info.ts'),
	 	loadModule('src/index.ts')
	]) as [ { info: IPluginExportInfo }, IPluginExportIndex ]
})

describe(`testing module: '${pluginName}' using the 'fox-test-runner' jest autorunner`, () => {
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

	test("ensure {bootstrap,fix}Functions are async", async () => {
		await babelTraverse({
			ExportDeclaration(path: any) {
				const { node } = path

				if (!node.declaration) return
				if (node.declaration.type !== 'FunctionDeclaration') return

				const declaration = node.declaration

				if (!declaration.id) throw new Error ('ndoe does not have id')
				if (declaration.id.type !== 'Identifier') return

				const fnsNames = new Set(['bootstrapFunction', 'fixFunction'])
				if (fnsNames.has(declaration.id.name)) {
					expect(declaration.async).toBe(true)
				}
			}
		})
	})

	test("ensure foxUtils.build{Bootstrap,Fix} are awaited", async () => {
		await babelTraverse({
			ExpressionStatement(path: any) {
				const { node } = path

				if (node.expression.type == 'AwaitExpression' || node.expression.type == 'CallExpression') {
					// valid
				} else {
					return
				}

				let callExpression
				if (node.expression.type === 'AwaitExpression') {
					callExpression = node.expression.argument
				} else if (node.expression.type === 'CallExpression') {
					callExpression = node.expression
				} else {
					throw new Error('this shouldn\'t happen')
				}

				// this call expression will be checked to be only specific to:
				// foxUtils.buildBootstrap()
				// buildBootstrap()
				const callExpressionIsAwaited = node.expression.type === 'AwaitExpression'


				const identifierNames = new Set(['buildBootstrap', 'buildFix'])

				const isValidCallExpression = (callExpression: any): boolean => {
					if (callExpression.callee.type === 'Identifier') {
						if (identifierNames.has(callExpression.callee.name)) return true
					} else if (callExpression.callee.type === 'MemberExpression') {
						const memberExpression = callExpression.callee

						if(memberExpression.object.name === 'foxUtils' &&
							identifierNames.has(memberExpression.property.name)) return true
					}
					return false
				}

				let isValidCallExp = isValidCallExpression(callExpression)
				if (!isValidCallExp) return

				// if the call expression is valid (meaning it looks something like
				// foxUtils.buildBootstrap() or buildBootstrap(), it must be awaited
				expect(isValidCallExp).toBe(callExpressionIsAwaited)
			}
		})
	})
})
