import path from 'path'
import { IFoxConfig } from 'fox-types'
import readPkgUp from 'read-pkg-up'

export function importPlugin(
	fox: IFoxConfig,
	tier: string,
): Record<string, any> {
	// requires sourceType: 'module' and ecmaVersion: 2018
	const obj: Record<string, any> = {
		plugins: ['eslint-plugin-import'],
		extends: [
			// we override all of these (i'm pretty sure)
			'plugin:import/errors',
  			'plugin:import/warnings'
		],
		settings: {},
		rules: {
			/* ------------------ static analyasis ------------------ */
			'import/no-unresolved': [
				'error',
				{
					commonjs: true,
					amd: false,
				},
			],
			'import/named': 'error',
			'import/default': 'error',
			'import/namespace': 'error',
			'import/no-restricted-paths': 'off',
			'import/no-absolute-path': [
				'error',
				{
					esmodule: true,
					commonjs: true,
					amd: false,
				},
			],
			'import/no-dynamic-require': 'off',
			'import/no-internal-modules': 'error',
			'import/no-webpack-loader-syntax': 'error',
			'import/no-self-import': 'off', // see strict
			'import/no-cycle': 'error', // see strict
			'import/no-useless-path-segments': 'off', // see strict
			'import/no-relative-parent-imports': 'off',

			/* ------------------ helpful warnings ------------------ */
			'import/export': 'error',
			'import/no-named-as-default': 'off',
			'import/no-named-as-default-member': 'error',
			'import/no-deprecated': 'off',
			'import/no-extraneous-dependencies': 'off',
			'import/no-mutable-exports': 'off',
			'import/no-unused-modules': 'off',

			/* ------------------- module systems ------------------- */
			'import/unambiguous': 'off',
			'import/no-commonjs': 'off',
			'import/no-amd': 'off',
			'import/no-nodejs-modules': 'off',

			/* --------------------- style guide -------------------- */
			'import/first': 'off',
			'import/exports-last': 0,
			'import/no-duplicates': 'off',
			'import/no-namespace': 'off',
			'import/extensions': 'off',
			'import/order': 'off',
			'import/newline-after-import': [
				'error',
				{
					count: 1,
				},
			],
			'import/prefer-default-export': 'off',
			'import-max-dependencies': 'off',
			'import/no-unassigned-import': 'off',
			'import/no-named-default': 'off',
			'import/no-default-export': 'off',
			'import/no-named-export': 'off',
			'import/no-anonymous-default-export': 'off',
			'import/group-exports': 'off',
			// TODO: webpack
			'import/dynamic-import-chunkname': 'off',
		},
	}

	if (tier === 'strict' || tier === 'excessive') {
		/* ------------------- static analysis ------------------ */
		;(obj.rules['import/no-self-import'] = 'error'),
			(obj.rules['import/no-cycle'] = 'error'),
			(obj.rules['import/no-useless-path-segments'] = [
				'error',
				{
					noUselessIndex: false,
					commonjs: true,
				},
			])

		/* ------------------ helpful warnings ------------------ */
		obj.rules['import/no-mutable-exports'] = 'error'

		/* --------------------- style guide -------------------- */
		// TODO: move these up to 'cozy'
		;(obj.rules['import/first'] = 'error'),
			(obj.rules['import/exports-last'] = 2),
			(obj.rules['import/no-duplicates'] = 'error')
	}

	if (tier === 'excessive') {
		/* ------------------- static analysis ------------------ */
		obj.rules['import/no-unresolved'] = [
			'error',
			{
				commonjs: true,
				amd: false,
				caseSensitive: true,
			},
		]
		obj.rules['import/no-useless-path-segments'] = [
			'error',
			{
				noUselessIndex: true,
				commonjs: true,
			},
		]

		/* ------------------ helpful warnings ------------------ */
		obj.rules['import/no-named-as-default'] = 'error'
		obj.rules['import/no-deprecated'] = 'error'
		obj.settings['import/doctyle'] = ['jsdoc' /*'tomdoc'*/]
		obj.rules['import/no-extraneous-dependencies'] = [
			'error',
			{
				devDependencies: true,
				optionalDependencies: true,
				peerDependencies: true,
				bundledDependencies: true,
			},
		]
		// obj.rules['import/no-unused-modules'] = ['error', {
		// missingExports: true,
		// unusedExports: true,
		/*src: [
				path.dirname(readPkgUp.sync()!.path) || process.cwd() ] */
		// }]

		/* --------------------- style guide -------------------- */
		obj.rules['import/order'] = [
			'error',
			{
				groups: ['builtin', 'external', 'parent', 'sibling', 'index'],
			},
		]
	}

	return obj
}
