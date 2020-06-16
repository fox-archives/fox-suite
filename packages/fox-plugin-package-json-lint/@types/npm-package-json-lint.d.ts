interface ILintOptions {
	cwd?: string
	packageJsonObject?: any
	packageJsonFile?: string
	config?: any
	configFile?: string
	patterns?: string[]
	quiet?: boolean
	ignorePath?: string
}

// declare module 'npm-package-json-lint' {
//   // export function fn(): string
//   // export interface ...
//   export namespace NpmPackageJsonLint {
//     export function lint(NpmPackageJsonLintOptions: ILintOptions): any
//   }
// }

declare module 'npm-package-json-lint'
