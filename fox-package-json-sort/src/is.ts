export const isString = (val: any): boolean => typeof val === 'string'
export const isArray = (val: any): boolean => Array.isArray(val)
export const isObject = (val: any): boolean => typeof val === 'object' && !Array.isArray(val)
export const isFunction = (val: any): boolean => typeof val === 'function'
