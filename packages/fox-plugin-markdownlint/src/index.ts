import path from 'path'
import markdownlint from 'markdownlint'
import type { IFoxConfig } from 'fox-types'
import * as foxUtils from 'fox-utils'

const { debug, glob, c } = foxUtils

export { info } from './info'

export async function bootstrapFunction(): Promise<void> {
	await foxUtils.buildBootstrap({
		dirname: __dirname,
	})
}

export async function fixFunction(fox: IFoxConfig): Promise<void> {
	await foxUtils.buildFix({
		dirname: __dirname,
		async fn(): Promise<void> {
			const project = await foxUtils.getProjectData()

			const config = {}

			await foxUtils.writeFile(
				path.join(
					project.location,
					'.config/build/htmllint.config.json',
				),
				config,
			)

			const htmlFiles = await glob(`${project.location}/**/*.md`, {
				ignore: '**/node_modules/**',
			})

			for (const markdownFiles of htmlFiles) {
				const result = markdownlint.sync({
					files: markdownFiles,
					config: {},
				})
				console.info(result.toString())
			}
		},
	})
}
