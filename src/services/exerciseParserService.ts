// ============================================================================
// Exercise Parser Service
// Parses individual exercise text into structured metadata
// ============================================================================

import {
  ExerciseMetadata,
  ExerciseModifiers,
  MovementPattern,
  MuscleGroup,
  RepClassification,
  RepScheme,
  GripDemand,
  ExercisePosition,
  FinisherType,
} from '../types/hierarchyTypes';
import { detectPrimaryPosition, detectPositions, hasPositionTransition } from './positionService';

// ============================================================================
// MOVEMENT PATTERN DETECTION
// ============================================================================

const MOVEMENT_PATTERNS: Record<MovementPattern, RegExp[]> = {
  push: [
    /chest\s*press/i,
    /push\s*up/i,
    /pushup/i,
    /shoulder\s*press/i,
    /tricep/i,
    /skull\s*crush/i,
    /close\s*grip/i,
    /incline\s*press/i,
    /overhead\s*press/i,
    /oh\s*press/i,
    /press/i,
  ],

  pull: [
    /row/i,
    /curl/i,
    /pullover/i,
    /pull\s*over/i,
    /high\s*pull/i,
    /hi\s*pull/i,
    /lat\s*pull/i,
    /reverse\s*fly/i,
  ],

  hinge: [
    /deadlift/i,
    /\bdl\b/i,
    /rdl/i,
    /sdl/i,
    /good\s*morning/i,
    /\bgm\b/i,
    /swing/i,
    /hip\s*hinge/i,
  ],

  squat: [
    /squat/i,
    /goblet/i,
    /sumo/i,
    /front\s*rack/i,
  ],

  lunge: [
    /lunge/i,
    /curtsy/i,
    /split\s*squat/i,
    /step\s*up/i,
    /lungster/i,
  ],

  rotation: [
    /russian\s*twist/i,
    /woodchop/i,
    /twist/i,
    /rotate/i,
    /windshield/i,
  ],

  plank: [
    /plank/i,
    /mountain\s*climber/i,
    /\bmc\b/i,
    /commando/i,
    /shoulder\s*tap/i,
    /hip\s*dip/i,
    /x\s*human/i,
  ],

  power: [
    /snatch/i,
    /clean/i,
    /burpee/i,
    /jump/i,
    /explosive/i,
    /power/i,
    /thruster/i,
  ],

  carry: [
    /carry/i,
    /farmer/i,
    /suitcase.*walk/i,
  ],
};

// ============================================================================
// MUSCLE GROUP DETECTION
// ============================================================================

const MUSCLE_PATTERNS: Record<MuscleGroup, RegExp[]> = {
  chest: [
    /chest/i,
    /\bfly\b/i,
    /push\s*up/i,
    /pushup/i,
  ],

  back: [
    /row/i,
    /pullover/i,
    /lat/i,
    /reverse\s*fly/i,
  ],

  shoulders: [
    /shoulder/i,
    /lateral\s*raise/i,
    /front\s*raise/i,
    /shrug/i,
    /upright/i,
  ],

  biceps: [
    /bicep/i,
    /curl(?!.*tricep)/i,
    /hammer(?!.*press)/i,
  ],

  triceps: [
    /tricep/i,
    /skull\s*crush/i,
    /overhead.*ext/i,
    /close\s*grip/i,
  ],

  quads: [
    /squat/i,
    /lunge/i,
    /step\s*up/i,
    /goblet/i,
  ],

  hamstrings: [
    /deadlift/i,
    /rdl/i,
    /good\s*morning/i,
    /\bgm\b/i,
    /curl.*leg/i,
  ],

  glutes: [
    /hip\s*thrust/i,
    /glute/i,
    /bridge/i,
  ],

  calves: [
    /calf/i,
    /calves/i,
  ],

  core: [
    /crunch/i,
    /situp/i,
    /sit\s*up/i,
    /plank/i,
    /toe\s*touch/i,
    /leg\s*lift/i,
    /jackknife/i,
    /hollow/i,
    /v\s*sit/i,
    /boat/i,
    /cherry\s*picker/i,
    /dead\s*bug/i,
  ],

  obliques: [
    /russian\s*twist/i,
    /oblique/i,
    /side.*plank/i,
    /windshield/i,
    /woodchop/i,
  ],

  full_body: [
    /burpee/i,
    /snatch/i,
    /clean/i,
    /thruster/i,
    /wgs/i,
    /world.*greatest/i,
  ],
};

