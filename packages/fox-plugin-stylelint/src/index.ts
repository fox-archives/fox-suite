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
				config: ((await import('stylelint-config-fox')).default),
				files: '**/*.css',
				...sharedOptions
			})

			console.info(result.output)
		}
	})
}
