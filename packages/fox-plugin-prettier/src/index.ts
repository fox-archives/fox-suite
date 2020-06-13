import path from 'path'
import prettier from 'prettier'
import { IFoxConfig } from "fox-types";
import * as foxUtils from "fox-utils";

const { debug, c } = foxUtils

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
			const project = await foxUtils.getProjectData()

			const config = {}

			debug('rebuilding config')
			await foxUtils.writeFile(
				path.join(project.location, '.config/build/eslint.config.json'),
				config
			)
		}
	})
}
