import type { EquipmentSpecification } from '@/types/cleaning.types'

export const equipmentDatabase: EquipmentSpecification[] = [
  // ============= PERSONAL PROTECTIVE EQUIPMENT (PPE) =============
  {
    id: 'equip-ppe-001',
    name: 'Nitrile Gloves (Powder-Free)',
    category: 'ppe',
    type: 'Hand Protection',
    specifications: {
      size: 'S, M, L, XL',
      material: 'Nitrile rubber',
      weight: '4-5 mil thickness',
      powerRequirement: 'N/A'
    },
    colorCoding: {
      available: ['Blue', 'Green', 'Yellow', 'Red', 'Black'],
      recommended: {
        bathroom: 'Yellow',
        kitchen: 'Green',
        general: 'Blue',
        medical: 'Red'
      }
    },
    maintenance: {
      dailyCare: ['Inspect for tears', 'Dispose if damaged'],
      weeklyMaintenance: ['Check inventory levels'],
      monthlyInspection: ['Review color coding compliance'],
      replacementSchedule: 0.25, // Single use
      commonIssues: ['Tearing', 'Allergic reactions', 'Wrong size selection']
    },
    safetyCertifications: ['EN 374', 'EN 455', 'FDA approved for food contact'],
    ergonomicFeatures: ['Textured fingertips', 'Ambidextrous design'],
    vendorInfo: {
      manufacturer: 'SafeHands Pro',
      model: 'SHP-NG-100',
      warranty: 'N/A',
      costRange: {
        min: 8.99,
        max: 12.99
      }
    },
    alternatives: ['Latex gloves', 'Vinyl gloves', 'Rubber gloves'],
    trainingRequired: false,
    storageRequirements: 'Cool, dry place away from direct sunlight'
  },
  {
    id: 'equip-ppe-002',
    name: 'Safety Goggles (Anti-Fog)',
    category: 'ppe',
    type: 'Eye Protection',
    specifications: {
      size: 'Universal fit',
      material: 'Polycarbonate lens, PVC frame',
      weight: '80 grams'
    },
    maintenance: {
      dailyCare: ['Clean with lens cleaner', 'Check for scratches'],
      weeklyMaintenance: ['Deep clean', 'Check strap elasticity'],
      monthlyInspection: ['Replace if scratched'],
      replacementSchedule: 6,
      commonIssues: ['Fogging', 'Scratches', 'Strap wear']
    },
    safetyCertifications: ['ANSI Z87.1', 'EN 166'],
    ergonomicFeatures: ['Adjustable strap', 'Indirect venting', 'Over-glasses design'],
    vendorInfo: {
      manufacturer: 'ClearView Safety',
      model: 'CVS-AG-200',
      warranty: '6 months',
      costRange: {
        min: 12.99,
        max: 24.99
      }
    },
    trainingRequired: false,
    storageRequirements: 'Protective case when not in use'
  },
  
  // ============= MANUAL CLEANING TOOLS =============
  {
    id: 'equip-cloth-001',
    name: 'Microfiber Cloths (16"x16")',
    category: 'manual-tools',
    type: 'Cleaning Cloths',
    specifications: {
      size: '16" x 16" (40cm x 40cm)',
      material: '80% polyester, 20% polyamide',
      weight: '300 GSM'
    },
    colorCoding: {
      available: ['Blue', 'Green', 'Yellow', 'Red', 'Gray', 'White'],
      recommended: {
        bathroom: 'Yellow',
        kitchen: 'Green',
        general: 'Blue',
        medical: 'Red'
      }
    },
    maintenance: {
      dailyCare: ['Rinse after use', 'Hang to dry'],
      weeklyMaintenance: ['Machine wash at 60°C', 'No fabric softener'],
      monthlyInspection: ['Check for wear', 'Replace if fraying'],
      replacementSchedule: 3,
      commonIssues: ['Lint buildup', 'Color fading', 'Reduced absorbency']
    },
    safetyCertifications: ['OEKO-TEX Standard 100'],
    vendorInfo: {
      manufacturer: 'ProClean Textiles',
      model: 'PCT-MF-300',
      warranty: 'N/A',
      costRange: {
        min: 2.99,
        max: 4.99
      }
    },
    alternatives: ['Cotton cloths', 'Disposable wipes'],
    trainingRequired: false,
    storageRequirements: 'Clean, dry storage by color'
  },
  {
    id: 'equip-brush-001',
    name: 'Toilet Bowl Brush with Caddy',
    category: 'restroom',
    type: 'Cleaning Brush',
    specifications: {
      size: '15" length, 4" brush head',
      material: 'Plastic handle, nylon bristles',
      weight: '200 grams'
    },
    maintenance: {
      dailyCare: ['Rinse after use', 'Return to caddy', 'Disinfect weekly'],
      weeklyMaintenance: ['Soak in disinfectant', 'Air dry'],
      monthlyInspection: ['Check bristle wear', 'Replace if bent'],
      replacementSchedule: 3,
      commonIssues: ['Bristle wear', 'Handle breakage', 'Caddy contamination']
    },
    safetyCertifications: [],
    vendorInfo: {
      manufacturer: 'SaniClean Tools',
      model: 'SCT-TB-100',
      warranty: 'N/A',
      costRange: {
        min: 8.99,
        max: 14.99
      }
    },
    alternatives: ['Disposable toilet wands'],
    trainingRequired: false,
    storageRequirements: 'Separate storage, never mix with other brushes'
  },
  
  // ============= POWERED EQUIPMENT =============
  {
    id: 'equip-vac-001',
    name: 'HEPA Filter Commercial Vacuum',
    category: 'powered-equipment',
    type: 'Vacuum Cleaner',
    specifications: {
      size: '14" cleaning path',
      capacity: '6 quarts',
      material: 'ABS plastic body',
      weight: '8.2 kg',
      powerRequirement: '120V, 7 amps',
      noiseLevel: '68 dB',
      efficiency: 'HEPA filtration 99.97% at 0.3 microns'
    },
    maintenance: {
      dailyCare: ['Empty bag at 75% full', 'Check cord for damage', 'Clean brush roll'],
      weeklyMaintenance: ['Replace bag', 'Clean filters', 'Check belt tension'],
      monthlyInspection: ['Deep clean filters', 'Inspect brush roll', 'Test suction'],
      replacementSchedule: 36,
      commonIssues: ['Loss of suction', 'Belt breakage', 'Clogged filters']
    },
    safetyCertifications: ['CRI Gold Certification', 'UL Listed'],
    ergonomicFeatures: ['Adjustable handle', 'Low profile design', 'Quiet operation'],
    vendorInfo: {
      manufacturer: 'ProVac Industries',
      model: 'PVI-HEPA-1000',
      warranty: '2 years',
      costRange: {
        min: 299.99,
        max: 499.99
      }
    },
    alternatives: ['Backpack vacuum', 'Canister vacuum'],
    trainingRequired: true,
    storageRequirements: 'Upright position, cord wrapped, clean and dry'
  },
  {
    id: 'equip-scrub-001',
    name: 'Auto-Scrubber (Walk-Behind)',
    category: 'floor-care',
    type: 'Floor Scrubber',
    specifications: {
      size: '17" cleaning path',
      capacity: '4 gallon solution, 5 gallon recovery',
      material: 'Rotomolded polyethylene',
      weight: '41 kg',
      powerRequirement: '24V battery operated',
      noiseLevel: '65 dB',
      efficiency: '10,000 sq ft per hour'
    },
    maintenance: {
      dailyCare: ['Empty and rinse tanks', 'Clean squeegee', 'Charge battery'],
      weeklyMaintenance: ['Deep clean tanks', 'Check pad wear', 'Clean filters'],
      monthlyInspection: ['Battery water levels', 'Squeegee adjustment', 'Motor brushes'],
      replacementSchedule: 60,
      commonIssues: ['Streaking', 'Poor water pickup', 'Battery issues']
    },
    safetyCertifications: ['CE Mark', 'ETL Listed'],
    ergonomicFeatures: ['Ergonomic handle', 'Simple controls', 'Parabolic squeegee'],
    vendorInfo: {
      manufacturer: 'FloorTech Pro',
      model: 'FTP-AS-1700',
      warranty: '1 year parts, 2 years tank',
      costRange: {
        min: 2499.99,
        max: 3999.99
      }
    },
    alternatives: ['Mop and bucket', 'Ride-on scrubber'],
    trainingRequired: true,
    storageRequirements: 'Charged, tanks empty and open, squeegee raised'
  },
  
  // ============= CARTS & STORAGE =============
  {
    id: 'equip-cart-001',
    name: 'Janitorial Cart with Locking Cabinet',
    category: 'carts-storage',
    type: 'Cleaning Cart',
    specifications: {
      size: '46"L x 22"W x 38"H',
      capacity: '25 gallon bag, 200 lbs total',
      material: 'Structural foam plastic',
      weight: '20 kg empty'
    },
    maintenance: {
      dailyCare: ['Wipe down surfaces', 'Empty trash', 'Organize supplies'],
      weeklyMaintenance: ['Deep clean all surfaces', 'Check wheels', 'Oil locks'],
      monthlyInspection: ['Tighten bolts', 'Check for cracks', 'Replace worn parts'],
      replacementSchedule: 60,
      commonIssues: ['Wheel wear', 'Lock failure', 'Handle loosening']
    },
    safetyCertifications: [],
    ergonomicFeatures: ['Non-marking wheels', 'Ergonomic handle', 'Tool holders'],
    vendorInfo: {
      manufacturer: 'CleanMobile',
      model: 'CM-JC-4600',
      warranty: '5 years',
      costRange: {
        min: 299.99,
        max: 499.99
      }
    },
    alternatives: ['Cleaning caddy', 'Wall-mounted station'],
    trainingRequired: false,
    storageRequirements: 'Locked storage area, supplies removed'
  },
  
  // ============= FLOOR CARE TOOLS =============
  {
    id: 'equip-mop-001',
    name: 'Microfiber Mop System (18")',
    category: 'floor-care',
    type: 'Mop System',
    specifications: {
      size: '18" frame, 60" handle',
      material: 'Aluminum frame, fiberglass handle',
      weight: '1.5 kg'
    },
    colorCoding: {
      available: ['Blue', 'Green', 'Yellow', 'Red'],
      recommended: {
        bathroom: 'Yellow',
        kitchen: 'Green',
        general: 'Blue',
        medical: 'Red'
      }
    },
    maintenance: {
      dailyCare: ['Rinse pads after use', 'Hang to dry'],
      weeklyMaintenance: ['Machine wash pads at 60°C', 'Check handle tightness'],
      monthlyInspection: ['Check frame alignment', 'Replace worn pads'],
      replacementSchedule: 12,
      commonIssues: ['Pad wear', 'Handle loosening', 'Frame bending']
    },
    safetyCertifications: [],
    ergonomicFeatures: ['Adjustable handle', '360° swivel', 'Lightweight design'],
    vendorInfo: {
      manufacturer: 'FloorCare Systems',
      model: 'FCS-MF-1800',
      warranty: '1 year',
      costRange: {
        min: 49.99,
        max: 89.99
      }
    },
    alternatives: ['String mop', 'Sponge mop'],
    trainingRequired: false,
    storageRequirements: 'Hang vertically, pads removed and washed'
  },
  {
    id: 'equip-bucket-001',
    name: 'Dual-Chamber Mop Bucket with Wringer',
    category: 'floor-care',
    type: 'Mop Bucket',
    specifications: {
      size: '36 quart total',
      capacity: '18 quart per chamber',
      material: 'Polypropylene',
      weight: '5 kg empty'
    },
    maintenance: {
      dailyCare: ['Empty and rinse', 'Wipe exterior', 'Check wheels'],
      weeklyMaintenance: ['Disinfect interior', 'Lubricate wringer'],
      monthlyInspection: ['Check for cracks', 'Test wringer mechanism'],
      replacementSchedule: 36,
      commonIssues: ['Wheel breakage', 'Wringer failure', 'Handle issues']
    },
    safetyCertifications: [],
    ergonomicFeatures: ['Non-marking casters', 'Ergonomic wringer handle', 'Pour spout'],
    vendorInfo: {
      manufacturer: 'MopTech Pro',
      model: 'MTP-DC-3600',
      warranty: '1 year',
      costRange: {
        min: 79.99,
        max: 129.99
      }
    },
    alternatives: ['Single chamber bucket', 'Flat mop bucket'],
    trainingRequired: false,
    storageRequirements: 'Clean, dry, inverted position'
  },
  
  // ============= SPECIALTY EQUIPMENT =============
  {
    id: 'equip-spray-001',
    name: 'Professional Spray Bottles (32 oz)',
    category: 'manual-tools',
    type: 'Spray Bottle',
    specifications: {
      size: '32 oz (946 ml)',
      material: 'HDPE plastic, polypropylene trigger',
      weight: '150 grams empty'
    },
    colorCoding: {
      available: ['Clear', 'Blue', 'Green', 'Yellow', 'Red'],
      recommended: {
        bathroom: 'Yellow',
        kitchen: 'Green',
        general: 'Blue',
        medical: 'Red'
      }
    },
    maintenance: {
      dailyCare: ['Rinse if changing chemicals', 'Check trigger function'],
      weeklyMaintenance: ['Clean trigger mechanism', 'Check for leaks'],
      monthlyInspection: ['Replace if trigger fails', 'Check labels'],
      replacementSchedule: 6,
      commonIssues: ['Trigger failure', 'Clogging', 'Label wear']
    },
    safetyCertifications: [],
    vendorInfo: {
      manufacturer: 'SprayTech',
      model: 'ST-PB-32',
      warranty: 'N/A',
      costRange: {
        min: 3.99,
        max: 6.99
      }
    },
    alternatives: ['Foam sprayers', 'Pump sprayers'],
    trainingRequired: false,
    storageRequirements: 'Upright position, labeled clearly'
  },
  {
    id: 'equip-duster-001',
    name: 'Extendable Microfiber Duster',
    category: 'manual-tools',
    type: 'Dusting Tool',
    specifications: {
      size: 'Extends 24" to 60"',
      material: 'Aluminum handle, microfiber head',
      weight: '300 grams'
    },
    maintenance: {
      dailyCare: ['Shake out dust', 'Store properly'],
      weeklyMaintenance: ['Wash microfiber head', 'Check extension mechanism'],
      monthlyInspection: ['Replace head if worn', 'Oil extension joints'],
      replacementSchedule: 6,
      commonIssues: ['Head detachment', 'Extension lock failure', 'Fiber matting']
    },
    safetyCertifications: [],
    ergonomicFeatures: ['Bendable head', 'Comfortable grip', 'Lightweight'],
    vendorInfo: {
      manufacturer: 'DustAway Pro',
      model: 'DAP-ED-60',
      warranty: '6 months',
      costRange: {
        min: 14.99,
        max: 24.99
      }
    },
    alternatives: ['Feather duster', 'Lambswool duster'],
    trainingRequired: false,
    storageRequirements: 'Hanging storage, head covered'
  },
  {
    id: 'equip-squeegee-001',
    name: 'Window Squeegee (14")',
    category: 'manual-tools',
    type: 'Window Cleaning',
    specifications: {
      size: '14" blade width',
      material: 'Stainless steel channel, rubber blade',
      weight: '200 grams'
    },
    maintenance: {
      dailyCare: ['Wipe blade clean', 'Check for nicks'],
      weeklyMaintenance: ['Clean channel', 'Flip or replace rubber'],
      monthlyInspection: ['Replace rubber if worn', 'Check handle security'],
      replacementSchedule: 3,
      commonIssues: ['Blade wear', 'Streaking', 'Handle loosening']
    },
    safetyCertifications: [],
    vendorInfo: {
      manufacturer: 'CrystalClear Tools',
      model: 'CCT-SQ-14',
      warranty: 'N/A',
      costRange: {
        min: 12.99,
        max: 19.99
      }
    },
    alternatives: ['Different sizes', 'Pivoting squeegees'],
    trainingRequired: false,
    storageRequirements: 'Blade protected, hung or laid flat'
  },
  
  // ============= WASTE MANAGEMENT =============
  {
    id: 'equip-waste-001',
    name: 'Heavy-Duty Trash Bags (55 gallon)',
    category: 'consumables',
    type: 'Waste Bags',
    specifications: {
      size: '55 gallon capacity',
      material: 'Linear low-density polyethylene',
      weight: '2.0 mil thickness'
    },
    maintenance: {
      dailyCare: ['Check for proper size', 'Ensure no overloading'],
      weeklyMaintenance: ['Monitor inventory'],
      monthlyInspection: ['Check for defects in batch'],
      replacementSchedule: 0, // Single use
      commonIssues: ['Tearing', 'Wrong size', 'Overfilling']
    },
    safetyCertifications: [],
    vendorInfo: {
      manufacturer: 'ToughBag Industries',
      model: 'TBI-55HD',
      warranty: 'N/A',
      costRange: {
        min: 24.99,
        max: 39.99
      }
    },
    alternatives: ['Different mil thickness', 'Recycled content bags'],
    trainingRequired: false,
    storageRequirements: 'Dry storage, away from sharp objects'
  },
  
  // ============= DISPENSERS & AMENITIES =============
  {
    id: 'equip-disp-001',
    name: 'Foam Soap Dispenser (Automatic)',
    category: 'restroom',
    type: 'Dispenser',
    specifications: {
      size: '1000ml capacity',
      material: 'ABS plastic',
      weight: '500 grams',
      powerRequirement: '4 AA batteries'
    },
    maintenance: {
      dailyCare: ['Check soap level', 'Wipe sensor'],
      weeklyMaintenance: ['Clean dispenser exterior', 'Test operation'],
      monthlyInspection: ['Replace batteries', 'Deep clean'],
      replacementSchedule: 36,
      commonIssues: ['Sensor failure', 'Battery drain', 'Clogging']
    },
    safetyCertifications: ['ADA compliant'],
    vendorInfo: {
      manufacturer: 'HygieneMax',
      model: 'HM-FSD-1000',
      warranty: '1 year',
      costRange: {
        min: 39.99,
        max: 59.99
      }
    },
    alternatives: ['Manual dispenser', 'Bulk soap dispenser'],
    trainingRequired: false,
    storageRequirements: 'Wall-mounted installation required'
  }
]

// Helper function to get equipment by ID
export function getEquipmentById(id: string): EquipmentSpecification | undefined {
  return equipmentDatabase.find(equip => equip.id === id)
}

// Helper function to get equipment by category
export function getEquipmentByCategory(category: string): EquipmentSpecification[] {
  return equipmentDatabase.filter(equip => equip.category === category)
}

// Helper function to get color-coded equipment
export function getColorCodedEquipment(area: 'bathroom' | 'kitchen' | 'general' | 'medical'): EquipmentSpecification[] {
  return equipmentDatabase.filter(equip => 
    equip.colorCoding && equip.colorCoding.recommended[area]
  )
}

// Helper function to calculate equipment replacement schedule
export function getEquipmentReplacementSchedule(): { 
  equipment: EquipmentSpecification; 
  dueIn: number 
}[] {
  const today = new Date()
  return equipmentDatabase
    .filter(equip => equip.maintenance.replacementSchedule > 0)
    .map(equip => ({
      equipment: equip,
      dueIn: equip.maintenance.replacementSchedule
    }))
    .sort((a, b) => a.dueIn - b.dueIn)
}