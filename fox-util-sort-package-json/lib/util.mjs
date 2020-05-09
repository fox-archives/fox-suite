import assert from 'assert'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import _ from 'lodash'

import {
  isString,
  isObject,
  isArray
} from './is.mjs'

/**
 * @description alphabetically sorts array
 * @param {array} arr - array to be sorted alphabetically
 * @return {array} array with sorted keys
 */
export function sortAlphabetical(arr) {
  return arr.sort(new Intl.Collator('en').compare)
}

/**
 * @description special function to sortContributors. since contributors
 * can be an array of strings or objects, this ensures that we treat it
 * properly each time. it skips formatting if array is heterogenous
 */
export function sortContributors(arr) {
  if (arr.every(el => typeof el === 'object' && !Array.isArray(el))) {
    return _.sortBy(arr, 'name')

  }
  else if (arr.every(el => typeof el === 'string')) {
    return sortAlphabetical(arr)
  }
  return arr
}

/**
 * @description meta sort function that converts object
 * to array for regular sort functions to consume
 * @param {object} obj - object to be sorted by keys
 * @param {function} sortFn - function that does sorting. it returns a sorted array
 * @return {object} object with sorted keys
 */
export function sortObject(obj, sortFn) {
  const sortedKeys = sortFn(Object.keys(obj))

  const sortedObject = {}
  for (const sortedKey of sortedKeys) {
    sortedObject[sortedKey] = obj[sortedKey]
  }
  return sortedObject
}

/**
 * @description processes each group
 */
export function processGroup(input, group) {
  const surface = {}
  for (const key of group.keys) {
    // ensure key meets schema requirements
    assert(isString(key.name), "keys must have a 'name' property of type string")

    // ensure the key actually exists in package.json. if not,
    // 'continue' (skip) to next element in loop
    if (group.location === '' && !input.hasOwnProperty(key.name)) continue

    // do the reassigning. different behavior dependent if the key
    // value is a 'array', or 'object', or anything else
    const keyName = key.name
    const keyValue = input[keyName]
    if (!key.hasOwnProperty('sortMethod')) {
      surface[key.name] = input[key.name]
    }
    else if (isArray(keyValue)) {
      surface[key.name] = key.sortMethod(input[key.name])
    }
    else if (isObject(keyValue)) {
      surface[key.name] = sortObject(input[key.name], key.sortMethod)
    }
  }
  return surface
}

/**
 *  @description when converting from oldSurface to sortedSurface,
 *  sorting keys in oldSurface are not always moved over to sortedSurface.
 *  this function fixes that, adding (and sorting) keys that have not been copied
 *  over to the _top_ of sortedSurface
 *  @param {object} oldSurface - old surface that includes all keys
 *  @param {object} sortedSurface - new sorted surface that may not have all keys as oldSurface
 *  @param {function} [sortingFunction] - function to sort all unrecognized keys by. defualts to alphabetical
 *  @return {object} object with all keys intact
 */
export function ensureUnecognizedKeys(oldSurface, sortedSurface, sortingFunction) {
  // ensure parameters are expected
  assert(typeof oldSurface === 'object' && !Array.isArray(oldSurface))
  assert(typeof sortedSurface === 'object' && !Array.isArray(sortedSurface))
  sortingFunction && assert(typeof sortingFunction === 'function')

  let surfaceTemp = {}
  for (const entryName in oldSurface) {
    // add all unknown elements to 'finalOutput' first
    if(oldSurface.hasOwnProperty(entryName) && !sortedSurface.hasOwnProperty(entryName)) {
      surfaceTemp[entryName] = oldSurface[entryName]
    }
  }

  const sortedSurfaceTemp = sortObject(surfaceTemp, sortingFunction || sortAlphabetical)

  return {
    ...sortedSurfaceTemp,
    ...sortedSurface
  }
}


/**
 * @description given the location of this binary, this finds the package.json
 * folder of the parent project
 * @async returns function 'walkup' which is async
 * @return {string} absolute path of parent packageJson file
 * @private
 * @todo make more robust; this probably won't work for pnpm and yarn 2
 */
export function findParentPackageJson() {
  function parentDirOf(fileOrDir) {
    return path.join(fileOrDir, '..')
  }
  async function packageJsonExists(dir) {
    const dirents = await fs.promises.readdir(dir, { withFileTypes: true })
    return dirents.some(dirent => dirent.isFile() && dirent.name === 'package.json')
  }

  // currentLocation could be a file or dir
  async function walkUp(currentLocation) {
    if (await packageJsonExists(currentLocation)) {
      return path.join(currentLocation, 'package.json')
    }
    else {
      const newLocation = parentDirOf(currentLocation)
      return walkUp(newLocation)
    }
  }

  const currentFile = fileURLToPath(import.meta.url)
  const currentDir = parentDirOf(currentFile)
  return walkUp(currentDir)
}
