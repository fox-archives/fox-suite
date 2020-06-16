import { IFoxConfig } from 'fox-types'

const isProd = process.env.NODE_ENV === 'production'

export function prettierPlugin(
	fox: IFoxConfig,
	tier: string,
): Record<string, any> {
	const obj: Record<string, any> = {
		plugins: ['eslint-plugin-prettier'],
		extends: [
			"prettier",
			"prettier/@typescript-eslint",
			"prettier/babel",
			"prettier/flowtype",
			"prettier/react",
			"prettier/standard",
			"prettier/unicorn",
			"prettier/vue"
		],
		rules: {
			'prettier/prettier': 'off',
		},
	}

	if (isProd) {
		obj.rules['prettier/prettier'] = 'error'
	}

	return obj
}
