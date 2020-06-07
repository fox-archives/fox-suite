import path from 'path'
import fs from 'fs'
import type { PackageJson } from 'type-fest'
import type { Dirent } from 'fs'
import { BabelFileResult } from '@babel/core'
import * as babel from "@babel/core"

export function getPluginInfo(): { pluginPath: string, pluginName: string } {
	let pluginPath: string = process.env.FOX_PLUGIN_DIRECTORY || ''
	let pluginName: string = path.basename(pluginPath)
	if (!pluginPath || !pluginName) {
		throw new Error('either pluginPath or pluginName are falsey. this is a problem')
	}
	return { pluginPath, pluginName }
}

export function loadModule(relativePath: string): Promise<Record<string, any>> {
	const { pluginPath } = getPluginInfo()

	return import(path.join(pluginPath, relativePath))
}

export async function readPackageJson(pluginPath: string): Promise<PackageJson> {
	return JSON.parse(await fs.promises.readFile(path.join(pluginPath, 'package.json'), { encoding: 'utf8' }))
}

export function getBinDirents(pluginPath: string): Promise<Dirent[]> {
	return fs.promises.readdir(path.join(pluginPath, 'bin'), { withFileTypes: true })
}

export async function readBinFile(pluginPath: string): Promise<string> {
	const packageJson = await readPackageJson(pluginPath)
	const binLocation = path.join(pluginPath, `bin/${packageJson.name}.js`)
	return fs.promises.readFile(binLocation, { encoding: 'utf8' })
}

export async function doesWrongTemplateFolderExist(pluginPath: string): Promise<boolean> {
	const wrongTemplateFileLocation = path.join(pluginPath, 'templates')

	return new Promise((resolve, reject) => {
		fs.exists(wrongTemplateFileLocation, (err) => {
			if (err) resolve(false)
			else resolve(true)
		})
	})
}

export async function babelTraverse(traverseOption: any): Promise<babel.types.File | babel.types.Program | null> {
	const { pluginPath } = getPluginInfo()
	const indexFile = path.join(pluginPath, 'src/index.ts')
	const fileContents = await fs.promises.readFile(indexFile, { encoding: 'utf8' })
	const ast = await babel.parseAsync(fileContents, {
		filename: 'index.ts',
		presets: [ "@babel/typescript" ]
	})
	babel.traverse(ast!, traverseOption)
	return ast
}
