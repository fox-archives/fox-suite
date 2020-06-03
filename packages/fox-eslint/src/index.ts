import path from 'path'
// @ts-ignore
import { ESLint } from "eslint";
import * as foxUtils from "fox-utils";
// @ts-ignore
import eslintConfigFox from 'eslint-config-fox'

export async function bootstrapFunction() {
	const templateFiles = [
		".config/eslint.config.js",
		".config/eslintignore"
	]
	await foxUtils.useBootstrapTemplate({
		templateRoot: path.join(__dirname, '../src/templates'),
		// templateRoot: path.join(foxUtils.__dirname(import.meta), '../src/templates'),
		templateFiles
	})
}

export async function lintFunction() {
  // 1. Create an instance.
  const eslint = new ESLint({
    cwd: process.cwd(),
    errorOnUnmatchedPattesrn: true,
    globInputPaths: true,
    // ignorePath: '',
    overrideConfig: {

    },
    useEslintrc: false
  });

  // 2. Lint files.
  const results = await eslint.lintFiles(["../**/*.js"]);

  // 3. Format the results.
  const formatter = await eslint.loadFormatter("stylish");
  const resultText = formatter.format(results);

  // 4. Output it.
  console.log(resultText);
}
