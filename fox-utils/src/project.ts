import path from 'path'
import readPkgUp from 'read-pkg-up'

/**
 * @description get all necessary data from parent module
 */
export async function getProjectData() {
  const {
    // @ts-ignore
    packageJson: projectPackageJson,
    // @ts-ignore
    path: projectPackageJsonPath } = await readPkgUp({
      cwd: process.cwd(),
      normalize: false
    })
  const projectPath = path.dirname(projectPackageJsonPath)
  const projectFoxConfigPath = path.resolve(projectPath, '.config')

  return {
    projectPackageJson,
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



