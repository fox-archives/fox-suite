import path from 'path'
import chalk from 'chalk'
import readPkgUp from 'read-pkg-up'

/**
 * @description get all necessary data from parent module
 */
export async function getParentProjectData() {
  const {
    // @ts-ignore
    packageJson: projectPackagejson,
    // @ts-ignore
    path: projectPackageJsonPath } = await readPkgUp({
      cwd: process.cwd(),
      normalize: false
    })
  const projectPath = path.dirname(projectPackageJsonPath)
  const projectFoxConfigPath = path.resolve(projectPath, '.config')

  return {
    projectPackageJson: projectPackagejson,
    // TODO: fix
    projectPackagejson,
    projectPackageJsonPath,
    projectFoxConfigPath,
    projectPath
  }
}

/**
 * @desc gets the content of a config file (in ./.config) if its json or js
 */
export async function getConfig(absolutePackageJsonPath: string, configName: string): Promise<any> {
  if (configName === 'npmpackagejsonlintrc.config.js') {
    const config = await import(path.join(absolutePackageJsonPath, './.config/npmpackagejsonlintrc.config.js'))
    return config
  }
}

/**
 * @desc Resolves an absolute path relative to the current working
 * directory. prepends a './' if it doesn't already exist
 */
export function absoluteToRelative(absolutePath: string): string {

  let relativePath = path.relative(process.cwd(), absolutePath)
  if (absolutePath.slice(0, 1) !== './')
    relativePath = './' + relativePath
  return relativePath
}

/**
 * @desc prints text in green color
 */
export function printSuccess(text: string): void {
  console.log(chalk.green(text))
}
