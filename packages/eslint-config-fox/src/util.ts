import type { IFoxConfig } from 'fox-types'

export const customizer = (
	destObj: Record<string, any>,
	srcObj: Record<string, any>,
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
		return destObj.concat(srcObj)
	}
}

export const getVars = (): [ IFoxConfig, string ] => {
	const foxConfig: IFoxConfig = JSON.parse(
		process.env.FOX_SUITE_FOX_OPTIONS || '{}',
	)
	const tier: string = process.env.FOX_SUITE_PLUGIN_ESLINT_TIER || ''

	return [ foxConfig, tier ]
}
