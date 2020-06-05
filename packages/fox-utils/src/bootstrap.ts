import path from 'path'
import fs from 'fs'
import prompts from 'prompts'
import * as c from 'colorette'
import { getProjectData } from './project.js';
import handlebars from 'handlebars'
import { IBuildBootstrap, ITemplateFile } from 'fox-types'
import { getPluginData } from './plugin.js';
import debug from './debug'
import readPkgUp from 'read-pkg-up'

/**
 * generate boilerpalte configuration in `.config`
 * folder of local projet
 */

 /**
	* @description configure how your project. right now all of this is
	* essentially automatically managed
  */
export async function buildBootstrap(opts: IBuildBootstrap): Promise<void> {
	const pluginRoot = path.dirname((await readPkgUp({ cwd: opts.dirname }))?.path as string)
	if (!pluginRoot) throw new Error('could not find pluginRoot')

	const [ pluginData, projectData ] = await Promise.all([ getPluginData(pluginRoot), getProjectData() ])
	const doTemplate = async (fileToTemplate: ITemplateFile): Promise<{ fileDest: string, templatedText: string }> => {
		const fileContents = await fs.promises.readFile(fileToTemplate.absolutePath, { encoding: 'utf8' })
		const templateFn = handlebars.compile(fileContents)
		const templatedText = templateFn({
			noEscape: true
		})
		const fileDest = path.join(projectData.location, fileToTemplate.relativePath)

		return {
			fileDest,
			templatedText,
		}
	}

	const retryFilesToTemplate: ITemplateFile[] = []
	for (const fileToTemplate of pluginData.templateFiles) {
		// const fileDest = path.join(projectData.location, fileToTemplate.filePathRelative)
		const { fileDest, templatedText } = await doTemplate(fileToTemplate)
		try {
			await fs.promises.writeFile(fileDest, templatedText, {
				mode: 0o644,
				flag: 'wx+'
			})
		} catch (err) {
			if (err.code === 'EEXIST') {
				retryFilesToTemplate.push(fileToTemplate)
			} else {
				throw new Error(err)
			}
		}
	}

	// if we have files that would have overriden files that already exist
	// ask the user if they actually want them to be overriden
	if (retryFilesToTemplate.length > 0) {
		const alreadyExistingFilesFormatted = JSON.stringify(retryFilesToTemplate.map(
			(el: ITemplateFile): string => el.relativePath
		))

		const { wantsToOverwrite } = await prompts({
			type: 'toggle',
			name: 'wantsToOverwrite',
			message: `Overwrite ${retryFilesToTemplate.length} files that already exist on disk?. Specifically, they are ${alreadyExistingFilesFormatted}. would you like to override them all?`,
			initial: true,
			active: 'yah!',
			inactive: 'no'
		})

		if (wantsToOverwrite) {
			for (const fileToTemplate of retryFilesToTemplate) {
				const { fileDest, templatedText } = await doTemplate(fileToTemplate)
				await fs.promises.writeFile(fileDest, templatedText)
			}
		} else {
			console.info(c.bold(c.red('exiting tui')))
			process.exit(1)
		}
	}

	console.info(c.bold(c.green('bootstrapped files successfully')))
}
