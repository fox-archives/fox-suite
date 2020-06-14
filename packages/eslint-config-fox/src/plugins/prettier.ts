import { IFoxConfig } from 'fox-types';

export function prettierPlugin(
	fox: IFoxConfig,
	tier: string
): Record<string, any> {
	const obj: Record<string, any> = {
		plugins: ['eslint-plugin-prettier'],
		rules: {
			'prettier/prettier': 'error',
		},
	};

	return obj;
}
