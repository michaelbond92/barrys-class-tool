// ============================================================================
// Rule Extraction Service
// Analyzes imported Barry's class data to extract patterns and rules
// ============================================================================

import { loadIndexFromStorage } from './indexingService';
import {
  RoundMetadata,
  BlockMetadata,
  TreadBlockMetadata,
  PairedMinute,
  ExerciseMetadata,
  TreadMinuteMetadata,
} from '../types/hierarchyTypes';

// ============================================================================
// TYPES
// ============================================================================

export interface ExtractedPattern {
  rule: string;
  frequency: number;       // How often this pattern appears (0-1)
  occurrences: number;     // Absolute count
  total: number;           // Total possible occurrences
  examples: string[];      // Sample instances
  confidence: 'high' | 'medium' | 'low';
}

export interface TreadAnalysis {
  startingSpeeds: ExtractedPattern;
  speedRanges: ExtractedPattern;
  maxSpeeds: ExtractedPattern;
  runLengths: ExtractedPattern;
  inclinePatterns: ExtractedPattern;
  recoveryPlacement: ExtractedPattern;
}

export interface FloorAnalysis {
  warmupLength: ExtractedPattern;
  warmupExercises: ExtractedPattern;
  powerMovePlacement: ExtractedPattern;
  repRanges: ExtractedPattern;
  ladderPatterns: ExtractedPattern;
  finisherTypes: ExtractedPattern;
}

export interface StructureAnalysis {
  roundDurations: ExtractedPattern;
  roundSplits: ExtractedPattern;
  totalDurations: ExtractedPattern;
}

export interface ExtractionResult {
  tread: TreadAnalysis;
  floor: FloorAnalysis;
  structure: StructureAnalysis;
  summary: string[];
  dataStats: {
    totalClasses: number;
    totalRounds: number;
    totalMinutes: number;
    totalFloorBlocks: number;
    totalTreadBlocks: number;
  };
}

// ============================================================================
// MAIN EXTRACTION FUNCTION
// ============================================================================

export function extractRulesFromData(): ExtractionResult | null {
  const indexed = loadIndexFromStorage();
  if (!indexed) {
    console.warn('No indexed data available for rule extraction');
    return null;
  }

  const { classes, rounds, floorBlocks, treadBlocks } = indexed;

  // Calculate total minutes
  const totalMinutes = rounds.reduce((sum, r) => sum + r.duration, 0);

  const result: ExtractionResult = {
    tread: analyzeTreadPatterns(rounds),
    floor: analyzeFloorPatterns(rounds, floorBlocks),
    structure: analyzeStructure(rounds),
    summary: [],
    dataStats: {
      totalClasses: classes.length,
      totalRounds: rounds.length,
      totalMinutes,
      totalFloorBlocks: floorBlocks.length,
      totalTreadBlocks: treadBlocks.length,
    },
  };

  // Generate summary
  result.summary = generateSummary(result);

  return result;
}

// ============================================================================
// TREAD ANALYSIS
// ============================================================================

