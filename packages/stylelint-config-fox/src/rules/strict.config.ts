import { IFoxConfig } from 'fox-types';

const isProd = process.env.NODE_ENV === 'production';

export function strictConfig(
	fox: IFoxConfig,
	tier: string
): Record<string, any> {
	const obj: Record<string, any> = {
		rules: {
			/* ------------------- possible errors ------------------ */
			// font-family
			'font-family-no-missing-generic-family-keyword': false, // recommended

			// block
			// "block-no-empty" (see below)

			// general-sheet
			'no-duplicate-selectors': true,
			'no-invalid-double-slash-comments': true,

			/* --------------- limit language features -------------- */
			// number
			'number-max-precision': 4,

			// time
			'time-min-milliseconds': 10,

			// value
			'value-no-vendor-prefix': true,

			// property
			'property-no-vendor-prefix': true,

			// selector
			'selector-no-vendor-prefix': true,

			// media feature
			'media-feature-name-no-vendor-prefix': true,

			// at-rule
			'at-rule-no-vendor-prefix': true,

			// general / sheet
			'max-nesting-depth': 4,
		},
	};

	if (isProd) {
		/* ------------------- possible errors ------------------ */
		// block
		obj.rules['block-no-empty'] = true;

		// general-sheet
		obj.rules['no-empty-source'] = true;
	}

	return obj;
}
