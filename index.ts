import { InventoryItem, SocketEntry } from './bungieTypes/inventoryItem.js'
import { InventoryItems, Manifest, PlugSets, SocketTypes, Stats } from './bungieTypes/manifest.js'

import { SimpleIndexedDB } from './classes/simpleIndexedDB.js'
import { TypedObject } from './classes/typedObject.js'

import { cleanObject } from './functions/cleanObject.js'
import { customJsonStringify } from './functions/customJsonStringify.js'
import { fetchBungieManifest } from './functions/fetchBungieManifest.js'
import { persistentFetch } from './functions/persistentFetch.js'

import { DeepReadonly } from './types/deepReadonly.js'

export { SimpleIndexedDB, TypedObject, cleanObject, customJsonStringify, fetchBungieManifest, persistentFetch }

export type { Manifest, InventoryItems, InventoryItem, PlugSets, SocketTypes, SocketEntry, Stats, DeepReadonly }

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
