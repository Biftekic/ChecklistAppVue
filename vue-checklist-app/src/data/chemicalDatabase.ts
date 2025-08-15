import type { ChemicalSpecification } from '@/types/cleaning.types'

export const chemicalDatabase: ChemicalSpecification[] = [
  // ============= BATHROOM CHEMICALS =============
  {
    id: 'chem-bath-001',
    name: 'Multi-Purpose Bathroom Cleaner',
    category: 'bathroom',
    activeIngredients: ['Quaternary ammonium compounds', 'Citric acid', 'Surfactants'],
    phRange: {
      min: 2,
      max: 6,
      optimal: 4
    },
    concentration: {
      recommended: '1:32',
      minimum: '1:64',
      maximum: '1:16'
    },
    dilutionRatio: {
      lightDuty: '1:64',
      normalDuty: '1:32',
      heavyDuty: '1:16'
    },
    dwellTime: {
      minimum: 30,
      recommended: 120,
      maximum: 600
    },
    temperature: {
      minimum: 10,
      optimal: 20,
      maximum: 40
    },
    safetyClassification: {
      hazardLevel: 'moderate',
      hmisRating: {
        health: 2,
        flammability: 0,
        reactivity: 0,
        protection: 'B'
      },
      ghs: {
        pictograms: ['GHS07'],
        signalWord: 'warning',
        hazardStatements: ['H315 - Causes skin irritation', 'H319 - Causes serious eye irritation']
      }
    },
    epaRegistration: 'EPA Reg. No. 1839-169',
    incompatibleChemicals: ['Bleach', 'Ammonia', 'Hydrogen peroxide'],
    storageRequirements: {
      temperature: '5-30°C',
      ventilation: true,
      segregation: ['Oxidizers', 'Acids'],
      shelfLife: 24
    },
    firstAid: {
      eyeContact: 'Flush with water for 15 minutes. Seek medical attention if irritation persists.',
      skinContact: 'Wash with soap and water. Remove contaminated clothing.',
      inhalation: 'Move to fresh air. Seek medical attention if symptoms persist.',
      ingestion: 'Do not induce vomiting. Rinse mouth with water. Seek immediate medical attention.'
    },
    vendorInfo: {
      manufacturer: 'Professional Cleaning Solutions Inc.',
      productCode: 'PCS-BC-001',
      unitSize: ['1 Gallon', '5 Gallon', '55 Gallon'],
      costPerUnit: 12.99
    }
  },
  {
    id: 'chem-bath-002',
    name: 'Toilet Bowl Cleaner (Phosphoric Acid)',
    category: 'bathroom',
    activeIngredients: ['Phosphoric acid 20-23%', 'Surfactants', 'Thickening agents'],
    phRange: {
      min: 0,
      max: 2,
      optimal: 1
    },
    concentration: {
      recommended: 'RTU',
      minimum: 'RTU',
      maximum: 'RTU'
    },
    dwellTime: {
      minimum: 600,
      recommended: 900,
      maximum: 1800
    },
    safetyClassification: {
      hazardLevel: 'high',
      hmisRating: {
        health: 3,
        flammability: 0,
        reactivity: 1,
        protection: 'C'
      },
      ghs: {
        pictograms: ['GHS05', 'GHS07'],
        signalWord: 'danger',
        hazardStatements: ['H314 - Causes severe skin burns and eye damage']
      }
    },
    incompatibleChemicals: ['Bleach', 'Ammonia', 'Alkaline cleaners'],
    storageRequirements: {
      temperature: '5-25°C',
      ventilation: true,
      segregation: ['Bases', 'Oxidizers'],
      shelfLife: 36
    },
    firstAid: {
      eyeContact: 'Immediately flush with water for 20 minutes. Seek immediate medical attention.',
      skinContact: 'Immediately wash with copious amounts of water. Remove contaminated clothing. Seek medical attention.',
      inhalation: 'Move to fresh air immediately. Seek medical attention.',
      ingestion: 'Do not induce vomiting. Rinse mouth. Seek immediate medical attention.'
    },
    vendorInfo: {
      manufacturer: 'Industrial Cleaners Corp.',
      productCode: 'ICC-TB-002',
      unitSize: ['32 oz', '1 Gallon'],
      costPerUnit: 8.49
    }
  },
  
  // ============= DISINFECTANTS =============
  {
    id: 'chem-dis-001',
    name: 'Quaternary Ammonium Disinfectant (EPA List N)',
    category: 'disinfectant',
    activeIngredients: [
      'Alkyl dimethyl benzyl ammonium chloride 0.105%',
      'Alkyl dimethyl ethylbenzyl ammonium chloride 0.105%'
    ],
    phRange: {
      min: 6,
      max: 8,
      optimal: 7
    },
    concentration: {
      recommended: '1:256',
      minimum: '1:512',
      maximum: '1:128'
    },
    dilutionRatio: {
      lightDuty: '1:512 (sanitizing)',
      normalDuty: '1:256 (disinfecting)',
      heavyDuty: '1:128 (virucidal)'
    },
    dwellTime: {
      minimum: 60,
      recommended: 600,
      maximum: 900
    },
    temperature: {
      minimum: 15,
      optimal: 20,
      maximum: 30
    },
    safetyClassification: {
      hazardLevel: 'low',
      hmisRating: {
        health: 1,
        flammability: 0,
        reactivity: 0,
        protection: 'A'
      }
    },
    epaRegistration: 'EPA Reg. No. 10324-108',
    incompatibleChemicals: ['Anionic detergents', 'Soap'],
    storageRequirements: {
      temperature: '10-30°C',
      ventilation: false,
      segregation: [],
      shelfLife: 24
    },
    firstAid: {
      eyeContact: 'Rinse with water for 15 minutes.',
      skinContact: 'Wash with soap and water.',
      inhalation: 'Move to fresh air.',
      ingestion: 'Drink water. Contact poison control.'
    },
    vendorInfo: {
      manufacturer: 'SafeClean Industries',
      productCode: 'SCI-QD-001',
      unitSize: ['1 Gallon', '5 Gallon'],
      costPerUnit: 24.99
    }
  },
  
  // ============= DEGREASERS =============
  {
    id: 'chem-deg-001',
    name: 'Heavy-Duty Alkaline Degreaser',
    category: 'degreaser',
    activeIngredients: ['Sodium hydroxide', 'Potassium hydroxide', 'Surfactants', 'Builders'],
    phRange: {
      min: 12,
      max: 14,
      optimal: 13
    },
    concentration: {
      recommended: '1:20',
      minimum: '1:40',
      maximum: '1:10'
    },
    dilutionRatio: {
      lightDuty: '1:40',
      normalDuty: '1:20',
      heavyDuty: '1:10'
    },
    dwellTime: {
      minimum: 300,
      recommended: 600,
      maximum: 1200
    },
    temperature: {
      minimum: 20,
      optimal: 50,
      maximum: 70
    },
    safetyClassification: {
      hazardLevel: 'high',
      hmisRating: {
        health: 3,
        flammability: 0,
        reactivity: 1,
        protection: 'C'
      },
      ghs: {
        pictograms: ['GHS05'],
        signalWord: 'danger',
        hazardStatements: ['H314 - Causes severe skin burns and eye damage']
      }
    },
    incompatibleChemicals: ['Acids', 'Aluminum', 'Zinc'],
    storageRequirements: {
      temperature: '10-35°C',
      ventilation: true,
      segregation: ['Acids', 'Oxidizers'],
      shelfLife: 36
    },
    firstAid: {
      eyeContact: 'Immediately flush with water for 20 minutes. Seek immediate medical attention.',
      skinContact: 'Immediately wash with copious amounts of water. Seek medical attention.',
      inhalation: 'Move to fresh air. Seek medical attention if symptoms develop.',
      ingestion: 'Do not induce vomiting. Rinse mouth. Seek immediate medical attention.'
    },
    vendorInfo: {
      manufacturer: 'Industrial Strength Cleaners',
      productCode: 'ISC-DG-001',
      unitSize: ['1 Gallon', '5 Gallon'],
      costPerUnit: 18.99
    }
  },
  
  // ============= FLOOR CLEANERS =============
  {
    id: 'chem-floor-001',
    name: 'Neutral Floor Cleaner',
    category: 'floor',
    activeIngredients: ['Surfactants', 'Builders', 'Fragrance'],
    phRange: {
      min: 6,
      max: 8,
      optimal: 7
    },
    concentration: {
      recommended: '1:128',
      minimum: '1:256',
      maximum: '1:64'
    },
    dilutionRatio: {
      lightDuty: '1:256',
      normalDuty: '1:128',
      heavyDuty: '1:64'
    },
    dwellTime: {
      minimum: 0,
      recommended: 60,
      maximum: 300
    },
    safetyClassification: {
      hazardLevel: 'low',
      hmisRating: {
        health: 1,
        flammability: 0,
        reactivity: 0,
        protection: 'A'
      }
    },
    incompatibleChemicals: ['Strong acids', 'Strong bases'],
    storageRequirements: {
      temperature: '5-40°C',
      ventilation: false,
      segregation: [],
      shelfLife: 36
    },
    firstAid: {
      eyeContact: 'Rinse with water for 10 minutes.',
      skinContact: 'Wash with soap and water.',
      inhalation: 'Move to fresh air.',
      ingestion: 'Drink water. Do not induce vomiting.'
    },
    vendorInfo: {
      manufacturer: 'FloorCare Pro',
      productCode: 'FCP-NF-001',
      unitSize: ['1 Gallon', '5 Gallon', '55 Gallon'],
      costPerUnit: 14.99
    }
  },
  
  // ============= GLASS CLEANERS =============
  {
    id: 'chem-glass-001',
    name: 'Ammonia-Free Glass Cleaner',
    category: 'glass',
    activeIngredients: ['Isopropyl alcohol', 'Surfactants', 'Glycol ethers'],
    phRange: {
      min: 9,
      max: 11,
      optimal: 10
    },
    concentration: {
      recommended: 'RTU',
      minimum: 'RTU',
      maximum: 'RTU'
    },
    dwellTime: {
      minimum: 0,
      recommended: 30,
      maximum: 60
    },
    safetyClassification: {
      hazardLevel: 'low',
      hmisRating: {
        health: 1,
        flammability: 1,
        reactivity: 0,
        protection: 'A'
      }
    },
    incompatibleChemicals: [],
    storageRequirements: {
      temperature: '5-35°C',
      ventilation: false,
      segregation: [],
      shelfLife: 24
    },
    firstAid: {
      eyeContact: 'Rinse with water.',
      skinContact: 'Wash with soap and water.',
      inhalation: 'Move to fresh air.',
      ingestion: 'Rinse mouth. Do not induce vomiting.'
    },
    vendorInfo: {
      manufacturer: 'Crystal Clear Solutions',
      productCode: 'CCS-GC-001',
      unitSize: ['32 oz', '1 Gallon'],
      costPerUnit: 6.99
    }
  },
  
  // ============= ALL-PURPOSE CLEANERS =============
  {
    id: 'chem-all-001',
    name: 'pH-Neutral All-Purpose Cleaner',
    category: 'all-purpose',
    activeIngredients: ['Surfactants', 'Builders', 'Chelating agents'],
    phRange: {
      min: 6,
      max: 8,
      optimal: 7
    },
    concentration: {
      recommended: '1:64',
      minimum: '1:128',
      maximum: '1:32'
    },
    dilutionRatio: {
      lightDuty: '1:128',
      normalDuty: '1:64',
      heavyDuty: '1:32'
    },
    dwellTime: {
      minimum: 30,
      recommended: 120,
      maximum: 300
    },
    temperature: {
      minimum: 5,
      optimal: 20,
      maximum: 50
    },
    safetyClassification: {
      hazardLevel: 'low',
      hmisRating: {
        health: 1,
        flammability: 0,
        reactivity: 0,
        protection: 'A'
      }
    },
    epaRegistration: 'EPA Reg. No. 5813-40',
    incompatibleChemicals: [],
    storageRequirements: {
      temperature: '5-40°C',
      ventilation: false,
      segregation: [],
      shelfLife: 36
    },
    firstAid: {
      eyeContact: 'Rinse with water for 10 minutes.',
      skinContact: 'Wash with soap and water.',
      inhalation: 'Move to fresh air.',
      ingestion: 'Drink water. Do not induce vomiting.'
    },
    vendorInfo: {
      manufacturer: 'Green Clean Products',
      productCode: 'GCP-AP-001',
      unitSize: ['1 Gallon', '5 Gallon'],
      costPerUnit: 16.99
    }
  },
  
  // ============= SANITIZERS =============
  {
    id: 'chem-san-001',
    name: 'Food Surface Sanitizer (No Rinse)',
    category: 'sanitizer',
    activeIngredients: ['Quaternary ammonium compounds 200ppm'],
    phRange: {
      min: 6,
      max: 8,
      optimal: 7
    },
    concentration: {
      recommended: '200ppm',
      minimum: '150ppm',
      maximum: '400ppm'
    },
    dwellTime: {
      minimum: 60,
      recommended: 60,
      maximum: 120
    },
    safetyClassification: {
      hazardLevel: 'low',
      hmisRating: {
        health: 1,
        flammability: 0,
        reactivity: 0,
        protection: 'A'
      }
    },
    epaRegistration: 'EPA Reg. No. 10324-85',
    incompatibleChemicals: ['Anionic detergents'],
    storageRequirements: {
      temperature: '10-30°C',
      ventilation: false,
      segregation: [],
      shelfLife: 12
    },
    firstAid: {
      eyeContact: 'Rinse with water.',
      skinContact: 'Wash with water.',
      inhalation: 'Not applicable.',
      ingestion: 'Drink water.'
    },
    vendorInfo: {
      manufacturer: 'FoodSafe Solutions',
      productCode: 'FSS-SAN-001',
      unitSize: ['1 Gallon', '5 Gallon'],
      costPerUnit: 22.99
    }
  },
  
  // ============= OVEN CLEANERS =============
  {
    id: 'chem-oven-001',
    name: 'Heavy-Duty Oven Cleaner',
    category: 'oven',
    activeIngredients: ['Sodium hydroxide 4-6%', 'Potassium hydroxide 2-4%', 'Surfactants'],
    phRange: {
      min: 13,
      max: 14,
      optimal: 13.5
    },
    concentration: {
      recommended: 'RTU',
      minimum: 'RTU',
      maximum: 'RTU'
    },
    dwellTime: {
      minimum: 1200,
      recommended: 3600,
      maximum: 28800
    },
    temperature: {
      minimum: 20,
      optimal: 40,
      maximum: 50
    },
    safetyClassification: {
      hazardLevel: 'extreme',
      hmisRating: {
        health: 3,
        flammability: 1,
        reactivity: 1,
        protection: 'C'
      },
      ghs: {
        pictograms: ['GHS05', 'GHS07'],
        signalWord: 'danger',
        hazardStatements: ['H314 - Causes severe skin burns and eye damage', 'H290 - May be corrosive to metals']
      }
    },
    incompatibleChemicals: ['Acids', 'Aluminum', 'Zinc', 'Tin'],
    storageRequirements: {
      temperature: '10-30°C',
      ventilation: true,
      segregation: ['Acids', 'Reactive metals'],
      shelfLife: 24
    },
    firstAid: {
      eyeContact: 'Immediately flush with water for 20 minutes. Seek immediate medical attention.',
      skinContact: 'Immediately wash with copious amounts of water. Remove contaminated clothing. Seek medical attention.',
      inhalation: 'Move to fresh air immediately. Seek medical attention.',
      ingestion: 'Do not induce vomiting. Rinse mouth. Seek immediate medical attention.'
    },
    vendorInfo: {
      manufacturer: 'ProKitchen Chemicals',
      productCode: 'PKC-OC-001',
      unitSize: ['19 oz aerosol', '1 Gallon'],
      costPerUnit: 12.99
    }
  },
  
  // ============= DESCALERS =============
  {
    id: 'chem-desc-001',
    name: 'Lime & Scale Remover',
    category: 'descaler',
    activeIngredients: ['Phosphoric acid 15-20%', 'Citric acid 5-10%', 'Surfactants'],
    phRange: {
      min: 0,
      max: 3,
      optimal: 2
    },
    concentration: {
      recommended: '1:10',
      minimum: '1:20',
      maximum: '1:5'
    },
    dilutionRatio: {
      lightDuty: '1:20',
      normalDuty: '1:10',
      heavyDuty: '1:5'
    },
    dwellTime: {
      minimum: 120,
      recommended: 300,
      maximum: 600
    },
    safetyClassification: {
      hazardLevel: 'moderate',
      hmisRating: {
        health: 2,
        flammability: 0,
        reactivity: 0,
        protection: 'B'
      },
      ghs: {
        pictograms: ['GHS05'],
        signalWord: 'warning',
        hazardStatements: ['H315 - Causes skin irritation', 'H319 - Causes serious eye irritation']
      }
    },
    incompatibleChemicals: ['Bleach', 'Ammonia', 'Alkaline cleaners'],
    storageRequirements: {
      temperature: '5-30°C',
      ventilation: true,
      segregation: ['Bases', 'Oxidizers'],
      shelfLife: 24
    },
    firstAid: {
      eyeContact: 'Flush with water for 15 minutes. Seek medical attention.',
      skinContact: 'Wash with soap and water.',
      inhalation: 'Move to fresh air.',
      ingestion: 'Do not induce vomiting. Seek medical attention.'
    },
    vendorInfo: {
      manufacturer: 'Scale Solutions Inc.',
      productCode: 'SSI-LS-001',
      unitSize: ['32 oz', '1 Gallon'],
      costPerUnit: 10.99
    }
  },
  
  // ============= SPECIALTY CLEANERS =============
  {
    id: 'chem-spec-001',
    name: 'Stainless Steel Polish',
    category: 'polish',
    activeIngredients: ['Mineral oil', 'Silicone', 'Surfactants'],
    phRange: {
      min: 6,
      max: 8,
      optimal: 7
    },
    concentration: {
      recommended: 'RTU',
      minimum: 'RTU',
      maximum: 'RTU'
    },
    dwellTime: {
      minimum: 0,
      recommended: 30,
      maximum: 60
    },
    safetyClassification: {
      hazardLevel: 'low',
      hmisRating: {
        health: 1,
        flammability: 1,
        reactivity: 0,
        protection: 'A'
      }
    },
    incompatibleChemicals: [],
    storageRequirements: {
      temperature: '5-35°C',
      ventilation: false,
      segregation: [],
      shelfLife: 36
    },
    firstAid: {
      eyeContact: 'Rinse with water.',
      skinContact: 'Wash with soap and water.',
      inhalation: 'Move to fresh air.',
      ingestion: 'Do not induce vomiting.'
    },
    vendorInfo: {
      manufacturer: 'Shine Pro',
      productCode: 'SP-SS-001',
      unitSize: ['16 oz', '32 oz'],
      costPerUnit: 8.99
    }
  },
  {
    id: 'chem-spec-002',
    name: 'Electronics-Safe Cleaner (70% IPA)',
    category: 'specialty',
    activeIngredients: ['Isopropyl alcohol 70%', 'Deionized water 30%'],
    phRange: {
      min: 6,
      max: 8,
      optimal: 7
    },
    concentration: {
      recommended: 'RTU',
      minimum: 'RTU',
      maximum: 'RTU'
    },
    dwellTime: {
      minimum: 0,
      recommended: 10,
      maximum: 30
    },
    safetyClassification: {
      hazardLevel: 'low',
      hmisRating: {
        health: 1,
        flammability: 3,
        reactivity: 0,
        protection: 'A'
      }
    },
    incompatibleChemicals: ['Strong oxidizers'],
    storageRequirements: {
      temperature: '15-25°C',
      ventilation: true,
      segregation: ['Heat sources', 'Oxidizers'],
      shelfLife: 24
    },
    firstAid: {
      eyeContact: 'Rinse with water.',
      skinContact: 'No action needed.',
      inhalation: 'Move to fresh air.',
      ingestion: 'Rinse mouth. Seek medical attention.'
    },
    vendorInfo: {
      manufacturer: 'TechClean Solutions',
      productCode: 'TCS-EC-001',
      unitSize: ['16 oz', '32 oz'],
      costPerUnit: 7.99
    }
  },
  {
    id: 'chem-spec-003',
    name: 'Enzyme Cleaner (Bio-Enzymatic)',
    category: 'enzyme',
    activeIngredients: ['Bacterial enzymes', 'Surfactants', 'Fragrance'],
    phRange: {
      min: 6,
      max: 8,
      optimal: 7
    },
    concentration: {
      recommended: '1:10',
      minimum: '1:20',
      maximum: '1:5'
    },
    dilutionRatio: {
      lightDuty: '1:20',
      normalDuty: '1:10',
      heavyDuty: '1:5'
    },
    dwellTime: {
      minimum: 300,
      recommended: 900,
      maximum: 3600
    },
    temperature: {
      minimum: 15,
      optimal: 25,
      maximum: 40
    },
    safetyClassification: {
      hazardLevel: 'low',
      hmisRating: {
        health: 0,
        flammability: 0,
        reactivity: 0,
        protection: 'A'
      }
    },
    incompatibleChemicals: ['Disinfectants', 'Hot water >60°C', 'Strong acids', 'Strong bases'],
    storageRequirements: {
      temperature: '10-30°C',
      ventilation: false,
      segregation: ['Disinfectants'],
      shelfLife: 12
    },
    firstAid: {
      eyeContact: 'Rinse with water.',
      skinContact: 'Wash with water.',
      inhalation: 'No action needed.',
      ingestion: 'Drink water.'
    },
    vendorInfo: {
      manufacturer: 'BioClean Technologies',
      productCode: 'BCT-ENZ-001',
      unitSize: ['32 oz', '1 Gallon'],
      costPerUnit: 19.99
    }
  }
]

// Helper function to get chemical by ID
export function getChemicalById(id: string): ChemicalSpecification | undefined {
  return chemicalDatabase.find(chem => chem.id === id)
}

// Helper function to get chemicals by category
export function getChemicalsByCategory(category: string): ChemicalSpecification[] {
  return chemicalDatabase.filter(chem => chem.category === category)
}

// Helper function to calculate dilution
export function calculateDilution(
  chemicalId: string,
  waterVolume: number,
  dutyLevel: 'lightDuty' | 'normalDuty' | 'heavyDuty' = 'normalDuty'
): { chemicalAmount: number; totalVolume: number } | null {
  const chemical = getChemicalById(chemicalId)
  if (!chemical || !chemical.dilutionRatio) return null
  
  const ratio = chemical.dilutionRatio[dutyLevel]
  if (!ratio) return null
  
  const [chemPart, waterPart] = ratio.split(':').map(Number)
  const chemicalAmount = waterVolume / waterPart * chemPart
  
  return {
    chemicalAmount,
    totalVolume: waterVolume + chemicalAmount
  }
}