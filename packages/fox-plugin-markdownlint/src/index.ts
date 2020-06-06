import markdownlint from 'markdownlint'
import type { IFoxConfig } from 'fox-types'
import * as foxUtils from 'fox-utils'
import util from 'util'
import glob from 'glob'

export { info } from './info'

export async function bootstrapFunction(): Promise<void> {
	await foxUtils.buildBootstrap({
		dirname: __dirname
	})
}

export async function fixFunction(fox: IFoxConfig): Promise<void> {
	await foxUtils.buildFix({
		dirname: __dirname,
		async fn() {
			const projectData = await foxUtils.getProjectData()
			const htmlFiles = await util.promisify(glob)(`${projectData.location}/**/*.md`, {
				ignore: "**/node_modules/**"
			})

			for (const markdownFiles of htmlFiles) {
			const result = markdownlint.sync({
				files: markdownFiles,
				config: {

				}
			})
			console.info(result.toString())
			}
		}
	})
}
