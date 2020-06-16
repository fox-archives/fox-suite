import { IFoxConfig } from 'fox-types'

const isProd = process.env.NODE_ENV === 'production'

export function excessiveConfig(
	fox: IFoxConfig,
	tier: string,
): Record<string, any> {
	const obj: Record<string, any> = {
		rules: {
			/* --------------- limit language features -------------- */
			// declaration
			'declaration-block-no-redundant-longhand-properties': true,

			/* ------------------ stylistic issues ------------------ */
			// declaration block
			'declaration-block-single-line-max-declarations': 3,

			// selector
			'selector-max-attribute': 4,
			'selector-max-class': 4,
			'selector-max-combinators': 4,
			'selector-max-compound-selectors': 4,
			'selector-max-id': 4,
			'selector-max-pseudo-class': 4,
			'selector-max-specificity': 4,
			'selector-max-type': 4,
			'selector-max-universal': 2,
		},
	}

	if (isProd) {
		/* ------------------- possible errors ------------------ */
		// comment
		obj.rules['comment-no-empty'] = true
	}

	return obj
}
