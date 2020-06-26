import { IBuildFix, ITemplateFile, IPluginExportIndex } from 'fox-types'
import { getProjectData } from './project'
import { getPluginData } from './plugin'
import path from 'path'
import fs from 'fs'
import { log } from './misc'
import merge from 'lodash.merge'

export async function buildFix(opts: IBuildFix): Promise<void> {
	const [projectData, pluginData] = await Promise.all([
		getProjectData(),
		getPluginData(opts.dirname),
	])

	const templateFilesExistBooleans = pluginData.templateFiles.map(
		(templateFile: ITemplateFile): boolean => {
			const templateFileInCurrentProject = path.join(
				projectData.location,
				templateFile.relativePath,
			)

			// TODO: sync
			try {
				fs.accessSync(templateFileInCurrentProject, fs.constants.F_OK)
				return true
			} catch {
				return false
			}

		},
	)

	// set the environment properly
	process.env.FOX_SUITE_FOX_OPTIONS = JSON.stringify(projectData.foxConfig)
	// TODO: this performs an extra import, not ideal, but refactoring
	// to pass in extra parameter may not be worth it
	const info = (<IPluginExportIndex>(
		await import(require.resolve(pluginData.pluginRoot))
	)).info

	const pluginEnvTierName = `FOX_SUITE_PLUGIN_${info.tool.toLocaleUpperCase()}_TIER`
	process.env[pluginEnvTierName] =
		projectData.foxConfig.plugins[info.tool] ||
		projectData.foxConfig.all


	const allTemplateFilesExist = () =>
		templateFilesExistBooleans.every(Boolean)

	if (!allTemplateFilesExist()) {
		log.warn(`skipping ${info.name}. not all config files were found. do you need to bootstrap first?`)
		return
	}

	log.info(`running ${info.name} fix`)
	await opts.fn()
}

const parseIgnoreFile = async (ignoreFilePath: string): Promise<string[]> => {
	const content = await fs.promises.readFile(ignoreFilePath, { encoding: 'utf8' })
	return []
}

interface IGetConfigAndIgnores {
	defaultConfig: Record<string, any>,
	userConfigPath: string,
	configMergeFn?: (defaultConfig: Record<string, any>, userConfig: Record<string, any>) => Record<string, any>
	ignoreFilePath?: string
}

export async function getConfigAndIgnores({
	defaultConfig,
	userConfigPath,
	configMergeFn,
	ignoreFilePath,
}: IGetConfigAndIgnores): Promise<{
	mergedConfig: Record<string, any> | null,
	ignoredFiles?: string[] | null
}> {
	const project = await getProjectData()

	const userConfigModule = (await import(userConfigPath))
	if (typeof userConfigModule.default !== 'function') {
		log.error('default export is not a function. skipping eslint')
		return {
			mergedConfig: null,
			ignoredFiles: null
		}
	}

	const userConfig = userConfigModule.default(project.foxConfig)

	let ignoredFiles = null
	if (ignoreFilePath) {
		ignoredFiles = await parseIgnoreFile(ignoreFilePath)
	}

	if (!configMergeFn) {
		return {
			mergedConfig: merge(defaultConfig, userConfig),
			ignoredFiles,
		}
	} else {
		return {
			mergedConfig: configMergeFn(defaultConfig, userConfig),
			ignoredFiles,
		}
	}

}
