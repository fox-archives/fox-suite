import path from 'path'
import fs from 'fs'
import prompts from 'prompts'
import * as c from 'colorette'
import { getProjectData } from './project.js';
import glob from 'glob'
import handlebars from 'handlebars'
import { IBuildBootstrap } from 'fox-types'
import { getPluginData } from './plugin.js';
import util from 'util'
import debug from './debug'

/**
 * generate boilerpalte configuration in `.config`
 * folder of local projet
 */

 /**
	* @description configure how your project. right now all of this is
	* essentially automatically managed
  */
export async function buildBootstrap(opts: IBuildBootstrap): Promise<void> {
	const pluginRoot = path.join(opts.dirname, '..')
	const [ pluginData, projectData ] = await Promise.all([ getPluginData(pluginRoot), getProjectData() ])

	const files = await util.promisify(glob)(`${pluginData.templateDir}/**/*`, {
		dot: true
	})

	interface fileObject {
		filePathAbsolute: string,
		filePathRelative: string,
		stats: fs.Stats
	}
	const filesToTemplatePromise: Promise<fileObject | undefined>[] = files.map(async (filePathAbsolute: string): Promise<fileObject | undefined> => {
		const filePathRelative = filePathAbsolute.slice(pluginData.pluginRoot.length + 'templates'.length + 2)
		const stats = await fs.promises.stat(filePathAbsolute)

		if (stats.isDirectory()) return undefined

		return {
			filePathAbsolute,
			filePathRelative,
			stats
		}
	})

	// these are all the files we need to process with handlebars
	const filesToTemplate = (await Promise.all(filesToTemplatePromise)).filter(Boolean) as fileObject[]
	const doTemplate = async (fileToTemplate: fileObject): Promise<{ fileDest: string, templatedText: string }> => {
		const fileContents = await fs.promises.readFile(fileToTemplate.filePathAbsolute, { encoding: 'utf8' })
		const templateFn = handlebars.compile(fileContents)
		const templatedText = templateFn({
			noEscape: true
		})
		const fileDest = path.join(projectData.location, fileToTemplate.filePathRelative)

		return {
			fileDest,
			templatedText,
		}
	}

	debug('filesToTemplate: %o', filesToTemplate)
	const retryFilesToTemplate: fileObject[] = []
	for (const fileToTemplate of filesToTemplate) {
		// const fileDest = path.join(projectData.location, fileToTemplate.filePathRelative)
		const { fileDest, templatedText } = await doTemplate(fileToTemplate)
		try {
			await fs.promises.writeFile(fileDest, templatedText, {
				mode: 0o755,
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
			(el: fileObject): string => el.filePathRelative
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
