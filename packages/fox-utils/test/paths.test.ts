import path from 'path'
import url from 'url'

/**
 * @description Resolves an absolute path relative to the current working
 * directory. prepends a './' if it doesn't already exist
 */
export function toRelativePath(absolutePath: string): string {

	let relativePath = path.relative(process.cwd(), absolutePath)

	if (relativePath.slice(0, 2) !== './' && relativePath.slice(0, 3) !== '../')
		relativePath = './' + relativePath
	return relativePath
}

export function __dirname(importMeta: ImportMeta): string {
	return path.dirname(url.fileURLToPath(importMeta.url));
}

/**
 * these have weird paths because toRelativePath resolves
 * relative to the current working directory (`/fox-utils`), but
 * the test file is in `/fox-utils/test/`
 */
describe('toRelativePath()', () => {
  beforeEach(() => {
    const spy = jest.spyOn(process, 'cwd')
    spy.mockReturnValue(__dirname)
  })

  test('relative path two dirs up', () => {
    const absolute = path.resolve(__dirname, '../../file')
    const relativePath = toRelativePath(absolute)

    expect(relativePath).toBe('../../file')
  })

  /**
   * toRelativePath uses path.relative internally and by defualt
   * it doesn't add a './' if the file is in the same directory
   * we test to ensure the './' gets prepended
   */
  test('relative path to current directory', () => {
    const absolute = path.resolve(__dirname, './file.json')
    const relativePath = toRelativePath(absolute)

    expect(relativePath).toBe('./file.json')
  })
})
