// ============================================================================
// Vibe Comparison Service
// Compares generated output quality against imported input baseline
// ============================================================================

import { ClassPlan, Round, FloorEntry, TreadEntry } from '../types';
import {
  RoundMetadata,
  BlockMetadata,
  ExerciseMetadata,
  ExercisePosition,
} from '../types/hierarchyTypes';
import { loadIndexFromStorage } from './indexingService';
import { loadExerciseIndex, IndexedExercise } from './exerciseIndexingService';
import { detectPrimaryPosition, hasPositionTransition, calculateFlowScore } from './positionService';
import {
  detectComboMovement,
  detectEMOM,
  detectSplitType,
  detectLadder,
  detectGripDemand,
  isFinisherMove,
  isPowerMove,
} from './exerciseParserService';

// ============================================================================
// TYPES
// ============================================================================

export interface VibeMetrics {
  // Flow metrics
  avgFlowScore: number;
  flowScoreDistribution: { great: number; good: number; fair: number; poor: number };

  // Vibe matching (tread ↔ floor synchronization)
  vibeMatchRate: number;          // % of minutes where tread intensity matches floor
  sprintExplosiveMatchRate: number;  // Sprint on tread → explosive on floor
  recoverRestMatchRate: number;   // Recover on tread → low intensity on floor

  // Structure variety
  comboMovementRate: number;      // % of exercises with combo movements
  emomRate: number;               // % of exercises with EMOM
  ladderRate: number;             // % of exercises with ladders
  split30Rate: number;            // % with 30/30 splits
  split45Rate: number;            // % with 45/15 splits

  // Position flow
  avgPositionTransitions: number; // Avg transitions per block
  uniquePositionsPerBlock: number;

  // Finisher metrics
  finisherRate: number;           // % of rounds ending with finisher
  powerMoveRate: number;          // % of exercises that are power moves

  // Grip management
  avgGripLoadScore: number;
  gripBreakRate: number;          // % of blocks with proper grip breaks

  // Sample size
  totalExercises: number;
  totalBlocks: number;
  totalRounds: number;
}

export interface VibeComparison {
  imported: VibeMetrics;
  generated: VibeMetrics;
  differences: {
    metric: string;
    imported: number;
    generated: number;
    diff: number;
    diffPercent: number;
    status: 'good' | 'acceptable' | 'needs_improvement';
  }[];
  overallScore: number;  // 0-100 similarity score
  recommendations: string[];
}

// ============================================================================
// METRIC CALCULATION - IMPORTED DATA
// ============================================================================

/**
 * Calculate vibe metrics from imported indexed data
 */
