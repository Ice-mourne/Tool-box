export interface SocketType {
   displayProperties:               DisplayProperties
   insertAction:                    InsertAction
   plugWhitelist:                   PlugWhitelist[]
   socketCategoryHash:              number
   visibility:                      number
   alwaysRandomizeSockets:          boolean
   isPreviewEnabled:                boolean
   hideDuplicateReusablePlugs:      boolean
   overridesUiAppearance:           boolean
   avoidDuplicatesOnInitialization: boolean
   currencyScalars:                 CurrencyScalar[]
   hash:                            number
   index:                           number
   redacted:                        boolean
   blacklisted:                     boolean
}

export interface CurrencyScalar {
   currencyItemHash: number
   scalarValue:      number
}

export interface DisplayProperties {
   description: string
   name:        string
   hasIcon:     boolean
}

export interface InsertAction {
   actionExecuteSeconds: number
   actionSoundHash:      number
   isPositiveAction:     boolean
   actionType:           number
}

export interface PlugWhitelist {
   categoryHash:                        number
   categoryIdentifier:                  string
   reinitializationPossiblePlugHashes?: number[]
}
