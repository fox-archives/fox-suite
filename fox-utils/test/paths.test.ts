import path from 'path'
import * as foxPathUtils from '../src/paths'

/**
 * these have weird paths because toRelativePath resolves
 * relative to the current working directory (`/fox-utils`), but
 * the test file is in `/fox-utils/test/`
 */
// @ts-ignore
describe('toRelativePath()', () => {
  // @ts-ignore
  beforeEach(() => {
    // @ts-ignore
    const spy = jest.spyOn(process, 'cwd')
    spy.mockReturnValue(__dirname)
  })

  // @ts-ignore
  test('relative path two dirs up', () => {
    const absolute = path.resolve(__dirname, '../../file')
    const relativePath = foxPathUtils.toRelativePath(absolute)
// @ts-ignore
    expect(relativePath).toBe('../../file')
  })

  /**
   * toRelativePath uses path.relative internally and by defualt
   * it doesn't add a './' if the file is in the same directory
   * we test to ensure the './' gets prepended
   */
  // @ts-ignore
  test('relative path to current directory', () => {
    const absolute = path.resolve(__dirname, './file.json')
    const relativePath = foxPathUtils.toRelativePath(absolute)

// @ts-ignore
    expect(relativePath).toBe('./file.json')
  })
})
