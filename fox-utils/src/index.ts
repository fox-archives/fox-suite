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
    projectPackagejson,
    projectPackageJsonPath,
    projectFoxConfigPath,
    projectPath
  }
}

/**
 * prints text in successfull color
 */
export function printSuccess(text: string) {
  console.log(chalk.green(text))
}
