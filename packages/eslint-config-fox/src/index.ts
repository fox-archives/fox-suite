import merge from 'lodash.mergewith'
import type { IFoxConfig } from 'fox-types'
import { rootConfig } from './root'
import { cozyConfig } from './rules/cozy.config'
import { strictConfig } from './rules/strict.config'
import { excessiveConfig } from './rules/excessive.config'
import { importPlugin } from './plugins/import'
import { simpleImportSortPlugin } from './plugins/simple-import-sort'

const customizer = (destObj: Record<string, any>, srcObj: Record<string, any>): any => {
	// for arrays that are not rules, merge them
	// 'extends', 'plugins', etc.
	if (
		Array.isArray(destObj) && Array.isArray(srcObj) &&
		!destObj.includes('error') && !srcObj.includes('error') &&
		!destObj.includes('off') && !srcObj.includes('off')
	) {
    return destObj.concat(srcObj)
  }
}

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
const foxConfig: IFoxConfig = JSON.parse(process.env.FOX_SUITE_FOX_OPTIONS || '{}')
const tier: string = process.env.FOX_SUITE_PLUGIN_ESLINT_TIER || ''

let config = {}

config = merge(config, rootConfig(foxConfig, tier), customizer)

if (tier === 'cozy') {
	config = merge(config, cozyConfig(foxConfig, tier), customizer)
} else if (tier === 'strict') {
	config = merge(config, cozyConfig(foxConfig, tier), customizer)
	config = merge(config, strictConfig(foxConfig, tier), customizer)
} else if (tier === 'excessive') {
	config = merge(config, cozyConfig(foxConfig, tier), customizer)
	config = merge(config, strictConfig(foxConfig, tier), customizer)
	config = merge(config, excessiveConfig(foxConfig, tier), customizer)
} else {
	console.error(`tier: '${tier}' not an expected value`)
}

config = merge(config, importPlugin(foxConfig, tier), customizer)
config = merge(config, simpleImportSortPlugin(foxConfig, tier), customizer)

module.exports = config
