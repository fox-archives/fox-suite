import path from 'path'
import * as foxUtils from "fox-utils";
// @ts-ignore
import { ESLint } from "eslint";
import type { IFoxConfig } from 'fox-types';

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

			const eslintConfigLocation = path.join(project.location, '.config/eslint.config.js')

			const eslint = new ESLint({
				cwd: project.location,
				errorOnUnmatchedPattern: false,
				ignorePath: path.join(project.location, '.config/eslintignore'),
				// TODO: use the eslintconfig in `.config/build`
				overrideConfig: (await import('eslint-config-fox')).default,
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
