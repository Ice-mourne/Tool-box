export interface Stat {
   displayProperties: DisplayProperties
   aggregationType:   number
   hasComputedBlock:  boolean
   statCategory:      number
   interpolate:       boolean
   hash:              number
   index:             number
   redacted:          boolean
   blacklisted:       boolean
}

export interface DisplayProperties {
   description:    string
   name:           string
   icon?:          string
   iconSequences?: IconSequence[]
   hasIcon:        boolean
}

export interface IconSequence {
   frames: string[]
}
