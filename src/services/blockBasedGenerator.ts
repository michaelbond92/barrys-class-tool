// Block-based class generator that creates naturally flowing workouts
// Based on analysis of real Barry's Total Body classes

import {
  ClassPlan,
  Round,
  TreadEntry,
  FloorEntry,
  GeneratorConfig,
  EnergyLevel,
  SpeedSet
} from '../types';
import { generateId, getToday } from '../utils/dateUtils';
import { formatMinuteRange } from '../utils/formatUtils';
import { createTreadEntry, calculateTreadAverage } from './treadParser';
import {
  ExerciseBlock,
  BlockType,
  getRandomBlock,
  getBlocksByType,
  WARMUP_BODYWEIGHT_BLOCKS,
  WARMUP_WEIGHTED_BLOCKS,
  TOTAL_BODY_BLOCK_SEQUENCES,
  ROUND_2_BLOCK_SEQUENCES,
  POWER_FINISHER_BLOCKS
} from '../data/exerciseBlocks';

interface GeneratedMinute {
  floor: FloorEntry;
  tread: TreadEntry;
}

// Get tread entry based on pattern type
function getTreadForPattern(
  minute: number,
  pattern: 'recover' | 'build' | 'push' | 'incline' | 'sprint',
  maxAverage: number
): TreadEntry {
  switch (pattern) {
    case 'recover':
      return createTreadEntry(minute, null, { isRecover: true });

    case 'build':
      return createTreadEntry(minute, { low: 5.5, mid: 6.5, high: 7.5 });

    case 'push':
      return createTreadEntry(minute, { low: 6, mid: 7, high: 8 });

    case 'incline': {
      const incline = Math.floor(Math.random() * 4) + 3; // 3-6%
      return createTreadEntry(minute, { low: 5, mid: 6, high: 7 }, { inclinePercent: incline });
    }

    case 'sprint':
      return createTreadEntry(minute, { low: 6, mid: 8, high: 10 }, { isSprint: true });

    default:
      return createTreadEntry(minute, { low: 6, mid: 7, high: 8 });
  }
}

// Get energy level from tread pattern
function getEnergyLevelFromPattern(pattern: string): EnergyLevel {
  switch (pattern) {
    case 'recover':
    case 'build':
      return 'L1';
    case 'push':
    case 'incline':
      return 'L2';
    case 'sprint':
      return 'L3';
    default:
      return 'L2';
  }
}

// Select a valid block sequence based on remaining duration
function selectBlockSequence(
  isRound1: boolean,
  remainingDuration: number,
  usedBlockTypes: Set<BlockType>
): BlockType[] {
  const sequences = isRound1 ? TOTAL_BODY_BLOCK_SEQUENCES : ROUND_2_BLOCK_SEQUENCES;

  // Filter sequences that would fit and don't reuse too many block types
  const validSequences = sequences.filter(seq => {
    // Check that at least some blocks are fresh
    const newBlocks = seq.filter(type => !usedBlockTypes.has(type));
    return newBlocks.length >= seq.length / 2;
  });

  if (validSequences.length === 0) {
    return isRound1
      ? ['chest', 'deadlift', 'power_finisher']
      : ['back_rows', 'power_finisher'];
  }

  return validSequences[Math.floor(Math.random() * validSequences.length)];
}

