import path from 'path'
import fs from 'fs'
import type { Dirent } from 'fs'
import * as foxUtils from 'fox-utils'
import type { IAction, IPluginExportIndex } from "fox-types";
import debug from './debug'

export async function getInstalledFoxPlugins(): Promise<string[]> {
	const nodeModulesPath = path.join((await foxUtils.getProjectData()).location, 'node_modules')
	debug('nodeModulesPath: %s', nodeModulesPath)

	try {
		let pluginList: string[] = []
		const nodeModules = await fs.promises.readdir(nodeModulesPath, { withFileTypes: true })

		const isFoxPlugin = (nodePackage: Dirent) => {
			return (nodePackage.isDirectory() || nodePackage.isSymbolicLink()) && nodePackage.name.startsWith("fox-plugin-")
		}

		const isFoxPreset = (nodePackage: Dirent) => {
			return (nodePackage.isDirectory() || nodePackage.isSymbolicLink()) && nodePackage.name.startsWith("fox-preset-")
		}

		for (const nodeModule of nodeModules) {
			if (isFoxPlugin(nodeModule)) {
				const pluginPath = require.resolve(
					path.join(nodeModulesPath, nodeModule.name)
				)
				pluginList.push(pluginPath)
			} else if (isFoxPreset(nodeModule)) {
				const presetPath = require.resolve(
					path.join(nodeModulesPath, nodeModule.name)
				)
				const presetPluginList = (await import(presetPath)).default.plugins
				pluginList = pluginList.concat(presetPluginList)
			}
		}

		// remove duplicates
		return Array.from(new Set(pluginList))
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