function analyzeTreadPatterns(rounds: RoundMetadata[]): TreadAnalysis {
  const startingSpeeds: Map<string, number> = new Map();
  const speedRanges: Map<number, number> = new Map();
  const maxSpeeds: Map<number, number> = new Map();
  const runLengths: number[] = [];
  const inclinePatterns: string[] = [];
  const recoveryPlacements: number[] = [];

  let totalRounds = 0;
  let roundsStartingWith5to7 = 0;

  for (const round of rounds) {
    if (!round.minutes || round.minutes.length === 0) continue;
    totalRounds++;

    // Analyze starting speeds
    const firstMinute = round.minutes[0]?.tread;
    if (firstMinute) {
      const speeds = firstMinute.speeds?.[0];
      if (speeds) {
        const range = `${speeds.low} - ${speeds.high}`;
        startingSpeeds.set(range, (startingSpeeds.get(range) || 0) + 1);

        // Check if starts with 5-7 range
        if (speeds.low >= 4.5 && speeds.low <= 5.5 && speeds.high >= 6.5 && speeds.high <= 7.5) {
          roundsStartingWith5to7++;
        }
      }
    }

    // Analyze speed ranges and max speeds
    for (const minute of round.minutes) {
      const tread = minute.tread;
      if (!tread?.speeds?.[0]) continue;

      const speeds = tread.speeds[0];
      const range = speeds.high - speeds.low;
      speedRanges.set(range, (speedRanges.get(range) || 0) + 1);
      maxSpeeds.set(speeds.high, (maxSpeeds.get(speeds.high) || 0) + 1);

      // Track incline patterns
      if (tread.inclinePercent > 0) {
        inclinePatterns.push(`${speeds.low}-${speeds.high} @ ${tread.inclinePercent}%`);
      }
    }

    // Analyze run lengths (consecutive non-recovery minutes)
    let currentRunLength = 0;
    for (let i = 0; i < round.minutes.length; i++) {
      const tread = round.minutes[i].tread;
      if (tread?.isRecover) {
        if (currentRunLength > 0) {
          runLengths.push(currentRunLength);
          recoveryPlacements.push(i);
        }
        currentRunLength = 0;
      } else {
        currentRunLength++;
      }
    }
    if (currentRunLength > 0) {
      runLengths.push(currentRunLength);
    }
  }

  // Calculate frequency distributions
  const totalSpeedEntries = Array.from(speedRanges.values()).reduce((a, b) => a + b, 0);

  return {
    startingSpeeds: {
      rule: 'Rounds typically start with 5-7 pace',
      frequency: totalRounds > 0 ? roundsStartingWith5to7 / totalRounds : 0,
      occurrences: roundsStartingWith5to7,
      total: totalRounds,
      examples: Array.from(startingSpeeds.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([range, count]) => `${range}: ${count}x`),
      confidence: roundsStartingWith5to7 / totalRounds > 0.7 ? 'high' : 'medium',
    },
    speedRanges: {
      rule: 'Speed ranges span 2 points (3 speeds)',
      frequency: totalSpeedEntries > 0 ? (speedRanges.get(2) || 0) / totalSpeedEntries : 0,
      occurrences: speedRanges.get(2) || 0,
      total: totalSpeedEntries,
      examples: Array.from(speedRanges.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([range, count]) => `Range of ${range}: ${count}x (${Math.round(count/totalSpeedEntries*100)}%)`),
      confidence: 'high',
    },
    maxSpeeds: {
      rule: 'Maximum speeds observed',
      frequency: 1,
      occurrences: Array.from(maxSpeeds.values()).reduce((a, b) => a + b, 0),
      total: totalSpeedEntries,
      examples: Array.from(maxSpeeds.entries())
        .sort((a, b) => b[0] - a[0])
        .slice(0, 8)
        .map(([speed, count]) => `${speed}: ${count}x`),
      confidence: 'high',
    },
    runLengths: {
      rule: 'Run lengths between recoveries',
      frequency: 1,
      occurrences: runLengths.length,
      total: runLengths.length,
      examples: calculateDistribution(runLengths).map(
        ([len, pct]) => `${len} min: ${pct}%`
      ),
      confidence: 'high',
    },
    inclinePatterns: {
      rule: 'Incline speed/grade combinations',
      frequency: inclinePatterns.length / Math.max(1, totalSpeedEntries),
      occurrences: inclinePatterns.length,
      total: totalSpeedEntries,
      examples: getMostCommon(inclinePatterns, 10),
      confidence: inclinePatterns.length > 20 ? 'high' : 'medium',
    },
    recoveryPlacement: {
      rule: 'Recovery minute placement within rounds',
      frequency: 1,
      occurrences: recoveryPlacements.length,
      total: recoveryPlacements.length,
      examples: calculateDistribution(recoveryPlacements).map(
        ([min, pct]) => `Minute ${min}: ${pct}%`
      ),
      confidence: 'medium',
    },
  };
}

// ============================================================================
// FLOOR ANALYSIS
// ============================================================================

