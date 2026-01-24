// ============================================================================
// Warmup Selection Service
// Selects contextually appropriate warmup exercises based on workout content
// ============================================================================

import { loadIndexFromStorage } from './indexingService';
import { BlockMetadata } from '../types/hierarchyTypes';

// ============================================================================
// WARMUP EXERCISE MAPPINGS
// Maps warmup exercises to the workout exercises they prepare for
// ============================================================================

interface WarmupMapping {
  warmupPattern: RegExp;
  preparedExercises: RegExp[];
  isUniversal?: boolean;  // Always good to include
  weight: number;         // Priority weight (higher = more likely to include)
}

const WARMUP_MAPPINGS: WarmupMapping[] = [
  {
    // WGS (World's Greatest Stretch) - Universal, especially good for running
    warmupPattern: /\bwgs\b|world.*greatest/i,
    preparedExercises: [/.*/],  // Universal - matches any exercise
    isUniversal: true,
    weight: 100,
  },
  {
    // Cat/Cow - Prepares for core, planks, AND rows
    warmupPattern: /cat[\s/]*cow|cat[\s/]*camel/i,
    preparedExercises: [
      /plank/i,
      /crunch/i,
      /sit[\s-]*up/i,
      /core/i,
      /twist/i,
      /row/i,
      /renegade/i,
      /bird[\s-]*dog/i,
      /hollow/i,
      /dead[\s-]*bug/i,
      /mountain[\s-]*climb/i,
    ],
    isUniversal: true,
    weight: 100,
  },
  {
    // Bodyweight Squats - Prepares for heavy squats, lunges, goblet squats
    warmupPattern: /\bbw\b.*squat|bodyweight.*squat|air\s*squat/i,
    preparedExercises: [
      /squat/i,
      /lunge/i,
      /goblet/i,
      /sumo/i,
      /step[\s-]*up/i,
      /box/i,
    ],
    weight: 80,
  },
  {
    // Good Mornings - Prepares for deadlifts, RDLs, hinges
    warmupPattern: /good\s*morning|\bgm\b/i,
    preparedExercises: [
      /deadlift/i,
      /\bdl\b/i,
      /rdl/i,
      /romanian/i,
      /hinge/i,
      /swing/i,
      /snatch/i,
      /clean/i,
    ],
    weight: 80,
  },
  {
    // Hip Circles / Hip Openers - Good for hip-intensive work
    warmupPattern: /hip\s*(circle|opener|stretch)/i,
    preparedExercises: [
      /squat/i,
      /lunge/i,
      /deadlift/i,
      /hip/i,
    ],
    weight: 60,
  },
  {
    // Arm Circles - Prepares for pressing and pulling
    warmupPattern: /arm\s*circle/i,
    preparedExercises: [
      /press/i,
      /push/i,
      /row/i,
      /curl/i,
      /shoulder/i,
    ],
    weight: 40,
  },
  {
    // Down Dog - Prepares for shoulder and core work
    warmupPattern: /down\s*dog|\bdd\b/i,
    preparedExercises: [
      /shoulder/i,
      /press/i,
      /plank/i,
      /push[\s-]*up/i,
    ],
    weight: 50,
  },
  {
    // Inchworm - Full body warmup, good for push work
    warmupPattern: /inchworm|inch\s*worm/i,
    preparedExercises: [
      /push[\s-]*up/i,
      /plank/i,
      /burpee/i,
      /press/i,
    ],
    weight: 60,
  },
];

// ============================================================================
// WARMUP SELECTION FUNCTIONS
// ============================================================================

/**
 * Score a warmup block based on how well it prepares for the workout content
 * @param warmupBlock - The warmup block content
 * @param workoutContent - All workout exercises that will follow the warmup
 * @returns Score from 0-100
 */
export function scoreWarmupRelevance(warmupBlock: string[], workoutContent: string[]): number {
  const warmupText = warmupBlock.join(' ').toLowerCase();
  const workoutText = workoutContent.join(' ').toLowerCase();

  let score = 0;
  let matchedMappings = 0;

  for (const mapping of WARMUP_MAPPINGS) {
    // Check if warmup contains this warmup exercise
    if (mapping.warmupPattern.test(warmupText)) {
      // Universal exercises get base score just for being present
      if (mapping.isUniversal) {
        score += mapping.weight * 0.5;
        matchedMappings++;
      }

      // Check if any workout exercises match what this warmup prepares for
      for (const preparedPattern of mapping.preparedExercises) {
        if (preparedPattern.test(workoutText)) {
          score += mapping.weight;
          matchedMappings++;
          break;  // Only count once per mapping
        }
      }
    }
  }

  // Normalize to 0-100 range
  const maxPossibleScore = WARMUP_MAPPINGS.reduce((sum, m) => sum + m.weight, 0);
  return Math.min(100, (score / maxPossibleScore) * 100);
}

