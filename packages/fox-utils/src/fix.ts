import { IBuildFix, ITemplateFile, IPluginExportIndex, IProject } from 'fox-types'
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

const parseIgnoreFile = async (
	project: IProject,
	ignoreFile: string
): Promise<{
	ignoreFilePath: string,
	ignoredFiles: string[]
}> => {
	const ignoreFilePath = path.join(project.location, ignoreFile)
	const content = await fs.promises.readFile(ignoreFilePath, { encoding: 'utf8' })

	const universalIgnoreFilePath = path.join(project.location, '.config/universal.ignore')

	return {
		ignoreFilePath: '',
		ignoredFiles: []
	}
}

interface IGetConfigAndIgnores {
	/**
	 * @description resolved pluginConfig that was dependent
	 * on `fox.config.js` variables
	 */
	defaultConfig: Record<string, any>,

	/**
	 * @description path to the user's extended version of config,
	 * usually located at `.config/pluginName.config.js`
	 */
	configPath: string,

	/**
	 * @description function used to merge `pluginConfig`
	 * and `userConfigPath`. if not supplied, it uses `_.merge`
	 */
	configMergeFn?: (defaultConfig: Record<string, any>, userConfig: Record<string, any>) => Record<string, any>


	pluginIgnorePath?: string
}

/**
 * @description does common operations like reading / merging configs,
 * and gets those file paths
 * @summary
 */
export async function getConfigAndIgnores({
	defaultConfig,
	configPath,
	configMergeFn,
	pluginIgnorePath,
}: IGetConfigAndIgnores): Promise<{
	mergedConfig: Record<string, any> | null,
	ignoredFiles?: string[] | null
}> {
	const project = await getProjectData()

	let mergedConfig: Record<string, any> = {}
	{
		const userConfigModule = (await import(
			require.resolve(path.join(project.location, configPath))
		))
		if (typeof userConfigModule.default !== 'function') {
			log.error('default export is not a function. skipping eslint')
			return {
				mergedConfig: null,
				ignoredFiles: null
			}
		}
		const userConfig = userConfigModule.default(project.foxConfig)

		if (!configMergeFn)
			mergedConfig = merge(defaultConfig, userConfig)
		else
			mergedConfig = configMergeFn(defaultConfig, userConfig)
	}

	pluginIgnorePath = pluginIgnorePath || ''

	let { ignoreFilePath, ignoredFiles } = await parseIgnoreFile(
		project,
		pluginIgnorePath
	);



	return {
		mergedConfig,
		ignoredFiles
	}
}