function analyzeFloorPatterns(
  rounds: RoundMetadata[],
  blocks: BlockMetadata[]
): FloorAnalysis {
  const warmupLengths: number[] = [];
  const warmupExercises: string[] = [];
  const powerMovePlacements: { minute: number; duration: number; roundNum: number }[] = [];
  const repCounts: number[] = [];
  const ladderIncrements: number[] = [];
  const finisherTypes: string[] = [];

  for (const round of rounds) {
    if (!round.minutes) continue;

    let warmupCount = 0;
    const duration = round.duration;

    for (let i = 0; i < round.minutes.length; i++) {
      const minute = round.minutes[i];
      const floor = minute.floor;
      if (!floor) continue;

      // Track warmup (using isWarmup flag if available, or first few minutes)
      if (minute.isWarmup || i < 4) {
        if (minute.isWarmup) {
          warmupCount++;
          warmupExercises.push(floor.rawText);
        }
      }

      // Track power move placement
      if (floor.isPowerMove) {
        powerMovePlacements.push({
          minute: i,
          duration,
          roundNum: round.roundNumber,
        });
      }

      // Extract rep counts from raw text
      const repMatch = floor.rawText.match(/^(\d+)\s/);
      if (repMatch) {
        repCounts.push(parseInt(repMatch[1], 10));
      }

      // Track ladder patterns
      if (floor.ladder) {
        ladderIncrements.push(floor.ladder.increment);
      }
    }

    if (warmupCount > 0) {
      warmupLengths.push(warmupCount);
    }

    // Track finisher
    if (round.finisherType) {
      finisherTypes.push(round.finisherType);
    }
  }

  // Calculate power move placement as percentage of round
  const powerMovePercentages = powerMovePlacements.map(p => ({
    percentage: p.minute / p.duration,
    roundNum: p.roundNum,
  }));

  const r1PowerMoves = powerMovePercentages.filter(p => p.roundNum === 1);
  const r2PowerMoves = powerMovePercentages.filter(p => p.roundNum === 2);

  const r1Last20Percent = r1PowerMoves.filter(p => p.percentage >= 0.8).length;
  const r2AfterWarmup = r2PowerMoves.filter(p => p.percentage >= 0.2).length;

  return {
    warmupLength: {
      rule: 'Warmup block length',
      frequency: 1,
      occurrences: warmupLengths.length,
      total: warmupLengths.length,
      examples: calculateDistribution(warmupLengths).map(
        ([len, pct]) => `${len} minutes: ${pct}%`
      ),
      confidence: warmupLengths.length > 10 ? 'high' : 'medium',
    },
    warmupExercises: {
      rule: 'Common warmup exercises',
      frequency: 1,
      occurrences: warmupExercises.length,
      total: warmupExercises.length,
      examples: getMostCommon(warmupExercises, 15),
      confidence: 'high',
    },
    powerMovePlacement: {
      rule: 'Power moves in last 20% of R1, anytime in R2',
      frequency: r1PowerMoves.length > 0
        ? r1Last20Percent / r1PowerMoves.length
        : 0,
      occurrences: r1Last20Percent,
      total: r1PowerMoves.length,
      examples: [
        `R1: ${r1Last20Percent}/${r1PowerMoves.length} in last 20% (${Math.round(r1Last20Percent/Math.max(1,r1PowerMoves.length)*100)}%)`,
        `R2: ${r2AfterWarmup}/${r2PowerMoves.length} after warmup`,
        ...powerMovePlacements.slice(0, 5).map(p => `R${p.roundNum} min ${p.minute+1}/${p.duration}`),
      ],
      confidence: r1PowerMoves.length > 10 ? 'high' : 'medium',
    },
    repRanges: {
      rule: 'Rep count distribution',
      frequency: 1,
      occurrences: repCounts.length,
      total: repCounts.length,
      examples: calculateDistribution(repCounts).map(
        ([reps, pct]) => `${reps} reps: ${pct}%`
      ),
      confidence: 'high',
    },
    ladderPatterns: {
      rule: 'Ladder increment patterns',
      frequency: 1,
      occurrences: ladderIncrements.length,
      total: ladderIncrements.length,
      examples: calculateDistribution(ladderIncrements).map(
        ([inc, pct]) => `${inc > 0 ? '+' : ''}${inc}: ${pct}%`
      ),
      confidence: ladderIncrements.length > 5 ? 'high' : 'low',
    },
    finisherTypes: {
      rule: 'Finisher exercise types',
      frequency: 1,
      occurrences: finisherTypes.length,
      total: rounds.length,
      examples: getMostCommon(finisherTypes, 10),
      confidence: 'high',
    },
  };
}

// ============================================================================
// STRUCTURE ANALYSIS
// ============================================================================