export function calculateImportedMetrics(): VibeMetrics | null {
  const indexed = loadIndexFromStorage();
  if (!indexed || indexed.floorBlocks.length === 0) {
    return null;
  }

  const { rounds, floorBlocks } = indexed;

  // Collect all floor exercise texts
  const allExerciseTexts: string[] = [];
  for (const block of floorBlocks) {
    allExerciseTexts.push(...block.content);
  }

  // Calculate flow scores
  const flowScores: number[] = [];
  const flowDist = { great: 0, good: 0, fair: 0, poor: 0 };

  for (const block of floorBlocks) {
    const positions = block.content.map(text => detectPrimaryPosition(text));
    const flowResult = calculateFlowScore(positions);
    flowScores.push(flowResult.score);

    if (flowResult.score >= 85) flowDist.great++;
    else if (flowResult.score >= 70) flowDist.good++;
    else if (flowResult.score >= 50) flowDist.fair++;
    else flowDist.poor++;
  }

  // Calculate structure rates
  let comboCount = 0;
  let emomCount = 0;
  let ladderCount = 0;
  let split30Count = 0;
  let split45Count = 0;
  let finisherCount = 0;
  let powerMoveCount = 0;
  let positionTransitions = 0;
  let uniquePositionSum = 0;
  let gripLoadSum = 0;
  let gripBreakCount = 0;

  for (const text of allExerciseTexts) {
    if (detectComboMovement(text)) comboCount++;
    if (detectEMOM(text).isEMOM) emomCount++;
    if (detectLadder(text)) ladderCount++;
    const splitType = detectSplitType(text);
    if (splitType === '30_30') split30Count++;
    if (splitType === '45_15') split45Count++;
    if (isFinisherMove(text)) finisherCount++;
    if (isPowerMove(text)) powerMoveCount++;
    if (hasPositionTransition(text)) positionTransitions++;

    // Grip scoring
    const grip = detectGripDemand(text);
    if (grip === 'high') gripLoadSum += 3;
    else if (grip === 'medium') gripLoadSum += 2;
    else if (grip === 'low') gripLoadSum += 1;
  }

  // Per-block metrics
  for (const block of floorBlocks) {
    const positions = block.content.map(text => detectPrimaryPosition(text));
    const uniquePos = new Set(positions);
    uniquePositionSum += uniquePos.size;

    // Check for grip breaks
    const grips = block.content.map(text => detectGripDemand(text));
    for (let i = 1; i < grips.length - 1; i++) {
      const prev = grips[i - 1];
      const curr = grips[i];
      const next = grips[i + 1];
      if ((prev === 'high' || prev === 'medium') &&
          (curr === 'none' || curr === 'low') &&
          (next === 'high' || next === 'medium')) {
        gripBreakCount++;
        break;
      }
    }
  }

  // Vibe matching (requires round-level data)
  let vibeMatchCount = 0;
  let sprintExplosiveMatch = 0;
  let recoverRestMatch = 0;
  let treadFloorPairs = 0;

  for (const round of rounds) {
    for (const minute of round.minutes || []) {
      if (minute.tread && minute.floor) {
        treadFloorPairs++;
        const treadIsSprint = minute.tread.isSprint;
        const treadIsRecover = minute.tread.isRecover;
        const floorIsPower = isPowerMove(minute.floor.rawText);
        const floorIntensity = detectGripDemand(minute.floor.rawText);

        if (treadIsSprint && floorIsPower) {
          sprintExplosiveMatch++;
          vibeMatchCount++;
        } else if (treadIsRecover && (floorIntensity === 'none' || floorIntensity === 'low')) {
          recoverRestMatch++;
          vibeMatchCount++;
        } else if (!treadIsSprint && !treadIsRecover) {
          // Normal minute - count as match if intensity is moderate
          vibeMatchCount++;
        }
      }
    }
  }

  const totalExercises = allExerciseTexts.length;
  const totalBlocks = floorBlocks.length;
  const totalRounds = rounds.length;

  return {
    avgFlowScore: flowScores.length > 0 ? flowScores.reduce((a, b) => a + b, 0) / flowScores.length : 0,
    flowScoreDistribution: {
      great: flowDist.great / totalBlocks,
      good: flowDist.good / totalBlocks,
      fair: flowDist.fair / totalBlocks,
      poor: flowDist.poor / totalBlocks,
    },
    vibeMatchRate: treadFloorPairs > 0 ? vibeMatchCount / treadFloorPairs : 0,
    sprintExplosiveMatchRate: treadFloorPairs > 0 ? sprintExplosiveMatch / treadFloorPairs : 0,
    recoverRestMatchRate: treadFloorPairs > 0 ? recoverRestMatch / treadFloorPairs : 0,
    comboMovementRate: totalExercises > 0 ? comboCount / totalExercises : 0,
    emomRate: totalExercises > 0 ? emomCount / totalExercises : 0,
    ladderRate: totalExercises > 0 ? ladderCount / totalExercises : 0,
    split30Rate: totalExercises > 0 ? split30Count / totalExercises : 0,
    split45Rate: totalExercises > 0 ? split45Count / totalExercises : 0,
    avgPositionTransitions: totalExercises > 0 ? positionTransitions / totalExercises : 0,
    uniquePositionsPerBlock: totalBlocks > 0 ? uniquePositionSum / totalBlocks : 0,
    finisherRate: totalRounds > 0 ? finisherCount / (totalRounds * 2) : 0, // Assume 2 potential finisher spots per round
    powerMoveRate: totalExercises > 0 ? powerMoveCount / totalExercises : 0,
    avgGripLoadScore: totalExercises > 0 ? (gripLoadSum / totalExercises) * 3.33 : 0,
    gripBreakRate: totalBlocks > 0 ? gripBreakCount / totalBlocks : 0,
    totalExercises,
    totalBlocks,
    totalRounds,
  };
}

// ============================================================================
// METRIC CALCULATION - GENERATED DATA
// ============================================================================

/**
 * Calculate vibe metrics from a generated class plan
 */
