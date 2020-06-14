import merge from 'lodash.mergewith';
import { rootConfig } from './root';
import { cozyConfig } from './rules/cozy.config';
import { strictConfig } from './rules/strict.config';
import { excessiveConfig } from './rules/excessive.config';
import { IFoxConfig } from 'fox-types';

const customizer = (
	destObj: Record<string, any>,
	srcObj: Record<string, any>
): any => {
	// for arrays that are not rules, merge them
	// 'extends', 'plugins', etc.
	if (
		Array.isArray(destObj) &&
		Array.isArray(srcObj) &&
		!destObj.includes('error') &&
		!srcObj.includes('error') &&
		!destObj.includes('off') &&
		!srcObj.includes('off')
	) {
		return destObj.concat(srcObj);
	}
};

const foxConfig: IFoxConfig = JSON.parse(
	process.env.FOX_SUITE_FOX_OPTIONS || '{}'
);
const tier: string = process.env.FOX_SUITE_PLUGIN_STYLELINT_TIER || '';

let config = {};
config = merge(config, rootConfig(foxConfig, tier), customizer);

if (tier === 'off') {
} else if (tier === 'cozy') {
	config = merge(config, cozyConfig(foxConfig, tier), customizer);
} else if (tier === 'strict') {
	config = merge(config, cozyConfig(foxConfig, tier), customizer);
	config = merge(config, strictConfig(foxConfig, tier), customizer);
} else if (tier === 'excessive') {
	config = merge(config, cozyConfig(foxConfig, tier), customizer);
	config = merge(config, strictConfig(foxConfig, tier), customizer);
	config = merge(config, excessiveConfig(foxConfig, tier), customizer);
} else {
	console.error(`tier: '${tier}' not an expected value`);
}

// prettier is in index.ts

module.exports = config;
