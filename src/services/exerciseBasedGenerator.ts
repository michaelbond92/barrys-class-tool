// ============================================================================
// Exercise-Based Generator
// Generates classes from individual exercises rather than remixing blocks
// Follows Barry's style: flow, vibe matching, progression patterns
// ============================================================================

import {
  ClassPlan,
  Round,
  TreadEntry,
  FloorEntry,
  GeneratorConfig,
  EnergyLevel,
  Equipment
} from '../types';
import { generateId } from '../utils/dateUtils';
import { formatMinuteRange } from '../utils/formatUtils';
import { calculateTreadAverage, parseTreadEntry } from './treadParser';
import {
  ExerciseIndex,
  IndexedExercise,
  buildExerciseIndex,
  loadExerciseIndex,
  saveExerciseIndex,
  findExercises,
  findExercisesForTread,
  getNextExercises,
  calculateIntensityScore,
  TreadContext,
  parseNLPrompt,
  scoreExerciseForPrompt,
  NLParseResult,
  RoundConstraints,
} from './exerciseIndexingService';
import {
  selectContextualWarmup,
  shouldRequireWgsAndCatCow,
  hasWgsAndCatCow,
} from './warmupSelectionService';
import { detectPrimaryPosition } from './positionService';
import { ExercisePosition } from '../types/hierarchyTypes';
import { loadIndexFromStorage } from './indexingService';
import { calculateFreshness } from './usageTrackingService';

// ============================================================================
// VIBE CONFIGURATION
// These rates control how often special notation/formats appear
// Based on analysis of imported Barry's class data
// ============================================================================

interface VibeConfig {
  comboMovementChance: number;    // 0.15-0.25 - how often to create combo moves
  emomChance: number;             // 0.05-0.10 - how often to use EMOM notation
  ladderChance: number;           // 0.10-0.15 - how often to add ladder patterns
  split30Chance: number;          // 0.05 - how often to use 30/30 split
  split45Chance: number;          // 0.05 - how often to use 45/15 split
  powerMoveMinRate: number;       // 0.15-0.20 - minimum power move frequency
  forceFinisher: boolean;         // true - ensure rounds end with finisher
}

const DEFAULT_VIBE_CONFIG: VibeConfig = {
  comboMovementChance: 0.25,  // Increased from 0.20 to better match target
  emomChance: 0.10,           // Increased from 0.08
  ladderChance: 0.15,         // Increased from 0.12
  split30Chance: 0.08,        // Increased from 0.06
  split45Chance: 0.08,        // Increased from 0.06
  powerMoveMinRate: 0.18,
  forceFinisher: true,
};

/**
 * Adjust vibe config based on NL preferences
 * If user says "lots of combos", increase combo chance
 * If user says "no EMOM", set emom chance to 0
 */
function adjustVibeConfig(base: VibeConfig, nlParsed?: NLParseResult): VibeConfig {
  if (!nlParsed?.vibePreferences) return base;

  const adjusted = { ...base };
  const prefs = nlParsed.vibePreferences;

  // Combos: true = boost to 0.5, false = set to 0
  if (prefs.combos === true) {
    adjusted.comboMovementChance = 0.5;
  } else if (prefs.combos === false) {
    adjusted.comboMovementChance = 0;
  }

  // EMOM: true = boost to 0.25, false = set to 0
  if (prefs.emom === true) {
    adjusted.emomChance = 0.25;
  } else if (prefs.emom === false) {
    adjusted.emomChance = 0;
  }

  // Ladders: true = boost to 0.35, false = set to 0
  if (prefs.ladders === true) {
    adjusted.ladderChance = 0.35;
  } else if (prefs.ladders === false) {
    adjusted.ladderChance = 0;
  }

  // Splits: true = boost both to 0.2, false = set to 0
  if (prefs.splits === true) {
    adjusted.split30Chance = 0.2;
    adjusted.split45Chance = 0.2;
  } else if (prefs.splits === false) {
    adjusted.split30Chance = 0;
    adjusted.split45Chance = 0;
  }

  return adjusted;
}

