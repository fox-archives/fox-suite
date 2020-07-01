import { setOpts, setTier } from './test.util'
import "jest-extended";

beforeEach(async () => {
  jest.resetModules();
  delete process.env.FOX_SUITE_FOX_OPTIONS;
});

describe('plugins work', () => {
	test.skip('', () => {

	})
})
