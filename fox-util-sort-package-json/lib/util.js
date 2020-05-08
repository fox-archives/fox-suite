export function sortAlphabetical(arr) {
  return arr.sort(new Intl.Collator('en').compare)
}

export function sortObject(obj, sortFn) {
  const sortedKeys = sortFn(Object.keys(obj))

  const sortedObject = {}
  for (const sortedKey of sortedKeys) {
    sortedObject[sortedKey] = obj[sortedKey]
  }
  return sortedObject
}
