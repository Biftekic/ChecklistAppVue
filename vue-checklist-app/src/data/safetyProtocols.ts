import type { SafetyRequirement, PPERequirement, Hazard, EmergencyProcedure } from '@/types/cleaning.types'

export const safetyProtocolsDatabase: SafetyRequirement[] = [
  // ============= CHEMICAL SAFETY PROTOCOLS =============
  {
    id: 'safety-chem-001',
    category: 'chemical',
    severity: 'high',
    ppe: [
      {
        type: 'gloves',
        specification: 'Nitrile gloves, minimum 5 mil thickness',
        mandatory: true
      },
      {
        type: 'goggles',
        specification: 'Chemical splash goggles with indirect venting',
        mandatory: true
      },
      {
        type: 'apron',
        specification: 'Chemical-resistant vinyl apron',
        mandatory: false,
        condition: 'When mixing concentrated chemicals'
      }
    ],
    hazards: [
      {
        type: 'Chemical burn',
        description: 'Contact with concentrated acids or bases can cause severe burns',
        likelihood: 'possible',
        severity: 'major',
        controls: [
          'Always wear appropriate PPE',
          'Never mix chemicals',
          'Follow dilution instructions exactly',
          'Have eyewash station accessible'
        ]
      },
      {
        type: 'Toxic vapor inhalation',
        description: 'Mixing incompatible chemicals can create toxic vapors',
        likelihood: 'unlikely',
        severity: 'catastrophic',
        controls: [
          'Never mix different chemicals',
          'Ensure adequate ventilation',
          'Know chemical compatibility',
          'Have SDS sheets available'
        ]
      }
    ],
    emergencyProcedures: [
      {
        scenario: 'Chemical splash to eyes',
        steps: [
          'Immediately flush eyes at eyewash station for 15 minutes',
          'Hold eyelids open while flushing',
          'Remove contact lenses if present',
          'Seek medical attention immediately',
          'Bring SDS sheet to medical facility'
        ],
        contactInfo: 'Emergency: 911, Poison Control: 1-800-222-1222',
        equipmentNeeded: ['Eyewash station', 'SDS sheets']
      },
      {
        scenario: 'Chemical spill',
        steps: [
          'Alert others in area',
          'Contain spill with absorbent materials',
          'Ventilate area',
          'Wear appropriate PPE for cleanup',
          'Dispose of contaminated materials properly',
          'Report incident to supervisor'
        ],
        equipmentNeeded: ['Spill kit', 'PPE', 'Ventilation fan']
      }
    ],
    oshaCompliance: {
      standard: '29 CFR 1910.1200',
      requirement: 'Hazard Communication Standard',
      documentation: ['SDS sheets', 'Chemical inventory', 'Training records']
    },
    training: {
      required: ['Hazard Communication', 'PPE usage', 'Emergency procedures'],
      recommended: ['Chemical compatibility', 'Spill response'],
      certificationNeeded: true,
      renewalPeriod: 12
    },
    signage: [
      'Chemical storage area',
      'PPE required',
      'No mixing zone',
      'Emergency shower/eyewash location'
    ],
    lockoutTagout: false,
    confinedSpace: false,
    workingAtHeight: false
  },
  
  // ============= BIOLOGICAL HAZARD PROTOCOLS =============
  {
    id: 'safety-bio-001',
    category: 'biological',
    severity: 'critical',
    ppe: [
      {
        type: 'gloves',
        specification: 'Nitrile gloves, double-layer for high-risk areas',
        mandatory: true
      },
      {
        type: 'face-shield',
        specification: 'Full face shield for splash protection',
        mandatory: true,
        condition: 'When cleaning bodily fluids'
      },
      {
        type: 'coveralls',
        specification: 'Disposable coveralls for contaminated areas',
        mandatory: false,
        condition: 'For known infectious disease areas'
      },
      {
        type: 'respirator',
        specification: 'N95 minimum for airborne pathogens',
        mandatory: false,
        condition: 'In isolation rooms or pandemic protocols'
      }
    ],
    hazards: [
      {
        type: 'Bloodborne pathogen exposure',
        description: 'Contact with blood or bodily fluids can transmit diseases',
        likelihood: 'possible',
        severity: 'major',
        controls: [
          'Universal precautions for all bodily fluids',
          'Proper PPE at all times',
          'Immediate decontamination procedures',
          'Hepatitis B vaccination'
        ]
      },
      {
        type: 'Needlestick injury',
        description: 'Accidental puncture from improperly disposed sharps',
        likelihood: 'unlikely',
        severity: 'major',
        controls: [
          'Never pick up sharps by hand',
          'Use mechanical tools',
          'Report all sharps immediately',
          'Sharps container for disposal'
        ]
      }
    ],
    emergencyProcedures: [
      {
        scenario: 'Bloodborne pathogen exposure',
        steps: [
          'Wash exposed area immediately with soap and water',
          'Flush mucous membranes with water',
          'Report to supervisor immediately',
          'Seek medical evaluation within 2 hours',
          'Document exposure incident',
          'Follow up with occupational health'
        ],
        contactInfo: 'Occupational Health: ext. 5555, Emergency: 911',
        equipmentNeeded: ['First aid kit', 'Incident report forms']
      }
    ],
    oshaCompliance: {
      standard: '29 CFR 1910.1030',
      requirement: 'Bloodborne Pathogens Standard',
      documentation: ['Exposure control plan', 'Training records', 'Vaccination records']
    },
    training: {
      required: ['Bloodborne pathogens', 'Universal precautions', 'PPE usage'],
      recommended: ['Infection control', 'Waste handling'],
      certificationNeeded: true,
      renewalPeriod: 12
    },
    signage: [
      'Biohazard warning',
      'PPE required',
      'Authorized personnel only'
    ]
  },
  
  // ============= SLIP/TRIP/FALL PROTOCOLS =============
  {
    id: 'safety-phys-001',
    category: 'physical',
    severity: 'high',
    ppe: [
      {
        type: 'boots',
        specification: 'Non-slip sole, closed-toe safety shoes',
        mandatory: true
      },
      {
        type: 'high-visibility',
        specification: 'High-visibility vest in parking areas',
        mandatory: false,
        condition: 'When working in traffic areas'
      }
    ],
    hazards: [
      {
        type: 'Slip on wet floor',
        description: 'Wet floors during and after cleaning pose slip hazard',
        likelihood: 'likely',
        severity: 'moderate',
        controls: [
          'Always use wet floor signs',
          'Clean in sections to allow dry path',
          'Wear non-slip footwear',
          'Mop with dry pass',
          'Check for leaks and spills'
        ]
      },
      {
        type: 'Trip over equipment',
        description: 'Cords, hoses, and equipment can cause trips',
        likelihood: 'possible',
        severity: 'moderate',
        controls: [
          'Keep walkways clear',
          'Proper cord management',
          'Good lighting in all areas',
          'Mark changes in elevation'
        ]
      },
      {
        type: 'Fall from height',
        description: 'Falling from ladders or step stools',
        likelihood: 'unlikely',
        severity: 'major',
        controls: [
          'Three-point contact rule',
          'Inspect ladder before use',
          'Never exceed weight limit',
          'Have spotter for high work'
        ]
      }
    ],
    emergencyProcedures: [
      {
        scenario: 'Slip and fall injury',
        steps: [
          'Do not move injured person unless in immediate danger',
          'Call for help immediately',
          'Check for consciousness and breathing',
          'Apply first aid as trained',
          'Document incident thoroughly',
          'Preserve scene for investigation'
        ],
        contactInfo: 'Emergency: 911, Supervisor: immediate notification',
        equipmentNeeded: ['First aid kit', 'Emergency contact list']
      }
    ],
    training: {
      required: ['Slip/trip/fall prevention', 'Ladder safety'],
      recommended: ['First aid/CPR'],
      certificationNeeded: false,
      renewalPeriod: 24
    },
    signage: [
      'Wet floor signs',
      'Caution tape',
      'Watch your step signs'
    ],
    workingAtHeight: true
  },
  
  // ============= ERGONOMIC SAFETY PROTOCOLS =============
  {
    id: 'safety-ergo-001',
    category: 'ergonomic',
    severity: 'medium',
    ppe: [
      {
        type: 'gloves',
        specification: 'Padded gloves for vibration reduction',
        mandatory: false,
        condition: 'When using vibrating equipment'
      }
    ],
    hazards: [
      {
        type: 'Repetitive strain injury',
        description: 'Repeated motions can cause musculoskeletal disorders',
        likelihood: 'likely',
        severity: 'moderate',
        controls: [
          'Rotate tasks every 2 hours',
          'Use proper lifting techniques',
          'Take regular breaks',
          'Use ergonomic tools',
          'Stretch before and during shift'
        ]
      },
      {
        type: 'Back injury from lifting',
        description: 'Improper lifting can cause back injuries',
        likelihood: 'possible',
        severity: 'major',
        controls: [
          'Lift with legs, not back',
          'Get help for heavy items (>50 lbs)',
          'Use mechanical aids when available',
          'Keep load close to body',
          'Avoid twisting while lifting'
        ]
      }
    ],
    emergencyProcedures: [
      {
        scenario: 'Back injury',
        steps: [
          'Stop work immediately',
          'Report to supervisor',
          'Apply ice to affected area',
          'Seek medical evaluation',
          'Complete injury report',
          'Follow return-to-work protocol'
        ],
        contactInfo: 'Occupational Health: ext. 5555',
        equipmentNeeded: ['Ice packs', 'Incident forms']
      }
    ],
    training: {
      required: ['Proper lifting techniques', 'Ergonomics awareness'],
      recommended: ['Stretching exercises', 'Body mechanics'],
      certificationNeeded: false,
      renewalPeriod: 24
    },
    signage: [
      'Lift with care',
      'Team lift required',
      'Maximum weight signs'
    ]
  },
  
  // ============= ELECTRICAL SAFETY PROTOCOLS =============
  {
    id: 'safety-elec-001',
    category: 'electrical',
    severity: 'high',
    ppe: [
      {
        type: 'gloves',
        specification: 'Insulated gloves for electrical work',
        mandatory: false,
        condition: 'Only qualified personnel'
      }
    ],
    hazards: [
      {
        type: 'Electrical shock',
        description: 'Contact with exposed wires or faulty equipment',
        likelihood: 'unlikely',
        severity: 'catastrophic',
        controls: [
          'Inspect cords before use',
          'Never use damaged equipment',
          'Keep liquids away from outlets',
          'Unplug equipment before cleaning',
          'Report electrical issues immediately'
        ]
      },
      {
        type: 'Arc flash',
        description: 'Electrical arc from faulty equipment',
        likelihood: 'rare',
        severity: 'catastrophic',
        controls: [
          'Only qualified personnel work on electrical',
          'Proper lockout/tagout procedures',
          'Maintain safe distance',
          'Use GFCI outlets in wet areas'
        ]
      }
    ],
    emergencyProcedures: [
      {
        scenario: 'Electrical shock',
        steps: [
          'Do not touch victim if still in contact with electricity',
          'Turn off power source if safe to do so',
          'Call 911 immediately',
          'Begin CPR if trained and victim is unconscious',
          'Use AED if available',
          'Document incident'
        ],
        contactInfo: 'Emergency: 911, Facilities: ext. 4444',
        equipmentNeeded: ['AED', 'First aid kit', 'Circuit breaker location map']
      }
    ],
    oshaCompliance: {
      standard: '29 CFR 1910.303-308',
      requirement: 'Electrical Safety Standards',
      documentation: ['Equipment inspection logs', 'Incident reports']
    },
    training: {
      required: ['Electrical safety awareness'],
      recommended: ['Lockout/tagout', 'CPR/AED'],
      certificationNeeded: false,
      renewalPeriod: 24
    },
    signage: [
      'High voltage',
      'Electrical hazard',
      'Authorized personnel only'
    ],
    lockoutTagout: true
  },
  
  // ============= CONFINED SPACE PROTOCOLS =============
  {
    id: 'safety-conf-001',
    category: 'environmental',
    severity: 'critical',
    ppe: [
      {
        type: 'respirator',
        specification: 'Supplied air respirator',
        mandatory: true,
        condition: 'In permit-required confined spaces'
      },
      {
        type: 'hard-hat',
        specification: 'Impact-resistant hard hat',
        mandatory: true
      },
      {
        type: 'hearing-protection',
        specification: 'Earplugs or earmuffs',
        mandatory: false,
        condition: 'If noise levels exceed 85 dB'
      }
    ],
    hazards: [
      {
        type: 'Oxygen deficiency',
        description: 'Low oxygen levels in confined spaces',
        likelihood: 'possible',
        severity: 'catastrophic',
        controls: [
          'Atmospheric testing before entry',
          'Continuous monitoring',
          'Ventilation equipment',
          'Rescue plan in place',
          'Never enter without permit'
        ]
      },
      {
        type: 'Toxic atmosphere',
        description: 'Buildup of toxic gases',
        likelihood: 'possible',
        severity: 'catastrophic',
        controls: [
          'Air quality testing',
          'Proper ventilation',
          'Respiratory protection',
          'Buddy system',
          'Emergency evacuation plan'
        ]
      }
    ],
    emergencyProcedures: [
      {
        scenario: 'Confined space emergency',
        steps: [
          'Do not enter space to rescue',
          'Call 911 and confined space rescue team',
          'Use retrieval system if in place',
          'Monitor atmospheric conditions',
          'Provide information to rescue team',
          'Keep area clear for emergency responders'
        ],
        contactInfo: 'Emergency: 911, Confined Space Team: ext. 6666',
        equipmentNeeded: ['Atmospheric monitor', 'Retrieval equipment', 'Ventilation fan']
      }
    ],
    oshaCompliance: {
      standard: '29 CFR 1910.146',
      requirement: 'Permit-Required Confined Spaces',
      documentation: ['Entry permits', 'Atmospheric test results', 'Training records']
    },
    training: {
      required: ['Confined space entry', 'Atmospheric testing', 'Rescue procedures'],
      recommended: ['CPR/First Aid'],
      certificationNeeded: true,
      renewalPeriod: 12
    },
    signage: [
      'Danger - Confined Space',
      'Entry by Permit Only',
      'Authorized Personnel Only'
    ],
    confinedSpace: true
  }
]

