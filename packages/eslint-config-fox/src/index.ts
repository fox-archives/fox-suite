import merge from 'lodash.merge'
import { eslintConfigFoxBase } from './eslint-config-fox-base'
import type { IFoxConfig } from 'fox-types'

/**
 * Rule Resolution
 * configs of the lowest priority are added to the rootConfig. first
 * cozyConfig gets added. then, strictConfig overwrites cozyConfig. lastly,
 * excessiveConfig overwrites strictConfig (and by extension, whatever is
 * in cozyConfig)
 *
 * when editing, keep in mind it is harder to move a rule from a higher
 * priority to a lower priority (if we wish to edit)
 */
const foxConfig: IFoxConfig = JSON.parse(process.env.FOX_SUITE_FOX_OPTIONS || '{}')
const tier: string = process.env.FOX_SUITE_TIER || ''

const obj2 = eslintConfigFoxBase(foxConfig, tier)
console.log(obj2)

const obj: Record<string, any> = {
	parserOptions: {
		parser: 'babel-eslint',
		ecmaVersion: 2020,
		sourceType: 'module',
		ecmaFeatures: {
			impliedStrict: true,
		}
	},
	env: {
		es6: true,
		es2017: true,
		es2020: true,
	},
	// commonjs: true,
	// 'shared-node-browser': true,
	// worker: false,
	// amd: false,
	// mocha: false,
	// jasmine: false,
	// jest: false,
	// phantomjs: false,
	// protractor: false,
	// qunit: false,
	// jquery: false,
	// prototypejs: false,
	// shelljs: false,
	// meteor: false,
	// mongo: false,
	// applescript: false,
	// nashorn: false,
	// serviceworker: false,
	// atomtest: false,
	// embertest: false,
	// webextensions: false,
	// greasemonkey: false,
	// },

	plugins: [
		// "simple-import-sort",
		// "no-use-extend-native",
		// "no-secrets",
		// "prettier"
	],
  extends: [
	// "eslint:recommended",
	// "plugin:promise/recommended",
	// "plugin:import/errors",
	// "plugin:import/warnings",
	// "plugin:jest/recommended",
	// "plugin:jest/style",
	// "plugin:monorepo/recommended"
	],

	overrides: [
		{
			files: ['**/test.js'],
			env: {
				// "jest": true,
				// "jest/globals": true
			},
		},
	],
	rules: {},

	globals: {
		document: 'readonly',
		navigator: 'readonly',
		window: 'readonly',
	},
}

module.exports = obj
