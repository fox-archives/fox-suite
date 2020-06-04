import path from 'path'
import fs from 'fs'
import type { Dirent } from 'fs'
import * as foxUtils from 'fox-utils'
import { spawn } from 'child_process'
import { IPlugin } from "fox-types";
import type { IActionFunction } from './action'
import debug from './debug'

// HACK: this could be less dirty
export async function getInstalledFoxPlugins(): Promise<string[]> {
	const nodeModulesPath = path.join((await foxUtils.getProjectData()).location, 'node_modules')
	debug('nodeModulesPath: %s', nodeModulesPath)

	try {
		const getPlugins = async (pluginParentDirectory: string): Promise<string[]> => {
			const pluginList: string[] = []
			const nodeModules = await fs.promises.readdir(pluginParentDirectory, { withFileTypes: true })

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

			debug('shortened list of plugins: %o', pluginName)
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

		debug('returned value from getInstalledFoxPlugins: %o', newAllPlugins)
		return newAllPlugins
	} catch (err) {
		console.error(err)
		process.exit(1)
	}
}

export function run(script: string): void {
	const scriptPath = path.join(__dirname, '../node_modules/.bin', script)
	const scriptPath2 = path.join(__dirname, '../node_modules', script, 'bin', `${script}.js`)
	const tsNodePath = path.join(__dirname, '../../node_modules/.bin/ts-node')

	debug('spawning script at: %s', scriptPath2)
	const child = spawn('node', ['--enable-source-maps', scriptPath2], {
		cwd: process.cwd(),
		windowsHide: true
	})

	let output = ""
	child.stdout.on('data', data => {
		console.log(data.toString())
		output += data
	})
	child.stderr.on('data', data => {
		console.info(data.toString())
		output += data
	})
}

type actionFunctions = "bootstrapFunction" | "formatFunction" | "lintFunction"
type fns = IActionFunction["action"]
export const pickModuleProperty = (foxPluginModules: IPlugin[], actionFunctions: actionFunctions): fns => {
	const pickedFunctions: fns = []
	for (const foxPluginModule of foxPluginModules) {
		// @ts-ignore
		pickedFunctions.push(foxPluginModule[actionFunctions])
	}
	return pickedFunctions
}
