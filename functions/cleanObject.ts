import _ from 'lodash'

/**
 ** Removes null, undefined, NaN, empty (objects, arrays, maps and or sets) from object or array
 ** Empty (...) means if any of specified in brackets is empty
 * @param { object | Array<T> } dirtyObject Object or Array to clean
 * @param { boolean } allowMutations Can object be mutated default false
 * @returns { T } Same object or array without null, undefined, NaN, empty (objects, arrays, maps and or sets)
 */
export function cleanObject<T>(dirtyObject: T, allowMutations: boolean = false): T {
  const obj = allowMutations ? dirtyObject : structuredClone(dirtyObject)
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
