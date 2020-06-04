import path from 'path'
import prettier from 'prettier'
import { IFox } from "fox-types";
import * as foxUtils from "fox-utils";

export { info } from './info'

export async function bootstrapFunction(): Promise<void> {
	await foxUtils.buildBootstrap({
		dirname: __dirname
	})
}

export async function formatFunction(fox: IFox): Promise<void> {

}
