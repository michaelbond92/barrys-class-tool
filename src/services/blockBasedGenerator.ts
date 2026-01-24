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
import { calculateTreadAverage } from './treadParser';
import {
  getRandomFloorBlock,
  getRandomTreadBlock,
  getAvailableLengths,
  BlockCategory
} from '../data/exerciseBlocks';

// Parse tread notation from the block (e.g., "6, 7, 8 | 7, 8, 9")
// IMPORTANT: Preserves the original raw string from the block
function parseTreadFromString(treadStr: string, minute: number): TreadEntry {
  const lower = treadStr.toLowerCase();

  // Handle recover
  if (lower.includes('recover')) {
    return {
      minute: formatMinuteRange(minute),
      raw: treadStr.trim(),  // Preserve original
      speeds: [],
      isRecover: true,
      isSprint: false,
      inclinePercent: 0,
      lowestSpeed: 0,
      effectiveSpeed: 0,
      textColor: 'black'
    };
  }

  // Handle sprint
  const isSprint = lower.includes('sprint');

  // Extract incline if present (e.g., "3% 6, 7, 8")
  const inclineMatch = treadStr.match(/(\d+)%/);
  const inclinePercent = inclineMatch ? parseInt(inclineMatch[1]) : 0;

  // Extract ALL speed sets - find patterns like "6, 7, 8"
  const speedMatches = treadStr.match(/[\d.]+,\s*[\d.]+,\s*[\d.]+/g);
  const speeds: { low: number; mid: number; high: number }[] = [];

  if (speedMatches) {
    for (const match of speedMatches) {
      const nums = match.match(/[\d.]+/g);
      if (nums && nums.length >= 3) {
        speeds.push({
          low: parseFloat(nums[0]),
          mid: parseFloat(nums[1]),
          high: parseFloat(nums[2])
        });
      }
    }
  }

  // Use first speed set for average calculation (or default)
  const lowestSpeed = speeds.length > 0 ? speeds[0].low : 6;
  const effectiveSpeed = lowestSpeed + (inclinePercent * 0.2);

  // Determine text color
  let textColor: 'black' | 'red' | 'purple' = 'black';
  if (isSprint) {
    textColor = 'purple';
  } else if (inclinePercent > 0) {
    textColor = 'red';
  }

  return {
    minute: formatMinuteRange(minute),
    raw: treadStr.trim(),  // Preserve original block text
    speeds,
    isRecover: false,
    isSprint,
    inclinePercent,
    lowestSpeed,
    effectiveSpeed,
    textColor
  };
}

