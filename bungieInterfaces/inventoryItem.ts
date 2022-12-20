export interface InventoryItem {
   displayProperties:                 DisplayProperties
   tooltipNotifications?:             TooltipNotification[]
   itemTypeDisplayName?:              string
   flavorText?:                       string
   uiItemDisplayStyle?:               string
   itemTypeAndTierDisplayName?:       string
   displaySource?:                    string
   action?:                           Action
   inventory:                         Inventory
   plug?:                             Plug
   acquireRewardSiteHash:             number
   acquireUnlockHash:                 number
   investmentStats?:                  InvestmentStat[]
   perks?:                            Perk[]
   allowActions:                      boolean
   doesPostmasterPullHaveSideEffects: boolean
   nonTransferrable:                  boolean
   itemCategoryHashes?:               number[]
   specialItemType:                   number
   itemType:                          number
   itemSubType:                       number
   classType:                         number
   breakerType:                       number
   equippable:                        boolean
   defaultDamageType:                 number
   isWrapper:                         boolean
   hash:                              number
   index:                             number
   redacted:                          boolean
   blacklisted:                       boolean
   backgroundColor?:                  BackgroundColor
   tooltipStyle?:                     string
   preview?:                          Preview
   screenshot?:                       string
   stats?:                            Stats
   equippingBlock?:                   EquippingBlock
   translationBlock?:                 TranslationBlock
   quality?:                          Quality
   sockets?:                          Sockets
   talentGrid?:                       TalentGrid
   summaryItemHash?:                  number
   traitIds?:                         string[]
   traitHashes?:                      number[]
   secondaryIcon?:                    string
   collectibleHash?:                  number
   iconWatermark?:                    string
   damageTypeHashes?:                 number[]
   damageTypes?:                      number[]
   defaultDamageTypeHash?:            number
   iconWatermarkShelved?:             string
   loreHash?:                         number
   gearset?:                          Gearset
   objectives?:                       Objectives
   crafting?:                         Crafting
   setData?:                          SetData
   value?:                            Value
   secondaryOverlay?:                 string
   secondarySpecial?:                 string
   metrics?:                          Metrics
   sack?:                             Sack
   summary?:                          Summary
   breakerTypeHash?:                  number
   seasonHash?:                       number
   animations?:                       any[]
   links?:                            any[]
}

export interface Action {
   verbName:                string
   verbDescription:         string
   isPositive:              boolean
   requiredCooldownSeconds: number
   requiredItems:           RequiredItem[]
   progressionRewards:      ProgressionReward[]
   actionTypeLabel?:        string
   rewardSheetHash:         number
   rewardItemHash:          number
   rewardSiteHash:          number
   requiredCooldownHash:    number
   deleteOnAction:          boolean
   consumeEntireStack:      boolean
   useOnAcquire:            boolean
}

export interface ProgressionReward {
   progressionMappingHash: number
   amount:                 number
   applyThrottles:         boolean
}

export interface RequiredItem {
   count:          number
   itemHash:       number
   deleteOnAction: boolean
}

export interface BackgroundColor {
   colorHash: number
   red:       number
   green:     number
   blue:      number
   alpha:     number
}

export interface Crafting {
   outputItemHash:           number
   requiredSocketTypeHashes: number[]
   failedRequirementStrings: string[]
   bonusPlugs:               BonusPlug[]
}

export interface BonusPlug {
   socketTypeHash: number
   plugItemHash:   number
}

export interface DisplayProperties {
   description:    string
   name:           string
   hasIcon:        boolean
   icon?:          string
   iconSequences?: IconSequence[]
   highResIcon?:   string
}

export interface IconSequence {
   frames: string[]
}

export interface EquippingBlock {
   uniqueLabelHash:       number
   equipmentSlotTypeHash: number
   attributes:            number
   equippingSoundHash:    number
   hornSoundHash:         number
   ammoType:              number
   displayStrings:        string[]
   uniqueLabel?:          string
}

export interface Gearset {
   trackingValueMax: number
   itemList:         number[]
}

export interface Inventory {
   maxStackSize:                             number
   bucketTypeHash:                           number
   recoveryBucketTypeHash:                   number
   tierTypeHash:                             number
   isInstanceItem:                           boolean
   nonTransferrableOriginal:                 boolean
   tierTypeName?:                            string
   tierType:                                 number
   expirationTooltip?:                       string
   expiredInActivityMessage?:                string
   expiredInOrbitMessage?:                   string
   suppressExpirationWhenObjectivesComplete: boolean
   stackUniqueLabel?:                        string
   recipeItemHash?:                          number
}

export interface InvestmentStat {
   statTypeHash:          number
   value:                 number
   isConditionallyActive: boolean
}

export interface Metrics {
   availableMetricCategoryNodeHashes: number[]
}

export interface Objectives {
   objectiveHashes:                  number[]
   displayActivityHashes:            number[]
   requireFullObjectiveCompletion:   boolean
   questlineItemHash:                number
   narrative:                        string
   objectiveVerbName:                string
   questTypeIdentifier:              string
   questTypeHash:                    number
   completionRewardSiteHash:         number
   nextQuestStepRewardSiteHash:      number
   timestampUnlockValueHash:         number
   isGlobalObjectiveItem:            boolean
   useOnObjectiveCompletion:         boolean
   inhibitCompletionUnlockValueHash: number
   perObjectiveDisplayProperties:    PerObjectiveDisplayProperty[]
   displayAsStatTracker:             boolean
}

