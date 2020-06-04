import path from 'path'
import fs from 'fs'
import type { PackageJson } from 'type-fest'
import type { Dirent } from 'fs'

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
