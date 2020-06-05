import { IBuildLint, ITemplateFile } from 'fox-types'
import { getProjectData } from './project'
import { getPluginData } from './plugin'
import path from 'path'
import fs from 'fs'
import readPkgUp from 'read-pkg-up'
import * as c from 'colorette'

export async function buildLint(opts: IBuildLint): Promise<void> {
	const pluginRoot = path.dirname((await readPkgUp({ cwd: opts.dirname }))?.path as string)
	if (!pluginRoot) throw new Error('could not find pluginRoot')

	const [ projectData, pluginData ] = await Promise.all([
		getProjectData(), getPluginData(pluginRoot)
	])

	const templateFilesExistPromises = pluginData.templateFiles.map((templateFile: ITemplateFile): Promise<void> => {
		const templateFileInCurrentProject = path.join(projectData.location, templateFile.relativePath)
		return fs.promises.access(templateFileInCurrentProject, fs.constants.F_OK)
	})

	// this will throw if at least 'one' template file
	// cannot be found in the user project's directory
	try {
		await Promise.all(templateFilesExistPromises)
	} catch {
		console.log(c.bold(c.red(`skipping ${path.basename(pluginData.pluginRoot)}. not all config files were found`)))
		process.exit(1)
	}

	await opts.fn()
}
