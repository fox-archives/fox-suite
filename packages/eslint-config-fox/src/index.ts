import merge from 'lodash.mergewith'
import { rootConfig } from './root'
import { cozyConfig } from './rules/cozy.config'
import { strictConfig } from './rules/strict.config'
import { excessiveConfig } from './rules/excessive.config'
import { importPlugin } from './plugins/import'
import { simpleImportSortPlugin } from './plugins/simple-import-sort'
import { prettierPlugin } from './plugins/prettier'
import { customizer, getVars } from './util'

/**
 * Rule Resolution
 * configs of the lowest priority are added to the rootConfig. first
 * cozyConfig gets added. then, strictConfig overwrites cozyConfig. lastly,
 * excessiveConfig overwrites strictConfig (and by extension, whatever is
 * in cozyConfig)
 *
 * when editing, keep in mind it is harder to move a rule from a higher
 * priority to a lower priority (if we wish to edit)
 */
const [ foxConfig, tier ] = getVars()

let config = {}

config = merge(config, rootConfig(foxConfig, tier), customizer)

if (tier === 'off') {

} else if (tier === 'cozy') {
	config = merge(config, cozyConfig(foxConfig, tier), customizer)
} else if (tier === 'strict') {
	config = merge(config, cozyConfig(foxConfig, tier), customizer)
	config = merge(config, strictConfig(foxConfig, tier), customizer)
} else if (tier === 'excessive') {
	config = merge(config, cozyConfig(foxConfig, tier), customizer)
	config = merge(config, strictConfig(foxConfig, tier), customizer)
	config = merge(config, excessiveConfig(foxConfig, tier), customizer)
} else {
	throw new Error(`tier: '${tier}' not an expected value`)
}

config = merge(config, importPlugin(foxConfig, tier), customizer)
config = merge(config, simpleImportSortPlugin(foxConfig, tier), customizer)
config = merge(config, prettierPlugin(foxConfig, tier), customizer)

module.exports = config
