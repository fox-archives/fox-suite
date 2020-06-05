import path from 'path'
import stylelint from 'stylelint'
import * as foxUtils from "fox-utils";
import { IFoxConfig } from "fox-types";
import postcssScss from 'postcss-scss'
import type stylelintType from '../../../@types/stylelint'

export { info } from './info'

export async function bootstrapFunction(): Promise<void> {
	await foxUtils.buildBootstrap({
		dirname: __dirname
	})
}

export async function fixFunction(fox: IFoxConfig): Promise<void> {
	await foxUtils.buildLint({
		dirname: __dirname,
		async fn() {
			console.log('fix stylelint')
			// const { location } = await foxUtils.getProjectData();
			// foxUtils.setFoxOptionsToEnv(fox)

			// const config = (await import(path.join(location, '.config/stylelint.config.js'))).default(fox)

			// const resolve = (module: string) =>
			// 	path.join(__dirname, `../node_modules/${module}`)
			// const stylelintConfigFoxPath =
			// 	path.join(__dirname, '../node_modules/stylelint-config-fox')

			// config.extends = config.extends || [],
			// config.extends.unshift(stylelintConfigFoxPath)

			// const sharedOptions: Partial<stylelintType.i> | undefined = {
			// 	globbyOptions: {
			// 		cwd: location,
			// 		ignore: [],
			// 		caseSensitiveMatch: true, // default
			// 		dot: false, // default
			// 		gitignore: false // default
			// 	},
			// 	configBasedir: location,
			// 	fix: true,
			// 	formatter: "string",
			// 	cache: true,
			// 	cacheLocation: path.join(location, '.config/.stylelintcache'),
			// 	disableDefaultIgnores: true,
			// 	ignorePath: path.join(location, '.config/stylelintignore'),
			// 	reportNeedlessDisables: true,
			// 	reportInvalidScopeDisables: true
			// }

			// const result = await stylelint.lint({
			// 	config,
			// 	files: '**/*.css',
			// 	...sharedOptions
			// })

			// const config2: Partial<stylelint.Configuration> = config
			// const i = resolve("postcss-scss/lib/scss-syntax.js");
			// console.log('i', i)
			// const j = (await import(i)).default
			// console.log(j)
			// config2.processors = [ j ];

			// // config2.plugins = [ postcssScss ]
			// // @ts-ignore
			// const result2 = await stylelint.lint({
			//   config: config2,
			//   files: '**/*.css',
			//   ...sharedOptions
			// })

			// console.log('a', result.output)
		}
	})
}
