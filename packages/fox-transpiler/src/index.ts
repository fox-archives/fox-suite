import path from 'path'
import fs from 'fs'
import { rollup } from 'rollup'
import type { OutputOptions } from 'rollup'
import type { IPlugin, IProject } from 'fox-types'
import { getPluginData } from 'fox-utils'
import * as c from 'colorette'

// @ts-ignore
import { babel } from "@rollup/plugin-babel"
import babelPluginFoxRunner from 'babel-plugin-fox-runner'

let exitIfFileDoesntExist = async (filePath: string, relativePath: string) => {
	try {
		await fs.promises.access(filePath, fs.constants.F_OK)
	} catch {
		console.log(c.bold(c.red(`${relativePath} doesn't exist. try to bootstrap the plugins's configuration`)))
		process.exit(1)
	}
}

interface ITranspileConfig {
	foxPluginPaths: string[],
	projectData: IProject
}

export async function transpileConfig({ foxPluginPaths, projectData }: ITranspileConfig) {
	for (const foxPluginPath of foxPluginPaths) {
		const pluginData = await getPluginData(foxPluginPath)

		const configBuildDir = path.join(projectData.location, '.config')
		// create build directory if it doesn't already exist
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

				await exitIfFileDoesntExist(templateFileLocation, templateFile.relativePath)

				const inputOptions = {
					input: templateFileLocation,
				}
				const outputOptions: OutputOptions = {
					file: templateFileLocationOutput,
					format: 'cjs'
				}

				const bundle = await rollup(inputOptions)
				await bundle.write(outputOptions);
			}

		}
	}
	console.log(c.bold(c.green('done transpiling')))
}

