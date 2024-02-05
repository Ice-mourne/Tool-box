import { InventoryItem } from './inventoryItem.js'
import { InventoryItemLite } from './inventoryItemLite.js'
import { PlugSet } from './plugSet.js'
import { SocketType } from './socketType.js'
import { Stat } from './stat.js'

export type InventoryItems = {
   [key: string]: InventoryItem
}

export type InventoryItemsLite = {
   [key: string]: InventoryItemLite
}

export type PlugSets = {
   [key: string]: PlugSet
}

export type SocketTypes = {
   [key: string]: SocketType
}

export type Stats = {
   [key: string]: Stat
}

export type Manifest = {
   version: string
   inventoryItem?: InventoryItems
   inventoryItemLite?: InventoryItemsLite
   plugSet?: PlugSets
   socketType?: SocketTypes
   stat?: Stats
}

export type Bungie = {
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
