import { IFoxConfig } from 'fox-types'

export function rootConfig(foxConfig: IFoxConfig, tier: string): Record<string, any> {
	const root: Record<string, any> = {
		parser: require.resolve('babel-eslint'),
		parserOptions: {
			parser: require.resolve('babel-eslint'),
			ecmaVersion: 2020,
			sourceType: 'module',
			ecmaFeatures: {
				globalReturn: false,
				impliedStrict: true,
				jsx: true,
			}
		},
		env: {
			browser: false, // see below
			node: false, // see below
			commonjs: false, // see below
			'shared-node-browser': false, // see below
			es6: true,
			es2017: true,
			es2020: true,
			worker: false,
			amd: false,
			mocha: false,
			jasmine: false,
			jest: false,
			phantomjs: false,
			protractor: false,
			qunit: false,
			jquery: false,
			prototypejs: false,
			shelljs: false,
			meteor: false,
			mongo: false,
			applescript: false,
			nashorn: false,
			serviceworker: false,
			atomtest: false,
			embertest: false,
			webextensions: false,
			greasemonkey: false,
		},
		globals: {
			document: 'readonly',
			navigator: 'readonly',
			window: 'readonly',
		},
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
				files: ['**/*.test.js', '**/*.spec.js'],
				env: {
					"jest": true,
					// "jest/globals": true
				},
			},
		],
		rules: { },
	}

	if (foxConfig.env.includes('browser')) {
		root.env.browser = true
	}

	if (foxConfig.env.includes('node')) {
		root.env.node = true
		root.env.commonjs = true
	}

	return root
}
