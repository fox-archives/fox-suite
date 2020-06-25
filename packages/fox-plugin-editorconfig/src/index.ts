import type { IFoxConfig } from 'fox-types'
import * as foxUtils from 'fox-utils'

const { debug, c } = foxUtils

export { info } from './info'

export async function bootstrapFunction() {
	await foxUtils.buildBootstrap({
		dirname: __dirname,
	})
}

// export async function fixFunction() {
// 	await foxUtils.buildFix({
// 		dirname: __dirname,
// 		async fn(): Promise<void> {
// 			const project = await foxUtils.getProjectData()

// 		}
// 	})
// }