// ============================================================================
// GRIP DEMAND DETECTION
// ============================================================================

const HIGH_GRIP_PATTERNS: RegExp[] = [
  /row/i,
  /deadlift/i,
  /\bdl\b/i,
  /rdl/i,
  /swing/i,
  /snatch/i,
  /clean/i,
  /farmer/i,
  /carry/i,
  /shrug/i,
];

const MEDIUM_GRIP_PATTERNS: RegExp[] = [
  /curl/i,
  /pull/i,
  /good\s*morning/i,
  /\bgm\b/i,
  /high\s*pull/i,
];

const NO_GRIP_PATTERNS: RegExp[] = [
  /plank/i,
  /pushup/i,
  /push\s*up/i,
  /mountain\s*climber/i,
  /commando/i,
  /burpee(?!.*snatch)/i,
  /crunch/i,
  /situp/i,
  /leg\s*lift/i,
  /toe\s*touch/i,
];

// ============================================================================
// REP CLASSIFICATION DETECTION
// ============================================================================

const REP_PATTERNS: Record<RepClassification, RegExp[]> = {
  amrap: [/amrap/i, /as\s*many/i],
  burnout: [/burn\s*out/i, /\bbo\b/i, /rep\s*out/i, /when\s*done/i],
  tempo: [/tempo/i, /slow/i, /controlled/i],
  hold: [/hold/i, /pause/i, /isometric/i, /:\s*hold/i],
  ladder: [/\+\d/, /-\d/, /\(\+/, /\(-/, /ladder/i, /pyramid/i],
  timed: [/\d+\s*sec/i, /\d+\s*seconds/i],
  fixed: [/^\d+\s+\w/, /\d+.*\d+.*\d+/], // e.g., "12 Squats" or "3 GM 3 Squats"
};

// ============================================================================
// MODIFIER PATTERNS
// ============================================================================

const MODIFIER_PATTERNS: Record<keyof ExerciseModifiers, RegExp> = {
  tempo: /tempo/i,
  alternating: /\balt\b|alternating/i,
  burnout: /\bbo\b|burn\s*out|rep\s*out/i,
  hold: /hold|pause/i,
  pulse: /pulse/i,
  heavy: /heavy/i,
  wide: /wide/i,
  narrow: /narrow|close\s*grip/i,
  singleArm: /single\s*arm|\b1\s*arm/i,
  incline: /incline/i,
  unilateral: /\bright\b|\bleft\b|\br\b|\bl\b/i,
};

// ============================================================================
// FINISHER DETECTION
// ============================================================================

const FINISHER_PATTERNS: { pattern: RegExp; type: FinisherType }[] = [
  { pattern: /burpee\s*snatch/i, type: 'snatches' },
  { pattern: /snatch/i, type: 'snatches' },
  { pattern: /weighted\s*burpee/i, type: 'weighted_burpees' },
  { pattern: /burpee/i, type: 'burpees' },
  { pattern: /hi\s*pull.*snatch|squat.*hi\s*pull/i, type: 'squat_to_hi_pull' },
  { pattern: /deadlift\s*clean\s*squat/i, type: 'deadlift_clean_squat' },
  { pattern: /db\s*swing|dumbbell\s*swing/i, type: 'db_swings' },
  { pattern: /amrap/i, type: 'amrap' },
  { pattern: /choice/i, type: 'choice' },
];

// ============================================================================
// PARSING FUNCTIONS
// ============================================================================

/**
 * Parse exercise text into structured metadata
 */
export function parseExercise(
  rawText: string,
  context: {
    minuteInBlock: number;
    minuteInRound: number;
    isBlockFinisher: boolean;
    isRoundFinisher: boolean;
  }
): ExerciseMetadata {
  const exercises = splitExercises(rawText);
  const positions = detectPositions(rawText);
  const primaryPosition = detectPrimaryPosition(rawText);
  const emomResult = detectEMOM(rawText);
  const ladderResult = detectLadder(rawText);

  return {
    id: generateExerciseId(rawText, context.minuteInRound),
    rawText,
    exercises,
    positions,
    primaryPosition,
    hasPositionTransition: hasPositionTransition(rawText),
    primaryMuscle: detectPrimaryMuscle(rawText),
    secondaryMuscles: detectSecondaryMuscles(rawText),
    movementPattern: detectMovementPattern(rawText),
    modifiers: extractModifiers(rawText),
    repClassification: detectRepClassification(rawText),
    repScheme: extractRepScheme(rawText),
    gripDemand: detectGripDemand(rawText),
    isFinisherMove: isFinisherMove(rawText),
    isPowerMove: isPowerMove(rawText),
    hasComboMovement: detectComboMovement(rawText),
    isEMOM: emomResult.isEMOM,
    emomNotation: emomResult.notation,
    splitType: detectSplitType(rawText),
    ladder: ladderResult,
    minuteInBlock: context.minuteInBlock,
    minuteInRound: context.minuteInRound,
    isBlockFinisher: context.isBlockFinisher,
    isRoundFinisher: context.isRoundFinisher,
    lastUsed: null,
    useCount: 0,
  };
}

/**
 * Split exercise text into individual exercises
 * Handles pipes, "to", and commas
 */
function splitExercises(text: string): string[] {
  // Split by pipe first
  const pipeSegments = text.split('|').map(s => s.trim());

  // Then split by " to " within each segment
  const exercises: string[] = [];
  for (const segment of pipeSegments) {
    const toSegments = segment.split(/\s+to\s+/i);
    for (const ex of toSegments) {
      if (ex.trim()) {
        exercises.push(ex.trim());
      }
    }
  }

  return exercises;
}

/**
 * Generate a unique ID for an exercise
 */
function generateExerciseId(text: string, minuteInRound: number): string {
  const normalized = text.toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 50);
  return `ex_${normalized}_m${minuteInRound}`;
}

/**
 * Detect primary muscle group
 */
function detectPrimaryMuscle(text: string): MuscleGroup {
  // Check in order of specificity
  for (const [muscle, patterns] of Object.entries(MUSCLE_PATTERNS)) {
    for (const pattern of patterns) {
      if (pattern.test(text)) {
        return muscle as MuscleGroup;
      }
    }
  }

  // Default based on position
  const position = detectPrimaryPosition(text);
  if (position === 'bench_laying') return 'chest';
  if (position === 'floor_laying') return 'core';

  return 'full_body';
}

/**
 * Detect secondary muscle groups
 */
function detectSecondaryMuscles(text: string): MuscleGroup[] {
  const primary = detectPrimaryMuscle(text);
  const secondary: Set<MuscleGroup> = new Set();

  for (const [muscle, patterns] of Object.entries(MUSCLE_PATTERNS)) {
    if (muscle === primary) continue;

    for (const pattern of patterns) {
      if (pattern.test(text)) {
        secondary.add(muscle as MuscleGroup);
        break;
      }
    }
  }

  // Limit to top 2 secondary muscles
  return Array.from(secondary).slice(0, 2);
}

/**
 * Detect movement pattern
 */
export function detectMovementPattern(text: string): MovementPattern {
  for (const [pattern, regexes] of Object.entries(MOVEMENT_PATTERNS)) {
    for (const regex of regexes) {
      if (regex.test(text)) {
        return pattern as MovementPattern;
      }
    }
  }

  return 'squat'; // Default to squat as most common
}

/**
 * Detect all movement patterns in a block
 */
export function detectMovementPatterns(texts: string[]): MovementPattern[] {
  const patterns: Set<MovementPattern> = new Set();

  for (const text of texts) {
    patterns.add(detectMovementPattern(text));
  }

  return Array.from(patterns);
}

/**
 * Extract exercise modifiers
 */
export function extractModifiers(text: string): ExerciseModifiers {
  const modifiers: ExerciseModifiers = {
    tempo: false,
    alternating: false,
    burnout: false,
    hold: false,
    pulse: false,
    heavy: false,
    wide: false,
    narrow: false,
    singleArm: false,
    incline: false,
    unilateral: null,
  };

  // Check each boolean modifier
  modifiers.tempo = MODIFIER_PATTERNS.tempo.test(text);
  modifiers.alternating = MODIFIER_PATTERNS.alternating.test(text);
  modifiers.burnout = MODIFIER_PATTERNS.burnout.test(text);
  modifiers.hold = MODIFIER_PATTERNS.hold.test(text);
  modifiers.pulse = MODIFIER_PATTERNS.pulse.test(text);
  modifiers.heavy = MODIFIER_PATTERNS.heavy.test(text);
  modifiers.wide = MODIFIER_PATTERNS.wide.test(text);
  modifiers.narrow = MODIFIER_PATTERNS.narrow.test(text);
  modifiers.singleArm = MODIFIER_PATTERNS.singleArm.test(text);
  modifiers.incline = MODIFIER_PATTERNS.incline.test(text);

  // Handle unilateral specially
  if (/\bright\b|\br\s+\w/i.test(text)) {
    modifiers.unilateral = 'right';
  } else if (/\bleft\b|\bl\s+\w/i.test(text)) {
    modifiers.unilateral = 'left';
  } else if (/r\/l|l\/r|e\/s|each\s*side/i.test(text)) {
    modifiers.unilateral = 'both';
  }

  return modifiers;
}

/**
 * Detect rep classification
 */
export function detectRepClassification(text: string): RepClassification {
  for (const [classification, patterns] of Object.entries(REP_PATTERNS)) {
    for (const pattern of patterns) {
      if (pattern.test(text)) {
        return classification as RepClassification;
      }
    }
  }

  return 'fixed'; // Default
}

/**
 * Extract rep scheme if present
 */
function extractRepScheme(text: string): RepScheme | undefined {
  // Look for patterns like "3-3-3", "6-4-2", "12"
  const match = text.match(/(\d+)(?:\s*[-,]\s*(\d+))?(?:\s*[-,]\s*(\d+))?/);

  if (match) {
    const [, first, second, third] = match;
    const nums = [first, second, third].filter(Boolean).map(Number);

    if (nums.length === 1) {
      return { type: 'fixed', pattern: first, totalReps: nums[0] };
    } else if (nums.length === 2) {
      return { type: 'fixed', pattern: `${first}-${second}`, totalReps: nums[0] + nums[1] };
    } else if (nums.length === 3) {
      // Determine pattern type
      if (nums[0] > nums[1] && nums[1] > nums[2]) {
        return { type: 'descending', pattern: nums.join('-'), totalReps: nums[0] + nums[1] + nums[2] };
      } else if (nums[0] < nums[1] && nums[1] < nums[2]) {
        return { type: 'ascending', pattern: nums.join('-'), totalReps: nums[0] + nums[1] + nums[2] };
      } else if (nums[0] === nums[1] && nums[1] === nums[2]) {
        return { type: 'triplet', pattern: nums.join('-'), totalReps: nums[0] + nums[1] + nums[2] };
      }
    }
  }

  // Check for ladder pattern
  if (/\+1|\(\+|\(-|-1/i.test(text)) {
    return { type: 'ladder', pattern: '+1' };
  }

  return undefined;
}

/**
 * Detect grip demand level
 */
export function detectGripDemand(text: string): GripDemand {
  // Check no-grip first
  for (const pattern of NO_GRIP_PATTERNS) {
    if (pattern.test(text)) {
      return 'none';
    }
  }

  // Check high grip
  for (const pattern of HIGH_GRIP_PATTERNS) {
    if (pattern.test(text)) {
      return 'high';
    }
  }

  // Check medium grip
  for (const pattern of MEDIUM_GRIP_PATTERNS) {
    if (pattern.test(text)) {
      return 'medium';
    }
  }

  return 'low';
}

/**
 * Calculate grip load score for a block (0-10)
 */
export function calculateGripLoadScore(texts: string[]): number {
  let score = 0;
  let gripMinutes = 0;

  for (const text of texts) {
    const demand = detectGripDemand(text);
    switch (demand) {
      case 'high':
        score += 3;
        gripMinutes++;
        break;
      case 'medium':
        score += 2;
        gripMinutes++;
        break;
      case 'low':
        score += 1;
        break;
      case 'none':
        break;
    }
  }

  // Normalize to 0-10 scale
  const normalized = Math.min(10, (score / texts.length) * 3.33);

  return Math.round(normalized * 10) / 10;
}

/**
 * Count grip-intensive minutes in a block
 */
export function countGripIntensiveMinutes(texts: string[]): number {
  let count = 0;
  for (const text of texts) {
    const demand = detectGripDemand(text);
    if (demand === 'high' || demand === 'medium') {
      count++;
    }
  }
  return count;
}

/**
 * Check if exercise is a finisher move
 */
export function isFinisherMove(text: string): boolean {
  for (const { pattern } of FINISHER_PATTERNS) {
    if (pattern.test(text)) {
      return true;
    }
  }
  return false;
}

/**
 * Detect finisher type
 */
export function detectFinisherType(text: string): FinisherType | null {
  for (const { pattern, type } of FINISHER_PATTERNS) {
    if (pattern.test(text)) {
      return type;
    }
  }
  return null;
}

/**
 * Check if exercise is a power move
 */
export function isPowerMove(text: string): boolean {
  return /snatch|clean|burpee|jump|explosive|power|thruster/i.test(text);
}

// ============================================================================
// COMBO MOVEMENT DETECTION
// ============================================================================

/**
 * False positive patterns - these contain "to" but are NOT combo movements
 */
const COMBO_FALSE_POSITIVES: RegExp[] = [
  /toe\s*touch/i,           // toe touch / toe touches
  /side\s+to\s+side/i,      // side to side
  /back\s+to\s+back/i,      // back to back
  /up\s+to\s+\d/i,          // up to [number]
  /down\s+to\s+\d/i,        // down to [number]
  /go\s+to\b/i,             // go to
  /close\s+to\b/i,          // close to
  /to\s+failure/i,          // to failure
];

/**
 * Detect if exercise text contains a combo movement (2+ exercises chained with "to")
 * Examples:
 *   "Squat to Press" → true
 *   "Good Morning to Squat to Lunge" → true
 *   "10 Barbell Curls (squat to press when done)" → true
 *   "Lat Pullover (+1) to Crunch" → true
 *   "Side to Side Lunges" → false (false positive)
 */
export function detectComboMovement(text: string): boolean {
  // Step 1: Clean the text
  // Remove (+1), (-1), etc. patterns
  let cleaned = text.replace(/\s*\([+-]\d+\)\s*/g, ' ');

  // Extract content from (X when done) parentheses - combos can be conditional
  const whenDoneMatch = cleaned.match(/\(([^)]+)\s+when\s+done\)/i);
  let extraContent = '';
  if (whenDoneMatch) {
    extraContent = whenDoneMatch[1];
    // Remove the "when done" part from main text
    cleaned = cleaned.replace(/\([^)]+\s+when\s+done\)/gi, '');
  }

  // Step 2: Split into segments using | and /
  // Note: We don't split on "then" when part of "when done" (already handled above)
  const segments = cleaned.split(/[|/]/)
    .map(s => s.trim())
    .filter(s => s.length > 0);

  // Add the "when done" content as an additional segment to check
  if (extraContent) {
    segments.push(extraContent);
  }

  // Step 3: Check each segment for combo pattern
  const comboPattern = /\b\w+\s+to\s+\w+\b/i;

  for (const segment of segments) {
    // First check if this segment matches any false positive pattern
    let isFalsePositive = false;
    for (const fp of COMBO_FALSE_POSITIVES) {
      if (fp.test(segment)) {
        isFalsePositive = true;
        break;
      }
    }

    if (isFalsePositive) {
      continue;
    }

    // Check if segment contains valid combo pattern
    if (comboPattern.test(segment)) {
      return true;
    }
  }

  return false;
}

// ============================================================================
// EMOM DETECTION
// ============================================================================

/**
 * Patterns that look like parentheses but are NOT EMOM
 */
const EMOM_EXCLUSIONS: RegExp[] = [
  /\(when\s+done\)/i,         // (when done)
  /\(finished\)/i,            // (finished)
  /\(done\)/i,                // (done)
  /\(optional[^)]*\)/i,       // (optional...)
  /\([+-]\d+\)/,              // (+1), (-2) - ladders
  /\([+-]\d+\s+to\s+\w+\)/i,  // (+1 to Squat) - targeted ladders
  /\(hold\)/i,                // (hold)
  /\(ladder\)/i,              // (ladder)
  /\([rl]\/[ld]\)/i,          // (r/l), (R/L/D)
  /\([rl]\)/i,                // (R), (L)
  /\(\d+\s+or\s+\d+\)/i,      // (8 or 12) - rep choices
  /\(core\)/i,                // Body part labels
  /\(biceps?\)/i,
  /\(triceps?\)/i,
  /\(chest\)/i,
  /\(back\)/i,
  /\(shoulders?\)/i,
  /\(legs?\)/i,
  /\(arms?\)/i,
  /\([^,)]+,\s*[^,)]+\)/i,    // Choices with commas: (MC, Snatches, Burpees)
];

