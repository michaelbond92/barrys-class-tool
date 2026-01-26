// ============================================================================
// Generation Rules
// Extracted from Barry's class patterns and user feedback
//
// STATUS KEY:
//   [CONFIRMED] - Verified by user
//   [UNCONFIRMED] - Needs user verification
//   [REJECTED] - User said this is wrong
// ============================================================================

export interface Rule {
  id: string;
  category: 'tread' | 'floor' | 'structure' | 'reps' | 'intensity' | 'equipment' | 'warmup' | 'timing';
  description: string;
  status: 'confirmed' | 'unconfirmed' | 'rejected';
  details?: string;
  examples?: string[];
  dataSource?: string; // e.g., "49 classes, 984 exercises analyzed"
}

export const GENERATION_RULES: Rule[] = [
  // ============================================================================
  // TREAD RULES
  // ============================================================================
  {
    id: 'tread-001',
    category: 'tread',
    status: 'confirmed',
    description: 'Always start Round 1 tread with "5 - 7" pace for light jog',
    details: 'The idea is to start at an easy pace and build from there. Round 2 is typically the same but doesn\'t need to be.',
    examples: ['Min 1-2: 5 - 7, then build to 6 - 8'],
  },
  {
    id: 'tread-002',
    category: 'tread',
    status: 'confirmed',
    description: 'Tread speeds are in ranges of 3 numbers, always 1 point apart, never exceeding 9 - 11',
    details: 'Range spans 3 speeds with 1.0 increments. 9 - 11 is the max and can be labeled as SPRINT. Decimals allowed.',
    examples: [
      '5 - 7',
      '5.5 - 7.5',
      '8 - 10',
      '8.2 - 10.2',
      '8.4 - 10.4',
      '9 - 11 (SPRINT)',
      '9 - 11+',
    ],
  },
  {
    id: 'tread-003',
    category: 'tread',
    status: 'confirmed',
    description: 'Tread patterns typically hold for 2-3 minutes, but can be 1-4 minutes',
    details: 'A "run" is defined as: start of round to recovery, between two recoveries, or recovery to end of round. Can have 1 min jog before sprint, or rare 4 min runs.',
    examples: [
      '5 - 7 for 2-3 min, then 6 - 8 for 2-3 min',
      '5 - 8 | SPRINT (1 min jog then sprint)',
      '5 - 8 | 9 - 11',
      '5 - 8 | 9 - 11+',
    ],
  },
  {
    id: 'tread-004',
    category: 'tread',
    status: 'confirmed',
    description: 'Never start with "ACTIVE REST" or "RECOVER" - start with actual jog pace',
    details: 'The first minutes should be a light jog to warm up, not recovery.',
  },
  {
    id: 'tread-005',
    category: 'tread',
    status: 'confirmed',
    description: 'Incline and speed have low correlation; lower speeds generally pair with higher inclines',
    details: 'Lower speeds (5-7) often correlate with higher inclines (6%+), but not always. Starting a round may have jog + lower incline. Incline can build, come off, and come on again within a single run.',
    examples: [
      '5 - 7 @ 6%',
      '5 - 7 @ 4% building to 8%',
      'Start: 5 - 7 @ 2%, build incline mid-run',
    ],
  },

  // ============================================================================
  // WARMUP RULES
  // ============================================================================
  {
    id: 'warmup-001',
    category: 'warmup',
    status: 'confirmed',
    description: 'Warmup blocks are 3-4 minutes, mixing stretches and progressive movements',
    details: 'Start with stretch warmups (GMS, WGS, Cat/Cow) then progress to movements (push-ups, plank jacks, mountain climbers, burpees).',
    examples: [
      'Min 1: 3 GMS, Min 2: 3 WGS, Min 3: 3 Push-ups + 3 Squats, Min 4: Plank Jacks',
      'Stretch → Movement → More intense movement',
    ],
  },
  {
    id: 'warmup-002',
    category: 'warmup',
    status: 'confirmed',
    description: 'Warmup reps are typically 3-4 per exercise',
    details: 'Lower rep counts for warmup. Can occasionally use ladders in warmup.',
    examples: ['3 GMS', '3 Squats', '4 Push-ups', '3/4/5 ladder (rare)'],
  },

  // ============================================================================
  // FLOOR RULES - INTENSITY
  // ============================================================================
  {
    id: 'floor-001',
    category: 'intensity',
    status: 'confirmed',
    description: 'Intense WEIGHTED moves only in last 20% of R1 or anytime in R2',
    details: 'Applies to weighted power moves (Clean to Press, Snatches with dumbbells, Weighted Burpees, Thrusters). Bodyweight intense moves like Burpees can appear anytime but typically at end of block/round.',
    examples: [
      'In 14-min R1: weighted power moves only min 12-14',
      'Bodyweight burpees: end of any block',
      'R2: weighted power moves OK after warmup',
    ],
  },
  {
    id: 'floor-002',
    category: 'intensity',
    status: 'confirmed',
    description: 'Intense moves CAN be back-to-back but max 2 minutes, and should flow into each other',
    details: 'Consecutive intense moves should build on each other logically. Example: Squat to High Pull → Snatch (snatch builds on the squat to high pull pattern).',
    examples: [
      'Min 10: Squat to High Pull, Min 11: Snatch (flows)',
      'Max 2 consecutive intense minutes',
    ],
  },

  // ============================================================================
  // REP RULES
  // ============================================================================
  {
    id: 'reps-001',
    category: 'reps',
    status: 'confirmed',
    description: 'Rep ladders change by 1 or 2 only (up or down)',
    details: 'For ladder style, reps go 12 → 10 → 8 (by -2) or 10 → 9 → 8 (by -1). Can also go UP: 8 → 10 → 12 (+2) or 8 → 9 → 10 (+1). Never change by 4.',
    examples: ['12 (-2)', '10 (-1)', '8 (+2)', '6 (+1)', 'NOT: 16 → 12'],
  },
  {
    id: 'reps-002',
    category: 'reps',
    status: 'confirmed',
    description: 'Standard rep ranges: 8, 10, or 12. Warmup: 3-4. Power: 6-8.',
    details: 'Main work uses 8-12 reps. Warmup exercises use 3-4 reps. Power/finisher moves use 6-8 reps.',
    examples: ['8 Chest Press', '10 Rows', '3 GMS (warmup)', '6 Snatches (power)'],
  },
  {
    id: 'reps-003',
    category: 'reps',
    status: 'confirmed',
    description: 'Intense exercises get fewer reps (6-8) or AMRAP structure',
    details: 'Power moves should be 6-8 reps max, or structured as AMRAP with no defined rep count.',
    examples: ['6 Clean to Press', '8 Snatches', 'AMRAP Burpees'],
  },

  // ============================================================================
  // CLASS STRUCTURE RULES
  // ============================================================================
  {
    id: 'structure-001',
    category: 'structure',
    status: 'confirmed',
    description: 'Total class time is ~40-42 minutes',
    details: 'Each round is done twice (groups swap between tread and floor).',
  },
  {
    id: 'structure-002',
    category: 'structure',
    status: 'confirmed',
    description: 'Round 1 + Round 2 durations should sum to 20-21 minutes',
    details: 'Since each round is done twice: (R1 + R2) x 2 = 40-42 min total.',
    examples: ['12 + 8 = 20 min → 40 min class', '14 + 7 = 21 min → 42 min class'],
  },
  {
    id: 'structure-003',
    category: 'structure',
    status: 'confirmed',
    description: 'Round 1 is typically longer than Round 2',
    details: 'Common splits: 12/8, 14/6, 13/7, 11/9, 10/10.',
  },

  // ============================================================================
  // EXERCISE SEQUENCING RULES
  // ============================================================================
  {
    id: 'sequence-001',
    category: 'floor',
    status: 'confirmed',
    description: 'Avoid repeating same exercise within 3 minutes UNLESS building on it',
    details: 'Can repeat if doing: max rep counts, 30/30 on/off structure, or progressive building.',
    examples: [
      'OK: Chest Press → (2 min) → Chest Press with ladder',
      'OK: 30s Squats | 30s Rest | 30s Squats',
      'Avoid: Random repeat within 3 min',
    ],
  },
  {
    id: 'sequence-002',
    category: 'floor',
    status: 'confirmed',
    description: 'Compound movements CAN be back-to-back in later rounds, but avoid INTENSE compounds back-to-back',
    details: 'Regular compounds (Squat to Press, Lunge to Curl) can be consecutive. Intense compounds (Clean to Press, Thrusters) should not be back-to-back.',
    examples: [
      'OK: Squat to Press → Deadlift to Row (later in round)',
      'Avoid: Clean to Press → Thrusters back-to-back',
    ],
  },

  // ============================================================================
  // EQUIPMENT RULES
  // ============================================================================
  {
    id: 'equipment-001',
    category: 'equipment',
    status: 'confirmed',
    description: 'Heavy weights do NOT mean lower reps - standard 8-12 rep ranges still apply',
    details: 'Heavy weights are about load, not rep count. Still use normal rep ranges.',
    examples: ['10 Heavy Chest Press', '8 Heavy Deadlift', '12 Heavy Rows'],
  },
  {
    id: 'equipment-002',
    category: 'equipment',
    status: 'confirmed',
    description: 'Medium weights are associated with secondary muscle groups and multiple compound movements',
    details: 'Mediums used for: secondary muscles (biceps, triceps, shoulders), multiple compound moves in a round. If round has heavy compound movement, pair with medium weights for other exercises.',
    examples: [
      'Heavy Deadlift + Medium Rows in same round',
      'Mediums for bicep/tricep work',
      'Multiple compound moves = mediums',
    ],
  },
  {
    id: 'equipment-003',
    category: 'equipment',
    status: 'confirmed',
    description: 'Any weight can be paired with tempo work',
    details: 'Tempo is a modifier that can apply to heavies, mediums, or lights.',
    examples: ['Tempo Heavy Chest Press', 'Tempo Medium Rows'],
  },

  // ============================================================================
  // TIMING RULES (Data-backed from 49 classes, 984 exercises)
  // ============================================================================
  {
    id: 'timing-001',
    category: 'timing',
    status: 'confirmed',
    description: 'Warmup exercises (WGS, GMS, Good Morning) appear in first 25% of round',
    details: '98% of warmup exercises appear in first 25% of round. Average placement is 12% through round. Almost exclusively in R1 (98%), rarely in R2.',
    examples: [
      'WGS at minute 1 of 11-min round (9%)',
      'GMS at minute 2 of 12-min round (17%)',
    ],
    dataSource: '56 warmup exercises from 49 classes',
  },
  {
    id: 'timing-002',
    category: 'timing',
    status: 'confirmed',
    description: 'Power moves (Snatch, DB Swing, Thruster) appear in last 25% of round',
    details: '80% of power moves appear in last 25% of round. Average placement is 90% through round. In R1: 93% placement, in R2: 88% placement.',
    examples: [
      'Snatches at minute 10 of 11-min round (91%)',
      'DB Swings at minute 11 of 12-min round (92%)',
    ],
    dataSource: '100 power exercises from 49 classes',
  },
  {
    id: 'timing-003',
    category: 'timing',
    status: 'confirmed',
    description: 'Burpees appear differently by round - mid-round in R1, very end in R2',
    details: 'In R1: burpees average 51% through round (middle). In R2: burpees average 98% through round (almost always last exercise). Overall 69% in last quarter.',
    examples: [
      'R1: Burpees at minute 6 of 12 (50%)',
      'R2: Burpees at minute 8 of 8 (100%)',
    ],
    dataSource: '48 burpee exercises from 49 classes',
  },
  {
    id: 'timing-004',
    category: 'timing',
    status: 'confirmed',
    description: 'Core exercises (Plank, Crunch, etc.) appear in middle of rounds',
    details: 'Average placement 59% through round. Only 8% in first quarter, 69% in middle 50%. Later in R2 (69%) than R1 (45%).',
    examples: [
      'Plank at minute 5 of 10-min round (50%)',
      'Russian Twist at minute 7 of 11-min round (64%)',
    ],
    dataSource: '93 core exercises from 49 classes',
  },
  {
    id: 'timing-005',
    category: 'timing',
    status: 'confirmed',
    description: 'Compound movements (to Press, to Row) appear in later half of rounds',
    details: 'Average placement 66% through round. 39% in last quarter. Evenly distributed between R1 (68%) and R2 (64%).',
    examples: [
      'Squat to Press at minute 7 of 11-min round (64%)',
      'Deadlift to Row at minute 8 of 12-min round (67%)',
    ],
    dataSource: '127 compound exercises from 49 classes',
  },
  {
    id: 'timing-006',
    category: 'timing',
    status: 'confirmed',
    description: 'Split timing (30/30, etc.) is evenly distributed throughout rounds',
    details: 'Split format with "|" appears at average 55% through round. Distribution: 22% first quarter, 50% middle, 28% last quarter. Not a timing rule, just variety pattern.',
    examples: [
      'Fast Feet | Burpees',
      'Tempo Wide Squat | DB Swings',
      'Plank | Snatches',
    ],
    dataSource: 'Common pattern across 49 classes',
  },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getRulesByCategory(category: Rule['category']): Rule[] {
  return GENERATION_RULES.filter(r => r.category === category);
}

export function getConfirmedRules(): Rule[] {
  return GENERATION_RULES.filter(r => r.status === 'confirmed');
}

export function getUnconfirmedRules(): Rule[] {
  return GENERATION_RULES.filter(r => r.status === 'unconfirmed');
}

export function getRejectedRules(): Rule[] {
  return GENERATION_RULES.filter(r => r.status === 'rejected');
}

// ============================================================================
// RULE APPLICATION HELPERS
// ============================================================================

/** Check if a tread speed range is valid (3 numbers, 1 apart, max 9-11) */
export function isValidTreadRange(low: number, high: number): boolean {
  const diff = high - low;
  return diff === 2 && high <= 11;
}

/** Check if minute index is in warmup zone (first 3-4 min) */
export function isWarmupMinute(minuteIndex: number): boolean {
  return minuteIndex < 4;
}

/** Check if minute index is in power zone for Round 1 (last 20%) */
export function isPowerZoneR1(minuteIndex: number, roundDuration: number): boolean {
  return minuteIndex >= Math.floor(roundDuration * 0.8);
}

/** Get appropriate rep count based on exercise type and minute */
export function getRepCount(
  isWarmup: boolean,
  isPowerMove: boolean,
  isAmrap: boolean
): number | 'AMRAP' {
  if (isAmrap) return 'AMRAP';
  if (isWarmup) return 3 + Math.floor(Math.random() * 2); // 3-4
  if (isPowerMove) return 6 + Math.floor(Math.random() * 3); // 6-8
  return 8 + Math.floor(Math.random() * 3) * 2; // 8, 10, or 12
}

/** Format tread speed range */
export function formatTreadRange(base: number): string {
  return `${base} - ${base + 2}`;
}

/** Check if two exercises flow into each other (for back-to-back intense moves) */
export function exercisesFlow(exercise1: string, exercise2: string): boolean {
  const flowPairs: [string, string][] = [
    ['squat to high pull', 'snatch'],
    ['high pull', 'snatch'],
    ['clean', 'press'],
    ['deadlift', 'row'],
    ['squat', 'press'],
  ];

  const e1 = exercise1.toLowerCase();
  const e2 = exercise2.toLowerCase();

  return flowPairs.some(([a, b]) =>
    (e1.includes(a) && e2.includes(b)) || (e1.includes(b) && e2.includes(a))
  );
}

// ============================================================================
// TIMING HELPERS (Data-backed placement percentages)
// ============================================================================

export type ExerciseType = 'warmup' | 'power' | 'burpee' | 'core' | 'compound' | 'standard';

/** Detect exercise type from text */
export function detectExerciseType(exercise: string): ExerciseType {
  const text = exercise.toLowerCase();

  if (/\b(wgs|gms|good morning|cat cow|hip opener|inchworm)\b/.test(text)) {
    return 'warmup';
  }
  if (/\b(snatch|clean to press|clean and press|thruster|db swing|kb swing)\b/.test(text)) {
    return 'power';
  }
  if (/burpee/.test(text)) {
    return 'burpee';
  }
  if (/\b(plank|crunch|situp|sit up|russian twist|dead bug|hollow|v up|bicycle)\b/.test(text)) {
    return 'core';
  }
  if (/\b(to press|to row|to curl|to hi pull|to high pull)\b/.test(text)) {
    return 'compound';
  }
  return 'standard';
}

/** Get ideal placement percentage for exercise type */
export function getIdealPlacement(type: ExerciseType, roundNumber: 1 | 2): { min: number; ideal: number; max: number } {
  switch (type) {
    case 'warmup':
      return { min: 0, ideal: 12, max: 25 };
    case 'power':
      return { min: 75, ideal: 90, max: 100 };
    case 'burpee':
      return roundNumber === 1
        ? { min: 30, ideal: 51, max: 70 }  // R1: mid-round
        : { min: 85, ideal: 98, max: 100 }; // R2: very end
    case 'core':
      return roundNumber === 1
        ? { min: 30, ideal: 45, max: 70 }
        : { min: 50, ideal: 69, max: 85 };
    case 'compound':
      return { min: 40, ideal: 66, max: 90 };
    default:
      return { min: 20, ideal: 50, max: 80 };
  }
}

/** Check if an exercise is well-placed within a round */
export function isWellPlaced(
  exercise: string,
  minuteIndex: number,
  roundDuration: number,
  roundNumber: 1 | 2
): boolean {
  const type = detectExerciseType(exercise);
  const placement = getIdealPlacement(type, roundNumber);
  const percentThrough = ((minuteIndex + 1) / roundDuration) * 100;

  return percentThrough >= placement.min && percentThrough <= placement.max;
}
