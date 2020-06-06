// this is a non-standard htmlhint configuration file
// (meaning only .htmlhintrc is usually valid)

/**
 * @param {import("../../../fox-transpiler/node_modules/fox-suite/node_modules/fox-types/types").IFoxConfig} [fox] - `fox.config.js` configuration object
 * @return {Record<string, any>}
 */
export default function(fox) {
	return {
		"extends": [
			"htmlvalidate:recommended"
		],

		"rules": {
			"close-order": "error",
    	"void": ["warn", { "style": "omit" }]
		}
	}

}
