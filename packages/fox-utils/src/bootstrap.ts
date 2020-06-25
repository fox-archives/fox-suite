import path from 'path'
import fs from 'fs'
import prompts from 'prompts'
import { getProjectData } from './project.js'
// @ts-ignore
import handlebars from 'handlebars'
import { IBuildBootstrap, ITemplateFile, IPlugin, IProject } from 'fox-types'
import { getPluginData } from './plugin.js'
import debug from './debug'
import merge from 'lodash.merge'
import { log } from './misc'

/**
 * generate boilerpalte configuration in `.config`
 * folder of local projet
 */

async function doHandlebarsTemplate(
	fileContents: string,
	{ pluginData, projectData }: { pluginData: IPlugin; projectData: IProject },
): Promise<string> {
	return handlebars.compile(fileContents)({
		noEscape: true,
		data: {
			projectLocation: projectData.location,
			projectFoxConfigPath: projectData.foxConfigPath,
			projectPackageJsonPath: projectData.packageJsonPath,
			pluginRoot: pluginData.pluginRoot,
			pluginTemplateDir: pluginData.templateDir,
		},
	})
}

/**
 * @description configure how your project. right now all of this is
 * essentially automatically managed
 */
export async function buildBootstrap(opts: IBuildBootstrap): Promise<void> {
	const [pluginData, projectData] = await Promise.all([
		getPluginData(opts.dirname),
		getProjectData(),
	])
	const doTemplate = async (
		fileToTemplate: ITemplateFile,
	): Promise<{ fileDest: string; templatedText: string }> => {
		const fileContent = await fs.promises.readFile(
			fileToTemplate.absolutePath,
			{ encoding: 'utf8' },
		)
		const templatedText = await doHandlebarsTemplate(fileContent, {
			pluginData,
			projectData,
		})
		const fileDest = path.join(
			projectData.location,
			fileToTemplate.relativePath,
		)

		return {
			fileDest,
			templatedText,
		}
	}

	const retryFilesToTemplate: ITemplateFile[] = []
	for (const fileToTemplate of pluginData.templateFiles) {
		const { fileDest, templatedText } = await doTemplate(fileToTemplate)
		try {
			try {
				await fs.promises.mkdir(path.dirname(fileDest), {
					mode: 0o755,
				})
			} catch {}
			await fs.promises.writeFile(fileDest, templatedText, {
				mode: 0o644,
				flag: 'wx+',
			})
		} catch (err) {
			if (err.code === 'EEXIST') {
				// if the file already exists, but is a json file,
				// merge the keys instead of throwing
				if (isJsonFile(fileToTemplate)) {
					await mergeJsonFiles(fileDest, templatedText, {
						projectData,
						pluginData,
					})
				} else {
					retryFilesToTemplate.push(fileToTemplate)
				}
			} else {
				throw new Error(err)
			}
		}
	}

	// if we have files that would have overriden files that already exist
	// ask the user if they actually want them to be overriden
	if (retryFilesToTemplate.length > 0) {
		const alreadyExistingFilesFormatted = JSON.stringify(
			retryFilesToTemplate.map(
				(el: ITemplateFile): string => el.relativePath,
			),
		)

		const { wantsToOverwrite } = await prompts({
			type: 'toggle',
			name: 'wantsToOverwrite',
			message: `Overwrite ${retryFilesToTemplate.length} files that already exist on disk?. Specifically, they are ${alreadyExistingFilesFormatted}. would you like to override them all?`,
			initial: false,
			active: 'yah!',
			inactive: 'no',
		})

		if (wantsToOverwrite) {
			for (const fileToTemplate of retryFilesToTemplate) {
				const { fileDest, templatedText } = await doTemplate(
					fileToTemplate,
				)
				await fs.promises.writeFile(fileDest, templatedText, {
					mode: 0o644,
				})
			}
		} else {
			log.info('exiting tui')
			process.exit(1)
		}
	}
}

function isJsonFile(templateFile: ITemplateFile): boolean {
	return path.extname(templateFile.relativePath) === '.json'
}

/**
 * @param {string} templatedText - strinified json to merge final destrination with
 */
async function mergeJsonFiles(
	fileDest: string,
	templatedText: string,
	{ pluginData, projectData }: { pluginData: IPlugin; projectData: IProject },
) {
	const fileContent = await fs.promises.readFile(fileDest, {
		encoding: 'utf8',
	})

	// final json supposed to be valid
	const jsonText = await doHandlebarsTemplate(fileContent, {
		pluginData,
		projectData,
	})

	// test objectifying the json
	{
		try {
			JSON.parse(jsonText)
		} catch (err) {
			log.error(`your templated json file (read from its respective config) with destination ${fileDest} failed to be parsed`)
			console.error(jsonText)
			console.error(err)
		}
		try {
			JSON.parse(templatedText)
		} catch (err) {
			log.error(`the json file at ${fileDest} could not be parsed`)
			console.error(templatedText)
			console.error(err)
		}
	}

	const finalJson = merge(JSON.parse(jsonText), JSON.parse(templatedText))

	await fs.promises.writeFile(fileDest, JSON.stringify(finalJson, null, 2), {
		mode: 0o644,
	})
}
