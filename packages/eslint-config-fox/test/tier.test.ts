import { setOpts, setTier, defaultOpts } from './test.util'
import "jest-extended";

beforeEach(async () => {
  jest.resetModules();
  delete process.env.FOX_SUITE_FOX_OPTIONS;
});

describe('tiers are configured properly', () => {
	test("'cozy' config", async () => {
		setOpts(Object.assign(defaultOpts, { all: 'cozy' }))
		setTier('cozy')

		const eslintConfig: Record<string, any> = await import('../src')

		expect(eslintConfig.rules['getter-return']).toBe('off')
	})

	test("'strict' config", async () => {
		setOpts(Object.assign(defaultOpts, { all: 'strict' }))
		setTier('strict')

		const eslintConfig: Record<string, any> = require('../src')

		expect(eslintConfig.rules['getter-return']).toMatchObject([
			'error',
			{ allowImplicit: true },
		])
	})

	test("'excessive' config", async () => {
		setOpts(Object.assign(defaultOpts, { all: 'excessive' }))
		setTier('excessive')

		const eslintConfig: Record<string, any> = await import('../src')

		expect(eslintConfig.rules['vars-on-top']).toBe('error')
	})
})