/**
 * Check if parenthetical content is a valid exercise (for EMOM detection)
 */
function isExerciseInParens(parenContent: string): boolean {
  // Must have at least one recognizable exercise pattern
  const exercisePatterns = [
    /squat/i, /press/i, /row/i, /curl/i, /lunge/i, /deadlift/i,
    /pushup/i, /push\s*up/i, /snatch/i, /clean/i, /burpee/i,
    /plank/i, /crunch/i, /fly/i, /raise/i, /pull/i, /swing/i,
  ];

  return exercisePatterns.some(p => p.test(parenContent));
}

/**
 * Detect EMOM (Every Minute On the Minute) format
 * Returns { isEMOM, notation } or { isEMOM: false }
 */
export function detectEMOM(text: string): { isEMOM: boolean; notation?: 'double_slash' | 'parentheses' } {
  // Check for // notation
  if (/\/\//.test(text)) {
    return { isEMOM: true, notation: 'double_slash' };
  }

  // Check for Exercise (Exercise) pattern
  // First, find all parenthetical content
  const parenMatches = text.match(/\([^)]+\)/g);

  if (parenMatches) {
    for (const match of parenMatches) {
      // Check if this matches any exclusion
      const isExcluded = EMOM_EXCLUSIONS.some(excl => excl.test(match));
      if (isExcluded) continue;

      // Extract content without parens
      const content = match.slice(1, -1).trim();

      // Check if content looks like an exercise
      if (isExerciseInParens(content)) {
        return { isEMOM: true, notation: 'parentheses' };
      }
    }
  }

  return { isEMOM: false };
}

