import path from 'path'
import stylelint from 'stylelint'
import * as foxUtils from "fox-utils";
import { IFoxConfig } from "fox-types";
import postcssScss from 'postcss-scss'
import type stylelintType from '../../../@types/stylelint'

export { info } from './info'

export async function bootstrapFunction(): Promise<void> {
	await foxUtils.buildBootstrap({
		dirname: __dirname
	})
}

export async function fixFunction(): Promise<void> {
	await foxUtils.buildFix({
		dirname: __dirname,
		async fn() {
			const projectData = await foxUtils.getProjectData();
			foxUtils.setFoxOptionsToEnv(projectData.foxConfig)

			const stylelintConfigLocation = path.join(projectData.location, '.config/stylelint.config.js')
			const stylelintConfig = (await import(stylelintConfigLocation)).default(projectData.location)

			const resolve = (module: string) =>
				path.join(__dirname, `../node_modules/${module}`)
			const stylelintConfigFoxPath =
				path.join(__dirname, '../node_modules/stylelint-config-fox')

			stylelintConfig.extends = stylelintConfig.extends || [],
			stylelintConfig.extends.unshift(stylelintConfigFoxPath)

			const sharedOptions: Partial<stylelintType.i> | undefined = {
				globbyOptions: {
					cwd: projectData.location,
					ignore: [],
					caseSensitiveMatch: true, // default
					dot: false, // default
					gitignore: false // default
				},
				configBasedir: projectData.location,
				fix: true,
				formatter: "string",
				cache: true,
				cacheLocation: path.join(projectData.location, '.config/.cache/.stylelintcache'),
				disableDefaultIgnores: true,
				ignorePath: path.join(projectData.location, '.config/stylelintignore'),
				reportNeedlessDisables: true,
				reportInvalidScopeDisables: true
			}

			const result = await stylelint.lint({
				config: stylelintConfig,
				files: '**/*.css',
				...sharedOptions
			})

			const config2: Partial<stylelint.Configuration> = stylelintConfig
			const i = resolve("postcss-scss/lib/scss-syntax.js");
			console.log('i', i)
			const j = (await import(i)).default
			console.log(j)
			config2.processors = [ j ];

			// config2.plugins = [ postcssScss ]
			// @ts-ignore
			const result2 = await stylelint.lint({
			  config: config2,
			  files: '**/*.css',
			  ...sharedOptions
			})

			console.log('a', result.output)
		}
	})
}