// Determine energy level based on position in round
function getEnergyLevel(minuteInRound: number, roundDuration: number, roundNumber: number): EnergyLevel {
  const progress = minuteInRound / roundDuration;

  // Only Round 1 has warmup (L1) phase - Round 2 goes straight to building
  if (roundNumber === 1 && progress < 0.25) return 'L1';  // First quarter of Round 1 - warmup
  if (progress > 0.85) return 'L3';  // Last bit - finisher
  return 'L2';  // Middle - building (and start of Round 2)
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

// ============================================
// RIGHT/LEFT BALANCING FOR FLOOR BLOCKS
// ============================================

// Check if a floor block contains "Right" exercises
function hasRightExercises(block: string[]): boolean {
  return block.some(line => /\bRight\b/i.test(line));
}

// Check if a floor block contains "Left" exercises
function hasLeftExercises(block: string[]): boolean {
  return block.some(line => /\bLeft\b/i.test(line));
}

// Check if a floor block is "Right-only" (has Right but not matching Left)
function isRightOnlyBlock(block: string[]): boolean {
  return hasRightExercises(block) && !hasLeftExercises(block);
}

// Create the Left version of a block by replacing "Right" with "Left"
function createLeftVersion(block: string[]): string[] {
  return block.map(line => line.replace(/\bRight\b/g, 'Left'));
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

  // Track forced Left block for Right/Left balancing
  let forcedLeftFloorBlock: string[] | null = null;
  let forcedLeftLibraryIndex = 0;
  let forcedLeftLibraryTotal = 0;

  while (currentMinute < duration) {
    const remaining = duration - currentMinute;
    blockNumber++;  // Increment for each new block

    // Determine category (warmup for first block, workout for rest)
    const category: BlockCategory = (isFirstBlock && roundNumber === 1) ? 'warmups' : 'workouts';
    const blockType: 'warmup' | 'workout' = category === 'warmups' ? 'warmup' : 'workout';

    // Pick a block length
    const blockLength = pickBlockLength(remaining, category);

    // Check if this could be the last block (or second-to-last)
    const isLastBlock = (currentMinute + blockLength) >= duration;
    const wouldBeLastIfRightOnly = (currentMinute + blockLength * 2) > duration;

    // Get floor block - either forced Left or random selection
    let floorBlock: string[];
    let floorLibraryIndex: number;
    let floorLibraryTotal: number;

    if (forcedLeftFloorBlock) {
      // Use the forced Left block from previous Right block
      floorBlock = forcedLeftFloorBlock;
      floorLibraryIndex = forcedLeftLibraryIndex;
      floorLibraryTotal = forcedLeftLibraryTotal;
      forcedLeftFloorBlock = null; // Clear the forced block
    } else {
      // Get random floor block of this length
      let floorSelection = getRandomFloorBlock(category, blockLength);
      let attempts = 0;

      // Keep trying to find a suitable block
      while (floorSelection && attempts < 20) {
        const alreadyUsed = usedFloorBlocks.has(floorSelection.block.join('|'));
        // Don't pick Right-only blocks if this would be the last block or if there's no room for Left follow-up
        const badRightOnlyAtEnd = isRightOnlyBlock(floorSelection.block) && (isLastBlock || wouldBeLastIfRightOnly);

        if (!alreadyUsed && !badRightOnlyAtEnd) {
          break; // Found a good block
        }

        floorSelection = getRandomFloorBlock(category, blockLength);
        attempts++;
      }

      floorBlock = floorSelection?.block || ['Exercise ' + currentMinute];
      floorLibraryIndex = floorSelection?.index || 0;
      floorLibraryTotal = floorSelection?.total || 0;

      // If this is a Right-only block, set up the Left version for the next block
      if (isRightOnlyBlock(floorBlock) && !isLastBlock) {
        forcedLeftFloorBlock = createLeftVersion(floorBlock);
        forcedLeftLibraryIndex = floorLibraryIndex; // Same library index (it's the same block, just Left version)
        forcedLeftLibraryTotal = floorLibraryTotal;
      }
    }

    // Get random tread block of same length
    // Additional constraints:
    // - First block of round should NOT start with RECOVER
    // - Last block of round should ideally end with SPRINT (not RECOVER)
    let treadSelection = getRandomTreadBlock(category, blockLength);
    let treadAttempts = 0;
    while (treadSelection && treadAttempts < 20) {
      const alreadyUsed = usedTreadBlocks.has(treadSelection.block.join('|'));
      const badStartForFirstBlock = isFirstBlock && treadStartsWithRecover(treadSelection.block);
      const badEndForLastBlock = isLastBlock && treadEndsWithRecover(treadSelection.block);

      if (!alreadyUsed && !badStartForFirstBlock && !badEndForLastBlock) {
        break; // Found a good block
      }

      treadSelection = getRandomTreadBlock(category, blockLength);
      treadAttempts++;
    }

    // If we couldn't find a perfect match, at least avoid RECOVER at start/end of round
    if (treadAttempts >= 20 && treadSelection) {
      // Try one more time with relaxed constraints
      for (let i = 0; i < 10; i++) {
        const candidate = getRandomTreadBlock(category, blockLength);
        if (candidate) {
          const badStart = isFirstBlock && treadStartsWithRecover(candidate.block);
          const badEnd = isLastBlock && treadEndsWithRecover(candidate.block);
          if (!badStart && !badEnd) {
            treadSelection = candidate;
            break;
          }
        }
      }
    }

    // Tread block fallback
    const treadBlock = treadSelection?.block || ['6, 7, 8'];
    const treadLibraryIndex = treadSelection?.index || 0;
    const treadLibraryTotal = treadSelection?.total || 0;

    // Mark as used
    usedFloorBlocks.add(floorBlock.join('|'));
    usedTreadBlocks.add(treadBlock.join('|'));

    // Add block to round (truncate if needed to fit duration)
    const minutesToAdd = Math.min(floorBlock.length, remaining);

    for (let i = 0; i < minutesToAdd; i++) {
      const energyLevel = getEnergyLevel(currentMinute, duration, roundNumber);

      floorEntries.push({
        minute: formatMinuteRange(currentMinute),
        exercises: floorBlock[i] || floorBlock[floorBlock.length - 1],
        exerciseIds: [],
        energyLevel,
        blockIndex: blockNumber,
        blockType,
        libraryIndex: floorLibraryIndex,
        libraryTotal: floorLibraryTotal
      });

      const treadEntry = parseTreadFromString(
        treadBlock[i] || treadBlock[treadBlock.length - 1],
        currentMinute
      );
      treadEntry.blockIndex = blockNumber;
      treadEntry.blockType = blockType;
      treadEntry.libraryIndex = treadLibraryIndex;
      treadEntry.libraryTotal = treadLibraryTotal;
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
