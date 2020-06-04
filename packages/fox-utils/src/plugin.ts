import path from 'path'
import { IPluginPrivateInfo } from 'fox-types'

/**
 * @private
 * @description get necessary information about a plugin that the
 * plugin shouldn't have to expose
 */
export async function getPluginData(pluginRoot: string): Promise<IPluginPrivateInfo> {
	const templateDir = path.join(pluginRoot, 'templates')

	return {
		templateDir,
		pluginRoot
	}
}
