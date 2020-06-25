import path from 'path'
import stylelint from 'stylelint'
import * as foxUtils from 'fox-utils'
import { IFoxConfig } from 'fox-types'
import postcssScss from 'postcss-scss'
import type stylelintType from '../../../@types/stylelint'
import fs from 'fs'

const { debug, c } = foxUtils

export { info } from './info'

export async function bootstrapFunction(): Promise<void> {
	await foxUtils.buildBootstrap({
		dirname: __dirname,
	})
}

export async function fixFunction(): Promise<void> {
	await foxUtils.buildFix({
		dirname: __dirname,
		async fn(): Promise<void> {
			const project = await foxUtils.getProjectData()

			const config = (await import('stylelint-config-fox')).default

			// rebuild config
			debug('rebuilding config')
			await foxUtils.writeFile(
				path.join(
					project.location,
					'.config/build/stylelint.config.json',
				),
				config,
			)

			const sharedOptions: Partial<stylelintType.i> | undefined = {
				globbyOptions: {
					cwd: project.location,
					ignore: [
						'**/node_modules/**'
					],
					caseSensitiveMatch: true, // default
					dot: false, // default
					gitignore: false, // default
				},
				configBasedir: project.location,
				fix: true,
				formatter: 'string',
				cache: true,
				cacheLocation: path.join(
					project.location,
					'.config/.cache/.stylelintcache',
				),
				disableDefaultIgnores: true,
				ignorePath: path.join(
					project.location,
					'.config/stylelintignore',
				),
				reportNeedlessDisables: true,
				reportInvalidScopeDisables: true,
			}

			const result = await stylelint.lint({
				config,
				files: '**/*.css',
				...sharedOptions,
			})

			console.info(result.output)
		},
	})
}
