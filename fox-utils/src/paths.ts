import path from 'path'

/**
 * @desc Resolves an absolute path relative to the current working
 * directory. prepends a './' if it doesn't already exist
 */
export function toRelativePath(absolutePath: string): string {

  let relativePath = path.relative(process.cwd(), absolutePath)

  if (relativePath.slice(0, 2) !== './' && relativePath.slice(0, 3) !== '../')
    relativePath = './' + relativePath
  return relativePath
}
