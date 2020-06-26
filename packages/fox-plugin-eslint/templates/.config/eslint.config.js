
/**
 * @description factory function to return a valid eslint config. it
 * will be merged with the default internal one
 * @param {import("fox-types/types").IFoxConfig} [fox] - `fox.config.js` configuration object
 * @return {Record<string, any>}
 */
export default function(fox) {
	return {
		// your overrides
		rules: {

		}
	}
}