// ============================================================================
// SPLIT TIMING DETECTION
// ============================================================================

/**
 * Detect split timing type
 * | = 30/30 split (30 sec each)
 * / = 45/15 split (when between exercises, NOT R/L/D)
 */
export function detectSplitType(text: string): '30_30' | '45_15' | undefined {
  // Check for | first (30/30 split)
  if (/\|/.test(text)) {
    return '30_30';
  }

  // Check for / between exercises (45/15 split)
  // Exclude R/L/D patterns
  const rlPatterns = /[rl]\/[ld]/i;
  const slashMatch = text.match(/\w+\s*\/\s*\w+/);

  if (slashMatch && !rlPatterns.test(slashMatch[0])) {
    // Make sure it's between exercise-like content, not just numbers
    const beforeSlash = slashMatch[0].split('/')[0].trim();
    const afterSlash = slashMatch[0].split('/')[1].trim();

    // If both sides are just single letters (R/L/D pattern), skip
    if (beforeSlash.length === 1 && afterSlash.length === 1) {
      return undefined;
    }

    // If either side looks like an exercise, it's 45/15
    if (/[a-z]{2,}/i.test(beforeSlash) || /[a-z]{2,}/i.test(afterSlash)) {
      return '45_15';
    }
  }

  return undefined;
}

