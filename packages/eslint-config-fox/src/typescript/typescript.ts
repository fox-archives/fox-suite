import { IFoxConfig } from 'fox-types'

const isProd = process.env.NODE_ENV === 'production'

export function typescriptConfig(
	fox: IFoxConfig,
	tier: string,
): Record<string, any> {
	const allExtensions = ['.ts', '.tsx', '.d.ts', '.mjs', '.js', '.jsx']

	const obj: Record<string, any> = {
		parser: '@typescript-eslint/parser',
		plugins: [
			'@typescript-eslint',
		],
		extends: [
			// we overwrite all of the @typescript-eslint ones below,
			// but this also contains rules to disable eslint rules
			'plugin:@typescript-eslint/recommended'
		],
		rules: {
			/* ------------------ typescript-eslint ----------------- */
			// https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin/src/configs
			'@typescript-eslint/adjacent-overload-signatures': 'error',
			'@typescript-eslint/ban-ts-comment': 'error',
			'@typescript-eslint/ban-types': 'error',
			'@typescript-eslint/explicit-module-boundary-types': 'warn',
			'no-array-constructor': 'off', // see below
			'@typescript-eslint/no-array-constructor': 'error',
			'no-empty-function': 'off',
			'@typescript-eslint/no-empty-function': 'off', // see below
			'@typescript-eslint/no-empty-interface': 'off', // see below
			'@typescript-eslint/no-explicit-any': 'off', // see below
			'@typescript-eslint/no-extra-non-null-assertion': 'error',
			'no-extra-semi': 'off',
			'@typescript-eslint/no-extra-semi': 'error',
			'@typescript-eslint/no-inferrable-types': 'error',
			'@typescript-eslint/no-misused-new': 'error',
			'@typescript-eslint/no-namespace': 'error',
			'@typescript-eslint/no-non-null-asserted-optional-chain': 'error',
			'@typescript-eslint/no-non-null-assertion': 'warn',
			'@typescript-eslint/no-this-alias': 'error',
			'no-unused-vars': 'off',
			'@typescript-eslint/no-unused-vars': 'off', // see below
			'@typescript-eslint/no-var-requires': 'off', // see below
			'@typescript-eslint/prefer-as-const': 'off', // see below
			'@typescript-eslint/prefer-namespace-keyword': 'error',
			'@typescript-eslint/triple-slash-reference': 'error',

			/* ----------------------- imports ---------------------- */
			// typescript handles this already
			'import/named': 'off',

			// 'import/extensions': [ 'error', allExtensions ],
			'import/external-module-folders': [
				'error',
				'node_modules',
				'node_modules/@types',
			],
			'import/parsers': {
				'@typescript-eslint/parser': ['.ts', '.tsx', '.d.ts']
			},
			'import/resolver': {
				node: {
					extensions: allExtensions,
				},
			}
		},
	}

	if (tier === 'strict' || tier === 'excessive') {
		obj.rules['@typescript-eslint/no-var-requires'] = 'error'
		obj.rules['@typescript-eslint/prefer-as-const'] = 'error'
		obj.rules['@typescript-eslint/no-explicit-any'] = 'warn'
		obj.rules['@typescript-eslint/no-unused-vars'] = 'error'

		if (isProd) {
			obj.rules['no-empty-function'] = 'error'
			obj.rules['@typescript-eslint/no-empty-function'] = 'off'
			obj.rules['@typescript-eslint/no-empty-interface'] = 'off'

		}
	}
	if (tier === 'excessive') {
		obj.rules['no-array-constructor'] = 'error',
		obj.rules['no-empty-function'] = 'error'
	}



	return obj
}
