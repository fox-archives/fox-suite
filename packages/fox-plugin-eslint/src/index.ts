import path from 'path'
import * as foxUtils from "fox-utils";
// @ts-ignore
import { ESLint } from "eslint";
import type { IFoxConfig } from 'fox-types';
import fs from 'fs'

const { debug, c } = foxUtils

export { info } from './info'

export async function bootstrapFunction() {
	await foxUtils.buildBootstrap({
		dirname: __dirname
	})
}

export async function fixFunction() {
	await foxUtils.buildFix({
		dirname: __dirname,
		async fn() {
			const project = await foxUtils.getProjectData()

			const config = (await import('eslint-config-fox')).default

			// rebuild config
			debug('rebuilding config')
			await foxUtils.writeFile(
				path.join(project.location, '.config/build/eslint.config.json'),
				config
			)

			const eslint = new ESLint({
				cwd: project.location,
				errorOnUnmatchedPattern: false,
				ignorePath: path.join(project.location, '.config/eslintignore'),
				overrideConfig: config,
				resolvePluginsRelativeTo: path.join(__dirname, '../node_modules/eslint-config-fox'),
				useEslintrc: false,
				fix: true,
				cache: true,
				cacheLocation: path.join(project.location, '.config/.cache/eslintcache')
			});

			const results = await eslint.lintFiles(["**/*.js"]);

			await ESLint.outputFixes(results);

			// format and print results
			const formatter = await eslint.loadFormatter("stylish");
			const resultText = formatter.format(results);
			console.info(resultText);
		}
	})
}
