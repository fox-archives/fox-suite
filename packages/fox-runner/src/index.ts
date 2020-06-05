import path from 'path'
// import { rollup } from 'rollup'

// @ts-ignore
import { babel } from "@rollup/plugin-babel"
import babelPluginFoxRunner from 'babel-plugin-fox-runner'

const sample = path.join(__dirname, '../input.js')
const ff = path.join(__dirname, '../output.js')

export default {
	input: sample,
	output: {
		file: ff,
		format: 'cjs'
	},
	plugins: [
		babel({
			babelHelpers: 'bundled',
			plugins: [babelPluginFoxRunner]
		})
	]
}
