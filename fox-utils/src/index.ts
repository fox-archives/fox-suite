import path from 'path'
import readPkgUp from 'read-pkg-up'

/**
 * @description get all necessary data from parent module
 */
export async function getParentProjectData() {
  // @ts-ignore
  const { packageJson: projectPackagejson, path: projectPackageJsonPath } = await readPkgUp()
  const projectPath = path.dirname(projectPackageJsonPath)
  const projectFoxConfigPath = path.resolve(projectPath, '.config')

  return {
    projectPackagejson,
    projectPackageJsonPath,
    projectFoxConfigPath,
    projectPath
  }
}
