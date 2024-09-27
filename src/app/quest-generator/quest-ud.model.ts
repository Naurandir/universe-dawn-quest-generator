export interface IQuest {
  _id: string
  conditions: TQuestCondition[]
  createdAt: Date
  name: ILocaleStringMap
  notification: IQuestNotificationAllLang
  prepareNpcs: IQuestPrepareNpcs[]
  startStepId: string
  steps: IQuestSteps
}

export interface ICoordinates {
	x: number
	y: number
	z: number
}

export interface IQuestPrepareNpcs {
  planet? : {
      coordinates: ICoordinates
      planetName: string
  }
  race: ERace
  rulerName: string
}

export type TQuestCondition = IQuestConditionPoints
  | IQuestConditionJob
  | IQuestConditionModuleResearched
  | IQuestConditionChassisResearched
  | IQuestConditionChassisBuilt
  | IQuestConditionBuilding

export interface IQuestConditionPoints {
  type: EQuestCondition.points
  value: number
}

export interface IQuestConditionModuleResearched {
  type: EQuestCondition.moduleResearched
  value: EModuleId
}

export interface IQuestConditionChassisResearched {
  type: EQuestCondition.chassisResearched
  value: EChassisId
}

export interface IQuestConditionChassisBuilt {
  type: EQuestCondition.chassisBuilt
  value: EChassisId
}

export interface IQuestConditionBuilding {
  amount: number
  type: EQuestCondition.building
  value: EBuildingType
}

export interface IQuestConditionJob {
  type: EQuestCondition.job
  value: EAllowedJobs
}
export interface IQuestSteps {
  [key: string]: IQuestStep
}
export interface IQuestStep {
  id: string
  nextPossibleSteps: string[]
  notification: IQuestNotificationAllLang
  rewards?: TReturnReward[]
  task: TQuestTask
}

export interface IQuestNotificationAllLang {
  de: IQuestNotification
  en?: IQuestNotification
}

export interface IQuestNotification {
  customText: string
  referralId?: string
  variables: Record<string, unknown>
}

export interface IQuestTaskDialogue {
  coordinates: ICoordinates
  correctDialogueWord: ILocaleStringMap
	dialogues: ILocalizedData<{[key: string]: string}>
  type: ETaskType.dialogue
}

export interface IQuestTaskTransactCredits {
  amount: number
  rulerName: string
  type: ETaskType.transactCredits
}

export type TQuestTask = IQuestTaskDialogue
  | IQuestTaskTransactCredits

  export enum EQuestCondition {
  building = "building",
  chassisBuilt = "chassisBuilt",
  chassisResearched = "chassisResearched",
  job = "job",
  moduleResearched = "moduleResearched",
  points = "points"
}

export enum ETaskType {
  dialogue = "dialogue",
  transactCredits = "transactCredits"
}

export enum EAllowedJobs {
  freelancer = "freelancer",
  trader = "trader",
  warlord = "warlord"
}

export enum ERace {
  jamozoid = "jamozoid",
  magumer = "magumer",
  mensch = "mensch",
  morricaner = "morricaner",
  mosoraner = "mosoraner",
  ozoid = "ozoid",
  plentrop = "plentrop",
  wegoner = "wegoner",
  zuup = "zuup"
}

