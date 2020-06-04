import path from 'path'
import fs from 'fs'
import { IPlugin } from 'fox-types'

/**
 * @description get necessary information about a plugin that the
 * plugin shouldn't have to expose
 */
export async function getPluginData(pluginRoot: string): Promise<IPlugin> {
	const templateDir = path.join(pluginRoot, 'templates')

	const packageJson = JSON.parse(await fs.promises.readFile(
		path.join(pluginRoot, 'package.json'),
		{ encoding: 'utf8' }
	))

	return {
		templateDir,
		pluginRoot,
		packageJson
	}
}
