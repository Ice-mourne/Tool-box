import _ from 'lodash'

/**
 ** Removes null, undefined, NaN, empty (objects, arrays, maps and or sets) from object or array
 ** Empty (...) means if any of specified in brackets is empty
 * @param dirtyObject Object or Array to clean
 * @param allowMutations Are you allow to mutate original object
 * @returns Same object or array without null, undefined, NaN, empty (objects, arrays, maps and or sets)
 */
export function cleanObject<T>(dirtyObject: object | Array<T>, allowMutations = false): T {
   const obj = allowMutations ? _.cloneDeep(dirtyObject) : dirtyObject
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
         // Deleting properties from array makes them undefined this will remove undefined values from array
         if (Array.isArray(obj)) obj = _.pull(obj, undefined)
      }
      return obj
   }
   return remover(obj)
}

/**
 * @param str String with numbers separated by comma
 * @returns Array of numbers
 */
export function numStringToArr(str: string): number[] {
   return str.split(',').flatMap(num => {
      const number = Number(num)
      if (number) return number
      return []
   })
}

/**
 * @param array Array of numbers
 * @returns String with numbers separated by comma
 */
export function numArrToString(array: number[] | undefined): string {
   if (array === undefined) return ''
   return array.join(', ')
}

/**
 ** Instead of regular stringify this one doesn't add new lines to specified arrays
 ** Basically normal stringify would make
 ** [
 **   1,
 **   2,
 **   3
 ** ]
 ** This will make
 ** [1, 2, 3]
 */
 export function customJsonStringify(object: object, properties: string[], spaces = 1) {
   const string = JSON.stringify(object, undefined, spaces)
   const regex = new RegExp(`"${properties.join('|')}"\\s*:\\s*\\[([^]+?)\\]`, 'g')

   const matches = string.match(regex) // /"(stat|multiplier|weaponTypes)": \[[^]+?\]/g
   if (matches === null) return string

   const newString = matches.reduce((acc, match) => {
      acc = acc.replace(match, match.replaceAll('\n', '').replace(/  +/g, ' '))
      return acc
   }, string)

   return newString
}

// todo: add index DB
// todo: add fetch with automatic repeat on fail // call it persistentFetch