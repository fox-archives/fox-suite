import { IFoxConfig } from 'fox-types'

export function rootConfig(
	foxConfig: IFoxConfig,
	tier: string,
): Record<string, any> {
	const config: Record<string, any> = {
		parser: require.resolve('babel-eslint'),
		env: {},
		parserOptions: {
			ecmaVersion: 2020,
			sourceType: 'module',
			ecmaFeatures: {
				jsx: true,
				modules: true,
				implicitStrict: true,
				globalReturn: false,
			},
		},
		extends: [require.resolve('eslint-config-prettier')],
		rules: {},
	}

	// TODO
	if (foxConfig.env.includes('node' as never)) {
		config.env.node = true
	}

	return config
}