export function calculateGeneratedMetrics(classPlan: ClassPlan): VibeMetrics {
  const allFloorEntries = [...classPlan.round1.floor, ...classPlan.round2.floor];
  const allTreadEntries = [...classPlan.round1.tread, ...classPlan.round2.tread];
  const allExerciseTexts = allFloorEntries.map(e => e.exercises);

  // Group into blocks (every 3 exercises = 1 block)
  const blockSize = 3;
  const blocks: string[][] = [];
  for (let i = 0; i < allExerciseTexts.length; i += blockSize) {
    blocks.push(allExerciseTexts.slice(i, i + blockSize));
  }

  // Calculate flow scores
  const flowScores: number[] = [];
  const flowDist = { great: 0, good: 0, fair: 0, poor: 0 };

  for (const block of blocks) {
    const positions = block.map(text => detectPrimaryPosition(text));
    const flowResult = calculateFlowScore(positions);
    flowScores.push(flowResult.score);

    if (flowResult.score >= 85) flowDist.great++;
    else if (flowResult.score >= 70) flowDist.good++;
    else if (flowResult.score >= 50) flowDist.fair++;
    else flowDist.poor++;
  }

  // Calculate structure rates
  let comboCount = 0;
  let emomCount = 0;
  let ladderCount = 0;
  let split30Count = 0;
  let split45Count = 0;
  let finisherCount = 0;
  let powerMoveCount = 0;
  let positionTransitions = 0;
  let uniquePositionSum = 0;
  let gripLoadSum = 0;
  let gripBreakCount = 0;

  for (const text of allExerciseTexts) {
    if (detectComboMovement(text)) comboCount++;
    if (detectEMOM(text).isEMOM) emomCount++;
    if (detectLadder(text)) ladderCount++;
    const splitType = detectSplitType(text);
    if (splitType === '30_30') split30Count++;
    if (splitType === '45_15') split45Count++;
    if (isFinisherMove(text)) finisherCount++;
    if (isPowerMove(text)) powerMoveCount++;
    if (hasPositionTransition(text)) positionTransitions++;

    const grip = detectGripDemand(text);
    if (grip === 'high') gripLoadSum += 3;
    else if (grip === 'medium') gripLoadSum += 2;
    else if (grip === 'low') gripLoadSum += 1;
  }

  // Per-block metrics
  for (const block of blocks) {
    const positions = block.map(text => detectPrimaryPosition(text));
    const uniquePos = new Set(positions);
    uniquePositionSum += uniquePos.size;

    const grips = block.map(text => detectGripDemand(text));
    for (let i = 1; i < grips.length - 1; i++) {
      const prev = grips[i - 1];
      const curr = grips[i];
      const next = grips[i + 1];
      if ((prev === 'high' || prev === 'medium') &&
          (curr === 'none' || curr === 'low') &&
          (next === 'high' || next === 'medium')) {
        gripBreakCount++;
        break;
      }
    }
  }

  // Vibe matching
  let vibeMatchCount = 0;
  let sprintExplosiveMatch = 0;
  let recoverRestMatch = 0;
  const minPairs = Math.min(allFloorEntries.length, allTreadEntries.length);

  for (let i = 0; i < minPairs; i++) {
    const tread = allTreadEntries[i];
    const floor = allFloorEntries[i];

    const floorIsPower = isPowerMove(floor.exercises);
    const floorIntensity = detectGripDemand(floor.exercises);

    if (tread.isSprint && floorIsPower) {
      sprintExplosiveMatch++;
      vibeMatchCount++;
    } else if (tread.isRecover && (floorIntensity === 'none' || floorIntensity === 'low')) {
      recoverRestMatch++;
      vibeMatchCount++;
    } else if (!tread.isSprint && !tread.isRecover) {
      vibeMatchCount++;
    }
  }

  const totalExercises = allExerciseTexts.length;
  const totalBlocks = blocks.length;
  const totalRounds = 2;

  return {
    avgFlowScore: flowScores.length > 0 ? flowScores.reduce((a, b) => a + b, 0) / flowScores.length : 0,
    flowScoreDistribution: {
      great: totalBlocks > 0 ? flowDist.great / totalBlocks : 0,
      good: totalBlocks > 0 ? flowDist.good / totalBlocks : 0,
      fair: totalBlocks > 0 ? flowDist.fair / totalBlocks : 0,
      poor: totalBlocks > 0 ? flowDist.poor / totalBlocks : 0,
    },
    vibeMatchRate: minPairs > 0 ? vibeMatchCount / minPairs : 0,
    sprintExplosiveMatchRate: minPairs > 0 ? sprintExplosiveMatch / minPairs : 0,
    recoverRestMatchRate: minPairs > 0 ? recoverRestMatch / minPairs : 0,
    comboMovementRate: totalExercises > 0 ? comboCount / totalExercises : 0,
    emomRate: totalExercises > 0 ? emomCount / totalExercises : 0,
    ladderRate: totalExercises > 0 ? ladderCount / totalExercises : 0,
    split30Rate: totalExercises > 0 ? split30Count / totalExercises : 0,
    split45Rate: totalExercises > 0 ? split45Count / totalExercises : 0,
    avgPositionTransitions: totalExercises > 0 ? positionTransitions / totalExercises : 0,
    uniquePositionsPerBlock: totalBlocks > 0 ? uniquePositionSum / totalBlocks : 0,
    finisherRate: totalRounds > 0 ? finisherCount / (totalRounds * 2) : 0,
    powerMoveRate: totalExercises > 0 ? powerMoveCount / totalExercises : 0,
    avgGripLoadScore: totalExercises > 0 ? (gripLoadSum / totalExercises) * 3.33 : 0,
    gripBreakRate: totalBlocks > 0 ? gripBreakCount / totalBlocks : 0,
    totalExercises,
    totalBlocks,
    totalRounds,
  };
}

