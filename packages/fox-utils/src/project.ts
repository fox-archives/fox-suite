import path from 'path'
import fs from 'fs'
import readPkgUp from 'read-pkg-up'
import { IProject, IFoxConfig } from 'fox-types'
import mergeWith from 'lodash.mergewith'
import debug from './debug'
import { log } from './misc'

/**
 * @description get all necessary data from parent module
 */
export async function getProjectData(): Promise<IProject> {
	const pkgUpObj = await readPkgUp({
		cwd: process.cwd(),
		normalize: false,
	})
	if (!pkgUpObj) {
		log.error("we couldn't get the package.json of your project. exiting.")
		process.exit(1)
	}
	const { packageJson: packageJson, path: packageJsonPath } = pkgUpObj

	const projectLocation = path.dirname(packageJsonPath)
	let [ foxConfig, foxConfigPath ] = await getFoxConfig(projectLocation)

	// default foxConfig options
	const defaultFoxConfig: IFoxConfig  = {
		all: 'cozy',
		monorepo: false,
		env: [],
		plugins: {}
	}

	foxConfig = mergeFoxConfig(defaultFoxConfig, foxConfig)

	debug('defaultFoxConfig: %o', defaultFoxConfig)
	debug('foxConfig: %o', foxConfig)
	debug('foxConfigPath, %s', foxConfigPath)

	return {
		packageJson,
		packageJsonPath,
		foxConfig,
		foxConfigPath,
		location: projectLocation,
	}
}

function mergeFoxConfig(defaultConfig: IFoxConfig, newConfig: IFoxConfig): IFoxConfig {
	const customizer = (
		destObj: Record<string, any>,
		srcObj: Record<string, any>,
	): any => {
		// for arrays that are not rules, merge them
		// 'extends', 'plugins', etc.
		if (
			Array.isArray(destObj) &&
			Array.isArray(srcObj) &&
			!destObj.includes('error') &&
			!srcObj.includes('error') &&
			!destObj.includes('off') &&
			!srcObj.includes('off')
		) {
			return destObj.concat(srcObj)
		}
	}

	return mergeWith(defaultConfig, newConfig, customizer)
}

async function getFoxConfig(projectLocation: string): Promise<[IFoxConfig, string]> {
	const foxConfigFilenames = ['fox.config.mjs', 'fox.config.js', 'fox.config.cjs']

	let foxConfigPath: string | null = null
	let foxConfig: IFoxConfig | null = null
	for(const filename of foxConfigFilenames) {
		foxConfigPath = path.resolve(projectLocation, filename)

		try {
			await fs.promises.access(foxConfigPath, fs.constants.F_OK)
			foxConfig = (await import(foxConfigPath)).default
			break
		} catch (err) {
			if (err.code === 'ENOENT' && err.syscall === 'access') {
				continue
			}
			console.error(err)
			process.exit(1)
		}
	}

	if (!foxConfig || !foxConfigPath) {
		log.error("fox.config.[c|m]?js file missing or not valid. see details: https://github.com/eankeen/fox-suite#fox-suite");
		process.exit(1)
	}

	return [ foxConfig, foxConfigPath ]
}