// Generate a round using blocks
function generateRoundFromBlocks(
  duration: number,
  isRound1: boolean,
  maxAverage: number,
  usedBlockTypes: Set<BlockType>
): { tread: TreadEntry[]; floor: FloorEntry[] } {
  const minutes: GeneratedMinute[] = [];
  let currentMinute = 0;

  // 1. Add warmup block (2-3 minutes)
  const warmupBlocks = isRound1 ? WARMUP_BODYWEIGHT_BLOCKS : WARMUP_WEIGHTED_BLOCKS;
  const warmupBlock = getRandomBlock(warmupBlocks);

  // Adjust warmup duration based on round length
  const warmupDuration = Math.min(warmupBlock.duration, Math.floor(duration * 0.25));

  for (let i = 0; i < warmupDuration && currentMinute < duration; i++) {
    const exercise = warmupBlock.exercises[i] || warmupBlock.exercises[warmupBlock.exercises.length - 1];

    // First minute of round 1 is always easier pace
    const adjustedPattern = (currentMinute === 0 && isRound1) ? 'build' : exercise.treadPattern;

    minutes.push({
      floor: {
        minute: formatMinuteRange(currentMinute),
        exercises: exercise.floor,
        exerciseIds: [],
        energyLevel: currentMinute < 2 ? 'L1' : 'L2'
      },
      tread: getTreadForPattern(currentMinute, adjustedPattern, maxAverage)
    });
    currentMinute++;
  }

  // 2. Determine remaining duration for main blocks and finisher
  const remainingDuration = duration - currentMinute;
  const finisherDuration = 2; // Always reserve 2 minutes for finisher
  const mainBlocksDuration = remainingDuration - finisherDuration;

  // 3. Select block sequence for main work
  const blockSequence = selectBlockSequence(isRound1, mainBlocksDuration, usedBlockTypes);

  // 4. Add main blocks (excluding finisher which we'll add at the end)
  const mainBlockTypes = blockSequence.filter(type => type !== 'power_finisher');
  let mainMinutesUsed = 0;
  const targetMainMinutes = mainBlocksDuration;

  for (const blockType of mainBlockTypes) {
    if (mainMinutesUsed >= targetMainMinutes) break;

    const blocks = getBlocksByType(blockType);
    if (blocks.length === 0) continue;

    const block = getRandomBlock(blocks);
    usedBlockTypes.add(blockType);

    // Calculate how many minutes to use from this block
    const availableMinutes = targetMainMinutes - mainMinutesUsed;
    const blockMinutes = Math.min(block.duration, availableMinutes);

    for (let i = 0; i < blockMinutes && currentMinute < duration - finisherDuration; i++) {
      const exercise = block.exercises[i] || block.exercises[block.exercises.length - 1];

      // Determine energy level based on position in round
      const roundProgress = currentMinute / duration;
      let energyLevel: EnergyLevel = 'L2';
      if (roundProgress < 0.25) energyLevel = 'L1';
      else if (roundProgress > 0.8) energyLevel = 'L3';

      minutes.push({
        floor: {
          minute: formatMinuteRange(currentMinute),
          exercises: exercise.floor,
          exerciseIds: [],
          energyLevel
        },
        tread: getTreadForPattern(currentMinute, exercise.treadPattern, maxAverage)
      });
      currentMinute++;
      mainMinutesUsed++;
    }
  }

  // 5. Fill any remaining main minutes if needed
  while (currentMinute < duration - finisherDuration) {
    const fillBlocks = [...getBlocksByType('squat'), ...getBlocksByType('core')];
    const fillBlock = getRandomBlock(fillBlocks);
    const exercise = fillBlock.exercises[0];

    minutes.push({
      floor: {
        minute: formatMinuteRange(currentMinute),
        exercises: exercise.floor,
        exerciseIds: [],
        energyLevel: 'L2'
      },
      tread: getTreadForPattern(currentMinute, exercise.treadPattern, maxAverage)
    });
    currentMinute++;
  }

  // 6. Add power finisher (last 2 minutes)
  const finisherBlock = getRandomBlock(POWER_FINISHER_BLOCKS);

  for (let i = 0; i < finisherDuration && currentMinute < duration; i++) {
    const exercise = finisherBlock.exercises[i] || finisherBlock.exercises[finisherBlock.exercises.length - 1];
    const isLastMinute = currentMinute === duration - 1;

    minutes.push({
      floor: {
        minute: formatMinuteRange(currentMinute),
        exercises: exercise.floor,
        exerciseIds: [],
        energyLevel: 'L3'
      },
      tread: isLastMinute
        ? createTreadEntry(currentMinute, { low: 6, mid: 8, high: 10 }, { isSprint: true })
        : getTreadForPattern(currentMinute, exercise.treadPattern, maxAverage)
    });
    currentMinute++;
  }

  return {
    tread: minutes.map(m => m.tread),
    floor: minutes.map(m => m.floor)
  };
}

// Main generation function
export function generateClassFromBlocks(config: GeneratorConfig): ClassPlan {
  const usedBlockTypes = new Set<BlockType>();

  // Generate Round 1
  const round1Data = generateRoundFromBlocks(
    config.round1Duration,
    true, // isRound1
    config.maxTreadAverage,
    usedBlockTypes
  );

  const round1: Round = {
    number: 1,
    duration: config.round1Duration,
    equipment: config.round1Equipment,
    tread: round1Data.tread,
    floor: round1Data.floor
  };

  // Generate Round 2
  const round2Data = generateRoundFromBlocks(
    config.round2Duration,
    false, // isRound1
    config.maxTreadAverage,
    usedBlockTypes
  );

  const round2: Round = {
    number: 2,
    duration: config.round2Duration,
    equipment: config.round2Equipment,
    tread: round2Data.tread,
    floor: round2Data.floor
  };

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
    round2Duration: 9,
    round1Equipment: '2 Heavy Dumbbells',
    round2Equipment: '2 Heavy Dumbbells',
    maxTreadAverage: 7.75
  };
}
