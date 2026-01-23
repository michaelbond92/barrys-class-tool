// Block-based class generator using real Barry's class patterns
// Each block is self-contained with hero moment at the end

import {
  ClassPlan,
  Round,
  TreadEntry,
  FloorEntry,
  GeneratorConfig,
  EnergyLevel
} from '../types';
import { generateId } from '../utils/dateUtils';
import { formatMinuteRange } from '../utils/formatUtils';
import { createTreadEntry, calculateTreadAverage } from './treadParser';
import {
  ExerciseBlock,
  getRandomBlock,
  ROUND1_WARMUPS,
  ROUND2_STARTERS,
  CHEST_BLOCKS,
  BACK_BLOCKS,
  DEADLIFT_BLOCKS,
  SQUAT_BLOCKS,
  LUNGE_BLOCKS,
  ARMS_BLOCKS,
  CORE_BLOCKS,
  POWER_BLOCKS
} from '../data/exerciseBlocks';

interface GeneratedMinute {
  floor: FloorEntry;
  tread: TreadEntry;
}

// Parse the actual tread notation from blocks (e.g., "6, 7, 8 | 7, 8, 9")
function parseTreadFromBlock(treadStr: string, minute: number): TreadEntry {
  const lower = treadStr.toLowerCase();

  // Handle recover
  if (lower.includes('recover')) {
    return createTreadEntry(minute, null, { isRecover: true });
  }

  // Handle sprint
  const isSprint = lower.includes('sprint');

  // Extract incline if present (e.g., "3% 6, 7, 8")
  const inclineMatch = treadStr.match(/(\d+)%/);
  const inclinePercent = inclineMatch ? parseInt(inclineMatch[1]) : 0;

  // Extract speeds - find all number patterns like "6, 7, 8"
  const speedMatches = treadStr.match(/[\d.]+,\s*[\d.]+,\s*[\d.]+/g);

  if (speedMatches && speedMatches.length > 0) {
    // Use first speed set for the entry
    const nums = speedMatches[0].match(/[\d.]+/g);
    if (nums && nums.length >= 3) {
      const speeds = {
        low: parseFloat(nums[0]),
        mid: parseFloat(nums[1]),
        high: parseFloat(nums[2])
      };
      return createTreadEntry(minute, speeds, {
        isSprint,
        inclinePercent
      });
    }
  }

  // Default fallback
  return createTreadEntry(minute, { low: 6, mid: 7, high: 8 }, { isSprint });
}

// Determine energy level based on position in block and round
function getEnergyLevel(
  minuteInBlock: number,
  blockDuration: number,
  minuteInRound: number,
  roundDuration: number
): EnergyLevel {
  const blockProgress = minuteInBlock / blockDuration;
  const roundProgress = minuteInRound / roundDuration;

  // First few minutes of round = warmup energy
  if (roundProgress < 0.2) return 'L1';

  // Last part of each block (hero moment) = high energy
  if (blockProgress >= 0.7) return 'L3';

  // Last part of round = high energy
  if (roundProgress > 0.85) return 'L3';

  return 'L2';
}

// Get blocks appropriate for a position in the round
function getBlocksForPosition(
  isFirstBlock: boolean,
  isLastBlock: boolean,
  round: number,
  usedFocuses: Set<string>
): ExerciseBlock[] {
  if (isFirstBlock) {
    return round === 1 ? ROUND1_WARMUPS : ROUND2_STARTERS;
  }

  // For last block, prefer power/explosive finishers
  if (isLastBlock) {
    const powerOptions = [...POWER_BLOCKS, ...BACK_BLOCKS.filter(b =>
      b.exercises.some(e => e.floor.toLowerCase().includes('snatch') || e.floor.toLowerCase().includes('hi pull'))
    )];
    if (powerOptions.length > 0) return powerOptions;
  }

  // For middle blocks, choose based on variety
  const allMiddle = [
    ...CHEST_BLOCKS,
    ...BACK_BLOCKS,
    ...DEADLIFT_BLOCKS,
    ...SQUAT_BLOCKS,
    ...LUNGE_BLOCKS,
    ...ARMS_BLOCKS,
    ...CORE_BLOCKS
  ];

  // Filter out recently used focuses for variety
  const available = allMiddle.filter(b => !usedFocuses.has(b.focus));
  return available.length > 0 ? available : allMiddle;
}

// Generate a round using complete blocks
function generateRoundFromBlocks(
  duration: number,
  roundNumber: number,
  usedFocuses: Set<string>
): { tread: TreadEntry[]; floor: FloorEntry[] } {
  const minutes: GeneratedMinute[] = [];
  let currentMinute = 0;

  // Determine number of blocks based on duration
  // ~3-4 minutes per block on average
  const targetBlocks = Math.max(2, Math.min(4, Math.floor(duration / 3)));
  let blocksUsed = 0;

  while (currentMinute < duration) {
    const remainingMinutes = duration - currentMinute;
    const isFirstBlock = blocksUsed === 0;
    const isLastBlock = remainingMinutes <= 4 || blocksUsed >= targetBlocks - 1;

    // Get appropriate blocks for this position
    const availableBlocks = getBlocksForPosition(
      isFirstBlock,
      isLastBlock,
      roundNumber,
      usedFocuses
    );

    // Select a random block
    const block = getRandomBlock(availableBlocks);
    usedFocuses.add(block.focus);

    // Determine how many minutes to use from this block
    const blockMinutes = Math.min(block.duration, remainingMinutes);

    // Add exercises from block
    for (let i = 0; i < blockMinutes; i++) {
      const exercise = block.exercises[i] || block.exercises[block.exercises.length - 1];
      const energyLevel = getEnergyLevel(i, block.duration, currentMinute, duration);

      minutes.push({
        floor: {
          minute: formatMinuteRange(currentMinute),
          exercises: exercise.floor,
          exerciseIds: [],
          energyLevel
        },
        tread: parseTreadFromBlock(exercise.tread, currentMinute)
      });
      currentMinute++;
    }

    blocksUsed++;
  }

  return {
    tread: minutes.map(m => m.tread),
    floor: minutes.map(m => m.floor)
  };
}

// Main generation function
export function generateClassFromBlocks(config: GeneratorConfig): ClassPlan {
  const usedFocuses = new Set<string>();

  // Generate Round 1
  const round1Data = generateRoundFromBlocks(
    config.round1Duration,
    1,
    usedFocuses
  );

  const round1: Round = {
    number: 1,
    duration: config.round1Duration,
    equipment: config.round1Equipment,
    tread: round1Data.tread,
    floor: round1Data.floor
  };

  // Generate Round 2 (different focuses for variety)
  const round2Data = generateRoundFromBlocks(
    config.round2Duration,
    2,
    usedFocuses
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
    date: new Date().toISOString().split('T')[0],
    round1Duration: 12,
    round2Duration: 9,
    round1Equipment: '2 Heavy Dumbbells',
    round2Equipment: '2 Heavy Dumbbells',
    maxTreadAverage: 7.75
  };
}