// ============================================================================
// COMPARISON
// ============================================================================

/**
 * Compare generated metrics against imported baseline
 */
export function compareVibeMetrics(
  imported: VibeMetrics,
  generated: VibeMetrics
): VibeComparison {
  const metricsToCompare = [
    { key: 'avgFlowScore', name: 'Flow Score', threshold: 10 },
    { key: 'vibeMatchRate', name: 'Vibe Match Rate', threshold: 0.15 },
    { key: 'sprintExplosiveMatchRate', name: 'Sprint-Explosive Match', threshold: 0.2 },
    { key: 'comboMovementRate', name: 'Combo Movement Rate', threshold: 0.15 },
    { key: 'powerMoveRate', name: 'Power Move Rate', threshold: 0.1 },
    { key: 'avgGripLoadScore', name: 'Grip Load Score', threshold: 1.5 },
    { key: 'uniquePositionsPerBlock', name: 'Position Variety', threshold: 0.5 },
    { key: 'finisherRate', name: 'Finisher Rate', threshold: 0.2 },
  ];

  const differences: VibeComparison['differences'] = [];
  let totalScore = 0;

  for (const metric of metricsToCompare) {
    const importedVal = imported[metric.key as keyof VibeMetrics] as number;
    const generatedVal = generated[metric.key as keyof VibeMetrics] as number;
    const diff = generatedVal - importedVal;
    const diffPercent = importedVal > 0 ? (diff / importedVal) * 100 : 0;
    const absDiff = Math.abs(diff);

    let status: 'good' | 'acceptable' | 'needs_improvement';
    if (absDiff <= metric.threshold * 0.5) {
      status = 'good';
      totalScore += 100;
    } else if (absDiff <= metric.threshold) {
      status = 'acceptable';
      totalScore += 70;
    } else {
      status = 'needs_improvement';
      totalScore += 30;
    }

    differences.push({
      metric: metric.name,
      imported: Math.round(importedVal * 100) / 100,
      generated: Math.round(generatedVal * 100) / 100,
      diff: Math.round(diff * 100) / 100,
      diffPercent: Math.round(diffPercent * 10) / 10,
      status,
    });
  }

  const overallScore = Math.round(totalScore / metricsToCompare.length);

  // Generate recommendations
  const recommendations: string[] = [];
  for (const d of differences) {
    if (d.status === 'needs_improvement') {
      if (d.metric === 'Flow Score' && d.diff < 0) {
        recommendations.push('Improve position transitions - consider grouping similar positions together');
      }
      if (d.metric === 'Vibe Match Rate' && d.diff < 0) {
        recommendations.push('Better tread-floor synchronization - match sprint tread with explosive exercises');
      }
      if (d.metric === 'Combo Movement Rate' && d.diff < 0) {
        recommendations.push('Add more combo movements (e.g., "Squat to Press") to match source style');
      }
      if (d.metric === 'Power Move Rate' && d.diff < 0) {
        recommendations.push('Include more power moves (snatches, cleans, burpees)');
      }
    }
  }

  return {
    imported,
    generated,
    differences,
    overallScore,
    recommendations,
  };
}

/**
 * Run full vibe comparison for a generated class
 */
export function runVibeComparison(classPlan: ClassPlan): VibeComparison | null {
  const importedMetrics = calculateImportedMetrics();
  if (!importedMetrics) {
    return null;
  }

  const generatedMetrics = calculateGeneratedMetrics(classPlan);
  return compareVibeMetrics(importedMetrics, generatedMetrics);
}

/**
 * Format vibe comparison as a readable report
 */
export function formatVibeReport(comparison: VibeComparison): string {
  const lines: string[] = [];

  lines.push('=== VIBE COMPARISON REPORT ===\n');
  lines.push(`Overall Similarity Score: ${comparison.overallScore}/100\n`);

  lines.push('--- Metric Comparison ---');
  for (const d of comparison.differences) {
    const statusIcon = d.status === 'good' ? '✅' : d.status === 'acceptable' ? '⚠️' : '❌';
    lines.push(`${statusIcon} ${d.metric}: ${d.generated} (imported: ${d.imported}, diff: ${d.diffPercent > 0 ? '+' : ''}${d.diffPercent}%)`);
  }

  if (comparison.recommendations.length > 0) {
    lines.push('\n--- Recommendations ---');
    for (const rec of comparison.recommendations) {
      lines.push(`• ${rec}`);
    }
  }

  return lines.join('\n');
}
