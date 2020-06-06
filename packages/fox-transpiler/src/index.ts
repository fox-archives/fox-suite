import path from 'path'
import { rollup } from 'rollup'
import type { IPlugin, IProject } from 'fox-types'
import { getPluginData } from 'fox-utils'
import fs from 'fs'

// @ts-ignore
import { babel } from "@rollup/plugin-babel"
import babelPluginFoxRunner from 'babel-plugin-fox-runner'


interface ITranspileConfig {
	foxPluginPaths: string[],
	projectData: IProject
}

export async function transpileConfig({ foxPluginPaths, projectData }: ITranspileConfig) {
	for (const foxPluginPath of foxPluginPaths) {
		const pluginData = await getPluginData(foxPluginPath)

		const configBuildDir = path.join(projectData.location, '.config')
		try {
			await fs.promises.mkdir(configBuildDir, 0o755)
		} catch {}

		for(const templateFile of pluginData.templateFiles) {
			if (path.extname(templateFile.relativePath) === '.js') {
				const templateFileLocation = path.join(projectData.location, templateFile.relativePath)
				const templateFileLocationOutput = path.join(
					projectData.location, '.config/build', templateFile.relativePath.slice(
						templateFile.relativePath.indexOf('/') + 1
					)
				)
				// console.log(templateFileLocationOutput)

				rollup({
					input: templateFileLocation,
					output: {
						file: templateFileLocationOutput,
						format: 'cjs'
					}
				})
			}

		}
	}
}

