import fs from 'fs'
import assert from 'assert'

import {
  sortObject,
  ensureUnecognizedKeys,
  findParentPackageJson
} from './util.mjs'
import {
  groupTopLevel,
  groupScriptsAndConfig,
  groupExternalPackageConfig,
  groupNpmPackageMeta,
  groupJsEntryPoints,
  groupMiscFile,
  groupEnginesOsCpu,
  groupVsCodeExtensionMeta,
  groupDependencyTypes
} from './groups.sort.mjs'

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


 /**
  * @description finds the closes parent package.json file and sorts it
  */
export async function sortPackageJsonFileAuto() {
  const packageJsonFile = await findParentPackageJson()
  await sortPackageJsonFile(packageJsonFile)
}


/**
 * @description sorts a particular package.json file
 * @param {string} packageJsonFile - package.json file to sort. must be an absolute path
 */
export async function sortPackageJsonFile(packageJsonFile) {
  if(!fs.existsSync(packageJsonFile)) {
    throw new Error(`packageJsonFile '${packageJsonFile}' does not exist`)
  }

  const packageJson = JSON.parse(await fs.promises.readFile(packageJsonFile))
  const sortedPackageJson = sortPackageJson(packageJson)
  await fs.promises.writeFile(packageJsonFile, JSON.stringify(sortedPackageJson, null, 2))
}


/**
 * @description sorts an object that represents a package.json file
 * @param {object} input - object to sort
 * @return {object} the sorted object
 * @todo add guards so that if package.json member type is not as expected, it skips sortMethod formatting
 */
export function sortPackageJson(input) {
  const groupRoot = {
    groupTopLevel,
    groupScriptsAndConfig,
    groupExternalPackageConfig,
    groupNpmPackageMeta,
    groupJsEntryPoints,
    groupMiscFile,
    groupEnginesOsCpu,
    groupVsCodeExtensionMeta,
    groupDependencyTypes
  }

  let output = {}
  for (const groupName in groupRoot) {
    const group = groupRoot[groupName]

    // ensure group meets schema requirements
    assert(typeof group === 'object' && !(group instanceof Array), "groups must be an object")
    assert(typeof group.location === 'string', "groups must have a 'location' property of type stirng")
    assert(Array.isArray(group.keys), "groups must have a 'keys' property that's an array")

    const surface = {}
    for (const key of group.keys) {
      // ensure key meets schema requirements
      assert(typeof key.name === 'string', "keys must have a 'name' property of type string")

      // ensure the key actually exists in package.json. if not,
      // 'continue' (skip) to next element in loop
      if (group.location === '' && !input.hasOwnProperty(key.name)) continue

      // if key does not have 'type' property, it's either some
      // primitive or something we do not wish to sort (ex. if it were
      // an object or array))
      if (!key.hasOwnProperty('type')) {
        surface[key.name] = input[key.name]
      }
      else if (key.type === 'array') {
        surface[key.name] = key.sortMethod(input[key.name])
      }
      else if (key.type === 'object') {
        surface[key.name] = sortObject(input[key.name], key.sortMethod)
      }
    }
    if(group.location === '') {
      output = {
        ...output,
        ...surface
      }
    }
  }

  const finalOutput = ensureUnecognizedKeys(input, output)

  return finalOutput
}

process.on('uncaughtException', (err) => console.error(err))
process.on('unhandledRejection', (err) => console.error(err))
