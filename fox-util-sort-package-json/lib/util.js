import assert from 'assert'

/**
 * @description alphabetically sorts array
 * @param {array} arr - array to be sorted alphabetically
 * @return {array} array with sorted keys
 */
export function sortAlphabetical(arr) {
  return arr.sort(new Intl.Collator('en').compare)
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
