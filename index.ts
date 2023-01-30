import _ from 'lodash'

import { InventoryItem, SocketEntry } from './bungieTypes/inventoryItem.js'
import { Bungie, InventoryItems, Language, Manifest, PlugSets, SocketTypes, Stats } from './bungieTypes/manifest.js'

export type { Manifest, InventoryItems, InventoryItem, PlugSets, SocketTypes, SocketEntry, Stats }

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

type StringifyProperties = 'stat' | 'multiplier' | 'weaponTypes' | 'classNames'
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
export function customJsonStringify(object: object, properties: StringifyProperties[] | string[], spaces = 1) {
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
 * @error { error } If error it will return object with error property
 */
export async function persistentFetch(
   url: RequestInfo | URL,
   numberOfTries: number,
   data: RequestInit | undefined = undefined
): Promise<any> {
   try {
      const resp = await fetch(url, data)
      return resp.json()
   } catch (error) {
      if (numberOfTries === 0) return { error }
      return persistentFetch(url, numberOfTries - 1, data)
   }
}

/**
 * @param { string } key Key to store data
 * @param { any } data Data to store
 * @returns { Promise<void> } Promise that resolves when data is stored
 * @error { error } If error it will return object with error property
 */
export class SimpleIndexedDB {
   private dbName: string
   private storeName: string

   constructor(dbName: string, storeName: string) {
      this.dbName = dbName
      this.storeName = storeName
   }

   async set(key: any, data: any) {
      const request = window.indexedDB.open(this.dbName)

      request.onupgradeneeded = () => {
         const db = request.result
         db.createObjectStore(this.storeName)
      }

      request.onsuccess = () => {
         const db = request.result
         const transaction = db.transaction([this.storeName], 'readwrite')
         const store = transaction.objectStore(this.storeName)
         store.put(data, key)
      }
   }

   async get(key: any) {
      return new Promise((resolve) => {
         const request = window.indexedDB.open(this.dbName)
         let data: any

         request.onupgradeneeded = () => {
            const db = request.result
            db.createObjectStore(this.storeName)
         }

         request.onsuccess = async () => {
            const db = request.result
            const transaction = db.transaction([this.storeName], 'readonly')
            const store = transaction.objectStore(this.storeName)
            data = store.get(key)
            data.onsuccess = () => {
               resolve(data.result)
            }
         }
      })
   }

   async delete() {
      const request = window.indexedDB.open(this.dbName)

      request.onsuccess = () => {
         const db = request.result
         db.deleteObjectStore(this.storeName)
      }
   }
}
type Locations = keyof Manifest

export async function fetchBungieManifest(
   locations: Locations[],
   language: Language = 'en',
   useIndexedDB: boolean = false
) {
   const json: Bungie = await persistentFetch('https://www.bungie.net/Platform/Destiny2/Manifest/', 3)
   const manifest = json.Response.jsonWorldComponentContentPaths[language]
   const manifestVersion = json.Response.version

   let bongoData = {} as { [key in Locations]: any }

   const fetchBongo = async (location: Locations) => {
      const fixedLocation = `Destiny${_.upperFirst(location)}Definition` as Locations
      return persistentFetch(`https://www.bungie.net${manifest[fixedLocation]}?corsFix`, 3)
   }

   if (useIndexedDB) {
      const db = new SimpleIndexedDB('bungie', 'manifest')
      const cachedVersion = await db.get('version')

      if (cachedVersion && cachedVersion !== manifestVersion) db.delete()

      locations.forEach(async (location) => {
         const dbResponse = await db.get(`${location}-${language}`)
         if (dbResponse) {
            bongoData[location] = dbResponse
            return
         }
         const response = fetchBongo(location)
         db.set(`${location}-${language}`, await response)
         bongoData[location] = response
      })
      db.set('version', manifestVersion)
      bongoData.version = manifestVersion
   } else {
      locations.forEach((location) => {
         const response = fetchBongo(location)
         bongoData[location] = response
      })
   }

   return Object.entries(bongoData).reduce(async (acc, [key, value]) => {
      acc[key] = await value
      return acc
   }, {} as any) as Manifest
}

type Entries<T> = {
   [K in keyof T]: [K, T[K]]
}[keyof T][]

export class TypedObject {
   static entries<T extends object>(obj: T) {
      return Object.entries(obj) as Entries<T>
   }
   static keys<T extends object>(obj: T) {
      return Object.keys(obj) as (keyof T)[]
   }
}
