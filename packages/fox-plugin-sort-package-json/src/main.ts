import fs from 'fs';
import assert from 'assert';
import * as foxUtils from 'fox-utils';
import { is } from './util';

import { ensureUnecognizedKeys, processGroup } from './util';
import { groupRootCategories } from './groupCategories';

/**
 * terminology
 *
 * a 'group' is a collection of keys that we want to be
 * sorted alphebetically relative to each other. this library
 * only actually sorts groups relative to each other
 *
 * a 'surface' is a platform where sorting occurs. aka
 * an object we add members to. members can be root keys to
 * package.json or members of a nested object in package.json (ex. "eslint": {})
 * usually we create a surface, then add members, and lastly, sort the members
 * within that surface
 */

interface ISortPackageJsonFileAutoReturn {
	packageJsonPath: string;
}

/**
 * @description finds the closes parent package.json file and sorts it
 */
export async function sortPackageJsonFileAuto(): Promise<
	ISortPackageJsonFileAutoReturn
> {
	const { packageJsonPath } = await foxUtils.getProjectData();

	// const packageJsonFile = await findParentPackageJson()
	await sortPackageJsonFile(packageJsonPath);

	return {
		packageJsonPath,
	};
}

/**
 * @description sorts a particular package.json file
 * @param {string} packageJsonFile - package.json file to sort. must be an absolute path
 */
export async function sortPackageJsonFile(packageJsonFile: any) {
	if (!fs.existsSync(packageJsonFile)) {
		throw new Error(`packageJsonFile '${packageJsonFile}' does not exist`);
	}

	const packageJson = JSON.parse(
		await fs.promises.readFile(packageJsonFile, { encoding: 'utf8' })
	);
	const sortedPackageJson = sortPackageJson(packageJson);
	await fs.promises.writeFile(
		packageJsonFile,
		JSON.stringify(sortedPackageJson, null, 2)
	);
}

/**
 * @description sorts an object that represents a package.json file
 * @param {object} input - object to sort
 * @return {object} the sorted object
 */
export function sortPackageJson(input: any): any {
	let output = {};
	for (const groupName in groupRootCategories) {
		const group = groupRootCategories[groupName];

		assert(is.object(group), 'groups must be an object');
		assert(
			is.string(group.location),
			"groups must have a 'location' property of type stirng"
		);
		assert(
			is.array(group.keys),
			"groups must have a 'keys' property that's an array"
		);

		const surface = processGroup(input, group);

		output = {
			...output,
			...surface,
		};
	}

	return ensureUnecognizedKeys(input, output);
}

process.on('uncaughtException', (err) => console.error(err));
process.on('unhandledRejection', (err) => console.error(err));
