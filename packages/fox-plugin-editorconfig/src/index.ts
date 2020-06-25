import * as foxUtils from 'fox-utils'

export { info } from './info'

export async function bootstrapFunction() {
	await foxUtils.buildBootstrap({
		dirname: __dirname,
	})
}
