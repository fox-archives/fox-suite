import path from 'path'
import fs from 'fs'
import type { Dirent } from 'fs'
import uniqBy from 'lodash.uniqby'
import * as foxUtils from 'fox-utils'

export async function getInstalledFoxPlugins(): Promise<string[]> {
	const nodeModulesPath = path.join((await foxUtils.getProjectData()).location, 'node_modules')

	try {
		const getPlugins = async (pluginParentDirectory: string): Promise<string[]> => {
			const pluginList: string[] = []
			const nodeModules = await fs.promises.readdir(pluginParentDirectory, { withFileTypes: true })

			// TODO: make module resolution better (better than require.resolve for non cjs)
			const resolveModule = (...modulePath: string[]): string => {
				return path.join.apply(null, [...modulePath, 'build/index.js'])
			}

			const isFoxPlugin = (nodePackage: Dirent) => {
				return (nodePackage.isDirectory() || nodePackage.isSymbolicLink()) && nodePackage.name.startsWith("fox-plugin")
			}

			const isFoxPreset = (nodePackage: Dirent) => {
				return (nodePackage.isDirectory() || nodePackage.isSymbolicLink()) && nodePackage.name.startsWith("fox-preset")
			}

			for (const nodeModule of nodeModules) {
				if (isFoxPlugin(nodeModule)) {
					const pluginPath = resolveModule(nodeModulesPath, nodeModule.name)
					pluginList.push(pluginPath)
				} else if (isFoxPreset(nodeModule)) {
					const presetPath = path.join(nodeModulesPath, nodeModule.name)
					const presetPlugins = await fs.promises.readdir(presetPath, { withFileTypes: true })
					for (const pluginDirent of presetPlugins) {
						if (isFoxPlugin(nodeModule)) {
							const pluginPath = resolveModule(nodeModulesPath, nodeModule.name, pluginDirent.name)
							pluginList.push(pluginPath)
						}
					}
				}
			}
			return pluginList
		}

		const allPlugins = await getPlugins(nodeModulesPath)
		return uniqBy(allPlugins, (string: string) => String.prototype.toString.call(string))
	} catch (err) {
		console.error(err)
		process.exit(1)
	}
}
