export const isObject = (val) => typeof val === 'object' && val !== null
export const isArray = (target) => Array.isArray(target)
const hasOwnProperty = Object.prototype.hasOwnProperty
export const isOwnProperty = (target, key) => hasOwnProperty.call(target, key)
export const isFunction = (val) => typeof val === 'function'