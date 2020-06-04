import assert from 'assert'
// import { fileURLToPath } from 'url'
import _ from 'lodash'

export const is = {
	string: (val: any): boolean =>
		typeof val === 'string',
	array: (val: any): boolean =>
		Array.isArray(val),
	object: (val: any): boolean =>
		typeof val === 'object' && !Array.isArray(val),
	function: (val: any): boolean =>
		typeof val === 'function'
}

/**
 * @description alphabetically sorts array
 * @param {array} arr - array to be sorted alphabetically
 * @return {array} array with sorted keys
 */
export function sortAlphabetical(arr: Array<string>) {
  return arr.sort(new Intl.Collator('en').compare)
}

/**
 * @description special function to sortContributors. since contributors
 * can be an array of strings or objects, this ensures that we treat it
 * properly each time. it skips formatting if array is heterogenous
 */
interface IContributors {
  name?: string,
  email?: string,
  url?: string
}
export function sortContributors(arr: Array<string | IContributors>) {
  if (arr.every(is.object)) {
    return _.sortBy(arr, 'name')

  }
  else if (arr.every(is.string)) {
    return sortAlphabetical(arr as Array<string>)
  }
  return arr
}

interface ISortObject {
  [key: string]: string | object
}
/**
 * @description meta sort function that converts object
 * to array for regular sort functions to consume
 * @param {object} obj - object to be sorted by keys
 * @param {function} sortFn - function that does sorting. it returns a sorted array
 * @return {object} object with sorted keys
 */
export function sortObject(obj: ISortObject, sortFn: Function) {
  const sortedKeys = sortFn(Object.keys(obj))

  const sortedObject: ISortObject = {}
  for (const sortedKey of sortedKeys) {
    sortedObject[sortedKey] = obj[sortedKey]
  }
  return sortedObject
}

interface ISurface {
  [key: string]: string | object
}

/**
 * @description processes each group
 */
export function processGroup(input: any, group: any) {
  const surface: ISurface = {}
  for (const key of group.keys) {
    // ensure key meets schema requirements
    assert(is.string(key.name), "keys must have a 'name' property of type string")

    // ensure the key actually exists in package.json. if not,
    // 'continue' (skip) to next element in loop
    if (!input.hasOwnProperty(key.name)) continue

    // do the reassigning. different behavior dependent if the key
    // value is a 'array', or 'object', or anything else
    const keyName = key.name
    const keyValue = input[keyName]
    if (!key.hasOwnProperty('sortMethod')) {
      surface[keyName] = keyValue
    }
    else if (is.array(keyValue)) {
      surface[keyName] = key.sortMethod(keyValue)
    }
    else if (is.object(keyValue)) {
      surface[keyName] = sortObject(keyValue, key.sortMethod)
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
export function ensureUnecognizedKeys(oldSurface: any, sortedSurface: any, sortingFunction?: Function) {
  // ensure parameters are expected
  assert(is.object(oldSurface))
  assert(is.object(sortedSurface))
  sortingFunction && assert(is.function(sortingFunction))

  let surfaceTemp: ISurface = {}
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
