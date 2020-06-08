import merge from 'lodash.merge'

import { cozyConfig } from './rules/cozy.config'
import { strictConfig } from './rules/strict.config'
import { excessiveConfig } from './rules/excessive.config'
import { IFoxConfig } from 'fox-types'

/**
 * we're combining the rules for eslint-config-fox here
 * because we want to import this as a sub-config to extend
 * (so these rules can be overriden by later configs like eslint-config-prettier)
 */
export function eslintConfigFoxBase(foxConfig: IFoxConfig, tier: string): Record<string, any> {
	let cfg = {}
	cfg = merge(cfg, cozyConfig)
	cfg = merge(cfg, strictConfig)
	cfg = merge(cfg, excessiveConfig)

	return cfg
}
