import { IFoxConfig } from 'fox-types'

export function cozyConfig(fox: IFoxConfig): Record<string, any> {
	return {
		rules: {
			/* ------------------- possible errors ------------------ */
			// color
			"color-no-invalid-hex": true, // recommended

			// font-family
			"font-family-no-duplicate-names": true, // recommended
			"font-family-no-missing-generic-family-keyword": false,

			// function
			"function-calc-no-invalid": true, // recommended
			"function-calc-no-unspaced-operator": true, // recommended
			"function-linear-gradient-no-nonstandard-direction": true, // recommended

			// string
			"string-no-newline": true, // recommended

			// unit
			"unit-no-unknown": true, // recommended

			// property
			"property-no-unknown": true, // recommended

			// keyframe declaration
			"keyframe-declaration-no-important": true,

			// declaration block
			"declaration-block-no-duplicate-properties": [
				true,
				{
					ignore: ["consecutive-duplicates-with-different-values"],
				},
			], // recommended
			"declaration-block-no-shorthand-property-overrides": true, // recommended

			// block
			"block-no-empty": true,

			// selector
			"selector-pseudo-class-no-unknown": true, // recommended
			"selector-pseudo-element-no-unknown": true, // recommended
			"selector-type-no-unknown": true, // recommended

			// media feature
			"media-feature-name-no-unknown": true,

			// at-rule
			"at-rule-no-unknown": true, // recommended

			// comment
			"comment-no-empty": false,

			// general / sheet
			"no-descending-specificity": true, // recommended
			"no-duplicate-at-import-rules": true, // recommended
			"no-duplicate-selectors": false,
			"no-empty-source": false,
			"no-extra-semicolons": true, // recommended
			"no-invalid-double-slash-comments": false,

			/* --------------- limit language features -------------- */
			// alpha-value
			"alpha-value-notation": true,

			// hue
			"hue-degree-notation": true,

			// color
			"color-function-notation": "modern",
			"color-named": null,
			"color-no-hex": null,

			// length
			"length-zero-no-unit": true,

			// font weight
			"font-weight-notation": null,

			// function
			"function-blacklist": null,
			"function-url-no-scheme-relative": null,
			"function-url-scheme-blacklist": null,
			"function-url-scheme-whitelist": null,
			"function-whitelist": null,

			// keyframes
			"keyframes-name-pattern": null,

			// number
			"number-max-precision": null,

			// time
			"time-min-milliseconds": null,

			// unit
			"unit-blacklist": [],
			"unit-whitelist": [],

			// shorthand property
			"shorthand-property-no-redundant-values": true,

			// value
			"value-no-vendor-prefix": null,

			// custom property
			"custom-property-pattern": null,

			// property
			"property-blacklist": null,
			"property-no-vendor-prefix": null,
			"property-whitelist": null,

			// declaration
			"declaration-block-no-redundant-longhand-properties": false,
			"declaration-no-important": false,
			"declaration-property-unit-blacklist": null,
			"declaration-property-unit-whitelist": null,
			"declaration-property-value-blacklist": null,
			"declaration-property-value-whitelist": null,

			// declaration block
			"declaration-block-single-line-max-declarations": false,

			// selector
			"selector-attribute-operator-blacklist": null,
			"selector-attribute-operator-whitelist": null,
			"selector-class-pattern": null,
			"selector-combinator-blacklist": null,
			"selector-combinator-whitelist": null,
			"selector-id-pattern": null,
			"selector-max-attribute": null,
			"selector-max-class": null,
			"selector-max-combinators": null,
			"selector-max-compound-selectors": null,
			"selector-max-empty-lines": null,
			"selector-max-id": null,
			"selector-max-pseudo-class": null,
			"selector-max-specificity": null,
			"selector-max-type": null,
			"selector-max-universal": null,
			"selector-nested-pattern": null,
			"selector-no-qualifying-type": false,
			"selector-no-vendor-prefix": null,
			"selector-pseudo-class-blacklist": null,
			"selector-pseudo-class-whitelist": null,
			"selector-pseudo-element-blacklist": null,
			"selector-pseudo-element-colon-notation": 'double',
			"selector-pseudo-element-whitelist": null,

			// media feature
			"media-feature-name-blacklist": null,
			"media-feature-name-no-vendor-prefix": null,
			"media-feature-name-value-whitelist": null,
			"media-feature-name-whitelist": null,

			// custom media
			"custom-media-pattern": null,

			// at-rule
			"at-rule-blacklist": null,
			"at-rule-no-vendor-prefix": null,
			"at-rule-property-requirelist": null,
			"at-rule-whitelist": null,

			// comment
			"comment-word-blacklist": null,

			// general / sheet
			"max-nesting-depth": null,
			"no-unknown-animations": true,

			/* ------------------ stylistic issues ------------------ */
			// defer to prettier as much as possible
			// color
			"color-hex-case": "lower",

			// function
			"function-name-case": "lower",
			"function-url-quotes": "always",

			// number
			"number-leading-zero": "always",
			"number-no-trailing-zeros": "always",

			// unit
			"unit-case": "lower",

			// value
			"value-keyword-case": "lower",

			// property
			"property-case": "lower",

			// declaration block
			"declaration-block-trailing-semicolon": "always",

			// selector
			"selector-attribute-quotes": "always",
			"selector-pseudo-class-case": "lower",
			"selector-pseudo-element-case": "lower",
			"selector-type-case": "lower",

			// media feature
			"media-feature-name-case": "lower",

			// at-rule
			"at-rule-name-case": "lower",
		},
	}
};
