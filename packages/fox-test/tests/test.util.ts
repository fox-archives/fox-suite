import path from 'path'

export function getPluginInfo(): { pluginPath: string, pluginName: string } {
	let pluginPath: string = process.env.FOX_PLUGIN_DIRECTORY || ''
	let pluginName: string = path.basename(pluginPath)
	if (!pluginPath || !pluginName) {
		throw new Error('either pluginPath or pluginName are falsey. this is a problem')
	}

	return { pluginPath, pluginName }
}

export function loadModule(relativePath: string) {
	const { pluginPath } = getPluginInfo()

	return import(path.join(pluginPath, relativePath))
}
