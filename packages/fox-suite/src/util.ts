import path from 'path'
import fs from 'fs'
import type { Dirent } from 'fs'
import type { IPluginExportIndex, IProject } from 'fox-types'
import debug from './debug'
import * as foxUtils from 'fox-utils'
import * as util from './util'

const { log } = foxUtils

export function getPluginNameFromPath(pluginPath: string): string {
	let str = pluginPath.slice(pluginPath.lastIndexOf('fox-plugin-'))
	return str.slice(0, str.indexOf('/'))
}

export async function getFoxPlugins(projectData: IProject): Promise<string[]> {
	const nodeModulesPath = path.join(projectData.location, 'node_modules')
	debug('nodeModulesPath: %s', nodeModulesPath)

	try {
		let pluginList: string[] = []
		const nodeModules = await fs.promises.readdir(nodeModulesPath, {
			withFileTypes: true,
		})

		const isFoxPlugin = (nodePackage: Dirent) => {
			return (
				!nodePackage.isFile() &&
				nodePackage.name.startsWith('fox-plugin-')
			)
		}

		const isFoxPreset = (nodePackage: Dirent) => {
			return (
				!nodePackage.isFile() &&
				nodePackage.name.startsWith('fox-preset-')
			)
		}

		for (const nodeModule of nodeModules) {
			if (isFoxPlugin(nodeModule)) {
				const pluginPath = require.resolve(
					path.join(nodeModulesPath, nodeModule.name),
				)
				pluginList.push(pluginPath)
			} else if (isFoxPreset(nodeModule)) {
				const presetPath = require.resolve(
					path.join(nodeModulesPath, nodeModule.name),
				)
				const presetPluginList = (await import(presetPath)).default
					.plugins
				pluginList = pluginList.concat(presetPluginList)
			}
		}

		// remove duplicates
		pluginList = Array.from(new Set(pluginList))

		if (pluginList.length === 0) {
			log.error('no fox-plugins or fox-presets found. please install some to continue')
			process.exit(0)
		}

		return pluginList
	} catch (err) {
		console.error(err)
		process.exit(1)
	}
}

export async function importFoxPlugins(
	projectData: IProject,
	foxPluginPaths: string[],
): Promise<IPluginExportIndex[]> {
	const promises: Promise<IPluginExportIndex>[] = []
	const foxPluginNames = foxPluginPaths.map(util.getPluginNameFromPath)

	for (let i = 0; i < foxPluginPaths.length; i++) {
		const foxPluginPath = foxPluginPaths[i]
		const foxPluginNameLong = foxPluginNames[i]
		const foxPluginName = foxPluginNameLong.slice('fox-plugin-'.length)

		if (projectData.foxConfig.plugins[foxPluginName] !== 'off') {
			promises.push(import(foxPluginPath))
		} else {
			debug('skipping plugin \'%s\' since it\'s \'off\' in fox.config.js', foxPluginName)
		}
	}

	const plugins = (await Promise.all(promises)).filter(Boolean)

	return plugins
}

type actionFunctions = 'bootstrapFunction' | 'fixFunction'
type fns = IPluginExportIndex["bootstrapFunction"][] | IPluginExportIndex["fixFunction"][]
interface ISpecificModuleProperty {
	foxPlugins: IPluginExportIndex[]
	specificIndicesToPick: number | number[]
	actionFunction: actionFunctions
}

/**
 * @description Same as above, but only do so for the elements 'i' that we want.
 * if `-1` is passed to `specificIndicesToPick`, it picks all of them
 */
export function pickSpecificModuleProperty({
	foxPlugins,
	specificIndicesToPick,
	actionFunction,
}: ISpecificModuleProperty): fns {
	const pickedFunctions: fns = []
	for (let i = 0; i < foxPlugins.length; ++i) {
		const foxPlugin = foxPlugins[i]

		if (Array.isArray(specificIndicesToPick)) {
			for(const indice of specificIndicesToPick) {
				// if array, don't accept -1 as 'select all'
				if (indice === i) {
					// @ts-ignore
					pickedFunctions.push(foxPlugin[actionFunction])
				}
			}
		} else {
			if (specificIndicesToPick === i || specificIndicesToPick === -1) {
				// @ts-ignore
				pickedFunctions.push(foxPlugin[actionFunction])
			}
		}

	}
	return pickedFunctions
}

/**
 * @description slightly better performance than .filter, possibly not worth it
 */
export function pickSpecificFoxPluginPath(
	foxPluginPaths: string[],
	specificIndicesToPick: number,
): string[] {
	const pickedPaths: string[] = []
	for (let i = 0; i < foxPluginPaths.length; ++i) {
		const foxPluginPath = foxPluginPaths[i]

		if (specificIndicesToPick === i || specificIndicesToPick === -1) {
			pickedPaths.push(foxPluginPath)
		}
	}
	return pickedPaths
}
