import path from 'path'
import fs from 'fs'
import readPkgUp from 'read-pkg-up'
import { IProject } from 'fox-types'

/**
 * @description get all necessary data from parent module
 */
export async function getProjectData(): Promise<IProject> {
  const {
    // @ts-ignore
    packageJson: packageJson,
    // @ts-ignore
    path: packageJsonPath } = await readPkgUp({
      cwd: process.cwd(),
      normalize: false
    })
  const location = path.dirname(packageJsonPath)
  const foxConfigPath = path.resolve(location, 'fox.config.mjs')

	let foxConfig
	try {
		await fs.promises.access(foxConfigPath, fs.constants.F_OK)
		foxConfig = (await import(foxConfigPath)).default
	} catch {
		foxConfig = {
			all: 'cozy'
		}
	}


  return {
    packageJson,
    packageJsonPath,
    foxConfig,
    foxConfigPath,
    location
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

const configMap = new Map([
  ['fox-plugin-package-json-lint', 'npmpackagejsonlint.config.js']
])

/**
 * @desc fetch the proper config file. if it doesn't exist,
 * and stdin is a tty, prompt user if want to create one.
 * if user doesn't, or not in tty, then skip and print
 * warning to console
 */

type configFileTypes = 'fox-plugin-package-json-lint'
export async function getAndCreateConfig(absProjectPath: string, configFileType: configFileTypes): Promise<object | undefined> {
  let configFile = configMap.get(configFileType)
  if (!configFile) throw new Error('unexpected connfiguration file')

  const configPath = path.join(absProjectPath, '.config', configFile)

  try {
    const { default: config } = await import(configPath)

    return config

  } catch (err) {
    if (err.code = "MODULE_NOT_FOUND") {
      await createDefaultConfig(absProjectPath, configFileType)
      // try again
      try {
        const { default: config } = await import(configPath)

        return config
      } catch (err) {
        console.log(`we tried to automatically create the config file ${configPath} at ${absProjectPath}, but failed. Terminating program with exit code 1`)
        console.error(err)
        process.exit(1)
      }
    }
  }
  return
}

async function createDefaultConfig(absProjectPath: string, configFileType: configFileTypes) {
  const configFile = configMap.get(configFileType)
  if (!configFile) throw new Error('error when getting config')
  const configFilePath = path.join(absProjectPath, '.config', configFile)

  await fs.promises.writeFile(configFilePath, `module.exports = {\n  "extends": "npm-package-json-lint-config-fox",
  "rules": {\n    'require-name': 'error'\n  }\n}`, {
    mode: 0o744
  })
}
