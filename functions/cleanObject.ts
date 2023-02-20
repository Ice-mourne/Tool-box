import _ from 'lodash'

/**
 ** Removes null, undefined, NaN, empty (objects, arrays, maps and or sets) from object or array
 ** Empty (...) means if any of specified in brackets is empty
 * @param { object | Array<T> } dirtyObject Object or Array to clean
 * @param { boolean } allowMutations Can object be mutated default false
 * @returns { T } Same object or array without null, undefined, NaN, empty (objects, arrays, maps and or sets)
 */
export function cleanObject<T>(dirtyObject: T, allowMutations: boolean = false): T {
  const obj = allowMutations ? dirtyObject : _.cloneDeep(dirtyObject)
  const remover = (obj: any) => {
    for (const key in obj) {
      // Remove null, undefined, NaN from array
      if (Array.isArray(obj[key])) {
        obj[key] = _.pull(obj[key], undefined, null, NaN)
      }
      // remove null undefined
      if (_.isNil(obj[key])) delete obj[key]
      // Remove NaN values
      if (Number.isNaN(obj[key])) delete obj[key]
      // If values is not object continue
      if (!obj[key] || typeof obj[key] !== 'object') continue
      remover(obj[key])
      // Remove empty objects, arrays, maps and sets
      if (_.isEmpty(obj[key])) delete obj[key]
    }
    // Deleting properties from array makes them undefined this will remove undefined values from array
    if (Array.isArray(obj)) return _.pull(obj, undefined)
    return obj
  }
  return remover(obj)
}

// TODO: check if this is better

/**
 * Removes null, undefined, NaN, empty (objects, arrays, maps, and sets) from an object or array.
 * @param {Object|Array<T>} dirtyObject - Object or array to clean.
 * @param {boolean} [allowMutations=false] - Can the object be mutated? Default is false.
 * @returns {T} Same object or array without null, undefined, NaN, empty (objects, arrays, maps, and sets).
 */
function cleanObject_<T>(dirtyObject: T, allowMutations: boolean = false): T {
  const obj = allowMutations ? dirtyObject : _.cloneDeep(dirtyObject)

  const cleanValue = (value: unknown) => {
    if (_.isNil(value) || Number.isNaN(value)) {
      return false
    }
    return true
  }

  const cleanObject_ = (obj: any) => {
    return _.omitBy(obj, (value) => {
      if (_.isArray(value)) {
        return !value.every(cleanValue)
      } else if (_.isObject(value)) {
        return _.isEmpty(cleanObject(value))
      } else {
        return !cleanValue(value)
      }
    })
  }

  return cleanObject_(obj) as T
}
