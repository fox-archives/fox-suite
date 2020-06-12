import { IBuildFix, ITemplateFile, IPluginExportIndex } from 'fox-types'
import { getProjectData } from './project'
import { getPluginData } from './plugin'
import path from 'path'
import fs from 'fs'
import * as c from 'colorette'

export async function buildFix(opts: IBuildFix): Promise<void> {
	const [ projectData, pluginData ] = await Promise.all([
		getProjectData(), getPluginData(opts.dirname)
	])

	const templateFilesExistPromises = pluginData.templateFiles.map((templateFile: ITemplateFile): Promise<void> => {
		const templateFileInCurrentProject = path.join(projectData.location, templateFile.relativePath)
		return fs.promises.access(templateFileInCurrentProject, fs.constants.F_OK)
	})

	// set the environment properly
	{
		process.env.FOX_SUITE_FOX_OPTIONS = JSON.stringify(projectData.foxConfig)
		const info = (<IPluginExportIndex> await import(require.resolve(pluginData.pluginRoot))).info
		const pluginEnvTierName =
  `FOX_SUITE_PLUGIN_${info.tool.toLocaleUpperCase()}_TIER`;
		process.env[pluginEnvTierName] = projectData.foxConfig.plugin[info.tool] || projectData.foxConfig.all ||
  "cozy";
	}

	// this will throw if at least 'one' template file
	// cannot be found in the user project's directory
	// if the file is a javascript file, we know it'll always
	// exist since the rollup build step is completed before this
	// stage
	try {
		await Promise.all(templateFilesExistPromises)
	} catch {
		console.log(c.bold(c.red(`skipping ${path.basename(pluginData.pluginRoot)}. not all config files were found`)))
		process.exit(1)
	}

	await opts.fn()
}
