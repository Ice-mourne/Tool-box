import { InventoryItem } from './inventoryItem'
import { PlugSet } from './plugSet'
import { SocketType } from './socketType'
import { Stat } from './stat'

export interface InventoryItems {
   [key: string]: InventoryItem
}

export interface PlugSets {
   [key: string]: PlugSet
}

export interface SocketTypes {
   [key: string]: SocketType
}

export interface Stats {
   [key: string]: Stat
}

export interface Manifest {
   version: string
   inventoryItem?: InventoryItems
   plugSet?: PlugSets
   socketType?: SocketTypes
   stat?: Stats
}

export interface Bungie {
   Response: {
      version: string
      jsonWorldComponentContentPaths: {
         'en': { [key: string]: string }
         'fr': { [key: string]: string }
         'es': { [key: string]: string }
         'es-mx': { [key: string]: string }
         'de': { [key: string]: string }
         'it': { [key: string]: string }
         'ja': { [key: string]: string }
         'pt-br': { [key: string]: string }
         'ru': { [key: string]: string }
         'pl': { [key: string]: string }
         'ko': { [key: string]: string }
         'zh-cht': { [key: string]: string }
         'zh-chs': { [key: string]: string }
      }
   }
   ErrorCode: number
   ThrottleSeconds: number
   ErrorStatus: string
   Message: string
   MessageData: {}
}

export type Language = keyof Bungie['Response']['jsonWorldComponentContentPaths']
