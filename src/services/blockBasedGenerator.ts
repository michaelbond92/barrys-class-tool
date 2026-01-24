// Block-based class generator using real Barry's class patterns
// Each block is a complete paired floor + tread sequence

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
  WorkoutBlock,
  getRandomBlock,
  getBlockDuration,
  ROUND1_WARMUPS,
  ROUND2_STARTERS,
  WORKOUT_BLOCKS
} from '../data/exerciseBlocks';

// Parse tread notation from the block (e.g., "6, 7, 8 | 7, 8, 9")
function parseTreadFromString(treadStr: string, minute: number): TreadEntry {
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

  // Extract speeds - find patterns like "6, 7, 8"
  const speedMatches = treadStr.match(/[\d.]+,\s*[\d.]+,\s*[\d.]+/g);

  if (speedMatches && speedMatches.length > 0) {
    const nums = speedMatches[0].match(/[\d.]+/g);
    if (nums && nums.length >= 3) {
      const speeds = {
        low: parseFloat(nums[0]),
        mid: parseFloat(nums[1]),
        high: parseFloat(nums[2])
      };
      return createTreadEntry(minute, speeds, { isSprint, inclinePercent });
    }
  }

  // Default fallback
  return createTreadEntry(minute, { low: 6, mid: 7, high: 8 }, { isSprint });
}

// Determine energy level based on position in round
function getEnergyLevel(minuteInRound: number, roundDuration: number): EnergyLevel {
  const progress = minuteInRound / roundDuration;

  if (progress < 0.25) return 'L1';  // First quarter - warmup
  if (progress > 0.85) return 'L3';  // Last bit - finisher
  return 'L2';  // Middle - building
}

// Generate a round by picking and concatenating blocks
function generateRound(
  duration: number,
  roundNumber: number,
  usedBlocks: Set<string>
): { tread: TreadEntry[]; floor: FloorEntry[] } {
  const treadEntries: TreadEntry[] = [];
  const floorEntries: FloorEntry[] = [];
  let currentMinute = 0;

  // 1. Pick opener block (warmup for R1, starter for R2+)
  const openerBlocks = roundNumber === 1 ? ROUND1_WARMUPS : ROUND2_STARTERS;
  const opener = getRandomBlock(openerBlocks);

  // Add opener block
  for (let i = 0; i < opener.floor.length && currentMinute < duration; i++) {
    const energyLevel = getEnergyLevel(currentMinute, duration);

    floorEntries.push({
      minute: formatMinuteRange(currentMinute),
      exercises: opener.floor[i],
      exerciseIds: [],
      energyLevel
    });

    treadEntries.push(parseTreadFromString(opener.tread[i], currentMinute));
    currentMinute++;
  }

  // 2. Fill remaining time with workout blocks
  while (currentMinute < duration) {
    const remainingMinutes = duration - currentMinute;

    // Find blocks that fit (or are close to fitting)
    const fittingBlocks = WORKOUT_BLOCKS.filter(b => {
      const blockKey = b.floor.join('|');
      const blockDuration = getBlockDuration(b);
      // Block should fit and not be already used
      return blockDuration <= remainingMinutes + 1 && !usedBlocks.has(blockKey);
    });

    // If no fitting blocks, use any block
    const availableBlocks = fittingBlocks.length > 0 ? fittingBlocks : WORKOUT_BLOCKS;
    const block = getRandomBlock(availableBlocks);

    // Mark as used
    usedBlocks.add(block.floor.join('|'));

    // Add block (may be truncated if it doesn't fit exactly)
    for (let i = 0; i < block.floor.length && currentMinute < duration; i++) {
      const energyLevel = getEnergyLevel(currentMinute, duration);

      floorEntries.push({
        minute: formatMinuteRange(currentMinute),
        exercises: block.floor[i],
        exerciseIds: [],
        energyLevel
      });

      treadEntries.push(parseTreadFromString(block.tread[i], currentMinute));
      currentMinute++;
    }
  }

  return { tread: treadEntries, floor: floorEntries };
}

// Main generation function
export function generateClassFromBlocks(config: GeneratorConfig): ClassPlan {
  const usedBlocks = new Set<string>();

  // Generate Round 1
  const round1Data = generateRound(config.round1Duration, 1, usedBlocks);
  const round1: Round = {
    number: 1,
    duration: config.round1Duration,
    equipment: config.round1Equipment,
    tread: round1Data.tread,
    floor: round1Data.floor
  };

  // Generate Round 2
  const round2Data = generateRound(config.round2Duration, 2, usedBlocks);
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
