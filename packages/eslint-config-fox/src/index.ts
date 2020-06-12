import merge from 'lodash.merge'
import type { IFoxConfig } from 'fox-types'
import { rootConfig } from './root'
import { cozyConfig } from './rules/cozy.config'
import { strictConfig } from './rules/strict.config'
import { excessiveConfig } from './rules/excessive.config'

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
const tier: string = process.env.FOX_SUITE_FOX_TIER || ''

let config = {}

config = merge(config, rootConfig(foxConfig, tier))

if (tier === 'cozy') {
	config = merge(config, cozyConfig(foxConfig, tier))
} else if (tier === 'strict') {
	config = merge(config, cozyConfig(foxConfig, tier))
	config = merge(config, strictConfig(foxConfig, tier))
} else if (tier === 'excessive') {
	config = merge(config, cozyConfig(foxConfig, tier))
	config = merge(config, strictConfig(foxConfig, tier))
	config = merge(config, excessiveConfig(foxConfig, tier))
} else {
	console.error(`tier: '${tier}' not an expected value`)
}

module.exports = config
