import path from 'path'
import * as foxUtils from 'fox-utils'
// @ts-ignore
import { ESLint } from 'eslint'
import type { IFoxConfig } from 'fox-types'
import fs from 'fs'

const { debug, c } = foxUtils

export { info } from './info'

export async function bootstrapFunction() {
	await foxUtils.buildBootstrap({
		dirname: __dirname,
	})
}

export async function fixFunction() {
	await foxUtils.buildFix({
		dirname: __dirname,
		async fn(): Promise<void> {
			const project = await foxUtils.getProjectData()

			const config = (await import('eslint-config-fox')).default
			// @ts-ignore
			// const tsConfig = (await import('../node_modules/eslint-config-fox/build/typescript/index.js')).default.default
			// const tsConfig = require('../node_modules/eslint-config-fox/build/typescript/index.js').default

			// rebuild config
			debug('rebuilding config')
			await foxUtils.writeFile(
				path.join(project.location, '.config/build/eslint.config.json'),
				config,
			)

			const eslint = new ESLint({
				cwd: project.location,
				errorOnUnmatchedPattern: false,
				ignorePath: path.join(project.location, '.config/eslintignore'),
				overrideConfig: config,
				resolvePluginsRelativeTo: path.join(
					__dirname,
					'../node_modules/eslint-config-fox',
				),
				useEslintrc: false,
				fix: true,
				cache: false,
				// cacheLocation: path.join(
				// 	project.location,
				// 	'.config/.cache/eslintcache',
				// ),
			})

			// const tsEslint = new ESLint({
			// 	cwd: project.location,
			// 	errorOnUnmatchedPattern: false,
			// 	ignorePath: path.join(project.location, '.config/eslintignore'),
			// 	overrideConfig: tsConfig,
			// 	resolvePluginsRelativeTo: path.join(
			// 		__dirname,
			// 		'../node_modules/eslint-config-fox',
			// 	),
			// 	useEslintrc: false,
			// 	fix: true,
			// 	cache: false,
			// 	// cacheLocation: path.join(
			// 	// 	project.location,
			// 	// 	'.config/.cache/eslintcache',
			// 	// ),
			// })

			const resultsJs = await eslint.lintFiles(['**/*.{js,cjs,mjs,jsx}'])
			const resultsTs = await eslint.lintFiles(['**/*.{ts,tsx}'])

			// faster
			const [ ,,formatter ] = await Promise.all([
				ESLint.outputFixes(resultsJs),
				ESLint.outputFixes(resultsTs),
				eslint.loadFormatter('stylish')
			])

			// format and print results
			const resultsJsText = formatter.format(resultsJs)
			const resultsTsText = formatter.format(resultsJs)

			console.info(resultsJsText)
			console.info(resultsTsText)
		},
	})
}
