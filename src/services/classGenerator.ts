import {
  Exercise,
  ClassPlan,
  Round,
  TreadEntry,
  FloorEntry,
  GeneratorConfig,
  PhaseAllocation,
  EnergyLevel,
  SpeedSet,
  Equipment
} from '../types';
import { generateId, getToday } from '../utils/dateUtils';
import { formatMinuteRange } from '../utils/formatUtils';
import { createTreadEntry, calculateTreadAverage } from './treadParser';
import {
  getEligibleExercises,
  selectExercisesForPhase,
  getCategoriesForClassType,
  ExerciseWithFreshness
} from './exerciseSelector';

export function allocatePhases(duration: number): PhaseAllocation {
  // L1: ~20% (warmup)
  // L2: ~65% (building)
  // L3: ~15% (finisher)
  const l1Minutes = Math.max(1, Math.round(duration * 0.20));
  const l3Minutes = Math.max(1, Math.round(duration * 0.15));
  const l2Minutes = duration - l1Minutes - l3Minutes;

  return { l1Minutes, l2Minutes, l3Minutes };
}

export function getPhaseForMinute(
  minute: number,
  duration: number,
  phases: PhaseAllocation
): EnergyLevel {
  if (minute < phases.l1Minutes) return 'L1';
  if (minute >= duration - phases.l3Minutes) return 'L3';
  return 'L2';
}

function getBaseSpeedForPhase(phase: EnergyLevel): SpeedSet {
  switch (phase) {
    case 'L1':
      return { low: 5.5, mid: 6.5, high: 7.5 };
    case 'L2':
      return { low: 6, mid: 7, high: 8 };
    case 'L3':
      return { low: 6.5, mid: 7.5, high: 8.5 };
  }
}

function shouldPlaceRecovery(
  minute: number,
  phase: EnergyLevel,
  entries: TreadEntry[]
): boolean {
  // No recoveries in L1 (warmup) or L3 (finisher)
  if (phase !== 'L2') return false;

  // Check last recovery placement
  const lastRecoverIndex = entries.findLastIndex(e => e.isRecover);
  const minutesSinceRecover = lastRecoverIndex === -1 ? minute : minute - lastRecoverIndex;

  // Place recovery every 3-4 minutes in L2
  return minutesSinceRecover >= 3 && Math.random() > 0.5;
}

function isHeroMinute(minute: number, duration: number): boolean {
  // Last minute is the hero moment
  return minute === duration - 1;
}

export function generateTreadStructure(
  duration: number,
  maxAverage: number,
  phases: PhaseAllocation
): TreadEntry[] {
  const entries: TreadEntry[] = [];
  let runningTotal = 0;
  let countedMinutes = 0;

  for (let minute = 0; minute < duration; minute++) {
    const phase = getPhaseForMinute(minute, duration, phases);

    // Place recoveries strategically
    if (shouldPlaceRecovery(minute, phase, entries)) {
      entries.push(createTreadEntry(minute, null, { isRecover: true }));
      continue;
    }

    // Hero moment at end of round
    if (isHeroMinute(minute, duration)) {
      entries.push(createTreadEntry(minute, { low: 6, mid: 8, high: 10 }, { isSprint: true }));
      // Use base speed (6) for average calculation
      runningTotal += 6;
      countedMinutes++;
      continue;
    }

    // Calculate speeds based on energy level
    const baseSpeed = getBaseSpeedForPhase(phase);

    // Check if we need to adjust to stay under max average
    const projectedAverage = (runningTotal + baseSpeed.low) / (countedMinutes + 1);
    let adjustedSpeed = { ...baseSpeed };

    if (projectedAverage > maxAverage) {
      // Need to reduce speed to stay under max
      const targetLow = Math.max(5, maxAverage * (countedMinutes + 1) - runningTotal);
      const reduction = baseSpeed.low - targetLow;
      adjustedSpeed = {
        low: targetLow,
        mid: Math.max(baseSpeed.mid - reduction, targetLow + 1),
        high: Math.max(baseSpeed.high - reduction, targetLow + 2)
      };
    }

    // Add some variation with inclines for L2
    let inclinePercent = 0;
    if (phase === 'L2' && Math.random() > 0.7) {
      inclinePercent = Math.floor(Math.random() * 4) + 3; // 3-6%
      // Reduce speed for incline
      adjustedSpeed = {
        low: adjustedSpeed.low - 1,
        mid: adjustedSpeed.mid - 1,
        high: adjustedSpeed.high - 1
      };
    }

    const entry = createTreadEntry(minute, adjustedSpeed, { inclinePercent });
    entries.push(entry);
    runningTotal += entry.effectiveSpeed;
    countedMinutes++;
  }

  return entries;
}

export function generateFloorStructure(
  exercises: Exercise[],
  config: GeneratorConfig,
  duration: number,
  equipment: Equipment,
  phases: PhaseAllocation
): FloorEntry[] {
  const categories = getCategoriesForClassType(config.classType);
  const eligible = getEligibleExercises(exercises, categories, equipment);
  const usedInClass = new Set<string>();
  const entries: FloorEntry[] = [];

  // Allocate exercises by phase
  const l1Exercises = selectExercisesForPhase(
    eligible,
    config.classType,
    'L1',
    phases.l1Minutes,
    usedInClass
  );

  const l2Exercises = selectExercisesForPhase(
    eligible,
    config.classType,
    'L2',
    phases.l2Minutes,
    usedInClass
  );

  const l3Exercises = selectExercisesForPhase(
    eligible,
    config.classType,
    'L3',
    phases.l3Minutes,
    usedInClass
  );

  let exerciseIndex = { l1: 0, l2: 0, l3: 0 };

  for (let minute = 0; minute < duration; minute++) {
    const phase = getPhaseForMinute(minute, duration, phases);
    let exercise: ExerciseWithFreshness | undefined;

    switch (phase) {
      case 'L1':
        exercise = l1Exercises[exerciseIndex.l1++];
        break;
      case 'L2':
        exercise = l2Exercises[exerciseIndex.l2++];
        break;
      case 'L3':
        exercise = l3Exercises[exerciseIndex.l3++];
        break;
    }

    entries.push({
      minute: formatMinuteRange(minute),
      exercises: exercise?.name || 'TBD',
      exerciseIds: exercise ? [exercise.id] : [],
      energyLevel: phase
    });
  }

  return entries;
}

export function generateRound(
  exercises: Exercise[],
  config: GeneratorConfig,
  roundNumber: 1 | 2
): Round {
  const duration = roundNumber === 1 ? config.round1Duration : config.round2Duration;
  const equipment = roundNumber === 1 ? config.round1Equipment : config.round2Equipment;
  const phases = allocatePhases(duration);

  const tread = generateTreadStructure(duration, config.maxTreadAverage, phases);
  const floor = generateFloorStructure(exercises, config, duration, equipment, phases);

  return {
    number: roundNumber,
    duration,
    equipment,
    tread,
    floor
  };
}

export function generateClass(
  exercises: Exercise[],
  config: GeneratorConfig
): ClassPlan {
  const round1 = generateRound(exercises, config, 1);
  const round2 = generateRound(exercises, config, 2);

  // Calculate combined tread average
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
    updatedAt: now
  };
}

export function createDefaultConfig(): GeneratorConfig {
  return {
    classType: 'total_body',
    date: getToday(),
    round1Duration: 12,
    round2Duration: 8,
    round1Equipment: '2 Heavy Dumbbells',
    round2Equipment: '2 Heavy Dumbbells',
    maxTreadAverage: 7.75
  };
}
