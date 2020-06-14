const r = require.resolve.bind(null)

/** @type {import("fox-types").IPresetExportIndex} */
const preset = {
	plugins: [
		r('fox-plugin-eslint'),
		r('fox-plugin-markdownlint'),
		r('fox-plugin-prettier'),
		r('fox-plugin-stylelint'),
	],
}

export default preset
