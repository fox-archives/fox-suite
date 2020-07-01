
/**
 * @description factory function to return a valid prettier config. it
 * will be merged with the default internal one
 * @param {import("fox-types/types").IFoxConfig} [fox] - `fox.config.js` configuration object
 * @return {Record<string, any>}
 */
export default function(fox) {
	return {
		semi: true
	}
}
