export const setOpts = (obj: Record<string, any>) =>
	(process.env.FOX_SUITE_FOX_OPTIONS = JSON.stringify(obj))

export const setTier = (tier: string) => (process.env.FOX_SUITE_PLUGIN_ESLINT_TIER = tier)

export const defaultOpts = {
	all: 'cozy',
	monorepo: false,
	env: [],
	plugins: {}
}