export enum EModuleId {
  WINCOM_Laserkanone = 1,
  Ingram_Laserturm_Typ_F = 2,
  Ionenkanone_Blast_I = 3,
  Fist_Laserkanone_Typ_II = 4,
  Fist_Laserkanone_Typ_IV = 5,
  Ionenkanone_Blast_II = 6,
  Ionenkanone_Blast_III = 7,
  Raketenwerfer_REVENGE_I = 8,
  Ingram_Laserturm_Typ_M = 9,
  Flak_Batterie_FB_02 = 10,
  Mass_Canon_MC1 = 11,
  Mass_Canon_MC2 = 12,
  HE_Laser_HEL_P1 = 13,
  Ladebucht_M_Militär_Version = 14,
  HE_Laser_HEL_A01 = 15,
  HE_Laser_HEL_A02 = 16,
  HE_Laser_DUAL_HEL_A01 = 17,
  HE_Laser_DUAL_HEL_A02 = 18,
  HE_Laser_HYDRA_M = 19,
  HE_Laser_HYDRA_S = 20,
  Defense_Cannon_X_I_alpha = 21,
  DMC_DMXC_MK2 = 22,
  Fist_Laserkanone_Typ_VII = 23,
  Eraser_II = 24,
  HE_Laser_HYDRA_Z = 25,
  WINCOM_II_Laserkanone = 26,
  Raketenwerfer_Revenge_EVO_2 = 27,
  GMT1_Verbrenner = 28,
  GMT2_Verbrenner = 29,
  Multimax_Brenner_Z_Edition = 30,
  Corebooster_I = 31,
  GMT3_Verbrenner = 32,
  Mega_Corebooster_Deluxe = 33,
  Mega_Corebooster_Deluxe_M = 34,
  Corebooster_Deluxe_M = 35,
  Fusionengine_SSE_XL = 36,
  Ladebucht_S = 37,
  Ladebucht_M = 38,
  Ladebucht_X = 39,
  Ladebucht_XX = 40,
  Ladebucht_TripleX = 41,
  Gigantor_Ladebucht = 42,
  Ladebucht_S_Militär_Version = 43,
  Spionageantenne = 44,
  Richtfunkantenne_ECHO_I = 45,
  Richtfunkantenne_ECHO_II = 46,
  Richtfunkantenne_ECHO_III = 47,
  Kopfgeldantenne_Argos = 48,
  Kopfgeldantenne_Argos_II = 49,
  Kopfgeldantenne_Argos_III = 50,
  Kopfgeldantenne_Argos_IV = 51,
  Imoto_Titanpanzerung = 52,
  Arama_Titan_Silizium_Panzerung = 53,
  Panzerung_NPZ1 = 54,
  Titanmolekülpanzerung = 55,
  Titanpanzerung = 56,
  Arama_Titan_Siliziummolekül_Panzerung = 57,
  Dual_Arama_Titan_Silizium_Panz = 58,
  Boostermischung_S = 59,
  Boostermischung_M = 60,
  Boostermischung_L = 61,
  Pulsgenerator_PG9 = 62,
  Pulsgenerator_PG9_MK_II = 63,
  IPH = 64,
  Fusion_Engine_Mk_I = 65,
  Habitat_1 = 66,
  Habitat_2 = 67,
  Erweiterungskapsel_EK_I = 68,
  Erweiterungskapsel_EK_II = 69,
  PLM_Standard_Bomb = 70,
  Light_Shield_Reflect_Pro = 71,
  Heavy_Shield_Reflect_Pro = 72,
  Light_Battery_Shield = 73,
  Richtfunkantenne_ECHO_IVa = 74,
  Richtfunkantenne_ECHO_IVb = 75,
  Richtfunkantenne_ECHO_IVc = 76,
  Multimax_Brenner_M_Edition = 77,
  Flux_II = 78,
  Ressschlund = 79,
  Heavy_Battery_Shield = 80,
  Panzerung_NPZ2 = 81,
  Titan_Verbundpanzerung = 82,
  Deflektorschild_Sub1 = 83,
  DMC_DMXC_MK4 = 84,
  Eraser_IV = 85,
  Flak_GFS_Dragonfly = 86,
  Siliziumpanzerung = 87,
  Vertigo_Launcher = 88,
  Gravity_Rifle_G1 = 89,
  Gravity_Rifle_G2 = 90,
  Meteor_Gatling_1 = 91,
  Meteor_Gatling_2 = 92,
  Vertigo_M = 93,
  Pulsgenerator_PG5 = 94,
  Railgun_X1 = 95,
  Railgun_X2 = 96,
  Railgun_X3 = 97,
  Railgun_X4 = 98,
  GMT1_LIGHT = 99,
  Einmal_Einbauteil = 100,
  Harvester_Unit = 101,
  Xenon_Ion_Engine = 102,
  Redeemer = 103,
  Gigantor_Light = 104,
  Richtfunkantenne_ECHO_V = 105,
  Wegabräu_Werbetafel = 106,
  Test_20_Aw = 107,
  Test500HP = 108,
  Test_1000_VW = 109,
  Test10_Man = 110,
  Hightech_Kommandostuhl = 111,
  Abrissbirne = 112
}

