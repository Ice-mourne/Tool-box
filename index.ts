import { Bungie, InventoryItems, Language, Manifest, PlugSets, SocketTypes, Stats } from './bungieInterfaces/manifest'

import _ from 'lodash'

export type { Manifest, InventoryItems, PlugSets, SocketTypes, Stats }

/**
 ** Removes null, undefined, NaN, empty (objects, arrays, maps and or sets) from object or array
 ** Empty (...) means if any of specified in brackets is empty
 * @param { object | Array<T> } dirtyObject Object or Array to clean
 * @param { boolean } allowMutations Can object be mutated default false
 * @returns { T } Same object or array without null, undefined, NaN, empty (objects, arrays, maps and or sets)
 */
export function cleanObject<T>(dirtyObject: T, allowMutations: boolean = false): T {
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
      }
      // Deleting properties from array makes them undefined this will remove undefined values from array
      if (Array.isArray(obj)) return _.pull(obj, undefined)
      return obj
   }
   return remover(obj)
}

/**
 * @param { string } str String with numbers separated by comma
 * @returns { number[] } Array of numbers
 */
export function numStringToArr(str: string): number[] {
   return str.split(',').flatMap((num) => {
      const number = Number(num)
      if (number) return number
      return []
   })
}

/**
 * @param { number[] } array Array of numbers
 * @returns { string } String with numbers separated by comma
 */
export function numArrToString(array: number[] | undefined): string {
   if (array === undefined) return ''
   return array.join(', ')
}

type StingilyProperties = 'stat' | 'multiplier' | 'weaponTypes' | 'classNames' | string
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
export function customJsonStringify(object: object, properties: StingilyProperties[], spaces = 1) {
   const string = JSON.stringify(object, undefined, spaces)
   const regex = new RegExp(`"(${properties.join('|')})"\\s*:\\s*\\[([^]+?)\\]`, 'g')

   const matches = string.match(regex)
   if (matches === null) return string

   const newString = matches.reduce((acc, match) => {
      acc = acc.replace(match, match.replaceAll('\n', '').replace(/  +/g, ' '))
      return acc
   }, string)

   return newString
}

/**
 * @param { RequestInfo | URL } url URL to fetch
 * @param { number } numberOfTries Number of tries to fetch
 * @param { RequestInit } data Data to send
 * @returns { Promise<any> } Fetched data in JSON format
 */
export async function persistentFetch(
   url: RequestInfo | URL,
   numberOfTries: number,
   data: RequestInit | undefined = undefined
): Promise<any> {
   try {
      const resp = await fetch(url)
      return resp.json()
   } catch (error) {
      if (numberOfTries === 0) return (error as Error).message
      return persistentFetch(url, numberOfTries - 1, data)
   }
}

/**
 * @param { string } name Name of the database
 * @param { string } key Key to store data under
 * @param payload Data to store
 * @returns Stored data
 */
export async function simpleIDB(name: string, key: string, payload?: any) {
   return await new Promise((resolve) => {
      const request = window.indexedDB.open(`${name}_db`)

      request.onerror = (e) => {
         console.error('IDB error')
         console.error(e)
      }

      request.onupgradeneeded = () => {
         const db = request.result
         db.createObjectStore(`${name}_store`)
      }

      if (payload) {
         request.onsuccess = () => {
            const db = request.result
            const transaction = db.transaction(`${name}_store`, 'readwrite')
            const store = transaction.objectStore(`${name}_store`)
            store.put(payload, key)
         }
      } else {
         request.onsuccess = () => {
            const db = request.result
            const transaction = db.transaction(`${name}_store`, 'readwrite')
            const store = transaction.objectStore(`${name}_store`)
            const data = store.get(key)

            data.onsuccess = () => {
               resolve(data.result)
            }
         }
      }
   })
}

type Locations = keyof Manifest

export async function fetchBungieManifest(locations: Locations[], language: Language = 'en') {
   const json: Bungie = await persistentFetch('https://www.bungie.net/Platform/Destiny2/Manifest/', 3)
   const manifest = json.Response.jsonWorldComponentContentPaths[language]
   const manifestVersion = json.Response.version

   let data: Manifest = {
      version: manifestVersion
   }

   for (let i = 0; i < locations.length; i++) {
      const location = locations[i]
      const fixedLocation = `Destiny${_.upperFirst(location)}Definition` as Locations
      data[location] = await persistentFetch(`https://www.bungie.net${manifest[fixedLocation]}`, 3)
   }

   return data
}
