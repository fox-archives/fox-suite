import { IFoxConfig } from "fox-types";

export default function(fox: IFoxConfig): Record<string, any> {
	return {
		// TODO: ensure preset
		'doctype-first': true,
		'doctype-html5': true,
		'head-script-disabled': true,
		'style-disabled': true,
		'title-require': true,

		// attributes
		'attr-lowercase': true,
		'attr-no-duplications': true,
		'attr-no-unecessary-whitespace': true,
		'attr-unsafe-chars': true,
		'attr-value-double-quotes': true,
		'attr-value-not-empty': true,
		'alt-require': true,

		// tags
		'tags-check': true,
		'tag-pair': true,
		'tag-self-close': true,
		'tagname-lowercase': true,
		'empty-tag-not-self-closed': true,
		'src-not-empty': true,
		'href-abs-or-rel': true,

		// id
		'id-class-ad-disabled': true,
		'id-class-value': true,
		'id-unique': true,

		// inline
		'inline-script-disabled': true,
		'inline-style-disabled': true,

		// formatting
		'space-tab-mixed-disabled': true,
		'spec-char-escape': true
	}
}