// Combo movement templates
const COMBO_TEMPLATES = [
  { base: 'squat', add: 'press', template: '{count} Squat to Press' },
  { base: 'squat', add: 'curl', template: '{count} Squat to Curl' },
  { base: 'deadlift', add: 'row', template: '{count} Deadlift to Row' },
  { base: 'rdl', add: 'row', template: '{count} RDL to Row' },
  { base: 'clean', add: 'press', template: '{count} Clean to Press' },
  { base: 'lunge', add: 'curl', template: '{count} Lunge to Curl' },
  { base: 'goblet', add: 'press', template: '{count} Goblet Squat to Press' },
];

// Finisher exercises (for end of rounds)
const FINISHER_EXERCISES = [
  '6 Single Arm Snatch R/L',
  '8 Clean to Press',
  '4 Burpees',
  '8 Thruster',
  '6 KB Swings',
  '8 Power Cleans',
  '6 Snatch R/L',
];

// ============================================================================
// TYPES
// ============================================================================

interface GenerationContext {
  roundNumber: 1 | 2;
  minuteIndex: number;
  totalMinutes: number;
  currentPosition: ExercisePosition;
  previousExercise: string | null;
  usedExercises: Set<string>;
  targetIntensity: number;
  treadContext: TreadContext;
  equipment: Equipment;
  nlParsed?: NLParseResult;  // Parsed NL prompt for scoring
  roundConstraints?: RoundConstraints;  // Per-round constraints from NL
}

interface TreadProfile {
  baseSpeed: number;
  maxSpeed: number;
  hasIncline: boolean;
  maxIncline: number;
  recoverCount: number;
  sprintCount: number;
}

// ============================================================================
// POSITION TRANSITION COSTS
// Lower cost = smoother transition
// ============================================================================

const TRANSITION_COSTS: Record<ExercisePosition, Record<ExercisePosition, number>> = {
  floor_standing: {
    floor_standing: 0,
    floor_laying: 1,
    bench_laying: 2,
    bench_sitting: 2,
    bench_front: 2,
    bench_back: 2,
    bench_straddling: 1,
    bench_standing: 1,
  },
  floor_laying: {
    floor_standing: 1,
    floor_laying: 0,
    bench_laying: 2,
    bench_sitting: 2,
    bench_front: 2,
    bench_back: 2,
    bench_straddling: 2,
    bench_standing: 2,
  },
  bench_laying: {
    floor_standing: 2,
    floor_laying: 2,
    bench_laying: 0,
    bench_sitting: 1,
    bench_front: 2,
    bench_back: 2,
    bench_straddling: 2,
    bench_standing: 2,
  },
  bench_sitting: {
    floor_standing: 2,
    floor_laying: 2,
    bench_laying: 1,
    bench_sitting: 0,
    bench_front: 1,
    bench_back: 1,
    bench_straddling: 1,
    bench_standing: 1,
  },
  bench_front: {
    floor_standing: 2,
    floor_laying: 2,
    bench_laying: 2,
    bench_sitting: 1,
    bench_front: 0,
    bench_back: 2,
    bench_straddling: 1,
    bench_standing: 1,
  },
  bench_back: {
    floor_standing: 2,
    floor_laying: 2,
    bench_laying: 2,
    bench_sitting: 1,
    bench_front: 2,
    bench_back: 0,
    bench_straddling: 2,
    bench_standing: 2,
  },
  bench_straddling: {
    floor_standing: 1,
    floor_laying: 2,
    bench_laying: 2,
    bench_sitting: 1,
    bench_front: 1,
    bench_back: 2,
    bench_straddling: 0,
    bench_standing: 1,
  },
  bench_standing: {
    floor_standing: 1,
    floor_laying: 2,
    bench_laying: 2,
    bench_sitting: 1,
    bench_front: 1,
    bench_back: 2,
    bench_straddling: 1,
    bench_standing: 0,
  },
};

// ============================================================================
// VIBE FORMATTING FUNCTIONS
// Apply Barry's style notation to exercises
// ============================================================================

