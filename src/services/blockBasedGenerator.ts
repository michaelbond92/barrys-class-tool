// Block-based class generator using real Barry's class patterns
// Floor and Tread blocks are separate - can mix and match by length

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
  getRandomFloorBlock,
  getRandomTreadBlock,
  getAvailableLengths,
  BlockCategory
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

// Check if a tread block starts with RECOVER
function treadStartsWithRecover(block: string[]): boolean {
  return block.length > 0 && block[0].toLowerCase().includes('recover');
}

// Check if a tread block ends with RECOVER
function treadEndsWithRecover(block: string[]): boolean {
  return block.length > 0 && block[block.length - 1].toLowerCase().includes('recover');
}

// Check if a tread block ends with SPRINT
function treadEndsWithSprint(block: string[]): boolean {
  return block.length > 0 && block[block.length - 1].toLowerCase().includes('sprint');
}

// Pick a block length that fits the remaining time
function pickBlockLength(remaining: number, category: BlockCategory): number {
  const available = getAvailableLengths(category);

  // Filter to lengths that fit
  const fitting = available.filter(len => len <= remaining);

  if (fitting.length === 0) {
    // If nothing fits exactly, use smallest available
    return available[0] || 3;
  }

  // Prefer 3-min blocks as they're most common, but vary it up
  const weights = fitting.map(len => {
    if (len === 3) return 3;  // Prefer 3-min
    if (len === 4) return 2;  // Then 4-min
    return 1;  // Then others
  });

  const totalWeight = weights.reduce((a, b) => a + b, 0);
  let random = Math.random() * totalWeight;

  for (let i = 0; i < fitting.length; i++) {
    random -= weights[i];
    if (random <= 0) return fitting[i];
  }

  return fitting[fitting.length - 1];
}

// Generate a round by picking blocks
function generateRound(
  duration: number,
  roundNumber: number,
  usedFloorBlocks: Set<string>,
  usedTreadBlocks: Set<string>
): { tread: TreadEntry[]; floor: FloorEntry[] } {
  const treadEntries: TreadEntry[] = [];
  const floorEntries: FloorEntry[] = [];
  let currentMinute = 0;
  let blockNumber = 0;  // Track block number (1-based when used)

  // Determine if first block is warmup
  let isFirstBlock = true;

  while (currentMinute < duration) {
    const remaining = duration - currentMinute;
    blockNumber++;  // Increment for each new block

    // Determine category (warmup for first block, workout for rest)
    const category: BlockCategory = (isFirstBlock && roundNumber === 1) ? 'warmups' : 'workouts';
    const blockType: 'warmup' | 'workout' = category === 'warmups' ? 'warmup' : 'workout';

    // Pick a block length
    const blockLength = pickBlockLength(remaining, category);

    // Get random floor block of this length
    let floorBlock = getRandomFloorBlock(category, blockLength);
    let attempts = 0;
    while (floorBlock && usedFloorBlocks.has(floorBlock.join('|')) && attempts < 10) {
      floorBlock = getRandomFloorBlock(category, blockLength);
      attempts++;
    }

    // Get random tread block of same length
    // Additional constraints:
    // - First block of round should NOT start with RECOVER
    // - Last block of round should ideally end with SPRINT (not RECOVER)
    const isLastBlock = (currentMinute + blockLength) >= duration;

    let treadBlock = getRandomTreadBlock(category, blockLength);
    attempts = 0;
    while (treadBlock && attempts < 20) {
      const alreadyUsed = usedTreadBlocks.has(treadBlock.join('|'));
      const badStartForFirstBlock = isFirstBlock && treadStartsWithRecover(treadBlock);
      const badEndForLastBlock = isLastBlock && treadEndsWithRecover(treadBlock);

      if (!alreadyUsed && !badStartForFirstBlock && !badEndForLastBlock) {
        break; // Found a good block
      }

      treadBlock = getRandomTreadBlock(category, blockLength);
      attempts++;
    }

    // If we couldn't find a perfect match, at least avoid RECOVER at start/end of round
    if (attempts >= 20 && treadBlock) {
      // Try one more time with relaxed constraints
      for (let i = 0; i < 10; i++) {
        const candidate = getRandomTreadBlock(category, blockLength);
        if (candidate) {
          const badStart = isFirstBlock && treadStartsWithRecover(candidate);
          const badEnd = isLastBlock && treadEndsWithRecover(candidate);
          if (!badStart && !badEnd) {
            treadBlock = candidate;
            break;
          }
        }
      }
    }

    // Fallback if no blocks found
    if (!floorBlock) floorBlock = ['Exercise ' + currentMinute];
    if (!treadBlock) treadBlock = ['6, 7, 8'];

    // Mark as used
    usedFloorBlocks.add(floorBlock.join('|'));
    usedTreadBlocks.add(treadBlock.join('|'));

    // Add block to round (truncate if needed to fit duration)
    const minutesToAdd = Math.min(floorBlock.length, remaining);

    for (let i = 0; i < minutesToAdd; i++) {
      const energyLevel = getEnergyLevel(currentMinute, duration);

      floorEntries.push({
        minute: formatMinuteRange(currentMinute),
        exercises: floorBlock[i] || floorBlock[floorBlock.length - 1],
        exerciseIds: [],
        energyLevel,
        blockIndex: blockNumber,
        blockType
      });

      const treadEntry = parseTreadFromString(
        treadBlock[i] || treadBlock[treadBlock.length - 1],
        currentMinute
      );
      treadEntry.blockIndex = blockNumber;
      treadEntry.blockType = blockType;
      treadEntries.push(treadEntry);

      currentMinute++;
    }

    isFirstBlock = false;
  }

  return { tread: treadEntries, floor: floorEntries };
}

// Main generation function
export function generateClassFromBlocks(config: GeneratorConfig): ClassPlan {
  const usedFloorBlocks = new Set<string>();
  const usedTreadBlocks = new Set<string>();

  // Generate Round 1
  const round1Data = generateRound(
    config.round1Duration,
    1,
    usedFloorBlocks,
    usedTreadBlocks
  );

  const round1: Round = {
    number: 1,
    duration: config.round1Duration,
    equipment: config.round1Equipment,
    tread: round1Data.tread,
    floor: round1Data.floor
  };

  // Generate Round 2
  const round2Data = generateRound(
    config.round2Duration,
    2,
    usedFloorBlocks,
    usedTreadBlocks
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