// Helper functions for safety protocols
export function getSafetyProtocolById(id: string): SafetyRequirement | undefined {
  return safetyProtocolsDatabase.find(protocol => protocol.id === id)
}

export function getSafetyProtocolsByCategory(category: string): SafetyRequirement[] {
  return safetyProtocolsDatabase.filter(protocol => protocol.category === category)
}

export function getSafetyProtocolsBySeverity(severity: string): SafetyRequirement[] {
  return safetyProtocolsDatabase.filter(protocol => protocol.severity === severity)
}

export function getRequiredPPE(protocolId: string): PPERequirement[] {
  const protocol = getSafetyProtocolById(protocolId)
  return protocol ? protocol.ppe.filter(ppe => ppe.mandatory) : []
}

export function getEmergencyProcedures(hazardType: string): EmergencyProcedure[] {
  const procedures: EmergencyProcedure[] = []
  safetyProtocolsDatabase.forEach(protocol => {
    protocol.emergencyProcedures.forEach(proc => {
      if (proc.scenario.toLowerCase().includes(hazardType.toLowerCase())) {
        procedures.push(proc)
      }
    })
  })
  return procedures
}

export function getTrainingRequirements(): { 
  protocol: SafetyRequirement; 
  training: string[]; 
  renewal: number | undefined 
}[] {
  return safetyProtocolsDatabase
    .filter(protocol => protocol.training.certificationNeeded)
    .map(protocol => ({
      protocol,
      training: protocol.training.required,
      renewal: protocol.training.renewalPeriod
    }))
}