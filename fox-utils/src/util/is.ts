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
