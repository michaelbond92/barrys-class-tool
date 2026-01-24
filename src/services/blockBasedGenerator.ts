// Block-based class generator using real Barry's class patterns
// Floor and Tread blocks are separate - can mix and match by length

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
import { calculateTreadAverage } from './treadParser';
import {
  getRandomFloorBlock,
  getRandomTreadBlock,
  getAvailableLengths,
  BlockCategory,
  getAllTreadBlocks,
  getAllFloorBlocks
} from '../data/exerciseBlocks';
import {
  selectContextualWarmup,
  shouldRequireWgsAndCatCow,
  scoreWarmupRelevance,
  hasWgsAndCatCow
} from './warmupSelectionService';
import {
  analyzeTreadBlock,
  scoreBlockFlow,
  getPositionInRound,
  TreadBlockProfile
} from './treadFlowService';

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

// Check if a floor block starts with SAME
function floorStartsWithSame(block: string[]): boolean {
  return block.length > 0 && block[0].toLowerCase().startsWith('same');
}

// Check if a floor block ends with SAME
function floorEndsWithSame(block: string[]): boolean {
  return block.length > 0 && block[block.length - 1].toLowerCase().startsWith('same');
}

// Get the content of the most recent complete tread block from entries
function getPreviousBlockContent(treadEntries: TreadEntry[]): string[] | null {
  if (treadEntries.length === 0) return null;

  // Find the last block index
  const lastEntry = treadEntries[treadEntries.length - 1];
  const lastBlockIndex = lastEntry.blockIndex;

  // Collect all entries from that block
  const blockEntries = treadEntries.filter(e => e.blockIndex === lastBlockIndex);

  // Return the raw content as an array
  return blockEntries.map(e => e.raw);
}

// Plan block lengths that sum exactly to the target duration
// This ensures no blocks are truncated
function planBlockLengths(duration: number, category: BlockCategory): number[] {
  const available = getAvailableLengths(category);
  if (available.length === 0) return [duration]; // Fallback

  // Try to find a combination that sums exactly to duration
  // Use dynamic programming / greedy approach
  const result: number[] = [];
  let remaining = duration;

  // Shuffle available lengths for variety, but prefer 3-min blocks
  const shuffled = [...available].sort(() => Math.random() - 0.5);

  while (remaining > 0) {
    // Find lengths that could work
    const fitting = shuffled.filter(len => len <= remaining);

    if (fitting.length === 0) {
      // No block fits - this shouldn't happen with good data
      // but fall back to smallest available
      result.push(available[0] || 3);
      break;
    }

    // Check if any length divides evenly into remaining
    const exactFit = fitting.find(len => remaining % len === 0);

    // Check if picking a length leaves a valid remainder
    const validChoices = fitting.filter(len => {
      const newRemaining = remaining - len;
      if (newRemaining === 0) return true;
      // Check if remainder can be filled with available blocks
      return available.some(a => a <= newRemaining && newRemaining % a === 0) ||
             available.some(a => newRemaining === a);
    });

    let chosen: number;
    if (validChoices.length > 0) {
      // Prefer 3-min blocks, then 4-min
      const preferred = validChoices.find(l => l === 3) ||
                       validChoices.find(l => l === 4) ||
                       validChoices[Math.floor(Math.random() * validChoices.length)];
      chosen = preferred;
    } else if (exactFit) {
      chosen = exactFit;
    } else {
      // Just pick the largest that fits
      chosen = Math.max(...fitting);
    }

    result.push(chosen);
    remaining -= chosen;
  }

  return result;
}

