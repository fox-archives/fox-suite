import path from 'path'
import prettier from 'prettier'
import { IFoxConfig } from 'fox-types'
import * as foxUtils from 'fox-utils'
import fs from 'fs'

const { debug, c, glob } = foxUtils
const d = debug('fox-suite:fox-plugin-prettier')

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

			const defaultConfig = (
				await import(
					require.resolve(path.join(__dirname, './prettier.config'))
				)
			).default
			const userConfigModule = (
				await import(
					require.resolve(path.join(project.location, '.config/prettier.config.js'))
				)
			)
			if (typeof userConfigModule.default !== 'function') {
				console.error(
					c.bold(c.red('default export is not a function. skipping prettier'))
				)
				return
			}
			const userConfig = userConfigModule.default(project.foxConfig)

			const mergedConfig = Object.assign({}, defaultConfig, userConfig)

			d('defaultConfig: %o', defaultConfig)
			d('userConfig: %o', userConfig)
			d('mergedConfig: %o', mergedConfig)

			await foxUtils.writeFile(
				path.join(
					project.location,
					'.config/build/prettier.config.json',
				),
				mergedConfig,
			)

			const files = await glob(`**/*`, {
				cwd: project.location,
				nodir: true,
				ignore: ['**/node_modules/**'],
			})

			function format(): Promise<void> {
				return new Promise((resolve, reject) => {
					for (let i = 0; i < files.length; ++i) {
						const file = files[i]
						fs.promises
							.readFile(file, { encoding: 'utf8' })
							.then(
								async (content: string): Promise<any> => {
									try {
										const formatOptions = {
											...mergedConfig,
											filepath: file,
										}

										// TODO: make more robust
										if (file === 'license' || file === 'LICENSE') {
											return
										}
										if (new Set(['.log', '.sh']).has(path.extname(file))) {
											return
										}

										const formatedContent = prettier.format(
											content,
											formatOptions
										)

										const stats = await fs.promises.stat(file)

										return fs.promises.writeFile(
											file,
											formatedContent,
											{
												mode: stats.mode,
											},
										)
									} catch (err) {
										if (err.message.includes('No parser could be inferred')) {
											console.info(c.bold(c.yellow(`non-fatal error for file ${file}:`)))
											console.error(err)
										} else {
											console.info(c.bold(c.red(`error occured for file ${file}:`)))
											console.error(err)
										}
									}
								},
							)
							.then(() => {
								if (i === files.length - 1) {
									d('promise resolving')
									resolve()
								}
							})
							.catch((err: any) => {
								if (
									!err
										.toString()
										.includes(
											'Error: No parser could be inferred for file',
										)
								) {
									console.error(err)
								}
							})
					}
				})

			}

			await format()
		},
	})
}
