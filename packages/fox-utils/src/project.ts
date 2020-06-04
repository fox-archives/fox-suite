import path from 'path'
import fs from 'fs'
import readPkgUp from 'read-pkg-up'
import { IProject } from 'fox-types'
import * as c from 'colorette'

import { IFox } from 'fox-types'

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
