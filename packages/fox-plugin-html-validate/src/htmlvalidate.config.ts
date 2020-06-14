import { IFoxConfig } from 'fox-types';

export default function (fox: IFoxConfig): Record<string, any> {
	return {
		extends: ['htmlvalidate:recommended'],

		rules: {
			'close-order': 'error',
			'void': ['warn', { style: 'omit' }],
		},
	};
}
