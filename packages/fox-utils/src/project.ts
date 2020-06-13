import path from 'path'
import fs from 'fs'
import readPkgUp from 'read-pkg-up'
import { IProject } from 'fox-types'
import * as c from 'colorette'

/**
 * @description get all necessary data from parent module
 */
export async function getProjectData(): Promise<IProject> {
  const obj = await readPkgUp({
      cwd: process.cwd(),
      normalize: false
		})
	if (!obj) {
		console.error(c.bold(c.red("we couldn't get the package.json of your project. exiting.")))
		process.exit(1)
	}
	const {
		packageJson: packageJson,
			path: packageJsonPath
	} = obj

	const location = path.dirname(packageJsonPath)
	const foxConfigPath = path.resolve(location, 'fox.config.js')

	let foxConfig
	try {
		await fs.promises.access(foxConfigPath, fs.constants.F_OK)
		foxConfig = (await import(foxConfigPath)).default
	} catch {
		// default foxConfig options
		const defaultFoxConfig = JSON.parse(await fs.promises.readFile(path.join(__dirname, '../src/default.json'), { encoding: 'utf8' }))
		foxConfig = defaultFoxConfig
	}

  return {
    packageJson,
    packageJsonPath,
    foxConfig,
    foxConfigPath,
    location
  }
}
