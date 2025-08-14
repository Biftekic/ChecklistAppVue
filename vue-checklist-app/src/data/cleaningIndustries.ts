export interface CleaningTask {
  id: string
  name: string
  description: string
  timeEstimate: string // e.g., "5-10 minutes"
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'as-needed'
  category: string
  supplies: string[]
  instructions: string[]
  safetyNotes?: string[]
  standards?: string[]
}

export interface TemplateSection {
  id: string
  name: string
  description: string
  tasks: CleaningTask[]
  estimatedTime: string
}

export interface IndustryTemplate {
  id: string
  name: string
  icon: string
  description: string
  regulations: string[]
  certifications: string[]
  sections: TemplateSection[]
  equipment: string[]
  chemicals: string[]
}

export const industries: IndustryTemplate[] = [
  {
    id: 'office',
    name: 'Office/Commercial',
    icon: '🏢',
    description: 'Professional office and commercial building cleaning',
    regulations: ['OSHA workplace safety', 'EPA regulations', 'BOMA standards'],
    certifications: ['ISSA CIMS', 'Green Seal', 'OSHA safety training'],
    sections: [
      {
        id: 'office-reception',
        name: 'Reception & Lobby',
        description: 'Main entrance and reception areas',
        estimatedTime: '20-30 minutes',
        tasks: [
          {
            id: 'office-reception-1',
            name: 'Clean entrance doors',
            description: 'Clean glass doors inside and out',
            timeEstimate: '5 minutes',
            frequency: 'daily',
            category: 'Entrance',
            supplies: ['Glass cleaner', 'Microfiber cloths', 'Squeegee'],
            instructions: [
              'Spray glass cleaner on door',
              'Wipe with microfiber cloth in S-pattern',
              'Use squeegee for streak-free finish',
              'Clean door handles with disinfectant'
            ],
            safetyNotes: ['Watch for wet floors'],
            standards: ['ISSA 447 - Entrance cleaning']
          },
          {
            id: 'office-reception-2',
            name: 'Vacuum entrance mats',
            description: 'Vacuum and spot clean entrance mats',
            timeEstimate: '3 minutes',
            frequency: 'daily',
            category: 'Floors',
            supplies: ['HEPA vacuum', 'Spot cleaner'],
            instructions: [
              'Vacuum both sides of mat',
              'Check for stains and spot clean',
              'Ensure mat lies flat'
            ]
          },
          {
            id: 'office-reception-3',
            name: 'Dust reception desk',
            description: 'Dust and sanitize reception desk area',
            timeEstimate: '5 minutes',
            frequency: 'daily',
            category: 'Surfaces',
            supplies: ['Microfiber cloth', 'All-purpose cleaner', 'Disinfectant'],
            instructions: [
              'Remove items from desk',
              'Dust all surfaces',
              'Apply disinfectant to high-touch areas',
              'Clean computer and phone'
            ],
            safetyNotes: ['Avoid liquid near electronics']
          }
        ]
      },
      {
        id: 'office-workspaces',
        name: 'Private Offices',
        description: 'Individual office spaces',
        estimatedTime: '15-25 minutes each',
        tasks: [
          {
            id: 'office-workspace-1',
            name: 'Empty trash bins',
            description: 'Empty and reline all trash receptacles',
            timeEstimate: '2 minutes',
            frequency: 'daily',
            category: 'Waste',
            supplies: ['Trash bags', 'Gloves'],
            instructions: [
              'Remove full bag and tie securely',
              'Check for spills in bin',
              'Insert new liner',
              'Transport waste to disposal area'
            ]
          },
          {
            id: 'office-workspace-2',
            name: 'Clean desk surfaces',
            description: 'Dust and disinfect desk and work surfaces',
            timeEstimate: '5 minutes',
            frequency: 'daily',
            category: 'Surfaces',
            supplies: ['Microfiber cloth', 'Electronics cleaner', 'Disinfectant'],
            instructions: [
              'Move papers to safe area (do not read)',
              'Dust all surfaces',
              'Clean keyboard and mouse',
              'Disinfect phone and high-touch areas',
              'Return items to original position'
            ],
            safetyNotes: ['Never move confidential documents', 'Use electronics-safe cleaners only']
          }
        ]
      },
      {
        id: 'office-restrooms',
        name: 'Restrooms',
        description: 'Complete restroom sanitization',
        estimatedTime: '20-30 minutes',
        tasks: [
          {
            id: 'office-restroom-1',
            name: 'Clean and disinfect toilets',
            description: 'Thorough toilet cleaning and sanitization',
            timeEstimate: '5 minutes per unit',
            frequency: 'daily',
            category: 'Fixtures',
            supplies: ['Toilet bowl cleaner', 'Disinfectant', 'Toilet brush', 'Gloves'],
            instructions: [
              'Apply toilet bowl cleaner under rim',
              'Let sit for 2 minutes',
              'Scrub with toilet brush',
              'Flush and repeat if needed',
              'Disinfect seat, handle, and exterior'
            ],
            safetyNotes: ['Wear gloves', 'Ensure adequate ventilation'],
            standards: ['CDC restroom guidelines']
          }
        ]
      }
    ],
    equipment: [
      'HEPA filter vacuum (<70dB)',
      'Microfiber mop system',
      'Dual-compartment mop bucket',
      'Janitorial cart with lock',
      'Extendable duster',
      'Electronics cleaning kit'
    ],
    chemicals: [
      'pH-neutral all-purpose cleaner',
      'EPA List N disinfectant',
      'Glass cleaner (ammonia-based)',
      '70% isopropyl alcohol',
      'Neutral floor cleaner',
      'Toilet bowl cleaner'
    ]
  },
  {
    id: 'medical',
    name: 'Medical/Healthcare',
    icon: '🏥',
    description: 'Healthcare facility cleaning with infection control',
    regulations: ['CDC guidelines', 'OSHA bloodborne pathogens', 'HIPAA compliance'],
    certifications: ['Healthcare cleaning certification', 'Bloodborne pathogen training'],
    sections: [
      {
        id: 'medical-patient-room',
        name: 'Patient Rooms',
        description: 'Standard patient room cleaning protocol',
        estimatedTime: '30-45 minutes',
        tasks: [
          {
            id: 'medical-room-1',
            name: 'Terminal cleaning protocol',
            description: 'Complete disinfection of patient room',
            timeEstimate: '30 minutes',
            frequency: 'as-needed',
            category: 'Disinfection',
            supplies: ['Hospital-grade disinfectant', 'Microfiber cloths', 'PPE'],
            instructions: [
              'Don full PPE',
              'Remove all linens and disposables',
              'Clean from cleanest to dirtiest areas',
              'Apply disinfectant with proper dwell time',
              'Clean all high-touch surfaces',
              'Terminal clean bathroom'
            ],
            safetyNotes: ['Follow infection control protocols', 'Use proper PPE'],
            standards: ['CDC environmental cleaning guidelines']
          }
        ]
      }
    ],
    equipment: [
      'UV-C disinfection device',
      'Microfiber system (color-coded)',
      'HEPA vacuum',
      'Isolation cart'
    ],
    chemicals: [
      'EPA List K disinfectants',
      'Quaternary ammonium compounds',
      'Hydrogen peroxide cleaners',
      'Bleach solution (1:10)'
    ]
  },
  {
    id: 'hospitality',
    name: 'Hospitality/Hotel',
    icon: '🏨',
    description: 'Hotel and hospitality cleaning standards',
    regulations: ['Health department codes', 'Brand standards', 'AAA requirements'],
    certifications: ['Hospitality cleaning certification'],
    sections: [
      {
        id: 'hotel-guest-room',
        name: 'Guest Rooms',
        description: 'Standard guest room turnover',
        estimatedTime: '25-35 minutes',
        tasks: [
          {
            id: 'hotel-room-1',
            name: 'Strip and remake bed',
            description: 'Complete bed linen change',
            timeEstimate: '8 minutes',
            frequency: 'daily',
            category: 'Bedding',
            supplies: ['Fresh linens', 'Mattress protector'],
            instructions: [
              'Strip all bedding',
              'Check mattress for stains',
              'Apply fresh sheets with hospital corners',
              'Add blanket and bedspread',
              'Fluff and arrange pillows'
            ],
            standards: ['Brand standards for bed presentation']
          }
        ]
      }
    ],
    equipment: [
      'Housekeeping cart',
      'Vacuum with HEPA filter',
      'Steam cleaner',
      'Microfiber system'
    ],
    chemicals: [
      'Multi-surface cleaner',
      'Glass cleaner',
      'Bathroom disinfectant',
      'Fabric refresher'
    ]
  },
  {
    id: 'residential',
    name: 'Residential',
    icon: '🏠',
    description: 'Home and apartment cleaning',
    regulations: ['Local health codes', 'EPA safer choice'],
    certifications: ['Residential cleaning certification'],
    sections: [
      {
        id: 'residential-kitchen',
        name: 'Kitchen',
        description: 'Complete kitchen cleaning',
        estimatedTime: '30-45 minutes',
        tasks: [
          {
            id: 'residential-kitchen-1',
            name: 'Clean appliances',
            description: 'Clean all kitchen appliances inside and out',
            timeEstimate: '15 minutes',
            frequency: 'weekly',
            category: 'Appliances',
            supplies: ['Degreaser', 'Microfiber cloths', 'Stainless steel cleaner'],
            instructions: [
              'Clean microwave inside and out',
              'Wipe down refrigerator exterior',
              'Clean stovetop and oven door',
              'Polish stainless steel surfaces'
            ]
          }
        ]
      }
    ],
    equipment: [
      'Vacuum cleaner',
      'Mop and bucket',
      'Cleaning caddy',
      'Extension duster'
    ],
    chemicals: [
      'All-purpose cleaner',
      'Degreaser',
      'Glass cleaner',
      'Disinfectant'
    ]
  },
  {
    id: 'industrial',
    name: 'Industrial/Warehouse',
    icon: '🏭',
    description: 'Industrial facility and warehouse cleaning',
    regulations: ['OSHA industrial standards', 'EPA regulations'],
    certifications: ['Industrial cleaning certification', 'Hazmat training'],
    sections: [
      {
        id: 'industrial-floor',
        name: 'Warehouse Floor',
        description: 'Industrial floor cleaning',
        estimatedTime: '2-3 hours per 10,000 sq ft',
        tasks: [
          {
            id: 'industrial-floor-1',
            name: 'Sweep and scrub floors',
            description: 'Industrial floor cleaning with auto-scrubber',
            timeEstimate: '60 minutes per 5000 sq ft',
            frequency: 'daily',
            category: 'Floors',
            supplies: ['Auto-scrubber', 'Industrial degreaser', 'Push broom'],
            instructions: [
              'Pre-sweep loose debris',
              'Fill auto-scrubber with cleaning solution',
              'Scrub in overlapping passes',
              'Check for oil spills and treat',
              'Allow to dry completely'
            ],
            safetyNotes: ['Wear steel-toe boots', 'Use wet floor signs']
          }
        ]
      }
    ],
    equipment: [
      'Auto-scrubber',
      'Industrial vacuum',
      'Pressure washer',
      'Spill kit'
    ],
    chemicals: [
      'Industrial degreaser',
      'Heavy-duty floor cleaner',
      'Concrete cleaner',
      'Oil absorbent'
    ]
  },
  {
    id: 'restaurant',
    name: 'Restaurant/Food Service',
    icon: '🍽️',
    description: 'Restaurant and food service area cleaning',
    regulations: ['FDA food code', 'Local health department', 'HACCP'],
    certifications: ['Food safety certification', 'ServSafe'],
    sections: [
      {
        id: 'restaurant-kitchen',
        name: 'Commercial Kitchen',
        description: 'Complete kitchen sanitization',
        estimatedTime: '2-3 hours',
        tasks: [
          {
            id: 'restaurant-kitchen-1',
            name: 'Deep clean cooking equipment',
            description: 'Clean grills, fryers, and cooking surfaces',
            timeEstimate: '45 minutes',
            frequency: 'daily',
            category: 'Equipment',
            supplies: ['Degreaser', 'Grill cleaner', 'Scrub pads', 'Sanitizer'],
            instructions: [
              'Turn off and cool equipment',
              'Apply degreaser',
              'Scrub all surfaces',
              'Rinse thoroughly',
              'Apply sanitizer solution',
              'Air dry'
            ],
            safetyNotes: ['Ensure equipment is cool', 'Use heat-resistant gloves'],
            standards: ['FDA Food Code 4-602.11']
          }
        ]
      }
    ],
    equipment: [
      'Commercial dishwasher',
      'Steam cleaner',
      'Floor scrubber',
      'Sanitizer test strips'
    ],
    chemicals: [
      'Food-safe degreaser',
      'Quaternary sanitizer',
      'Dish detergent',
      'Oven cleaner'
    ]
  },
  {
    id: 'retail',
    name: 'Retail/Store',
    icon: '🛍️',
    description: 'Retail store and shopping area cleaning',
    regulations: ['Local health codes', 'ADA compliance'],
    certifications: ['Retail cleaning certification'],
    sections: [
      {
        id: 'retail-sales-floor',
        name: 'Sales Floor',
        description: 'Customer area cleaning',
        estimatedTime: '1-2 hours',
        tasks: [
          {
            id: 'retail-floor-1',
            name: 'Clean display fixtures',
            description: 'Dust and clean all display units',
            timeEstimate: '30 minutes',
            frequency: 'daily',
            category: 'Displays',
            supplies: ['Microfiber cloths', 'Glass cleaner', 'All-purpose cleaner'],
            instructions: [
              'Dust all shelving units',
              'Clean glass display cases',
              'Wipe down counters',
              'Organize displays as needed'
            ]
          }
        ]
      }
    ],
    equipment: [
      'Floor buffer',
      'Carpet cleaner',
      'Window cleaning kit',
      'Dust mop'
    ],
    chemicals: [
      'Neutral floor cleaner',
      'Glass cleaner',
      'Carpet spotter',
      'Air freshener'
    ]
  },
  {
    id: 'education',
    name: 'Educational Facilities',
    icon: '🎓',
    description: 'Schools and educational institution cleaning',
    regulations: ['CDC school guidelines', 'State education codes'],
    certifications: ['School cleaning certification'],
    sections: [
      {
        id: 'education-classroom',
        name: 'Classrooms',
        description: 'Standard classroom cleaning',
        estimatedTime: '20-30 minutes',
        tasks: [
          {
            id: 'education-class-1',
            name: 'Sanitize desks and chairs',
            description: 'Clean and disinfect all student desks',
            timeEstimate: '15 minutes',
            frequency: 'daily',
            category: 'Furniture',
            supplies: ['Disinfectant', 'Microfiber cloths'],
            instructions: [
              'Clear desk surfaces',
              'Apply disinfectant',
              'Wipe all surfaces including undersides',
              'Clean chair backs and seats',
              'Allow proper dwell time'
            ],
            standards: ['CDC guidance for schools']
          }
        ]
      }
    ],
    equipment: [
      'Backpack vacuum',
      'Microfiber system',
      'Electrostatic sprayer',
      'Floor scrubber'
    ],
    chemicals: [
      'EPA List N disinfectant',
      'Neutral cleaner',
      'Glass cleaner',
      'Floor finish'
    ]
  }
]