// Generate a round by picking blocks
function generateRound(
  duration: number,
  roundNumber: number,
  usedFloorBlocks: Set<string>,
  usedTreadBlocks: Set<string>,
  equipment: Equipment
): { tread: TreadEntry[]; floor: FloorEntry[] } {
  const treadEntries: TreadEntry[] = [];
  const floorEntries: FloorEntry[] = [];
  let currentMinute = 0;
  let blockNumber = 0;

  // Determine category for this round
  const useWarmup = roundNumber === 1;

  // Plan block lengths upfront to ensure they sum exactly to duration
  // First block of Round 1 uses warmup category
  const warmupCategory: BlockCategory = 'warmups';
  const workoutCategory: BlockCategory = 'workouts';

  // Plan lengths: first block warmup (if Round 1), rest are workouts
  let plannedLengths: number[];
  let warmupLength = 0;
  if (useWarmup) {
    // Calculate warmup length (variable, typically 2-4 minutes)
    const warmupLengths = planBlockLengths(3, warmupCategory); // ~3 min warmup
    warmupLength = warmupLengths.reduce((a, b) => a + b, 0);
    const workoutLengths = planBlockLengths(duration - warmupLength, workoutCategory);
    plannedLengths = [...warmupLengths, ...workoutLengths];
  } else {
    plannedLengths = planBlockLengths(duration, workoutCategory);
  }

  // Verify lengths sum to duration, adjust if needed
  const totalPlanned = plannedLengths.reduce((a, b) => a + b, 0);
  if (totalPlanned !== duration) {
    // Fallback: use 3-min blocks
    plannedLengths = [];
    let remaining = duration;
    while (remaining > 0) {
      const len = Math.min(3, remaining);
      plannedLengths.push(len);
      remaining -= len;
    }
    warmupLength = useWarmup ? plannedLengths[0] : 0;
  }

  // For Round 1: Pre-select workout blocks to enable contextual warmup selection
  let preSelectedWorkoutContent: string[] = [];
  if (useWarmup) {
    // Get workout block lengths (skip warmup)
    const workoutLengths = plannedLengths.slice(warmupLength > 0 ? 1 : 0);

    // Sample some workout blocks to understand workout content
    for (const len of workoutLengths.slice(0, 3)) { // Sample first 3 blocks
      const workoutBlocks = getAllFloorBlocks(workoutCategory, len as 2 | 3 | 4, equipment);
      if (workoutBlocks.length > 0) {
        const randomBlock = workoutBlocks[Math.floor(Math.random() * workoutBlocks.length)];
        preSelectedWorkoutContent.push(...randomBlock.block);
      }
    }
  }

  // Determine if we should require WGS + Cat/Cow (80% of the time)
  const requireWgsAndCatCow = useWarmup ? shouldRequireWgsAndCatCow() : false;

  // Track forced Left block for Right/Left balancing
  let forcedLeftFloorBlock: string[] | null = null;
  let forcedLeftLibraryIndex = 0;
  let forcedLeftLibraryTotal = 0;
  let forcedLeftIsCustom = false;

  // Pre-selected contextual warmup for Round 1
  let contextualWarmupBlock: string[] | null = null;
  if (useWarmup && preSelectedWorkoutContent.length > 0) {
    const warmupSelection = selectContextualWarmup(preSelectedWorkoutContent, requireWgsAndCatCow);
    if (warmupSelection) {
      contextualWarmupBlock = warmupSelection.content;
    }
  }

  for (let blockIdx = 0; blockIdx < plannedLengths.length; blockIdx++) {
    const blockLength = plannedLengths[blockIdx];
    blockNumber++;

    const isFirstBlock = blockIdx === 0;
    const isLastBlock = blockIdx === plannedLengths.length - 1;

    // Determine category
    const category: BlockCategory = (isFirstBlock && useWarmup) ? warmupCategory : workoutCategory;
    const blockType: 'warmup' | 'workout' = category === 'warmups' ? 'warmup' : 'workout';

    // Check if there's room for a Left follow-up block
    const remainingAfterThis = plannedLengths.slice(blockIdx + 1).reduce((a, b) => a + b, 0);
    const canFitLeftFollowup = remainingAfterThis >= blockLength;

    // Get floor block - either forced Left, contextual warmup, or random selection
    let floorBlock: string[];
    let floorLibraryIndex: number;
    let floorLibraryTotal: number;
    let floorIsCustom: boolean;

    if (forcedLeftFloorBlock) {
      floorBlock = forcedLeftFloorBlock;
      floorLibraryIndex = forcedLeftLibraryIndex;
      floorLibraryTotal = forcedLeftLibraryTotal;
      floorIsCustom = forcedLeftIsCustom;
      forcedLeftFloorBlock = null;
    } else if (isFirstBlock && useWarmup && contextualWarmupBlock && contextualWarmupBlock.length >= blockLength) {
      // Use contextually selected warmup for first block of Round 1
      // Ensure warmup block fits the planned length
      floorBlock = contextualWarmupBlock.slice(0, blockLength);
      floorLibraryIndex = 1;
      floorLibraryTotal = 1;
      floorIsCustom = false;

      // Log warmup selection for debugging
      const { hasWgs, hasCatCow } = hasWgsAndCatCow(floorBlock);
      if (requireWgsAndCatCow && (!hasWgs || !hasCatCow)) {
        // If we required both but didn't get both, that's ok - we still use best available
        console.debug('Warmup selection: WGS=' + hasWgs + ', Cat/Cow=' + hasCatCow);
      }
    } else {
      let floorSelection = getRandomFloorBlock(category, blockLength, equipment);
      let attempts = 0;

      // For warmup blocks, score based on relevance to workout content
      if (category === 'warmups' && preSelectedWorkoutContent.length > 0) {
        const allWarmups = getAllFloorBlocks(category, blockLength, equipment);
        const scoredWarmups = allWarmups
          .filter(b => !usedFloorBlocks.has(b.block.join('|')))
          .map(b => ({
            ...b,
            score: scoreWarmupRelevance(b.block, preSelectedWorkoutContent),
            ...hasWgsAndCatCow(b.block)
          }))
          .sort((a, b) => {
            // Prioritize blocks with both WGS and Cat/Cow if required
            if (requireWgsAndCatCow) {
              const aHasBoth = a.hasWgs && a.hasCatCow;
              const bHasBoth = b.hasWgs && b.hasCatCow;
              if (aHasBoth !== bHasBoth) return bHasBoth ? 1 : -1;
            }
            return b.score - a.score;
          });

        if (scoredWarmups.length > 0) {
          // Pick from top 3 scored warmups
          const topN = scoredWarmups.slice(0, Math.min(3, scoredWarmups.length));
          const selected = topN[Math.floor(Math.random() * topN.length)];
          floorSelection = {
            block: selected.block,
            index: 1,
            total: scoredWarmups.length,
            isCustom: selected.isCustom
          };
        }
      } else {
        // Standard selection for workout blocks
        while (floorSelection && attempts < 30) {
          const alreadyUsed = usedFloorBlocks.has(floorSelection.block.join('|'));
          const badRightOnlyAtEnd = isRightOnlyBlock(floorSelection.block) && (isLastBlock || !canFitLeftFollowup);
          const badSameAtStart = isFirstBlock && floorStartsWithSame(floorSelection.block);
          const badSameAtEnd = isLastBlock && floorEndsWithSame(floorSelection.block);

          if (!alreadyUsed && !badRightOnlyAtEnd && !badSameAtStart && !badSameAtEnd) {
            break;
          }

          floorSelection = getRandomFloorBlock(category, blockLength, equipment);
          attempts++;
        }
      }

      floorBlock = floorSelection?.block || ['Exercise ' + currentMinute];
      floorLibraryIndex = floorSelection?.index || 0;
      floorLibraryTotal = floorSelection?.total || 0;
      floorIsCustom = floorSelection?.isCustom || false;

      if (isRightOnlyBlock(floorBlock) && !isLastBlock && canFitLeftFollowup) {
        forcedLeftFloorBlock = createLeftVersion(floorBlock);
        forcedLeftLibraryIndex = floorLibraryIndex;
        forcedLeftLibraryTotal = floorLibraryTotal;
        forcedLeftIsCustom = floorIsCustom;
      }
    }

    // Get tread block with flow awareness
    let treadBlock: string[];
    let treadLibraryIndex: number;
    let treadLibraryTotal: number;
    let treadIsCustom: boolean;

    // Determine position in round for flow scoring
    const position = getPositionInRound(currentMinute, duration);

    // Get the previous tread block's profile (if any non-warmup block exists)
    const prevTreadBlock = treadEntries.length > 0 && blockNumber > 1
      ? getPreviousBlockContent(treadEntries)
      : null;
    const prevProfile = prevTreadBlock ? analyzeTreadBlock(prevTreadBlock) : null;

    if (prevProfile && category === 'workouts') {
      // Flow-aware selection: score all candidates and pick best compatible one
      const allBlocks = getAllTreadBlocks(category, blockLength);
      const validCandidates = allBlocks
        .map((b, idx) => ({ ...b, originalIndex: idx + 1 }))
        .filter(b => {
          const key = b.block.join('|');
          if (usedTreadBlocks.has(key)) return false;
          if (isFirstBlock && treadStartsWithRecover(b.block)) return false;
          if (isLastBlock && treadEndsWithRecover(b.block)) return false;
          return true;
        });

      // Score candidates by flow compatibility
      const scoredCandidates = validCandidates.map(candidate => {
        const candidateProfile = analyzeTreadBlock(candidate.block);
        const score = scoreBlockFlow(prevProfile, candidateProfile, position);
        return { ...candidate, score, profile: candidateProfile };
      });

      // Sort by score (highest first)
      scoredCandidates.sort((a, b) => b.score - a.score);

      // Pick from top candidates (add some randomness among top scorers)
      const topCandidates = scoredCandidates.filter(c => c.score >= 60);
      const selection = topCandidates.length > 0
        ? topCandidates[Math.floor(Math.random() * Math.min(3, topCandidates.length))]
        : scoredCandidates[0];

      if (selection) {
        treadBlock = selection.block;
        treadLibraryIndex = selection.originalIndex;
        treadLibraryTotal = allBlocks.length;
        treadIsCustom = selection.isCustom;
      } else {
        // Fallback to random if no candidates
        const fallback = getRandomTreadBlock(category, blockLength);
        treadBlock = fallback?.block || Array(blockLength).fill('6, 7, 8');
        treadLibraryIndex = fallback?.index || 0;
        treadLibraryTotal = fallback?.total || 0;
        treadIsCustom = fallback?.isCustom || false;
      }
    } else {
      // First block or warmup: use original random selection with constraints
      let treadSelection = getRandomTreadBlock(category, blockLength);
      let treadAttempts = 0;

      while (treadSelection && treadAttempts < 30) {
        const alreadyUsed = usedTreadBlocks.has(treadSelection.block.join('|'));
        const badStartRecover = isFirstBlock && treadStartsWithRecover(treadSelection.block);
        const badEndRecover = isLastBlock && treadEndsWithRecover(treadSelection.block);

        if (!alreadyUsed && !badStartRecover && !badEndRecover) {
          break;
        }

        treadSelection = getRandomTreadBlock(category, blockLength);
        treadAttempts++;
      }

      treadBlock = treadSelection?.block || Array(blockLength).fill('6, 7, 8');
      treadLibraryIndex = treadSelection?.index || 0;
      treadLibraryTotal = treadSelection?.total || 0;
      treadIsCustom = treadSelection?.isCustom || false;
    }

    // Mark as used
    usedFloorBlocks.add(floorBlock.join('|'));
    usedTreadBlocks.add(treadBlock.join('|'));

    // Add FULL block to round - no truncation allowed
    for (let i = 0; i < blockLength; i++) {
      const energyLevel = getEnergyLevel(currentMinute, duration, roundNumber);

      floorEntries.push({
        minute: formatMinuteRange(currentMinute),
        exercises: floorBlock[i] || floorBlock[floorBlock.length - 1],
        exerciseIds: [],
        energyLevel,
        blockIndex: blockNumber,
        blockType,
        libraryIndex: floorLibraryIndex,
        libraryTotal: floorLibraryTotal,
        blockLength,
        isCustomBlock: floorIsCustom
      });

      const treadEntry = parseTreadFromString(
        treadBlock[i] || treadBlock[treadBlock.length - 1],
        currentMinute
      );
      treadEntry.blockIndex = blockNumber;
      treadEntry.blockType = blockType;
      treadEntry.libraryIndex = treadLibraryIndex;
      treadEntry.libraryTotal = treadLibraryTotal;
      treadEntry.blockLength = blockLength;
      treadEntry.isCustomBlock = treadIsCustom;
      treadEntries.push(treadEntry);

      currentMinute++;
    }
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
    usedTreadBlocks,
    config.round1Equipment
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
    usedTreadBlocks,
    config.round2Equipment
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