export enum EBuildingType {
	academy = "academy",
	bunker = "bunker",
	comm = "comm",
	def = "def",
	dock = "dock",
	gov = "gov",
	hq = "hq",
	shipyard = "shipyard",
	tech = "tech"
}

export interface IReturnReward {
  createdAt?: Date
  occasion?: string
  rewardType: EReturnReward
}

export interface IReturnRewardGiveResources extends IReturnReward{
  cost: ICost
  rewardType: EReturnReward.giveResources
}

export interface IReturnRewardGiveLicense extends IReturnReward {
  componentType: EComponentType
  licenseId: string
  licenses : number
  rewardType: EReturnReward.giveLicense
}

export type TReturnReward = IReturnRewardGiveLicense
  |IReturnRewardGiveResources

export enum EChassisId {
    Probe_XZ1 = 1,
    MX_Handelsschiff = 2,
    Intruder = 3,
    Transporter_Class_I = 4,
    SM_Fighter = 5,
    LR_Fighter = 6,
    Fight_Corvet = 7,
    Colonist_X = 8,
    Behemoth = 9,
    Transporter_Class_II = 10,
    Fight_Corvet_XL = 11,
    Carrier_Bullfrog = 12,
    Supportship_Marauder_F = 13,
    Supportship_Marauder_Z = 14,
    x_303_su = 15,
    Command_Ship = 16,
    Prototype = 17,
    Beast_of_Prey = 18,
    Raumstation_X1 = 19,
    SM_Scout = 20,
    Carrier_Prestige = 21,
    Nemesis_Cruiser = 22,
    Probe_XZ2 = 23,
    Carrier_Kaiman = 24,
    x_800_ha = 25,
    Battlestar_X3 = 26,
    Eagle_Patrol_Ship = 27,
    Turtle_LS_Carrier = 28,
    Predator_Schlachtschiff = 29,
    Harvester_80_S = 30,
    Harvester_120_M = 31,
    Harvester_200_L = 32,
    Supportstation_X0 = 33,
    SIPE_Punisher = 34,
    Bugjäger = 35,
    Ikarus_FS_V = 36,
    Questjäger = 37,
    Command_Ship_MK_II = 38,
    Prism_Carrier = 39,
    Ikarus_MK_2 = 40,
    Weihnachtsschlitten = 41,
  }

  export enum EComponentType {
    chassis = "chassis",
    ep = "ep",
    module = "module",
    turret = "turret"
  }

  export enum EReturnReward {
    giveBuildingLevel = "giveBuildingLevel",
    giveLicense = "giveLicense",
    giveNoobProtection = "giveNoobProtection",
    giveRandomEvent = "giveRandomEvent",
    giveResources = "giveResources",
    giveShip = "giveShip",
    giveTitle = "giveTitle",
    noReward = "noReward",
    routingPad = "routingPad",
    rulerEp = "rulerEp"
  }

export interface ICost {
    currencies: TCurrencies
    resources : TResources
  }

export type TCurrency = number
export type TCurrencies = [TCurrency, TCurrency]

export type TResource = number
export type TResources = [
	TResource,
	TResource,
	TResource,
	TResource,
	TResource,
	TResource,
	TResource,
	TResource,
	TResource,
	TResource
]

export interface ILocalizedData<T> {
	[ELocalisation.en]: T
	[ELocalisation.de]: T
}

export enum ELocalisation {
  en = "en",
  de = "de"
}

export interface ILocaleStringMap extends ILocalizedData<string> {}