/**
 * Try to create a combo movement from a base exercise
 */
function tryCreateCombo(exerciseName: string, repCount: number): string | null {
  const lowerName = exerciseName.toLowerCase();

  for (const combo of COMBO_TEMPLATES) {
    if (lowerName.includes(combo.base)) {
      return combo.template.replace('{count}', String(repCount));
    }
  }
  return null;
}

/**
 * Format exercise with EMOM notation
 * Pairs current exercise with a compatible secondary exercise
 */
function formatAsEMOM(primaryExercise: string, secondaryExercise: string | null): string {
  if (!secondaryExercise) return primaryExercise;

  // Use // notation for EMOM
  const primaryReps = primaryExercise.match(/^\d+/)?.[0] || '8';
  const primaryName = primaryExercise.replace(/^\d+\s*/, '').trim();
  const secondaryReps = secondaryExercise.match(/^\d+/)?.[0] || '8';
  const secondaryName = secondaryExercise.replace(/^\d+\s*/, '').trim();

  return `${primaryReps} ${primaryName} // ${secondaryReps} ${secondaryName}`;
}

/**
 * Add ladder notation to exercise
 */
function formatWithLadder(exercise: string, ascending: boolean): string {
  // Extract reps if present
  const repMatch = exercise.match(/^(\d+)\s+(.+)$/);
  if (!repMatch) return exercise;

  const reps = repMatch[1];
  const name = repMatch[2];
  const increment = ascending ? '+2' : '-2';

  return `${reps} ${name} (${increment})`;
}

/**
 * Format exercise with 30/30 split (two exercises with pipe)
 */
function formatAsSplit30(primaryExercise: string, secondaryExercise: string): string {
  const primaryReps = primaryExercise.match(/^\d+/)?.[0] || '8';
  const primaryName = primaryExercise.replace(/^\d+\s*/, '').trim();
  const secondaryReps = secondaryExercise.match(/^\d+/)?.[0] || '8';
  const secondaryName = secondaryExercise.replace(/^\d+\s*/, '').trim();

  return `${primaryReps} ${primaryName} | ${secondaryReps} ${secondaryName}`;
}

/**
 * Format exercise with 45/15 split (exercise / hold or squeeze)
 */
function formatAsSplit45(exercise: string): string {
  const reps = exercise.match(/^\d+/)?.[0] || '8';
  const name = exercise.replace(/^\d+\s*/, '').trim();

  // Choose hold variant based on exercise type
  const holdType = Math.random() < 0.5 ? 'Hold' : 'Squeeze';
  return `${reps} ${name} / ${holdType}`;
}

/**
 * Check if exercise is a power move
 */
function isPowerExercise(exercise: string): boolean {
  return /\b(snatch|clean|swing|burpee|jump|power|explosive|thruster)\b/i.test(exercise);
}

/**
 * Apply vibe formatting to exercise based on config and context
 */
function applyVibeFormatting(
  exercise: string,
  context: GenerationContext,
  vibeConfig: VibeConfig,
  secondaryExercise: string | null = null
): string {
  // Don't apply to warmup exercises
  if (context.roundNumber === 1 && context.minuteIndex < 3) {
    return exercise;
  }

  // Don't apply multiple formats
  if (exercise.includes('//') || exercise.includes('|') || exercise.includes('(+') || exercise.includes('(-')) {
    return exercise;
  }

  // Get rep count from exercise or default to 8
  const repCount = parseInt(exercise.match(/^\d+/)?.[0] || '8', 10);

  // Try combo movement
  if (Math.random() < vibeConfig.comboMovementChance) {
    const combo = tryCreateCombo(exercise, repCount);
    if (combo) return combo;
  }

  // Try EMOM notation
  if (secondaryExercise && Math.random() < vibeConfig.emomChance) {
    return formatAsEMOM(exercise, secondaryExercise);
  }

  // Try 30/30 split
  if (secondaryExercise && Math.random() < vibeConfig.split30Chance) {
    return formatAsSplit30(exercise, secondaryExercise);
  }

  // Try 45/15 split
  if (Math.random() < vibeConfig.split45Chance) {
    return formatAsSplit45(exercise);
  }

  // Try ladder (more common near end of blocks)
  const isBlockEnd = context.minuteIndex % 3 === 2;
  const ladderChance = isBlockEnd ? vibeConfig.ladderChance * 1.5 : vibeConfig.ladderChance;
  if (Math.random() < ladderChance) {
    const ascending = Math.random() < 0.5;
    return formatWithLadder(exercise, ascending);
  }

  return exercise;
}

