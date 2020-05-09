export const isString = val => typeof val === 'string'
export const isArray = val => Array.isArray(val)
export const isObject = val => typeof val === 'object' && !Array.isArray(val)
