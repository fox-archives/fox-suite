import path from 'path'
import * as foxUtils from "fox-utils";
import eslintConfigFox from 'eslint-config-fox'
// @ts-ignore
import { ESLint } from "eslint";

export { info } from './info'

export async function bootstrapFunction() {
	await foxUtils.buildBootstrap({
		dirname: __dirname
	})
}

export async function fixFunction() {
	foxUtils.buildFix({
		dirname: __dirname,
		async fn() {
			const projectData = await foxUtils.getProjectData()
			foxUtils.setFoxOptionsToEnv(projectData.foxConfig)

			const eslintConfigLocation = path.join(projectData.location, '.config/eslint.config.js')
			const eslintConfig = (await import(eslintConfigLocation)).default(projectData.foxConfig)

			const eslint = new ESLint({
				cwd: projectData.location,
				errorOnUnmatchedPattern: false,
				ignorePath: path.join(projectData.location, '.config/eslintignore'),
				overrideConfig: eslintConfig,
			  useEslintrc: false,
				fix: true,
				cache: true,
				cacheLocation: path.join(projectData.location, '.config/.cache/eslintcache')
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
