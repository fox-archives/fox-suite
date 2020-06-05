// this implicitly extends `stylelint-config-fox`

/**
 * @param {import("fox-suite/node_modules/fox-types/types").IFoxConfig} [fox] - `fox.config.js` configuration object
 * @return {Record<string, any>}
 */
export default function (fox) {
	let a = fox.all
	console.log(fox.monorepo)
	console.log(a)
	return {
		rules: {}
	}
}
