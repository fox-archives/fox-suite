import { ESLint, CLIEngine } from 'eslint'
import { setOpts, setTier, defaultOpts } from './test.util'
import 'jest-extended'

beforeEach(async () => {
	jest.resetModules()
	delete process.env.FOX_SUITE_FOX_OPTIONS
})

// jest won't execute matched javascript files ending in '.cjs'
test('config has basic properties', async () => {
	setOpts(Object.assign(defaultOpts, { all: "cozy" }));
	setTier('cozy')

	const cfg: Record<string, any> = await import('../src')

	expect(cfg).toBeObject()
	expect(cfg.parserOptions).toBeObject()
	expect(cfg.env).toBeObject()
	expect(cfg.plugins).toBeArray()
	expect(cfg.extends).toBeArray()
	expect(cfg.rules).toBeObject()
})

	describe('engine parses all configs fine', () => {
		for(const config of ['off', 'cozy', 'strict', 'excessive']) {
			test(`${config} config`, async () => {
				setOpts(
					Object.assign(
						defaultOpts,
						{ all: config }
					)
				);
				setTier(config);

				const code = "\"use strict\";\n";

				const eslint = new ESLint({
					overrideConfig: require("../"),
					useEslintrc: false,
				});

				const results = await eslint.lintText(code)
				const formatter = await eslint.loadFormatter('stylish')
				const resultText = formatter.format(results)


				// deprecated api
				const cli = new CLIEngine({
					useEslintrc: false,
					configFile: require.resolve("../"),
				});

				const info = cli.executeOnText(code)
				expect(info.errorCount).toBe(0);
			})
		}

})