/**
 * Select a finisher exercise for round end
 */
function selectFinisher(usedExercises: Set<string>): string {
  // Prefer finishers that haven't been used
  const available = FINISHER_EXERCISES.filter(f => {
    const normalized = f.toLowerCase().replace(/\d+\s*/g, '').trim();
    return !usedExercises.has(normalized);
  });

  const options = available.length > 0 ? available : FINISHER_EXERCISES;
  return options[Math.floor(Math.random() * options.length)];
}

// ============================================================================
// INTENSITY CURVE
// Defines target intensity at each point in the round
// ============================================================================

function getTargetIntensity(minuteIndex: number, totalMinutes: number, roundNumber: number): number {
  const progress = minuteIndex / totalMinutes;

  if (roundNumber === 1) {
    // Round 1: Warmup (0-25%) -> Build (25-85%) -> Peak (85-100%)
    if (progress < 0.25) return 20 + (progress / 0.25) * 30; // 20 -> 50
    if (progress < 0.85) return 50 + ((progress - 0.25) / 0.6) * 30; // 50 -> 80
    return 80 + ((progress - 0.85) / 0.15) * 20; // 80 -> 100
  } else {
    // Round 2: Build immediately (0-85%) -> Peak (85-100%)
    if (progress < 0.85) return 50 + (progress / 0.85) * 35; // 50 -> 85
    return 85 + ((progress - 0.85) / 0.15) * 15; // 85 -> 100
  }
}

// ============================================================================
// EXERCISE SELECTION
// ============================================================================

/**
 * Select the best exercise for the current context
 */
