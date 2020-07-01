import path from 'path'
import * as foxUtils from 'fox-utils'
// @ts-ignore
import { ESLint } from 'eslint'
import type { IFoxConfig } from 'fox-types'
import fs from 'fs'
import mergewith from 'lodash.mergewith'

const { debug, log } = foxUtils
const d = debug('fox-suite:fox-plugin-eslint')
export const customizer = (
	destObj: Record<string, any>,
	srcObj: Record<string, any>,
): any => {
	// for arrays that are not rules, merge them
	// 'extends', 'plugins', etc.
	if (
		Array.isArray(destObj) &&
		Array.isArray(srcObj) &&
		!destObj.includes('error') &&
		!srcObj.includes('error') &&
		!destObj.includes('off') &&
		!srcObj.includes('off')
	) {
		return destObj.concat(srcObj)
	}
}

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

			const defaultConfig = (await import(
				require.resolve('eslint-config-fox'))
			).default

			const {
				mergedConfig
			} = await foxUtils.getConfigAndIgnores({
				defaultConfig,
				configFile: '.config/eslint.config.js',
				configMergeFn: (defaultConfig, userConfig) => {
					return mergewith(defaultConfig, userConfig, customizer)
				},
				ignoreFile: '.config/eslintignore'
			})
			if (!mergedConfig) {
				log.error(`failed to merge config for fox-plugin-eslint. skipping.`)
				return
			}

			await foxUtils.writeFile(
				path.join(project.location, '.config/build/eslint.config.json'),
				mergedConfig,
			)

			const eslintObj: ESLint.Options = {
				cwd: project.location,
				errorOnUnmatchedPattern: false,
				ignorePath: path.join(project.location, '.config/eslintignore'),
				overrideConfig: mergedConfig,
				resolvePluginsRelativeTo: path.join(
					__dirname,
					'../node_modules/eslint-config-fox',
				),
				useEslintrc: false,
				fix: true,
				cache: false

			}
			const cacheLocation = path.join(
				project.location,
				'.config/.cache/eslintcache',
			)
			if(project.foxConfig.cache === true) {
				eslintObj.cache = true,
				eslintObj.cacheLocation
			} else {
				// ensure eslint cache is removed
				try {
					await fs.promises.unlink(cacheLocation)
				} catch (err) {
					if (err.code !== "ENOENT") {
						log.error('problem removing eslint cache')
						console.error(err);
					}
				}
			}
			const eslint = new ESLint(eslintObj)

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
