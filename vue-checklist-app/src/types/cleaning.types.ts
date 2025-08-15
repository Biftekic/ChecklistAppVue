// Professional Cleaning System Type Definitions

// ============= Chemical Specifications =============
export interface ChemicalSpecification {
  id: string
  name: string
  category: ChemicalCategory
  activeIngredients: string[]
  phRange: {
    min: number
    max: number
    optimal?: number
  }
  concentration: {
    recommended: string // e.g., "1:128", "2%", "RTU (Ready-to-use)"
    minimum: string
    maximum: string
  }
  dilutionRatio?: {
    lightDuty: string
    normalDuty: string
    heavyDuty: string
  }
  dwellTime: {
    minimum: number // seconds
    recommended: number
    maximum?: number
  }
  temperature?: {
    minimum?: number // Celsius
    optimal?: number
    maximum?: number
  }
  safetyClassification: {
    hazardLevel: 'low' | 'moderate' | 'high' | 'extreme'
    hmisRating?: {
      health: number // 0-4
      flammability: number // 0-4
      reactivity: number // 0-4
      protection: string // PPE code
    }
    ghs?: {
      pictograms: string[]
      signalWord: 'warning' | 'danger'
      hazardStatements: string[]
    }
  }
  epaRegistration?: string
  incompatibleChemicals: string[]
  storageRequirements: {
    temperature: string
    ventilation: boolean
    segregation: string[]
    shelfLife: number // months
  }
  firstAid: {
    eyeContact: string
    skinContact: string
    inhalation: string
    ingestion: string
  }
  sdsUrl?: string
  vendorInfo?: {
    manufacturer: string
    productCode: string
    unitSize: string[]
    costPerUnit?: number
  }
}

export type ChemicalCategory = 
  | 'all-purpose'
  | 'bathroom'
  | 'degreaser'
  | 'disinfectant'
  | 'floor'
  | 'glass'
  | 'oven'
  | 'polish'
  | 'sanitizer'
  | 'descaler'
  | 'enzyme'
  | 'solvent'
  | 'specialty'

// ============= Equipment Specifications =============
export interface EquipmentSpecification {
  id: string
  name: string
  category: EquipmentCategory
  type: string
  specifications: {
    size?: string
    capacity?: string
    material?: string
    weight?: string
    powerRequirement?: string
    noiseLevel?: string // decibels
    efficiency?: string
  }
  colorCoding?: {
    available: string[]
    recommended: {
      bathroom: string
      kitchen: string
      general: string
      medical?: string
    }
  }
  maintenance: {
    dailyCare: string[]
    weeklyMaintenance: string[]
    monthlyInspection: string[]
    replacementSchedule: number // months
    commonIssues: string[]
  }
  safetyCertifications: string[]
  ergonomicFeatures?: string[]
  vendorInfo?: {
    manufacturer: string
    model: string
    warranty: string
    costRange: {
      min: number
      max: number
    }
  }
  alternatives?: string[]
  trainingRequired: boolean
  storageRequirements?: string
}

export type EquipmentCategory = 
  | 'ppe'
  | 'manual-tools'
  | 'powered-equipment'
  | 'carts-storage'
  | 'floor-care'
  | 'restroom'
  | 'waste-management'
  | 'specialty'
  | 'consumables'

// ============= Safety Requirements =============
export interface SafetyRequirement {
  id: string
  taskId?: string
  category: SafetyCategory
  severity: 'low' | 'medium' | 'high' | 'critical'
  ppe: PPERequirement[]
  hazards: Hazard[]
  emergencyProcedures: EmergencyProcedure[]
  oshaCompliance?: {
    standard: string
    requirement: string
    documentation: string[]
  }
  training: {
    required: string[]
    recommended: string[]
    certificationNeeded: boolean
    renewalPeriod?: number // months
  }
  signage: string[]
  lockoutTagout?: boolean
  confinedSpace?: boolean
  workingAtHeight?: boolean
}

export interface PPERequirement {
  type: PPEType
  specification: string
  mandatory: boolean
  condition?: string // When required
}

export type PPEType = 
  | 'gloves'
  | 'goggles'
  | 'face-shield'
  | 'respirator'
  | 'apron'
  | 'boots'
  | 'coveralls'
  | 'hearing-protection'
  | 'hard-hat'
  | 'high-visibility'

export interface Hazard {
  type: string
  description: string
  likelihood: 'rare' | 'unlikely' | 'possible' | 'likely' | 'certain'
  severity: 'negligible' | 'minor' | 'moderate' | 'major' | 'catastrophic'
  controls: string[]
}

export interface EmergencyProcedure {
  scenario: string
  steps: string[]
  contactInfo?: string
  equipmentNeeded: string[]
}

export type SafetyCategory = 
  | 'chemical'
  | 'biological'
  | 'physical'
  | 'ergonomic'
  | 'electrical'
  | 'environmental'

// ============= Enhanced Cleaning Task =============
export interface EnhancedCleaningTask {
  id: string
  name: string
  description: string
  category: string
  room?: string
  surface?: string
  
