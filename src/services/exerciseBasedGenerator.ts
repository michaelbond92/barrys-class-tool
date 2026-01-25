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
} from './exerciseIndexingService';
import {
  selectContextualWarmup,
  shouldRequireWgsAndCatCow,
  hasWgsAndCatCow,
} from './warmupSelectionService';
import { detectPrimaryPosition } from './positionService';
import { ExercisePosition } from '../types/hierarchyTypes';
import { loadIndexFromStorage } from './indexingService';

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
  totalMinutes: number
): TreadEntry {
  const progress = minuteIndex / totalMinutes;
  const isWarmup = roundNumber === 1 && progress < 0.25;
  const isNearEnd = progress > 0.85;

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

  // Strategic recover placement
  if (!isWarmup && Math.random() < 0.15 && !isNearEnd) {
    isRecover = true;
    raw = 'RECOVER';
  }
  // Sprint at end of warmup or near round end
  else if ((isWarmup && progress > 0.2) || (isNearEnd && Math.random() < 0.4)) {
    isSprint = true;
    // Warmup sprint ends in 8, 9, 10 (as per Barry's rule)
    if (isWarmup) {
      raw = `${baseLow}, ${baseMid}, ${baseHigh} | 8, 9, 10`;
    } else {
      raw = `${baseLow}, ${baseMid}, ${baseHigh} | Sprint (30 Seconds)`;
    }
  }
  // Occasional incline
  else if (Math.random() < 0.15 && targetIntensity > 50) {
    inclinePercent = Math.floor(Math.random() * 3 + 2) * 2; // 4%, 6%, or 8%
    raw = `${inclinePercent}% ${baseLow}, ${baseMid}, ${baseHigh}`;
  }
  // Build pattern (two speed sets)
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
  usedExercises: Set<string>
): { tread: TreadEntry[]; floor: FloorEntry[] } {
  const treadEntries: TreadEntry[] = [];
  const floorEntries: FloorEntry[] = [];
  let currentPosition: ExercisePosition = 'floor_standing';
  let previousExercise: string | null = null;

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
    const warmupDuration = Math.min(3, Math.floor(duration * 0.25));

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

  for (let minute = 0; minute < duration; minute++) {
    const targetIntensity = getTargetIntensity(minute, duration, roundNumber);

    // Generate tread first
    const treadEntry = generateTreadEntry(minute, targetIntensity, roundNumber, duration);
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
        totalMinutes: duration,
        currentPosition,
        previousExercise,
        usedExercises,
        targetIntensity,
        treadContext,
        equipment,
      };

      const selectedExercise = selectExercise(index, context);

      if (selectedExercise) {
        floorText = selectedExercise.rawText;
        currentPosition = selectedExercise.position;
        previousExercise = selectedExercise.normalizedName;
        usedExercises.add(selectedExercise.normalizedName);
      } else {
        // Fallback
        floorText = 'Squat';
      }

      // Determine energy level
      if (minute < duration * 0.25 && roundNumber === 1) {
        energyLevel = 'L1';
      } else if (minute >= duration * 0.85) {
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

  // Track used exercises across both rounds for variety
  const usedExercises = new Set<string>();

  // Generate Round 1
  const round1Data = generateRoundFromExercises(
    index,
    config.round1Duration,
    1,
    config.round1Equipment,
    usedExercises
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
    usedExercises
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
