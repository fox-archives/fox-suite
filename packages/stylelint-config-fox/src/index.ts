import merge from 'lodash.merge'
import { cozyConfig } from './rules/cozy.config'
import { strictConfig } from './rules/strict.config'
import { excessiveConfig } from './rules/excessive.config'
import { IFoxConfig } from 'fox-types'


/**
 * @todo remove duplicate function (can't
 * import from `fox-utils` because `fox-types`
 * is an ECMAScript module and `stylelint-config-fox`
 * is emitted as a CommonJS module for
 * compatability with stylelint)
 */
function getFoxOptionsFromEnv(): IFoxConfig {
  let foxOptions = process.env.FOX_SUITE_FOX_OPTIONS
  foxOptions = foxOptions || "{ error: 'process.env.FOX_SUITE_FOX_OPTIONS is falsey' }"
  return JSON.parse(foxOptions)
}

const fox = getFoxOptionsFromEnv()

let stylelintConfigFox = {}
if (fox.plugin.stylelint === "off" || fox.all === "off") {

} else if (fox.plugin.stylelint === "cozy" || fox.all === "cozy") {
	stylelintConfigFox = merge(cozyConfig(fox))
} else if (fox.plugin.stylelint === "strict" || fox.all === "strict") {
	stylelintConfigFox = merge(cozyConfig(fox))
	stylelintConfigFox = merge(strictConfig(fox))
} else if (fox.plugin.stylelint === "excessive" || fox.all === "excessive") {
	stylelintConfigFox = merge(cozyConfig(fox))
	stylelintConfigFox = merge(strictConfig(fox))
	stylelintConfigFox = merge(excessiveConfig(fox))
}


module.exports = stylelintConfigFox