// ============================================================================
// LADDER DETECTION
// ============================================================================

/**
 * Detect ladder pattern (ascending/descending reps)
 * (-X) = descending, decrement by X
 * (+X) = ascending, increment by X
 * (+X to Y) or (-X to Y) = targeted, only Y changes
 */
export function detectLadder(text: string): {
  type: 'ascending' | 'descending';
  increment: number;
  target?: string;
  isTargeted: boolean;
} | undefined {
  // Check for targeted ladder first: (+X to Y) or (-X to Y)
  const targetedMatch = text.match(/\(([+-])(\d+)\s+to\s+(\w+(?:\s+\w+)*)\)/i);
  if (targetedMatch) {
    const [, sign, incStr, target] = targetedMatch;
    return {
      type: sign === '+' ? 'ascending' : 'descending',
      increment: parseInt(incStr, 10),
      target: target.trim(),
      isTargeted: true,
    };
  }

  // Check for simple ladder: (+X) or (-X)
  const simpleMatch = text.match(/\(([+-])(\d+)\)/);
  if (simpleMatch) {
    const [, sign, incStr] = simpleMatch;
    return {
      type: sign === '+' ? 'ascending' : 'descending',
      increment: parseInt(incStr, 10),
      isTargeted: false,
    };
  }

  return undefined;
}

/**
 * Check if block has grip breaks (non-grip exercises between grip-intensive ones)
 */
export function hasGripBreaks(texts: string[]): boolean {
  const demands = texts.map(t => detectGripDemand(t));

  // Look for pattern: high/medium -> none/low -> high/medium
  for (let i = 1; i < demands.length - 1; i++) {
    const prev = demands[i - 1];
    const curr = demands[i];
    const next = demands[i + 1];

    if (
      (prev === 'high' || prev === 'medium') &&
      (curr === 'none' || curr === 'low') &&
      (next === 'high' || next === 'medium')
    ) {
      return true;
    }
  }

  return false;
}
