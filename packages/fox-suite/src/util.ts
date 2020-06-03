import path from 'path'
import fs from 'fs'
import util from 'util'
import type { Dirent } from 'fs'
import * as foxUtils from 'fox-utils'

// TODO: make less dirty
export async function getInstalledFoxPlugins(): Promise<string[]> {
	const nodeModulesPath = path.join((await foxUtils.getProjectData()).location, 'node_modules')

	// const { location } = (await foxUtils.getProjectData())
	// console.info(`${location}/node_modules`)
	// const matches = await util.promisify(glob)(`${location}/node_modules/+(fox-plugin-*|fox-preset-*)/*`, {})
	// console.log(matches)

	try {
		const getPlugins = async (pluginParentDirectory: string): Promise<string[]> => {
			const pluginList: string[] = []
			const nodeModules = await fs.promises.readdir(pluginParentDirectory, { withFileTypes: true })

			// TODO: make module resolution better (better than require.resolve for non cjs)
			const resolveModule = (...modulePath: string[]): string => {
				return path.join.apply(null, [...modulePath, 'build/index.js'])
			}

			const isFoxPlugin = (nodePackage: Dirent) => {
				return (nodePackage.isDirectory() || nodePackage.isSymbolicLink()) && nodePackage.name.startsWith("fox-plugin-")
			}

			const isFoxPreset = (nodePackage: Dirent) => {
				return (nodePackage.isDirectory() || nodePackage.isSymbolicLink()) && nodePackage.name.startsWith("fox-preset-")
			}

			for (const nodeModule of nodeModules) {
				if (isFoxPlugin(nodeModule)) {
					const pluginPath = resolveModule(nodeModulesPath, nodeModule.name)
					pluginList.push(pluginPath)
				} else if (isFoxPreset(nodeModule)) {
					const presetPath = path.join(nodeModulesPath, nodeModule.name)
					const presetPlugins = await fs.promises.readdir(path.join(presetPath, 'node_modules'), { withFileTypes: true })
					for (const pluginDirent of presetPlugins) {
						if (isFoxPlugin(pluginDirent)) {
							const pluginPath = resolveModule(presetPath, 'node_modules', pluginDirent.name)
							pluginList.push(pluginPath)
						}
					}
				}
			}

			return pluginList
		}

		let allPlugins = await getPlugins(nodeModulesPath)


		const allPluginsShort = allPlugins.map((el, i, arr) => {
			const start = el.indexOf("node_modules") + "node_modules".length + 1
			let pluginName = el.slice(start)

			// pnpm has nested node modules. manually check for one nesting
			if(pluginName.includes("node_modules")) {
				const start2 = pluginName.indexOf("node_modules") + "node_modules".length + 1
				pluginName = pluginName.slice(start2)
			}

			pluginName = pluginName.slice(0, pluginName.indexOf("/") || pluginName.indexOf(path.delimiter))

			return pluginName

			// const i1 = arr.findIndex(el => el.includes(pluginName))
			// const i2 = arr.length - arr.reverse().findIndex(el => el.includes(pluginName)) - 1

			// const isNotDuplicated = i1 === i2
			// console.log(isNotDuplicated, pluginName)
			// return isNotDuplicated
		})

		const allPluginsCopy = Array.from(allPlugins)
		const newAllPlugins = []
		for (let i = 0; i < allPlugins.length; ++i) {
			const pluginName = allPluginsShort.pop()
			const pluginPath = allPluginsCopy.pop()

			if(pluginName && allPluginsCopy.find(el => !el.includes(pluginName))) {
				if (pluginPath) newAllPlugins.push(pluginPath)
			}
		}

		return newAllPlugins
	} catch (err) {
		console.error(err)
		process.exit(1)
	}
}
