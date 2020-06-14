// @ts-ignore
import { NpmPackageJsonLint } from 'npm-package-json-lint';
import * as foxUtils from 'fox-utils';
import { IFoxConfig } from 'fox-types';
import path from 'path';

export { info } from './info';

export async function bootstrapFunction(): Promise<void> {
	await foxUtils.buildBootstrap({
		dirname: __dirname,
	});
}

export async function lintFunction(fox: IFoxConfig): Promise<void> {
	// const { packageJson, packageJsonPath, location } = await foxUtils.getProjectData();
	// const packageJsonLintConfig = await foxUtils.getAndCreateConfig(location, 'fox-plugin-package-json-lint');
	// if (!packageJsonLintConfig) return
	// const npmPackageLint = new NpmPackageJsonLint({
	// 	cwd: process.cwd(),
	// 	packageJsonObject: packageJson,
	// 	packageJsonFilePath: packageJsonPath,
	// 	config: packageJsonLintConfig,
	// 	// configFile: '',
	// 	// patterns: ['**/package.json'],
	// 	quiet: false,
	// 	// ignorePath: ''
	// })
	// const lintedPackageJson = npmPackageLint.lint()
	// console.log(lintedPackageJson)
}