export interface PerObjectiveDisplayProperty {
   displayOnItemPreviewScreen: boolean
   activityHash?:              number
}

export interface Perk {
   requirementDisplayString: string
   perkHash:                 number
   perkVisibility:           number
}

export interface Plug {
   insertionRules:                   Rule[]
   plugCategoryIdentifier:           string
   plugCategoryHash:                 number
   onActionRecreateSelf:             boolean
   actionRewardSiteHash:             number
   actionRewardItemOverrideHash:     number
   insertionMaterialRequirementHash: number
   previewItemOverrideHash:          number
   enabledMaterialRequirementHash:   number
   enabledRules:                     Rule[]
   uiPlugLabel:                      string
   plugStyle:                        number
   plugAvailability:                 number
   alternateUiPlugLabel:             string
   alternatePlugStyle:               number
   isDummyPlug:                      boolean
   applyStatsToSocketOwnerItem:      boolean
   energyCost?:                      EnergyCost
   energyCapacity?:                  EnergyCapacity
}

export interface Rule {
   failureMessage: string
}

export interface EnergyCapacity {
   capacityValue:  number
   energyTypeHash: number
   energyType:     number
}

export interface EnergyCost {
   energyCost:     number
   energyTypeHash: number
   energyType:     number
}

export interface Preview {
   screenStyle:            string
   previewVendorHash:      number
   previewActionString:    string
   derivedItemCategories?: DerivedItemCategory[]
   artifactHash?:          number
}

export interface DerivedItemCategory {
   categoryDescription: string
   items:               Item[]
   categoryIndex:       number
}

export interface Item {
   itemHash:        number
   vendorItemIndex: number
}

export interface Quality {
   itemLevels:                      any[]
   qualityLevel:                    number
   infusionCategoryName:            string
   infusionCategoryHash:            number
   infusionCategoryHashes:          number[]
   progressionLevelRequirementHash: number
   currentVersion:                  number
   versions:                        Version[]
   displayVersionWatermarkIcons?:   string[]
}

export interface Version {
   powerCapHash: number
}

export interface Sack {
   detailAction:                     string
   openAction:                       string
   seedUnlockValueHash:              number
   resolvedBitVectorUnlockValueHash: number
   resolvedItemCountUnlockValueHash: number
   selectItemCount:                  number
   rollStateUnlockValueHash:         number
   rewardItemListHash:               number
   openOnAcquire:                    boolean
   vendorSackType?:                  string
}

export interface SetData {
   itemList:                 ItemList[]
   trackingUnlockValueHash:  number
   abandonmentUnlockHash:    number
   requireOrderedSetItemAdd: boolean
   setIsFeatured:            boolean
   setType:                  string
   questLineName:            string
   questLineDescription:     string
   questStepSummary:         string
}

export interface ItemList {
   trackingValue: number
   itemHash:      number
}

export interface Sockets {
   detail:           string
   socketEntries:    SocketEntry[]
   intrinsicSockets: IntrinsicSocket[]
   socketCategories: SocketCategory[]
}

export interface IntrinsicSocket {
   plugItemHash:   number
   socketTypeHash: number
   defaultVisible: boolean
}

export interface SocketCategory {
   socketCategoryHash: number
   socketIndexes:      number[]
}

export interface SocketEntry {
   socketTypeHash:                        number
   singleInitialItemHash:                 number
   reusablePlugItems:                     ReusablePlugItem[]
   preventInitializationOnVendorPurchase: boolean
   preventInitializationWhenVersioning:   boolean
   hidePerksInItemTooltip:                boolean
   plugSources:                           number
   reusablePlugSetHash?:                  number
   overridesUiAppearance:                 boolean
   defaultVisible:                        boolean
   randomizedPlugSetHash?:                number
}

export interface ReusablePlugItem {
   plugItemHash: number
}

export interface Stats {
   disablePrimaryStatDisplay: boolean
   statGroupHash?:            number
   stats:                     { [key: string]: Stat }
   hasDisplayableStats:       boolean
   primaryBaseStatHash:       number
}

export interface Stat {
   statHash:        number
   value:           number
   minimum:         number
   maximum:         number
   displayMaximum?: number
}

export interface Summary {
   sortPriority: number
}

export interface TalentGrid {
   talentGridHash:   number
   itemDetailString: string
   hudDamageType:    number
   buildName?:       string
   hudIcon?:         string
}

export interface TooltipNotification {
   displayString: string
   displayStyle:  string
}

export interface TranslationBlock {
   weaponPatternHash: number
   defaultDyes:       Dye[]
   lockedDyes:        Dye[]
   customDyes:        Dye[]
   arrangements:      Arrangement[]
   hasGeometry:       boolean
}

export interface Arrangement {
   classHash:          number
   artArrangementHash: number
}

export interface Dye {
   channelHash: number
   dyeHash:     number
}

export interface Value {
   itemValue:        ItemValue[]
   valueDescription: string
}

export interface ItemValue {
   itemHash:                 number
   quantity:                 number
   hasConditionalVisibility: boolean
}
