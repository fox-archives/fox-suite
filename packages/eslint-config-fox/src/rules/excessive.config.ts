import { IFoxConfig } from 'fox-types';

/**
 * Enable rules that could prevent
 * potentially misinterpreted code
 */
export function excessiveConfig(
	fox: IFoxConfig,
	tier: string
): Record<string, any> {
	const obj: Record<string, any> = {
		rules: {
			/* ------------------- possible errors ------------------ */
			// these are duplicated in cozy.config.ts isProd
			'getter-return': 'error',
			'no-unused-expressions': 'error',
			'no-unused-labels': 'error',
			'no-useless-backreference': 'error',

			/* ------------------- best practices ------------------- */
			'accessor-pairs': 'error', // see isProd
			'block-scoped-var': 'error',
			'complexity': ['error', { max: 15 }],
			'curly': 'error',
			'default-param-last': 'error',
			'grouped-accessor-pairs': 'error',
			'no-else-return': ['error', { allowElseIf: false }],
			'no-implicit-coercion': 'error',
			'no-multi-str': 'error',
			'consistent-return': 'error',
			'no-alert': 'error',
			'no-param-reassign': [
				'error',
				{
					props: true,
					ignorePropertyModificationsFor: [
						'ctx',
						'req',
						'request',
						'res',
						'response',
					],
				},
			],
			'no-magic-numbers': 'error',
			'no-return-await': 'error',
			'no-script-url': 'error',
			'no-sequences': 'error',
			'no-unmodified-loop-condition': 'error',
			'radix': ['error', 'always'],
			'vars-on-top': 'error',

			/* --------------------- strict mode -------------------- */

			/* ---------------------- variables --------------------- */
			'no-label-var': 'error',
			'no-shadow': 'error',
			'no-undef': 'error',
			'no-undef-init': 'error',
			'no-undefined': 'error',
			'no-unused-vars': 'error',
			'no-useless-concat': 'error',
			'no-var': 'error',
			'prefer-named-capture-group': 'error',

			/* -------------------- ecmascript 6 -------------------- */
			'no-duplicate-imports': 'error',
			'prefer-numeric-literals': 'error',
		},
	};

	return obj;
}
