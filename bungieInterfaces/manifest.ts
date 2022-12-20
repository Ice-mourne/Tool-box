import { InventoryItem } from "./inventoryItem";
import { PlugSet } from "./plugSet";
import { SocketType } from "./socketType";
import { Stat } from "./stat";

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
   version:         string
   inventoryItems?: InventoryItems
   plugSets?:       PlugSets
   socketTypes?:    SocketTypes
   stats?:          Stats
}