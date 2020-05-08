import assert from 'assert'

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
} from './groups.sort.js'

/**
 * terminology
 *
 * a 'group' is a collection of keys that we want to be
 * sorted alphebetically relative to each other. this library
 * only actually sorts groups relative to each other
 *
 * a 'surface' is a platform where sorting occurs. aka
 * a member of nested member of `package.json`
 *
 * @todo fix bug where if item in package.json is not in this list, it disappears
 */

/**
 * @description sorts an object that represents a package.json file
 * @param {object} input - object to sort
 * @return {object} output - the sorted object
 */
export function sort(input) {
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
      assert(typeof key.type === 'string', `key with name '${key.name}' must have a 'type' property of type string`)

      // ensure the key actually exists in package.json. if not,
      // 'continue' (skip) to next element in loop
      if (group.location === '' && !input.hasOwnProperty(key.name)) continue

      if (key.type === 'lone') {
        surface[key.name] = input[key.name]
      }
    }

    if(group.location === '') {
      output = {
        ...output,
        ...surface
      }
    }
  }

  // console.log(JSON.stringify(output, null, 2))

  return output
}

process.on('uncaughtException', (err) => console.error(err))
process.on('unhandledRejection', (err) => console.error(err))
