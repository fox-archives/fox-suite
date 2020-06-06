import { babel } from "@rollup/plugin-babel"
// import babelPluginFoxRunner from 'babel-plugin-fox-runner'

export default {
	input: '/home/edwin/docs/programming/repos/fox-css/.config/stylelint.config.js',
	output: {
		file: '/home/edwin/docs/programming/repos/fox-css/.config/build/stylelint.config.js',
		format: 'cjs'
	},
	plugins: [
		babel({
			babelHelpers: 'bundled',
			// plugins: [babelPluginFoxRunner]
			sourcemap: true
		})
	]
}
