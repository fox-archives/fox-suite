import { setOpts, setTier } from './test.util'
import { defaultOpts } from './test.util'
import "jest-extended";

beforeEach(async () => {
  jest.resetModules();
  delete process.env.FOX_SUITE_FOX_OPTIONS;
});

describe('typescript works', () => {
	test('cozy works', async () => {
		setOpts(Object.assign(defaultOpts, { all: 'cozy' }))
		setTier('cozy')

		const eslintConfig: Record<string, any> = await import('../src/typescript')

		expect(eslintConfig.rules['@typescript-eslint/prefer-as-const']).toBe('off')
		expect(eslintConfig.rules['import/extensions']).toContain('.ts')
	})

	test('strict works', async () => {
		setOpts(Object.assign(defaultOpts, { all: 'strict' }))
		setTier('strict')

		const eslintConfig: Record<string, any> = await import('../src/typescript')

		expect(eslintConfig.rules['@typescript-eslint/prefer-as-const']).toBe('error')
	})
})
