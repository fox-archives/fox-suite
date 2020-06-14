import eslint from 'eslint';
import 'jest-extended';

beforeEach(async () => {
	jest.resetModules();
	delete process.env.FOX_SUITE_FOX_OPTIONS;
});

const setOpts = (obj: Record<string, any>) =>
	(process.env.FOX_SUITE_FOX_OPTIONS = JSON.stringify(obj));

const setTier = (tier: string) => (process.env.FOX_SUITE_FOX_TIER = tier);

// jest won't execute matched javascript files ending in '.cjs'
test('config has basic properties', async () => {
	setOpts({ all: 'cozy', env: [] });
	setTier('cozy');

	const cfg: Record<string, any> = await import('../src');

	expect(cfg).toBeObject();
	expect(cfg.parserOptions).toBeObject();
	expect(cfg.env).toBeObject();
	expect(cfg.plugins).toBeArray();
	expect(cfg.extends).toBeArray();
	expect(cfg.rules).toBeObject();
});

test('eslint engine evaluates config file', () => {
	setOpts({ all: 'cozy', env: [] });
	setTier('cozy');

	const CLIEngine = eslint.CLIEngine;

	const cli = new CLIEngine({
		useEslintrc: false,
		configFile: require.resolve('../'),
	});

	const code = 'const foo = 1\n';

	expect(cli.executeOnText(code).errorCount).toBe(0);
});

describe('tiers', () => {
	test("'cozy' config", async () => {
		setOpts({ all: 'cozy', env: [] });
		setTier('cozy');

		const eslintConfig: Record<string, any> = await import('../src');

		expect(eslintConfig.rules['getter-return']).toBe('off');
	});

	test("'strict' config", async () => {
		setOpts({ all: 'strict', env: [] });
		setTier('strict');

		const eslintConfig: Record<string, any> = await import('../src');

		expect(eslintConfig.rules['getter-return']).toMatchObject([
			'error',
			{ allowImplicit: true },
		]);
	});

	test("'excessive' config", async () => {
		setOpts({ all: 'excessive', env: [] });
		setTier('excessive');

		const eslintConfig: Record<string, any> = await import('../src');

		expect(eslintConfig.rules['vars-on-top']).toBe('error');
	});
});
