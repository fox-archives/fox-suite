import path from 'path'
import fs from 'fs'
import type { Dirent } from 'fs'
import * as foxUtils from 'fox-utils'
import { spawn } from 'child_process'
import { IPluginExportIndex } from "fox-types";
import type { IAction } from 'fox-types'
import debug from './debug'

// HACK: this could be less dirty
export async function getInstalledFoxPlugins(): Promise<string[]> {
	const nodeModulesPath = path.join((await foxUtils.getProjectData()).location, 'node_modules')
	debug('nodeModulesPath: %s', nodeModulesPath)

	try {
		const getPlugins = async (pluginParentDirectory: string): Promise<string[]> => {
			const pluginList: string[] = []
			const nodeModules = await fs.promises.readdir(pluginParentDirectory, { withFileTypes: true })

			const resolveModule = async (...modulePath: string[]): Promise<string> => {
				const pluginRoot = path.join.apply(null, modulePath)
				const pluginData = await foxUtils.getPluginData(pluginRoot)
				const entryPoint = pluginData.packageJson.main || 'build/index.js'
				return path.join(pluginRoot, entryPoint)
			}

			const isFoxPlugin = (nodePackage: Dirent) => {
				return (nodePackage.isDirectory() || nodePackage.isSymbolicLink()) && nodePackage.name.startsWith("fox-plugin-")
			}

			const isFoxPreset = (nodePackage: Dirent) => {
				return (nodePackage.isDirectory() || nodePackage.isSymbolicLink()) && nodePackage.name.startsWith("fox-preset-")
			}

			for (const nodeModule of nodeModules) {
				if (isFoxPlugin(nodeModule)) {
					const pluginPath = await resolveModule(nodeModulesPath, nodeModule.name)
					pluginList.push(pluginPath)
				} else if (isFoxPreset(nodeModule)) {
					const presetPath = path.join(nodeModulesPath, nodeModule.name)
					const presetPlugins = await fs.promises.readdir(path.join(presetPath, 'node_modules'), { withFileTypes: true })
					for (const pluginDirent of presetPlugins) {
						if (isFoxPlugin(pluginDirent)) {
							const pluginPath = await resolveModule(presetPath, 'node_modules', pluginDirent.name)
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

			debug('shortened list of plugins: %o', pluginName)
			return pluginName
		})

		const shortToLongPluginName: Record<string, string> = {}
		for (let i = 0; i < allPluginsShort.length; ++i) {
			shortToLongPluginName[allPluginsShort[i]] = allPlugins[i]
		}
		const newAllPlugins = Object.values(shortToLongPluginName)

		debug('returned value from getInstalledFoxPlugins: %o', newAllPlugins)
		return newAllPlugins
	} catch (err) {
		console.error(err)
		process.exit(1)
	}
}

type actionFunctions = "bootstrapFunction" | "fixFunction"
type fns = IAction["actionFunctions"]
interface ISpecificModuleProperty {
	foxPlugins: IPluginExportIndex[],
	specificIndicesToPick: number,
	actionFunction: actionFunctions
}

/**
 * @description Same as above, but only do so for the elements 'i' that we want.
 * if `-1` is passed to `specificIndicesToPick`, it picks all of them
 */
export function pickSpecificModuleProperty({
	foxPlugins,
	specificIndicesToPick,
	actionFunction
}: ISpecificModuleProperty): fns {
	const pickedFunctions: fns = []
	for (let i = 0; i < foxPlugins.length; ++i) {
		const foxPlugin = foxPlugins[i]

		if (specificIndicesToPick === i || specificIndicesToPick === -1) {

			// @ts-ignore
			pickedFunctions.push(foxPlugin[actionFunction])
		}
	}
	return pickedFunctions
}

/**
 * @description slightly better performance than .filter, possibly not worth it
 */
export function pickSpecificFoxPluginPath(foxPluginPaths: string[], specificIndicesToPick: number): string[] {
	const pickedPaths: string[] = []
	for (let i = 0; i < foxPluginPaths.length; ++i) {
		const foxPluginPath = foxPluginPaths[i]

		if (specificIndicesToPick === i || specificIndicesToPick === -1) {

			// @ts-ignore
			pickedPaths.push(foxPluginPath)
		}
	}
	return pickedPaths
}
