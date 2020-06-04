import path from 'path'
// @ts-ignore
import { ESLint } from "eslint";
import * as foxUtils from "fox-utils";
import eslintConfigFox from 'eslint-config-fox'

export { info } from './info'

export async function bootstrapFunction() {
	await foxUtils.buildBootstrap({
		dirname: __dirname
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
