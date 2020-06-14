import type stylelint from 'stylelint';

// declare module "stylelint" {
// 	export interface LinterOptionsOverride extends stylelint.LinterOptions {
// 		globbyOptions: Record<string, any>
// 	}
// }

// HACK: could be less ugly
export interface i extends stylelint.LinterOptions {
	globbyOptions: Record<string, any>;
	reportInvalidScopeDisables: boolean;
}
