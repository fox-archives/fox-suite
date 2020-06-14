import path from 'path'
import fs from 'fs'
import util from 'util'
import { IPlugin } from 'fox-types'
import glob from 'glob'
import { ITemplateFile } from 'fox-types'
import readPkgUp from 'read-pkg-up'

/**
 * @description get necessary information about a plugin that the
 * plugin shouldn't have to expose
 */
export async function getPluginData(
	pluginRootOrSubDir: string,
): Promise<IPlugin> {
	const pluginRoot = path.dirname(
		(await readPkgUp({ cwd: pluginRootOrSubDir }))?.path as string,
	)
	const templateDir = path.join(pluginRoot, 'templates')

	const packageJson = JSON.parse(
		await fs.promises.readFile(path.join(pluginRoot, 'package.json'), {
			encoding: 'utf8',
		}),
	)

	const templateFilesPaths = await util.promisify(glob)(
		`${templateDir}/**/*`,
		{
			dot: true,
		},
	)
	let templateFilesPromises = templateFilesPaths.map(
		async (absolutePath: string): Promise<ITemplateFile | undefined> => {
			// + 2 to account for extra forward slashes
			const relativePath = absolutePath.slice(
				pluginRoot.length + 'templates'.length + 2,
			)
			const stats = await fs.promises.stat(absolutePath)

			if (stats.isDirectory()) return undefined

			return {
				absolutePath,
				relativePath,
				stats,
			}
		},
	)
	const templateFiles = (await Promise.all(templateFilesPromises)).filter(
		Boolean,
	) as ITemplateFile[]

	return {
		templateDir,
		templateFiles,
		pluginRoot,
		packageJson,
	}
}
