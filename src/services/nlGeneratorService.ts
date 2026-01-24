// ============================================================================
// NL Generator Service
// Natural language-guided class generation
// ============================================================================

import { ClassPlan, Round, FloorEntry, TreadEntry, GeneratorConfig, Equipment } from '../types';
import { BlockMetadata, TreadBlockMetadata, SearchConstraints, FinisherType } from '../types/hierarchyTypes';
import { loadIndexFromStorage } from './indexingService';
import { parseQuery, interpretQuery, calculateMatchScore } from './queryParserService';
import { calculateTreadAverage, parseTreadEntry } from './treadParser';

// Simple ID generator
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// ============================================================================
// TYPES
// ============================================================================

export interface GenerationQuery {
  duration?: number;
  roundCount?: 1 | 2;
  bodyFocus?: string[];
  movementPatterns?: string[];
  finisherType?: FinisherType;
  intensity?: 'high' | 'medium' | 'low';
  equipment?: Equipment;
  constraints?: string[];
}

export interface NLGenerationResult {
  classPlan: ClassPlan;
  matchExplanation: string;
  alternatives: ClassPlan[];
  query: string;
  parsedConstraints: SearchConstraints;
}

interface ScoredBlock {
  block: BlockMetadata | TreadBlockMetadata;
  score: number;
  matchedFields: string[];
}

// ============================================================================
// MAIN GENERATION FUNCTION
// ============================================================================

/**
 * Generate a class plan from a natural language query
 */
export async function generateFromNaturalLanguage(
  query: string,
  config?: Partial<GeneratorConfig>
): Promise<NLGenerationResult> {
  // 1. Parse query to constraints
  const constraints = parseQuery(query);

  // 2. Load indexed data
  const indexed = loadIndexFromStorage();
  if (!indexed || indexed.floorBlocks.length === 0) {
    throw new Error('No imported data available. Please import a class spreadsheet first.');
  }

  // 3. Score and rank blocks
  const scoredFloorBlocks = scoreBlocks(indexed.floorBlocks, constraints);
  const scoredTreadBlocks = scoreBlocks(indexed.treadBlocks, constraints);

  // 4. Determine configuration
  const effectiveConfig = buildEffectiveConfig(constraints, config);

  // 5. Build class plans
  const primary = buildClassPlanFromBlocks(
    scoredFloorBlocks,
    scoredTreadBlocks,
    effectiveConfig,
    0
  );

  // 6. Build alternatives (offset by different starting points)
  const alternatives = [
    buildClassPlanFromBlocks(scoredFloorBlocks, scoredTreadBlocks, effectiveConfig, 1),
    buildClassPlanFromBlocks(scoredFloorBlocks, scoredTreadBlocks, effectiveConfig, 2),
  ].filter((alt): alt is ClassPlan => alt !== null);

  // 7. Generate explanation
  const matchExplanation = generateExplanation(query, constraints, primary);

  return {
    classPlan: primary,
    matchExplanation,
    alternatives,
    query,
    parsedConstraints: constraints,
  };
}

// ============================================================================
// BLOCK SCORING
// ============================================================================

/**
 * Score blocks against search constraints
 */
function scoreBlocks<T extends BlockMetadata | TreadBlockMetadata>(
  blocks: T[],
  constraints: SearchConstraints
): ScoredBlock[] {
  return blocks
    .map(block => {
      // Convert block to entity format for scoring
      const entity = {
        duration: block.length,
        bodyFocus: 'bodyFocus' in block ? (block as BlockMetadata).bodyFocus : undefined,
        movementPatterns: 'movementPatterns' in block ? (block as BlockMetadata).movementPatterns : undefined,
        flowScore: 'flowScore' in block ? (block as BlockMetadata).flowScore : undefined,
        hasIncline: 'hasIncline' in block ? (block as TreadBlockMetadata).hasIncline : undefined,
      };

      const { score, matchedFields } = calculateMatchScore(entity, constraints);

      return { block, score, matchedFields };
    })
    .sort((a, b) => b.score - a.score);
}

// ============================================================================
// CONFIG BUILDING
// ============================================================================

/**
 * Build effective config from constraints and user overrides
 */
