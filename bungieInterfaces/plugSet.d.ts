export interface PlugSet {
   reusablePlugItems: ReusablePlugItem[]
   isFakePlugSet: boolean
   hash: number
   index: number
   redacted: boolean
   blacklisted: boolean
   displayProperties?: DisplayProperties
}

export interface DisplayProperties {
   description: string
   name: string
   hasIcon: boolean
}

export interface ReusablePlugItem {
   weight: number
   alternateWeight: number
   currentlyCanRoll: boolean
   plugItemHash: number
   craftingRequirements?: CraftingRequirements
}

export interface CraftingRequirements {
   unlockRequirements: UnlockRequirement[]
   materialRequirementHashes: number[]
   requiredLevel?: number
}

export interface UnlockRequirement {
   failureDescription: string
}