function selectExercise(
  index: ExerciseIndex,
  context: GenerationContext
): IndexedExercise | null {
  // Get candidates that match the tread context
  let candidates = findExercisesForTread(index, context.treadContext);

  // Filter by intensity range (±20 from target)
  const minIntensity = Math.max(0, context.targetIntensity - 20);
  const maxIntensity = Math.min(100, context.targetIntensity + 20);
  candidates = candidates.filter(e =>
    e.intensityScore >= minIntensity && e.intensityScore <= maxIntensity
  );

  // Filter out already used exercises (prefer variety)
  const freshCandidates = candidates.filter(e => !context.usedExercises.has(e.normalizedName));
  if (freshCandidates.length > 0) {
    candidates = freshCandidates;
  }

  // Apply round-specific constraints
  if (context.roundConstraints) {
    const rc = context.roundConstraints;

    // Filter out excluded exercises
    if (rc.mustExclude && rc.mustExclude.length > 0) {
      candidates = candidates.filter(e => {
        const name = e.normalizedName.toLowerCase();
        return !rc.mustExclude!.some(excl => name.includes(excl.toLowerCase()));
      });
    }

    // Prefer exercises that match mustInclude (but don't filter out all others)
    // This is handled in scoring below
  }

  // Score candidates by flow (position transition cost)
  const scored = candidates.map(candidate => {
    let score = 100;

    // Position transition cost (0-2 points of penalty per cost unit)
    const transitionCost = TRANSITION_COSTS[context.currentPosition]?.[candidate.position] ?? 2;
    score -= transitionCost * 15;

    // Intensity match (closer to target = better)
    const intensityDiff = Math.abs(candidate.intensityScore - context.targetIntensity);
    score -= intensityDiff * 0.5;

    // Progression bonus (if this exercise commonly follows the previous one)
    if (context.previousExercise) {
      const progressions = getNextExercises(index, context.previousExercise);
      if (progressions.some(p => p.normalizedName === candidate.normalizedName)) {
        score += 20;
      }
    }

    // Finisher bonus for end of round
    const isNearEnd = context.minuteIndex >= context.totalMinutes - 2;
    if (isNearEnd && candidate.isFinisher) {
      score += 15;
    }

    // Warmup preference for start of Round 1
    const isWarmupPhase = context.roundNumber === 1 && context.minuteIndex < 3;
    if (isWarmupPhase && candidate.vibeProfile.preferredEnergyLevel === 'warmup') {
      score += 15;
    }

    // NL prompt scoring (if prompt was provided)
    if (context.nlParsed) {
      const nlScore = scoreExerciseForPrompt(candidate, context.nlParsed);
      // Weight NL score heavily - it's the user's explicit request
      score += (nlScore - 50) * 0.6; // Adds -30 to +30 based on NL match
    }

    // Round-specific constraint scoring
    if (context.roundConstraints) {
      const rc = context.roundConstraints;

      // Boost exercises that match mustInclude keywords
      if (rc.mustInclude && rc.mustInclude.length > 0) {
        const name = candidate.normalizedName.toLowerCase();
        const rawText = candidate.rawText.toLowerCase();
        for (const incl of rc.mustInclude) {
          if (name.includes(incl.toLowerCase()) || rawText.includes(incl.toLowerCase())) {
            score += 25; // Strong boost for explicitly requested exercises
            break;
          }
        }
      }

      // Boost exercises that match round movement patterns
      if (rc.movements && rc.movements.length > 0) {
        if (rc.movements.includes(candidate.movementPattern)) {
          score += 20;
        }
      }

      // Boost exercises that match round muscle groups
      if (rc.muscles && rc.muscles.length > 0) {
        if (rc.muscles.includes(candidate.primaryMuscle)) {
          score += 15;
        }
      }

      // Intensity match for round
      if (rc.intensity) {
        const exIntensity = candidate.intensityScore;
        if (rc.intensity === 'high' && exIntensity > 70) score += 10;
        else if (rc.intensity === 'medium' && exIntensity >= 40 && exIntensity <= 70) score += 10;
        else if (rc.intensity === 'low' && exIntensity < 40) score += 10;
      }
    }

    // Freshness scoring
    const freshness = calculateFreshness(candidate.id);
    if (context.nlParsed?.vibePreferences?.freshOnly === true) {
      // User wants fresh exercises - heavily weight freshness
      score += (freshness.score - 50) * 0.4; // Adds -20 to +20 based on freshness
    } else {
      // Default: slightly prefer fresh exercises, penalize overused
      if (freshness.isOverused) {
        score -= 15; // Penalize overused exercises
      } else if (freshness.score >= 80) {
        score += 5; // Small bonus for very fresh exercises
      }
    }

    return { exercise: candidate, score };
  });

  // Sort by score and pick from top 3 with some randomness
  scored.sort((a, b) => b.score - a.score);

  if (scored.length === 0) return null;

  const topN = scored.slice(0, Math.min(3, scored.length));
  const selected = topN[Math.floor(Math.random() * topN.length)];

  return selected.exercise;
}

// ============================================================================
// TREAD GENERATION
// ============================================================================

/**
 * Generate tread entry based on minute position and intensity target
 */
