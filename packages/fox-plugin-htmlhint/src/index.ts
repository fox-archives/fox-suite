import path from 'path'
import htmlhint from 'htmlhint'
import type { IFoxConfig } from "fox-types";
import * as foxUtils from "fox-utils";

export { info } from './info'

export async function bootstrapFunction(): Promise<void> {
	await foxUtils.buildBootstrap({
		dirname: __dirname
	})
}

export async function fixFunction(fox: IFoxConfig): Promise<void> {
	console.log('fix htmlhint')
}
