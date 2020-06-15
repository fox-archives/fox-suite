/**
 * @param {import("fox-types/types").IFoxConfig} [fox] - `fox.config.js` configuration object
 * @return {Record<string, any>}
 */
export default function (fox) {
	return {
		default: false,
		"heading-increment": "atx",
		"ul-style": {
			style: "asterisk",
		},
		"list-indent": true,
		"ul-start-left": true,
		"ul-indent": {
			indent: 4,
		},
		"no-trailing-spaces": true,
		"no-hard-tabs": true,
		"no-reversed-links": true,
		"no-multiple-blanks": true,
		"no-missing-space-atx": true,
		"no-multiple-space-atx": true,
		"blanks-around-headings": true,
		"heading-start-left": true,
		"no-trailing-punctuation": {
			punctuation: ".,;:!",
		},
		"no-multiple-space-blockquote": true,
		"no-blanks-blockquote": true,
		"ol-prefix": {
			style: "ordered",
		},
		"list-marker-space": true,
		"blanks-around-fences": true,
		"blanks-around-lists": true,
		"no-bare-urls": true,
		"hr-style": "---",
		"no-space-in-emphasis": true,
		"no-space-in-links": true,
		"fenced-code-language": true,
	};
}