function generateTreadEntry(
  minuteIndex: number,
  targetIntensity: number,
  roundNumber: number,
  totalMinutes: number,
  roundConstraints?: RoundConstraints
): TreadEntry {
  const progress = minuteIndex / totalMinutes;
  const isWarmup = roundNumber === 1 && progress < 0.25;
  const isNearEnd = progress > 0.85;

  // Check for round-specific tread constraints
  const forceIncline = roundConstraints?.treadIncline === true;
  const noIncline = roundConstraints?.treadIncline === false;
  const forceSprints = roundConstraints?.treadSprints === true;
  const noSprints = roundConstraints?.treadSprints === false || roundConstraints?.treadEndurance === true;
  const isEndurance = roundConstraints?.treadEndurance === true;

  // Determine base speeds based on intensity
  let baseLow: number, baseMid: number, baseHigh: number;

  if (targetIntensity < 40) {
    // Low intensity (warmup/recovery)
    baseLow = 5 + (targetIntensity / 40) * 1.5;
    baseMid = baseLow + 1;
    baseHigh = baseMid + 1;
  } else if (targetIntensity < 70) {
    // Medium intensity (building)
    baseLow = 6.5 + ((targetIntensity - 40) / 30) * 1;
    baseMid = baseLow + 1;
    baseHigh = baseMid + 1;
  } else {
    // High intensity (peak)
    baseLow = 7.5 + ((targetIntensity - 70) / 30) * 1.5;
    baseMid = baseLow + 1;
    baseHigh = baseMid + 1;
  }

  // Round speeds
  baseLow = Math.round(baseLow * 2) / 2;
  baseMid = Math.round(baseMid * 2) / 2;
  baseHigh = Math.round(baseHigh * 2) / 2;

  // Determine if this should be a recover, sprint, or incline
  let isRecover = false;
  let isSprint = false;
  let inclinePercent = 0;
  let raw: string;

  // Strategic recover placement (less common in endurance rounds)
  const recoverChance = isEndurance ? 0.05 : 0.15;
  if (!isWarmup && Math.random() < recoverChance && !isNearEnd) {
    isRecover = true;
    raw = 'RECOVER';
  }
  // Sprint at end of warmup or near round end (unless sprints are disabled)
  else if (!noSprints && ((isWarmup && progress > 0.2) || (isNearEnd && Math.random() < 0.4) || forceSprints)) {
    isSprint = true;
    // Warmup sprint ends in 8, 9, 10 (as per Barry's rule)
    if (isWarmup) {
      raw = `${baseLow}, ${baseMid}, ${baseHigh} | 8, 9, 10`;
    } else {
      raw = `${baseLow}, ${baseMid}, ${baseHigh} | Sprint (30 Seconds)`;
    }
  }
  // Incline - forced, random, or disabled based on constraints
  else if (!noIncline && (forceIncline || (Math.random() < 0.15 && targetIntensity > 50))) {
    // Higher incline chance when forced
    const inclineChance = forceIncline ? 0.6 : 0.15;
    if (forceIncline || Math.random() < inclineChance) {
      inclinePercent = Math.floor(Math.random() * 3 + 2) * 2; // 4%, 6%, or 8%
      raw = `${inclinePercent}% ${baseLow}, ${baseMid}, ${baseHigh}`;
    } else {
      // Fallback to standard
      raw = `${baseLow}, ${baseMid}, ${baseHigh}`;
    }
  }
  // Build pattern (two speed sets) - good for "endurance runs"
  else if (targetIntensity > 60 && Math.random() < 0.3) {
    const highLow = baseLow + 1;
    const highMid = baseMid + 1;
    const highHigh = baseHigh + 1;
    raw = `${baseLow}, ${baseMid}, ${baseHigh} | ${highLow}, ${highMid}, ${highHigh}`;
  }
  // Standard speed set
  else {
    raw = `${baseLow}, ${baseMid}, ${baseHigh}`;
  }

  return {
    minute: formatMinuteRange(minuteIndex),
    raw,
    speeds: [{ low: baseLow, mid: baseMid, high: baseHigh }],
    isRecover,
    isSprint,
    inclinePercent,
    lowestSpeed: isRecover ? 0 : baseLow,
    effectiveSpeed: isRecover ? 0 : baseLow + (inclinePercent * 0.2),
    textColor: inclinePercent > 0 ? 'red' : (isSprint ? 'purple' : 'black'),
  };
}

// ============================================================================
// ROUND GENERATION
// ============================================================================

