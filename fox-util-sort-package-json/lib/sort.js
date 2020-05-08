import assert from 'assert'

import {
  sortAlphabetical,
  sortObject
} from './util.js'
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
 * an objects we add members to. members can be root keys to
 * package.json or members of a nested object in package.json (ex. "eslint": {})
 * usually we create a surface, then add members, and lastly, sort the members
 * within that surface
 */


/**
 * @description sorts an object that represents a package.json file
 * @param {object} input - object to sort
 * @return {object} output - the sorted object
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

  // 'output' object is now sorted. but, properties unknown to this
  // sorter are not in the 'output' object. we add them here
  let finalOutput = {}
  let surface = {}
  for (const entryName in input) {
    // add all unknown elements to 'finalOutput' first
    if(input.hasOwnProperty(entryName) && !output.hasOwnProperty(entryName)) {
      surface[entryName] = input[entryName]
    }
  }

  // now, alphebatically sort 'surface'

  surface = sortObject(surface, sortAlphabetical)

  finalOutput = {
    ...surface,
    ...output
  }

  return finalOutput
}

process.on('uncaughtException', (err) => console.error(err))
process.on('unhandledRejection', (err) => console.error(err))