  // Timing
  timeEstimate: {
    minimum: number // minutes
    average: number
    maximum: number
    factors: TimeFactor[]
  }
  
  frequency: TaskFrequency
  priority: 'critical' | 'high' | 'medium' | 'low'
  
  // Detailed Steps (10-15 minimum)
  steps: DetailedStep[]
  
  // Chemical Requirements
  chemicals: ChemicalRequirement[]
  
  // Equipment Requirements
  equipment: EquipmentRequirement[]
  
  // Safety
  safety: SafetyRequirement
  
  // Quality Standards
  qualityStandards: QualityStandard[]
  
  // Verification
  verificationChecklist: VerificationItem[]
  
  // Documentation
  photoDocumentation?: {
    required: boolean
    points: string[]
    frequency: string
  }
  
  // Special Conditions
  specialConditions?: {
    temperature?: string
    humidity?: string
    ventilation?: string
    lighting?: string
    access?: string
  }
  
  // Regulatory
  regulations?: {
    standard: string
    requirement: string
    reference: string
  }[]
  
  // Notes
  commonMistakes?: string[]
  professionalTips?: string[]
  troubleshooting?: {
    issue: string
    solution: string
  }[]
}

export interface DetailedStep {
  number: number
  action: string
  detail: string
  duration?: number // seconds
  technique?: string
  tools?: string[]
  chemical?: string
  safety?: string
  checkpoint?: string
  photo?: boolean
}

export interface ChemicalRequirement {
  chemicalId: string
  purpose: string
  dilution?: string
  quantity: string
  applicationMethod: 'spray' | 'wipe' | 'mop' | 'foam' | 'soak' | 'scrub'
  dwellTime?: number
  temperature?: string
  ppe?: string[]
}

export interface EquipmentRequirement {
  equipmentId: string
  purpose: string
  colorCode?: string
  quantity: number
  alternatives?: string[]
  condition?: string
}

export interface QualityStandard {
  category: 'visual' | 'tactile' | 'olfactory' | 'measurable'
  description: string
  acceptanceCriteria: string
  testMethod?: string
  tools?: string[]
}

export interface VerificationItem {
  id: string
  description: string
  required: boolean
  category: string
  evidence?: 'visual' | 'photo' | 'signature' | 'measurement'
}

export interface TimeFactor {
  factor: string
  impact: number // percentage increase
  condition: string
}

export interface TaskFrequency {
  type: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'annual' | 'as-needed'
  specificDays?: string[]
  time?: string
  season?: string[]
  triggers?: string[]
}

// ============= Template Structure =============
export interface ProfessionalCleaningTemplate {
  id: string
  name: string
  industry: string
  propertyType: string
  serviceLevel: 'basic' | 'standard' | 'premium' | 'specialized'
  
  // Master Supply List
  masterSupplyList: {
    chemicals: ChemicalRequirement[]
    equipment: EquipmentRequirement[]
    consumables: ConsumableItem[]
    amenities: AmenityItem[]
  }
  
  // Cleaning Sequence & Timing
  cleaningSequence: {
    totalTime: {
      minimum: number
      average: number
      maximum: number
    }
    routeOptimization: RouteStep[]
    serviceSchedule: ServiceSchedule
  }
  
  // Areas/Sections
  sections: CleaningSection[]
  
  // Compliance
  compliance: {
    regulations: string[]
    certifications: string[]
    inspectionPoints: string[]
    documentation: string[]
  }
  
  // Client Customization
  customization?: {
    preferences: ClientPreference[]
    restrictions: string[]
    specialInstructions: string[]
    accessCodes?: AccessInfo[]
  }
}

export interface CleaningSection {
  id: string
  name: string
  area: string
  tasks: EnhancedCleaningTask[]
  totalTime: {
    minimum: number
    average: number
    maximum: number
  }
  sequence: number
  notes?: string[]
}

export interface RouteStep {
  sequence: number
  area: string
  tasks: string[] // task IDs
  estimatedTime: number
  transition: string // How to move to next area
}

export interface ServiceSchedule {
  standardHours: {
    start: string
    end: string
  }
  restrictions?: string[]
  optimalTime?: string
  avoidTimes?: string[]
}

export interface ConsumableItem {
  name: string
  category: string
  quantity: string
  size: string
  replenishmentFrequency: string
}

export interface AmenityItem {
  name: string
  location: string[]
  quantity: string
  brand?: string
  qualityStandard?: string
}

export interface ClientPreference {
  category: string
  preference: string
  priority: 'mandatory' | 'preferred' | 'optional'
}

export interface AccessInfo {
  location: string
  type: 'key' | 'code' | 'card' | 'biometric'
  details: string
  restrictions?: string
}

// ============= Industry Standards =============
export interface IndustryStandard {
  id: string
  name: string
  organization: string
  category: string
  requirements: StandardRequirement[]
  certificationProcess?: string
  renewalPeriod?: number
  documentation: string[]
}

export interface StandardRequirement {
  id: string
  description: string
  mandatory: boolean
  verificationMethod: string
  frequency?: string
  evidence?: string[]
}