function generateRoundFromExercises(
  index: ExerciseIndex,
  duration: number,
  roundNumber: 1 | 2,
  equipment: Equipment,
  usedExercises: Set<string>,
  nlParsed?: NLParseResult
): { tread: TreadEntry[]; floor: FloorEntry[] } {
  const treadEntries: TreadEntry[] = [];
  const floorEntries: FloorEntry[] = [];
  let currentPosition: ExercisePosition = 'floor_standing';
  let previousExercise: string | null = null;

  // Get round-specific constraints
  const roundConstraints = roundNumber === 1 ? nlParsed?.round1 : nlParsed?.round2;

  // Override duration if specified in NL constraints
  const effectiveDuration = roundConstraints?.duration || duration;

  // Adjust vibe config based on NL preferences (global + round-specific)
  let vibeConfig = adjustVibeConfig(DEFAULT_VIBE_CONFIG, nlParsed);

  // If round has compound/combo focus, boost combo chance significantly
  if (roundConstraints?.compoundFocus ||
      roundConstraints?.movements?.includes('power') ||
      roundConstraints?.mustInclude?.some(m => ['clean', 'snatch', 'thruster'].includes(m.toLowerCase()))) {
    vibeConfig = { ...vibeConfig, comboMovementChance: 0.5 };
  }

  // For Round 1, start with warmup
  let warmupExercises: string[] = [];
  if (roundNumber === 1) {
    // Get warmup content from warmup selection service
    const requireWgsAndCatCow = shouldRequireWgsAndCatCow();

    // Sample some workout exercises to inform warmup selection
    const workoutSample: string[] = [];
    const workoutExercises = findExercises(index, {
      minIntensity: 50,
      maxIntensity: 80,
    });
    for (let i = 0; i < Math.min(5, workoutExercises.length); i++) {
      workoutSample.push(workoutExercises[i].rawText);
    }

    // Build warmup exercises
    const warmupDuration = Math.min(3, Math.floor(effectiveDuration * 0.25));

    // 80% of warmups should have WGS
    if (requireWgsAndCatCow || Math.random() < 0.8) {
      warmupExercises.push('WGS to Pushup');
    }

    // Add contextual warmup exercises
    const warmupCandidates = findExercises(index, {
      preferWarmup: true,
      maxIntensity: 50,
    });

    while (warmupExercises.length < warmupDuration && warmupCandidates.length > 0) {
      const idx = Math.floor(Math.random() * warmupCandidates.length);
      const candidate = warmupCandidates.splice(idx, 1)[0];
      if (!warmupExercises.some(e => e.toLowerCase().includes(candidate.normalizedName))) {
        warmupExercises.push(candidate.rawText);
      }
    }
  }

  for (let minute = 0; minute < effectiveDuration; minute++) {
    const targetIntensity = getTargetIntensity(minute, effectiveDuration, roundNumber);

    // Generate tread first (with round constraints for incline/sprint control)
    const treadEntry = generateTreadEntry(minute, targetIntensity, roundNumber, effectiveDuration, roundConstraints);
    treadEntries.push(treadEntry);

    // Build tread context for floor selection
    const treadContext: TreadContext = {
      isRecover: treadEntry.isRecover,
      isSprint: treadEntry.isSprint,
      hasIncline: treadEntry.inclinePercent > 0,
      effectiveSpeed: treadEntry.effectiveSpeed,
    };

    // Generate floor entry
    let floorText: string;
    let energyLevel: EnergyLevel;

    // Use warmup exercises for first few minutes of Round 1
    if (roundNumber === 1 && minute < warmupExercises.length) {
      floorText = warmupExercises[minute];
      energyLevel = 'L1';
    } else {
      // Select exercise based on context
      const context: GenerationContext = {
        roundNumber,
        minuteIndex: minute,
        totalMinutes: effectiveDuration,
        currentPosition,
        previousExercise,
        usedExercises,
        targetIntensity,
        treadContext,
        equipment,
        nlParsed,  // Pass NL prompt for scoring
        roundConstraints,  // Pass round-specific constraints
      };

      // Check if this is the last minute (finisher position)
      const isLastMinute = minute === effectiveDuration - 1;

      // Force finisher selection at round end
      if (isLastMinute && vibeConfig.forceFinisher) {
        floorText = selectFinisher(usedExercises);
        const finisherNorm = floorText.toLowerCase().replace(/\d+\s*/g, '').trim();
        usedExercises.add(finisherNorm);
        currentPosition = 'floor_standing'; // Most finishers are standing
      } else {
        const selectedExercise = selectExercise(index, context);

        if (selectedExercise) {
          floorText = selectedExercise.rawText;

          // Try to get a secondary exercise for EMOM/split formatting
          let secondaryExercise: string | null = null;
          if (Math.random() < (vibeConfig.emomChance + vibeConfig.split30Chance)) {
            // Get a compatible exercise for pairing
            const secondaryContext = { ...context, previousExercise: selectedExercise.normalizedName };
            const secondary = selectExercise(index, secondaryContext);
            if (secondary && secondary.normalizedName !== selectedExercise.normalizedName) {
              secondaryExercise = secondary.rawText;
            }
          }

          // Apply vibe formatting (combos, EMOM, ladders, splits)
          floorText = applyVibeFormatting(floorText, context, vibeConfig, secondaryExercise);

          currentPosition = selectedExercise.position;
          previousExercise = selectedExercise.normalizedName;
          usedExercises.add(selectedExercise.normalizedName);
        } else {
          // Fallback
          floorText = 'Squat';
        }
      }

      // Determine energy level
      if (minute < effectiveDuration * 0.25 && roundNumber === 1) {
        energyLevel = 'L1';
      } else if (minute >= effectiveDuration * 0.85) {
        energyLevel = 'L3';
      } else {
        energyLevel = 'L2';
      }
    }

    floorEntries.push({
      minute: formatMinuteRange(minute),
      exercises: floorText,
      exerciseIds: [],
      energyLevel,
      blockIndex: Math.floor(minute / 3) + 1,
      blockType: minute < 3 && roundNumber === 1 ? 'warmup' : 'workout',
      libraryIndex: 0,
      libraryTotal: 0,
      blockLength: 3,
      isCustomBlock: false,
    });
  }

  return { tread: treadEntries, floor: floorEntries };
}