/**
 * Check if a warmup block contains both WGS and Cat/Cow (should be 80% of the time)
 */
export function hasWgsAndCatCow(warmupBlock: string[]): { hasWgs: boolean; hasCatCow: boolean } {
  const text = warmupBlock.join(' ').toLowerCase();
  return {
    hasWgs: /\bwgs\b|world.*greatest/i.test(text),
    hasCatCow: /cat[\s/]*cow|cat[\s/]*camel/i.test(text),
  };
}

/**
 * Select the best warmup block for the given workout content
 * @param workoutContent - All workout exercises for the round
 * @param requireWgsAndCatCow - If true, strongly prefer warmups with both WGS and Cat/Cow
 * @returns Selected warmup block or null if no suitable block found
 */
export function selectContextualWarmup(
  workoutContent: string[],
  requireWgsAndCatCow: boolean = true
): BlockMetadata | null {
  const index = loadIndexFromStorage();
  if (!index || index.floorBlocks.length === 0) {
    return null;
  }

  // Get all warmup blocks from Round 1 only
  const warmupBlocks = index.floorBlocks.filter(
    block => block.category === 'warmups' && block.sourceRoundNumber === 1
  );

  if (warmupBlocks.length === 0) {
    return null;
  }

  // Score each warmup block
  const scoredBlocks = warmupBlocks.map(block => {
    const relevanceScore = scoreWarmupRelevance(block.content, workoutContent);
    const { hasWgs, hasCatCow } = hasWgsAndCatCow(block.content);

    // Bonus for having both WGS and Cat/Cow (80% of warmups should have this)
    let universalBonus = 0;
    if (requireWgsAndCatCow) {
      if (hasWgs && hasCatCow) {
        universalBonus = 30;  // Strong bonus for having both
      } else if (hasWgs || hasCatCow) {
        universalBonus = 15;  // Partial bonus for having one
      }
    }

    // Freshness bonus (prefer less-used blocks)
    const freshnessBonus = block.useCount === 0 ? 10 : block.useCount === 1 ? 5 : 0;

    return {
      block,
      score: relevanceScore + universalBonus + freshnessBonus,
      hasWgs,
      hasCatCow,
    };
  });

  // Sort by score (highest first)
  scoredBlocks.sort((a, b) => b.score - a.score);

  // If we need WGS + Cat/Cow (80% of the time), check if top choices have it
  if (requireWgsAndCatCow) {
    // Filter to only blocks with both WGS and Cat/Cow
    const withBoth = scoredBlocks.filter(s => s.hasWgs && s.hasCatCow);

    if (withBoth.length > 0) {
      // Pick randomly from top 3 with both
      const topWithBoth = withBoth.slice(0, Math.min(3, withBoth.length));
      const selected = topWithBoth[Math.floor(Math.random() * topWithBoth.length)];
      return selected.block;
    }

    // If no blocks have both, try to find one with at least one
    const withOne = scoredBlocks.filter(s => s.hasWgs || s.hasCatCow);
    if (withOne.length > 0) {
      const selected = withOne[0];
      return selected.block;
    }
  }

  // Fall back to highest scored block
  if (scoredBlocks.length > 0) {
    // Pick randomly from top 3
    const top = scoredBlocks.slice(0, Math.min(3, scoredBlocks.length));
    const selected = top[Math.floor(Math.random() * top.length)];
    return selected.block;
  }

  return null;
}

/**
 * Get workout content from the planned workout blocks
 * This is used to determine which warmup exercises are most relevant
 */
export function extractWorkoutContent(workoutBlocks: BlockMetadata[]): string[] {
  return workoutBlocks.flatMap(block => block.content);
}

/**
 * Determine if we should enforce WGS + Cat/Cow requirement
 * Returns true 80% of the time
 */
export function shouldRequireWgsAndCatCow(): boolean {
  return Math.random() < 0.8;
}

// ============================================================================
// WARMUP VALIDATION
// ============================================================================

/**
 * Validate that a generated class has proper warmup structure
 */
export function validateWarmupStructure(
  round1Content: string[],
  warmupDuration: number
): {
  isValid: boolean;
  hasWarmup: boolean;
  warmupMinutes: number;
  issues: string[];
} {
  const issues: string[] = [];
  const warmupContent = round1Content.slice(0, warmupDuration);

  // Check if warmup exists
  const hasWarmup = warmupDuration > 0;
  if (!hasWarmup) {
    issues.push('Round 1 is missing warmup block');
  }

  // Check for WGS and Cat/Cow
  const { hasWgs, hasCatCow } = hasWgsAndCatCow(warmupContent);
  if (!hasWgs && !hasCatCow) {
    issues.push('Warmup is missing both WGS and Cat/Cow - consider adding one or both');
  }

  return {
    isValid: hasWarmup && issues.length === 0,
    hasWarmup,
    warmupMinutes: warmupDuration,
    issues,
  };
}