function buildEffectiveConfig(
  constraints: SearchConstraints,
  userConfig?: Partial<GeneratorConfig>
): GeneratorConfig {
  // Default values
  let round1Duration = 10;
  let round2Duration = 10;

  // Extract duration from constraints
  if (constraints.duration) {
    const avgDuration = Math.round(((constraints.duration.min || 10) + (constraints.duration.max || 10)) / 2);
    round1Duration = avgDuration;
    round2Duration = avgDuration;
  }

  // Determine equipment from constraints
  let equipment: Equipment = '2 Heavy Dumbbells';
  if (constraints.equipment) {
    if (constraints.equipment.includes('heavy')) {
      equipment = '2 Heavy Dumbbells';
    } else if (constraints.equipment.includes('medium')) {
      equipment = '2 Mediums';
    } else if (constraints.equipment.includes('light')) {
      equipment = '2 Light Dumbbells';
    }
  }

  return {
    classType: 'total_body',
    date: new Date().toISOString().split('T')[0],
    round1Duration: userConfig?.round1Duration ?? round1Duration,
    round2Duration: userConfig?.round2Duration ?? round2Duration,
    round1Equipment: userConfig?.round1Equipment ?? equipment,
    round2Equipment: userConfig?.round2Equipment ?? equipment,
    maxTreadAverage: userConfig?.maxTreadAverage ?? 8.0,
    ...userConfig,
  };
}

// ============================================================================
// CLASS PLAN BUILDING
// ============================================================================

/**
 * Build a class plan from scored blocks
 */