// ============================================================================
// MAIN GENERATION FUNCTION
// ============================================================================

/**
 * Generate a class using exercise-based approach
 */
export function generateClassFromExercises(config: GeneratorConfig): ClassPlan {
  // Load or build exercise index
  let index = loadExerciseIndex();
  if (!index || index.exercises.size === 0) {
    index = buildExerciseIndex();
    if (index.exercises.size > 0) {
      saveExerciseIndex(index);
    }
  }

  // Parse NL prompt if provided
  const nlParsed = config.nlPrompt ? parseNLPrompt(config.nlPrompt) : undefined;

  // Track used exercises across both rounds for variety
  const usedExercises = new Set<string>();

  // Generate Round 1
  const round1Data = generateRoundFromExercises(
    index,
    config.round1Duration,
    1,
    config.round1Equipment,
    usedExercises,
    nlParsed
  );

  const round1: Round = {
    number: 1,
    duration: config.round1Duration,
    equipment: config.round1Equipment,
    tread: round1Data.tread,
    floor: round1Data.floor,
  };

  // Generate Round 2
  const round2Data = generateRoundFromExercises(
    index,
    config.round2Duration,
    2,
    config.round2Equipment,
    usedExercises,
    nlParsed
  );

  const round2: Round = {
    number: 2,
    duration: config.round2Duration,
    equipment: config.round2Equipment,
    tread: round2Data.tread,
    floor: round2Data.floor,
  };

  // Calculate tread average
  const allTreadEntries = [...round1.tread, ...round2.tread];
  const treadAverage = calculateTreadAverage(allTreadEntries);

  const now = new Date().toISOString();

  return {
    id: generateId(),
    date: config.date,
    classType: config.classType,
    round1,
    round2,
    treadAverage,
    createdAt: now,
    updatedAt: now,
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  getTargetIntensity,
  TRANSITION_COSTS,
};