function analyzeStructure(rounds: RoundMetadata[]): StructureAnalysis {
  const r1Durations: number[] = [];
  const r2Durations: number[] = [];
  const roundSplits: string[] = [];
  const totalDurations: number[] = [];

  // Group rounds by class
  const classPairs: Map<string, { r1?: RoundMetadata; r2?: RoundMetadata }> = new Map();

  for (const round of rounds) {
    const classId = round.sourceClassId;
    if (!classPairs.has(classId)) {
      classPairs.set(classId, {});
    }
    const pair = classPairs.get(classId)!;
    if (round.roundNumber === 1) {
      pair.r1 = round;
      r1Durations.push(round.duration);
    } else {
      pair.r2 = round;
      r2Durations.push(round.duration);
    }
  }

  for (const [, pair] of classPairs) {
    if (pair.r1 && pair.r2) {
      const split = `${pair.r1.duration}/${pair.r2.duration}`;
      roundSplits.push(split);
      totalDurations.push(pair.r1.duration + pair.r2.duration);
    }
  }

  // Check if R1 is typically longer
  let r1LongerCount = 0;
  for (const [, pair] of classPairs) {
    if (pair.r1 && pair.r2 && pair.r1.duration > pair.r2.duration) {
      r1LongerCount++;
    }
  }

  return {
    roundDurations: {
      rule: 'Round duration patterns',
      frequency: 1,
      occurrences: rounds.length,
      total: rounds.length,
      examples: [
        `R1 durations: ${calculateDistribution(r1Durations).map(([d, p]) => `${d}min: ${p}%`).join(', ')}`,
        `R2 durations: ${calculateDistribution(r2Durations).map(([d, p]) => `${d}min: ${p}%`).join(', ')}`,
      ],
      confidence: 'high',
    },
    roundSplits: {
      rule: 'R1 is typically longer than R2',
      frequency: classPairs.size > 0 ? r1LongerCount / classPairs.size : 0,
      occurrences: r1LongerCount,
      total: classPairs.size,
      examples: getMostCommon(roundSplits, 10).map(s => `${s} split`),
      confidence: 'high',
    },
    totalDurations: {
      rule: 'Total round content (R1+R2) is 20-21 minutes',
      frequency: 1,
      occurrences: totalDurations.length,
      total: totalDurations.length,
      examples: calculateDistribution(totalDurations).map(
        ([d, pct]) => `${d} min total: ${pct}%`
      ),
      confidence: 'high',
    },
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function calculateDistribution(values: number[]): [number, number][] {
  if (values.length === 0) return [];

  const counts: Map<number, number> = new Map();
  for (const v of values) {
    counts.set(v, (counts.get(v) || 0) + 1);
  }

  const total = values.length;
  return Array.from(counts.entries())
    .map(([value, count]) => [value, Math.round((count / total) * 100)] as [number, number])
    .sort((a, b) => b[1] - a[1]);
}

function getMostCommon(items: string[], limit: number): string[] {
  const counts: Map<string, number> = new Map();
  for (const item of items) {
    counts.set(item, (counts.get(item) || 0) + 1);
  }

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([item, count]) => `${item}: ${count}x`);
}

function generateSummary(result: ExtractionResult): string[] {
  const summary: string[] = [];
  const stats = result.dataStats;

  summary.push(`Analyzed ${stats.totalClasses} classes, ${stats.totalRounds} rounds, ${stats.totalMinutes} total minutes`);
  summary.push('');

  // Tread findings
  summary.push('=== TREAD PATTERNS ===');
  summary.push(`Starting speeds: ${result.tread.startingSpeeds.frequency * 100}% start with ~5-7 pace`);
  summary.push(`Speed ranges: Most common is range of ${result.tread.speedRanges.examples[0]}`);
  summary.push(`Run lengths: ${result.tread.runLengths.examples.slice(0, 3).join(', ')}`);
  summary.push('');

  // Floor findings
  summary.push('=== FLOOR PATTERNS ===');
  summary.push(`Warmup length: ${result.floor.warmupLength.examples.slice(0, 2).join(', ')}`);
  summary.push(`Power moves: ${result.floor.powerMovePlacement.examples.slice(0, 2).join(', ')}`);
  summary.push(`Rep ranges: ${result.floor.repRanges.examples.slice(0, 5).join(', ')}`);
  summary.push(`Finishers: ${result.floor.finisherTypes.examples.slice(0, 5).join(', ')}`);
  summary.push('');

  // Structure findings
  summary.push('=== STRUCTURE PATTERNS ===');
  summary.push(`R1 longer than R2: ${Math.round(result.structure.roundSplits.frequency * 100)}% of classes`);
  summary.push(`Common splits: ${result.structure.roundSplits.examples.slice(0, 5).join(', ')}`);
  summary.push(`Total durations: ${result.structure.totalDurations.examples.slice(0, 3).join(', ')}`);

  return summary;
}

// ============================================================================
// EXPORT FOR UI
// ============================================================================

export function getExtractionResultAsText(): string {
  const result = extractRulesFromData();
  if (!result) {
    return 'No data available. Please import class data first.';
  }

  return result.summary.join('\n');
}