function buildClassPlanFromBlocks(
  scoredFloorBlocks: ScoredBlock[],
  scoredTreadBlocks: ScoredBlock[],
  config: GeneratorConfig,
  offset: number
): ClassPlan {
  const floorBlocks = scoredFloorBlocks.map(s => s.block as BlockMetadata);
  const treadBlocks = scoredTreadBlocks.map(s => s.block as TreadBlockMetadata);

  // Select blocks for each round
  const round1Floor = selectBlocksForDuration(
    floorBlocks.filter(b => b.category === 'warmups' || b.category === 'workouts'),
    config.round1Duration,
    offset
  );
  const round2Floor = selectBlocksForDuration(
    floorBlocks.filter(b => b.category === 'workouts'),
    config.round2Duration,
    offset + round1Floor.length
  );

  const round1Tread = selectBlocksForDuration(
    treadBlocks.filter(b => b.category === 'warmups' || b.category === 'workouts'),
    config.round1Duration,
    offset
  );
  const round2Tread = selectBlocksForDuration(
    treadBlocks.filter(b => b.category === 'workouts'),
    config.round2Duration,
    offset + round1Tread.length
  );

  // Convert to entries
  const round1FloorEntries = blocksToFloorEntries(round1Floor, 1);
  const round2FloorEntries = blocksToFloorEntries(round2Floor, 2);
  const round1TreadEntries = blocksToTreadEntries(round1Tread, 1);
  const round2TreadEntries = blocksToTreadEntries(round2Tread, 2);

  // Build rounds
  const round1: Round = {
    number: 1,
    duration: config.round1Duration,
    equipment: config.round1Equipment,
    tread: round1TreadEntries,
    floor: round1FloorEntries,
  };

  const round2: Round = {
    number: 2,
    duration: config.round2Duration,
    equipment: config.round2Equipment,
    tread: round2TreadEntries,
    floor: round2FloorEntries,
  };

  // Calculate tread average
  const allTreadEntries = [...round1TreadEntries, ...round2TreadEntries];
  const treadAverage = calculateTreadAverage(allTreadEntries);

  return {
    id: generateId(),
    date: config.date,
    classType: config.classType,
    round1,
    round2,
    treadAverage,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Select blocks to fill a target duration
 */
function selectBlocksForDuration<T extends BlockMetadata | TreadBlockMetadata>(
  blocks: T[],
  targetDuration: number,
  offset: number
): T[] {
  const selected: T[] = [];
  let totalDuration = 0;
  let index = offset % Math.max(1, blocks.length);

  while (totalDuration < targetDuration && blocks.length > 0) {
    const block = blocks[index % blocks.length];
    if (totalDuration + block.length <= targetDuration + 1) { // Allow 1 min overflow
      selected.push(block);
      totalDuration += block.length;
    }
    index++;

    // Prevent infinite loop
    if (index > blocks.length * 2) break;
  }

  return selected;
}

/**
 * Convert floor blocks to floor entries
 */
function blocksToFloorEntries(blocks: BlockMetadata[], roundNumber: number): FloorEntry[] {
  const entries: FloorEntry[] = [];
  let minute = 1;
  let blockIndex = 1;

  for (const block of blocks) {
    for (let i = 0; i < block.content.length; i++) {
      entries.push({
        minute: String(minute),
        exercises: block.content[i],
        exerciseIds: [],
        energyLevel: i === block.content.length - 1 ? 'L3' : 'L2',
        blockIndex,
        blockType: block.category === 'warmups' ? 'warmup' : 'workout',
        blockLength: block.length,
      });
      minute++;
    }
    blockIndex++;
  }

  return entries;
}

/**
 * Convert tread blocks to tread entries
 */
function blocksToTreadEntries(blocks: TreadBlockMetadata[], roundNumber: number): TreadEntry[] {
  const entries: TreadEntry[] = [];
  let minute = 1;
  let blockIndex = 1;

  for (const block of blocks) {
    for (let i = 0; i < block.content.length; i++) {
      const rawText = block.content[i];
      const parsed = parseTreadEntry(rawText);

      entries.push({
        minute: String(minute),
        raw: rawText,
        speeds: parsed.speeds,
        isRecover: parsed.isRecover,
        isSprint: parsed.isSprint,
        inclinePercent: parsed.inclinePercent,
        lowestSpeed: parsed.lowestSpeed,
        effectiveSpeed: parsed.effectiveSpeed,
        textColor: parsed.textColor,
        blockIndex,
        blockType: block.category === 'warmups' ? 'warmup' : 'workout',
        blockLength: block.length,
      });
      minute++;
    }
    blockIndex++;
  }

  return entries;
}

// ============================================================================
// EXPLANATION GENERATION
// ============================================================================

/**
 * Generate a human-readable explanation of the generation
 */
function generateExplanation(
  query: string,
  constraints: SearchConstraints,
  classPlan: ClassPlan
): string {
  const parts: string[] = [];

  // Summarize what was understood
  const interpretation = interpretQuery(constraints);
  parts.push(interpretation);

  // Add class summary
  parts.push(`Generated a ${classPlan.round1.duration + classPlan.round2.duration} min class`);
  parts.push(`with tread average of ${classPlan.treadAverage.toFixed(1)}`);

  // Add block counts
  const floorBlockCount =
    (classPlan.round1.floor.filter(e => e.blockIndex === 1).length > 0 ? 1 : 0) +
    (classPlan.round1.floor.filter(e => e.blockIndex === 2).length > 0 ? 1 : 0) +
    (classPlan.round2.floor.filter(e => e.blockIndex === 1).length > 0 ? 1 : 0) +
    (classPlan.round2.floor.filter(e => e.blockIndex === 2).length > 0 ? 1 : 0);

  parts.push(`using ${floorBlockCount} floor blocks`);

  return parts.join('. ') + '.';
}

// ============================================================================
// QUERY ENHANCEMENT
// ============================================================================

/**
 * Get generation examples for the UI
 */
export function getGenerationExamples(): string[] {
  return [
    '10 min push/pull with snatch finisher',
    '12 min round with incline, heavy weights',
    'chest and back focus with good flow',
    'high intensity with burpee finisher',
    'lower body focus, no grip intensive',
    '8 min warmup into 12 min workout',
  ];
}

/**
 * Validate if a query is suitable for generation
 */
export function validateGenerationQuery(query: string): {
  isValid: boolean;
  suggestions: string[];
  warnings: string[];
} {
  const trimmed = query.trim();

  if (trimmed.length < 3) {
    return {
      isValid: false,
      suggestions: getGenerationExamples(),
      warnings: ['Query too short. Try describing your ideal class.'],
    };
  }

  const constraints = parseQuery(query);
  const warnings: string[] = [];

  // Check if any meaningful constraints were parsed
  const hasConstraints = Object.keys(constraints).length > 1 ||
    (Object.keys(constraints).length === 1 && !constraints.textQuery);

  if (!hasConstraints) {
    warnings.push('No specific filters detected. Results will be semi-random.');
  }

  return {
    isValid: true,
    suggestions: [],
    warnings,
  };
}
