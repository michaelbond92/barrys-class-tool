// ============================================================================
// Indexing Service
// Builds and manages the hierarchical index: Class → Round → Block → Exercise
// ============================================================================

import {
  ImportedClass,
  ClassMetadata,
  RoundMetadata,
  BlockMetadata,
  TreadBlockMetadata,
  ExerciseMetadata,
  PairedMinute,
  TreadMinuteMetadata,
  EquipmentSet,
  ExercisePosition,
  BodyFocus,
  MovementPattern,
  TreadPattern,
  TreadCharacter,
  FinisherType,
  Intensity,
  StructureTag,
  MovementTag,
  BlockPosition,
  ArcType,
  FlowScore,
  SpeedSet,
  WorkoutType,
  HIERARCHY_STORAGE_KEYS,
} from '../types/hierarchyTypes';
import {
  parseEquipmentToSet,
  parseClassNumberFromSheetName,
  parseDayFromSheetName,
} from './xlsxParserService';
import {
  detectPrimaryPosition,
  getPositionSequence,
  getDominantPosition,
  calculateFlowScore,
  calculateBlockFlowScore,
} from './positionService';
import {
  parseExercise,
  detectMovementPatterns,
  detectFinisherType,
  calculateGripLoadScore,
  countGripIntensiveMinutes,
  hasGripBreaks,
  extractModifiers,
  detectRepClassification,
} from './exerciseParserService';
import { parseTreadEntry } from './treadParser';

// ============================================================================
// MAIN INDEXING FUNCTIONS
// ============================================================================

/**
 * Index all imported classes into the full hierarchy
 */
export function indexImportedClasses(
  classes: ImportedClass[],
  workoutType: WorkoutType = 'total_body'
): {
  classes: ClassMetadata[];
  rounds: RoundMetadata[];
  floorBlocks: BlockMetadata[];
  treadBlocks: TreadBlockMetadata[];
} {
  const allClasses: ClassMetadata[] = [];
  const allRounds: RoundMetadata[] = [];
  const allFloorBlocks: BlockMetadata[] = [];
  const allTreadBlocks: TreadBlockMetadata[] = [];

  for (const imported of classes) {
    const indexed = indexClass(imported, workoutType);

    allClasses.push(indexed.classMetadata);
    allRounds.push(indexed.round1, indexed.round2);
    allFloorBlocks.push(...indexed.floorBlocks);
    allTreadBlocks.push(...indexed.treadBlocks);
  }

  return {
    classes: allClasses,
    rounds: allRounds,
    floorBlocks: allFloorBlocks,
    treadBlocks: allTreadBlocks,
  };
}

/**
 * Index a single imported class
 */
export function indexClass(
  imported: ImportedClass,
  workoutType: WorkoutType = 'total_body'
): {
  classMetadata: ClassMetadata;
  round1: RoundMetadata;
  round2: RoundMetadata;
  floorBlocks: BlockMetadata[];
  treadBlocks: TreadBlockMetadata[];
} {
  const classId = generateClassId(imported);
  const classNumber = parseClassNumberFromSheetName(imported.sourceSheet);
  const dayOfWeek = parseDayFromSheetName(imported.sourceSheet) || getDayOfWeek(imported.date);

  // Index rounds
  const round1Result = indexRound(imported.round1, {
    classId,
    sourceDate: imported.date,
    sourceSheet: imported.sourceSheet,
    roundNumber: 1,
  });

  const round2Result = indexRound(imported.round2, {
    classId,
    sourceDate: imported.date,
    sourceSheet: imported.sourceSheet,
    roundNumber: 2,
  });

  // Build class metadata
  const classMetadata: ClassMetadata = {
    id: classId,
    date: imported.date,
    sourceSheet: imported.sourceSheet,
    classNumber: classNumber || undefined,
    dayOfWeek,
    workoutType,
    totalDuration: round1Result.round.duration + round2Result.round.duration,
    round1: round1Result.round,
    round2: round2Result.round,
    overallTreadAverage: calculateOverallTreadAverage(round1Result.round, round2Result.round),
    totalSprintCount: round1Result.round.sprintCount + round2Result.round.sprintCount,
    totalRecoverCount: round1Result.round.recoverCount + round2Result.round.recoverCount,
    bodyFocusDistribution: calculateBodyFocusDistribution(round1Result.round, round2Result.round),
    movementPatternDistribution: calculateMovementPatternDistribution(round1Result.round, round2Result.round),
    lastUsed: null,
    useCount: 0,
  };

  return {
    classMetadata,
    round1: round1Result.round,
    round2: round2Result.round,
    floorBlocks: [...round1Result.floorBlocks, ...round2Result.floorBlocks],
    treadBlocks: [...round1Result.treadBlocks, ...round2Result.treadBlocks],
  };
}

/**
 * Index a single round
 */
function indexRound(
  roundData: ImportedClass['round1'],
  context: {
    classId: string;
    sourceDate: string;
    sourceSheet: string;
    roundNumber: 1 | 2;
  }
): {
  round: RoundMetadata;
  floorBlocks: BlockMetadata[];
  treadBlocks: TreadBlockMetadata[];
} {
  const roundId = `${context.classId}_r${context.roundNumber}`;
  const equipment = parseEquipmentToSet(roundData.equipment);
  const duration = roundData.minutes.length;

  // Parse all minutes (preserving warmup flags from import)
  const pairedMinutes: PairedMinute[] = roundData.minutes.map((m, idx) => ({
    minuteLabel: m.minute,
    minuteIndex: idx,
    tread: parseTreadMinute(m.tread, idx),
    floor: parseExercise(m.floor, {
      minuteInBlock: 0, // Will be updated when blocks are identified
      minuteInRound: idx,
      isBlockFinisher: false,
      isRoundFinisher: idx === roundData.minutes.length - 1,
    }),
    notes: m.notes,
    isWarmup: m.isWarmup, // Preserve warmup detection from Excel cell color
  }));

  // Identify blocks (with warmup info from cell colors)
  const floorBlocks = identifyFloorBlocks(pairedMinutes, roundId, context);
  const treadBlocks = identifyTreadBlocks(pairedMinutes, roundId, context);

  // Calculate round-level metrics
  const positionSequence = pairedMinutes.map(m => m.floor.primaryPosition);
  const flowScore = calculateFlowScore(positionSequence);
  const movementPatterns = detectMovementPatterns(pairedMinutes.map(m => m.floor.rawText));
  const gripLoadScore = calculateGripLoadScore(pairedMinutes.map(m => m.floor.rawText));

  // Find finisher
  const lastMinute = pairedMinutes[pairedMinutes.length - 1];
  const finisherType = detectFinisherType(lastMinute?.floor.rawText || '');
  const finisherExercise = lastMinute?.floor.rawText || '';

  // Calculate tread stats
  const treadStats = calculateTreadStats(pairedMinutes);

  const round: RoundMetadata = {
    id: roundId,
    roundNumber: context.roundNumber,
    sourceClassId: context.classId,
    sourceDate: context.sourceDate,
    sourceSheet: context.sourceSheet,
    duration,
    equipment,
    forecast: roundData.forecast,
    minutes: pairedMinutes,
    blockIds: floorBlocks.map(b => b.id),
    treadBlockIds: treadBlocks.map(b => b.id),
    treadPattern: treadStats.pattern,
    treadCharacter: treadStats.character,
    sprintCount: treadStats.sprintCount,
    recoverCount: treadStats.recoverCount,
    hasIncline: treadStats.hasIncline,
    maxIncline: treadStats.maxIncline,
    treadAverage: treadStats.average,
    primaryBodyFocus: detectPrimaryBodyFocus(pairedMinutes),
    movementPatterns,
    dominantPosition: getDominantPosition(pairedMinutes.map(m => m.floor.rawText)),
    positionSequence,
    flowScore: flowScore.score,
    gripLoadScore,
    hasGripBreaks: hasGripBreaks(pairedMinutes.map(m => m.floor.rawText)),
    finisherType,
    finisherExercise,
    exerciseSequence: pairedMinutes.map(m => m.floor.rawText).join(' | '),
    lastUsed: null,
    useCount: 0,
    useDates: [],
  };

  return { round, floorBlocks, treadBlocks };
}

// ============================================================================
// BLOCK IDENTIFICATION
// ============================================================================

/**
 * Identify floor blocks from paired minutes
 * Uses warmup flags from cell colors (Round 1 only) or falls back to first 3 min heuristic
 */
function identifyFloorBlocks(
  minutes: PairedMinute[],
  roundId: string,
  context: { classId: string; roundNumber: 1 | 2 }
): BlockMetadata[] {
  const blocks: BlockMetadata[] = [];

  // Detect warmup boundary using isWarmup flags from cell colors
  // Only Round 1 has warmups - Round 2 starts directly with workout
  let warmupEnd = 0;

  if (context.roundNumber === 1) {
    // Find where warmup ends by looking for last consecutive warmup minute
    for (let i = 0; i < minutes.length; i++) {
      if (minutes[i].isWarmup) {
        warmupEnd = i + 1;
      } else if (warmupEnd > 0) {
        // Found first non-warmup after warmups started
        break;
      }
    }

    // Fallback to first 3 minutes if no warmup flags detected
    // (for older imports without color detection)
    if (warmupEnd === 0) {
      warmupEnd = Math.min(3, minutes.length);
    }
  }

  const workoutStart = warmupEnd;

  // Warmup block (Round 1 only)
  if (warmupEnd > 0) {
    const warmupContent = minutes.slice(0, warmupEnd).map(m => m.floor.rawText);
    const warmupBlock = indexFloorBlock(warmupContent, {
      id: `${roundId}_floor_warmup`,
      category: 'warmups',
      sourceClassId: context.classId,
      sourceRoundNumber: context.roundNumber,
      sourceMinuteStart: 0,
      sourceMinuteEnd: warmupEnd,
    });
    blocks.push(warmupBlock);
  }

  // Workout blocks - try to make 3-4 minute blocks
  let currentStart = workoutStart;
  let blockNum = 1;

  while (currentStart < minutes.length) {
    const remaining = minutes.length - currentStart;
    let blockLength: number;

    if (remaining <= 4) {
      blockLength = remaining;
    } else if (remaining <= 7) {
      // Split evenly
      blockLength = Math.ceil(remaining / 2);
    } else {
      blockLength = 4;
    }

    const blockEnd = Math.min(currentStart + blockLength, minutes.length);
    const blockContent = minutes.slice(currentStart, blockEnd).map(m => m.floor.rawText);

    const block = indexFloorBlock(blockContent, {
      id: `${roundId}_floor_workout_${blockNum}`,
      category: 'workouts',
      sourceClassId: context.classId,
      sourceRoundNumber: context.roundNumber,
      sourceMinuteStart: currentStart,
      sourceMinuteEnd: blockEnd,
    });
    blocks.push(block);

    currentStart = blockEnd;
    blockNum++;
  }

  return blocks;
}

/**
 * Index a single floor block
 */
function indexFloorBlock(
  content: string[],
  context: {
    id: string;
    category: 'warmups' | 'workouts';
    sourceClassId: string;
    sourceRoundNumber: 1 | 2;
    sourceMinuteStart: number;
    sourceMinuteEnd: number;
  }
): BlockMetadata {
  const length = content.length as 2 | 3 | 4;
  const positions = content.map(c => detectPrimaryPosition(c));
  const flowResult = calculateBlockFlowScore(content);
  const movementPatterns = detectMovementPatterns(content);
  const gripLoadScore = calculateGripLoadScore(content);

  // Detect structure tags
  const structure = detectStructureTags(content);
  const movement = detectMovementTags(content);
  const bodyFocus = detectBodyFocus(content);
  const intensity = detectIntensity(content);

  // Detect characteristics
  const isRightSide = content.some(c => /\bright\b|\br\s+/i.test(c));
  const isLeftSide = content.some(c => /\bleft\b|\bl\s+/i.test(c));
  const hasSame = content.some(c => /\bsame\b/i.test(c));
  const hasChoice = content.some(c => /\bchoice\b/i.test(c));

  // Typical position in round
  const typicalPosition = determineTypicalPosition(
    context.sourceMinuteStart,
    context.sourceMinuteEnd,
    context.category
  );

  // Arc type
  const arcType = determineArcType(content);

  // Equipment requirements
  const requiredEquipment = detectEquipmentRequirements(content);

  return {
    id: context.id,
    content,
    length,
    category: context.category,
    sourceClassId: context.sourceClassId,
    sourceRoundNumber: context.sourceRoundNumber,
    sourceMinuteStart: context.sourceMinuteStart,
    sourceMinuteEnd: context.sourceMinuteEnd,
    positions,
    dominantPosition: getDominantPosition(content),
    positionSequence: positions,
    flowScore: flowResult.score,
    flowRating: flowResult.rating,
    totalTransitionCost: flowResult.totalTransitionCost,
    hasExcessiveTransitions: flowResult.totalTransitionCost > 6,
    structure,
    movement,
    bodyFocus,
    intensity,
    typicalPosition,
    arcType,
    isRightSideBlock: isRightSide && !isLeftSide,
    isLeftSideBlock: isLeftSide && !isRightSide,
    hasSameKeyword: hasSame,
    hasChoiceKeyword: hasChoice,
    movementPatterns,
    gripLoadScore,
    gripIntensiveMinutes: countGripIntensiveMinutes(content),
    requiredEquipment,
    exerciseSequence: content.join(' | '),
    lastUsed: null,
    useCount: 0,
    useDates: [],
  };
}

/**
 * Identify tread blocks from paired minutes
 * Uses warmup flags from cell colors (Round 1 only) or falls back to heuristic
 */
function identifyTreadBlocks(
  minutes: PairedMinute[],
  roundId: string,
  context: { classId: string; roundNumber: 1 | 2 }
): TreadBlockMetadata[] {
  const blocks: TreadBlockMetadata[] = [];

  // Detect warmup boundary using isWarmup flags (same logic as floor blocks)
  let warmupEnd = 0;

  if (context.roundNumber === 1) {
    for (let i = 0; i < minutes.length; i++) {
      if (minutes[i].isWarmup) {
        warmupEnd = i + 1;
      } else if (warmupEnd > 0) {
        break;
      }
    }

    // Fallback to first 3 minutes if no warmup flags detected
    if (warmupEnd === 0) {
      warmupEnd = Math.min(3, minutes.length);
    }
  }

  const workoutStart = warmupEnd;

  // Warmup block (Round 1 only)
  if (warmupEnd > 0) {
    const warmupContent = minutes.slice(0, warmupEnd).map(m => m.tread.rawText);
    const warmupBlock = indexTreadBlock(warmupContent, {
      id: `${roundId}_tread_warmup`,
      category: 'warmups',
      sourceClassId: context.classId,
      sourceRoundNumber: context.roundNumber,
      sourceMinuteStart: 0,
      sourceMinuteEnd: warmupEnd,
    });
    blocks.push(warmupBlock);
  }

  // Workout blocks
  let currentStart = workoutStart;
  let blockNum = 1;

  while (currentStart < minutes.length) {
    const remaining = minutes.length - currentStart;
    const blockLength = remaining <= 4 ? remaining : (remaining <= 7 ? Math.ceil(remaining / 2) : 4);
    const blockEnd = Math.min(currentStart + blockLength, minutes.length);
    const blockContent = minutes.slice(currentStart, blockEnd).map(m => m.tread.rawText);

    const block = indexTreadBlock(blockContent, {
      id: `${roundId}_tread_workout_${blockNum}`,
      category: 'workouts',
      sourceClassId: context.classId,
      sourceRoundNumber: context.roundNumber,
      sourceMinuteStart: currentStart,
      sourceMinuteEnd: blockEnd,
    });
    blocks.push(block);

    currentStart = blockEnd;
    blockNum++;
  }

  return blocks;
}

/**
 * Index a single tread block
 */
function indexTreadBlock(
  content: string[],
  context: {
    id: string;
    category: 'warmups' | 'workouts';
    sourceClassId: string;
    sourceRoundNumber: 1 | 2;
    sourceMinuteStart: number;
    sourceMinuteEnd: number;
  }
): TreadBlockMetadata {
  const length = content.length as 2 | 3 | 4;

  // Parse each minute
  const parsed = content.map(c => parseTreadEntry(c));

  // Calculate stats
  const speeds = parsed.flatMap(p => p.speeds.flatMap(s => [s.low, s.mid, s.high])).filter(s => s > 0);
  const baseSpeed = Math.min(...speeds.filter(s => s > 0)) || 0;
  const maxSpeed = Math.max(...speeds) || 0;
  const avgSpeed = speeds.length > 0 ? speeds.reduce((a, b) => a + b, 0) / speeds.length : 0;

  const hasIncline = parsed.some(p => p.inclinePercent > 0);
  const maxIncline = Math.max(...parsed.map(p => p.inclinePercent), 0);
  const inclineMinutes = parsed.filter(p => p.inclinePercent > 0).length;

  const recoverCount = parsed.filter(p => p.isRecover).length;
  const sprintCount = parsed.filter(p => p.isSprint).length;
  const intervalCount = content.filter(c => c.includes('|')).length;

  // Determine character
  const character = determineTreadCharacter(parsed, content);
  const intensity = recoverCount > content.length / 2 ? 'low' :
    sprintCount > 1 || maxSpeed > 9 ? 'high' : 'medium';

  return {
    id: context.id,
    content,
    length,
    category: context.category,
    sourceClassId: context.sourceClassId,
    sourceRoundNumber: context.sourceRoundNumber,
    sourceMinuteStart: context.sourceMinuteStart,
    sourceMinuteEnd: context.sourceMinuteEnd,
    character,
    baseSpeed,
    maxSpeed,
    avgSpeed: Math.round(avgSpeed * 10) / 10,
    speedRange: maxSpeed - baseSpeed,
    hasIncline,
    maxIncline,
    inclineMinutes,
    hasRecover: recoverCount > 0,
    recoverCount,
    recoverRatio: content.length > 0 ? recoverCount / content.length : 0,
    hasSprint: sprintCount > 0,
    sprintCount,
    hasIntervals: intervalCount > 0,
    intervalCount,
    intensity: intensity as Intensity,
    lastUsed: null,
    useCount: 0,
  };
}

// ============================================================================
// TREAD PARSING HELPERS
// ============================================================================

/**
 * Parse a tread minute into metadata
 */
function parseTreadMinute(raw: string, minuteIndex: number): TreadMinuteMetadata {
  const parsed = parseTreadEntry(raw);

  return {
    id: `tread_m${minuteIndex}`,
    rawText: raw,
    speeds: parsed.speeds,
    lowestSpeed: parsed.lowestSpeed,
    highestSpeed: Math.max(...parsed.speeds.flatMap(s => [s.low, s.mid, s.high])),
    effectiveSpeed: parsed.effectiveSpeed,
    isRecover: parsed.isRecover,
    isSprint: parsed.isSprint,
    inclinePercent: parsed.inclinePercent,
    hasInterval: raw.includes('|'),
    minuteInBlock: 0, // Will be updated
    minuteInRound: minuteIndex,
    textColor: parsed.textColor,
  };
}

/**
 * Calculate tread statistics for a round
 */
function calculateTreadStats(minutes: PairedMinute[]): {
  pattern: TreadPattern;
  character: TreadCharacter;
  sprintCount: number;
  recoverCount: number;
  hasIncline: boolean;
  maxIncline: number;
  average: number;
} {
  const treadData = minutes.map(m => m.tread);

  const sprintCount = treadData.filter(t => t.isSprint).length;
  const recoverCount = treadData.filter(t => t.isRecover).length;
  const hasIncline = treadData.some(t => t.inclinePercent > 0);
  const maxIncline = Math.max(...treadData.map(t => t.inclinePercent), 0);

  // Calculate average (excluding recovers)
  const nonRecoverSpeeds = treadData
    .filter(t => !t.isRecover)
    .map(t => t.effectiveSpeed)
    .filter(s => s > 0);
  const average = nonRecoverSpeeds.length > 0
    ? nonRecoverSpeeds.reduce((a, b) => a + b, 0) / nonRecoverSpeeds.length
    : 0;

  // Determine pattern
  const pattern = determineTreadPattern(treadData);
  const character = determineTreadCharacter(
    treadData.map(t => parseTreadEntry(t.rawText)),
    treadData.map(t => t.rawText)
  );

  return {
    pattern,
    character,
    sprintCount,
    recoverCount,
    hasIncline,
    maxIncline,
    average: Math.round(average * 10) / 10,
  };
}

/**
 * Determine tread pattern
 */
function determineTreadPattern(treadData: TreadMinuteMetadata[]): TreadPattern {
  const speeds = treadData.filter(t => !t.isRecover).map(t => t.effectiveSpeed);

  if (treadData.filter(t => t.inclinePercent > 2).length > treadData.length / 3) {
    return 'incline_heavy';
  }
  if (treadData.filter(t => t.isRecover).length > treadData.length / 2) {
    return 'recovery_heavy';
  }
  if (treadData.filter(t => t.isSprint).length > 2) {
    return 'sprint_focused';
  }
  if (treadData.filter(t => t.hasInterval).length > treadData.length / 2) {
    return 'intervals';
  }

  // Check for progressive build (speeds increase)
  if (speeds.length >= 3) {
    let increasing = true;
    for (let i = 1; i < speeds.length; i++) {
      if (speeds[i] < speeds[i - 1]) {
        increasing = false;
        break;
      }
    }
    if (increasing) return 'progressive_build';
  }

  // Check for slingshot (speed then recover pattern)
  if (treadData.length >= 4) {
    const hasPattern = treadData.some((t, i) =>
      t.isSprint && i + 1 < treadData.length && treadData[i + 1].isRecover
    );
    if (hasPattern) return 'slingshot';
  }

  return 'balanced';
}

/**
 * Determine tread character
 */
function determineTreadCharacter(parsed: ReturnType<typeof parseTreadEntry>[], raw: string[]): TreadCharacter {
  const speeds = parsed.flatMap(p => p.speeds.flatMap(s => [s.low, s.mid, s.high])).filter(s => s > 0);
  const inclineCount = parsed.filter(p => p.inclinePercent > 0).length;
  const recoverCount = parsed.filter(p => p.isRecover).length;
  const sprintCount = parsed.filter(p => p.isSprint).length;
  const intervalCount = raw.filter(r => r.includes('|')).length;

  if (inclineCount > raw.length / 3) return 'incline_focus';
  if (recoverCount > raw.length / 2) return 'recovery_focused';
  if (sprintCount > 1) return 'sprint_focused';
  if (intervalCount > raw.length / 2) return 'interval_heavy';

  // Check for speed build
  if (speeds.length >= 4) {
    const firstHalf = speeds.slice(0, Math.floor(speeds.length / 2));
    const secondHalf = speeds.slice(Math.floor(speeds.length / 2));
    const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
    if (secondAvg > firstAvg + 0.5) return 'speed_build';
  }

  return 'balanced';
}

// ============================================================================
// DETECTION HELPERS
// ============================================================================

function detectStructureTags(content: string[]): StructureTag[] {
  const tags: Set<StructureTag> = new Set();
  const combined = content.join(' ').toLowerCase();

  if (/amrap/i.test(combined)) tags.add('amrap');
  if (/tempo/i.test(combined)) tags.add('tempo');
  if (/drop.*set|\(-\)/i.test(combined)) tags.add('drop_set');
  if (/hold.*pulse|pulse.*hold/i.test(combined)) tags.add('hold_pulse');
  if (/\d+.*\d+.*\d+/i.test(combined)) tags.add('rep_scheme');
  if (/\+\d|\(-/i.test(combined)) tags.add('ladder');
  if (/same\s*side|\bss\b/i.test(combined)) tags.add('same_side');
  if (/e\/s|each\s*side/i.test(combined)) tags.add('superset');

  return Array.from(tags);
}

function detectMovementTags(content: string[]): MovementTag[] {
  const tags: Set<MovementTag> = new Set();
  const combined = content.join(' ').toLowerCase();

  if (/squat.*press|clean.*squat|deadlift.*row/i.test(combined)) tags.add('compound');
  if (/curl|tricep|lateral\s*raise/i.test(combined)) tags.add('isolation');
  if (/snatch|clean|burpee|jump|power/i.test(combined)) tags.add('power_explosive');
  if (/wgs|world.*greatest|cat\s*cow|stretch/i.test(combined)) tags.add('mobility');

  return Array.from(tags);
}

function detectBodyFocus(content: string[]): BodyFocus[] {
  const combined = content.join(' ').toLowerCase();
  const focus: Set<BodyFocus> = new Set();

  if (/chest|press(?!.*shoulder)|fly|pushup/i.test(combined)) focus.add('chest');
  if (/row|pullover|lat/i.test(combined)) focus.add('back');
  if (/shoulder|lateral\s*raise|shrug/i.test(combined)) focus.add('shoulders');
  if (/curl|tricep|bicep/i.test(combined)) focus.add('arms');
  if (/squat|lunge|deadlift|leg/i.test(combined)) focus.add('lower');
  if (/crunch|plank|twist|sit\s*up|core/i.test(combined)) focus.add('core');
  if (/burpee|snatch|clean|thruster/i.test(combined)) focus.add('full_body');

  // Determine upper vs lower
  const hasUpper = focus.has('chest') || focus.has('back') || focus.has('shoulders') || focus.has('arms');
  const hasLower = focus.has('lower');

  if (hasUpper && !hasLower) focus.add('upper');
  if (!hasUpper && hasLower) focus.add('lower');
  if (hasUpper && hasLower) focus.add('full_body');

  return Array.from(focus);
}

function detectIntensity(content: string[]): Intensity {
  const combined = content.join(' ').toLowerCase();

  if (/amrap|burn\s*out|sprint|snatch|burpee|all\s*out/i.test(combined)) {
    return 'high';
  }
  if (/tempo|hold|stretch|wgs|recover/i.test(combined)) {
    return 'low';
  }
  return 'medium';
}

function determineTypicalPosition(start: number, end: number, category: 'warmups' | 'workouts'): BlockPosition {
  if (category === 'warmups') return 'early';
  if (start < 4) return 'early';
  if (end >= 10) return 'finisher';
  if (start >= 6) return 'late';
  return 'middle';
}

function determineArcType(content: string[]): ArcType {
  const intensities = content.map(c => {
    if (/tempo|hold|slow/i.test(c)) return 1;
    if (/burn\s*out|sprint|snatch|burpee|amrap/i.test(c)) return 3;
    return 2;
  });

  const first = intensities[0];
  const last = intensities[intensities.length - 1];

  if (last > first + 0.5) return 'build';
  if (last < first - 0.5) return 'recovery';
  if (Math.max(...intensities) === intensities[Math.floor(intensities.length / 2)]) return 'peak';
  return 'steady';
}

function detectEquipmentRequirements(content: string[]): BlockMetadata['requiredEquipment'] {
  const combined = content.join(' ').toLowerCase();

  const requiresHeavy = /heavy|deadlift|chest\s*press|bent\s*over/i.test(combined);
  const requiresMedium = /curl|tricep|shoulder\s*press/i.test(combined);
  const requiresLight = /lateral\s*raise|fly/i.test(combined);
  const canBeBodyweight = /push\s*up|plank|burpee|mountain|commando/i.test(combined);
  const requiresBench = /chest\s*press|skull|pullover|crunch|sit\s*up|russian/i.test(combined);

  return {
    requiresHeavy,
    requiresMedium,
    requiresLight,
    canBeBodyweight,
    requiresBench,
  };
}

function detectPrimaryBodyFocus(minutes: PairedMinute[]): BodyFocus[] {
  const allFocus = detectBodyFocus(minutes.map(m => m.floor.rawText));

  // Prioritize specific focus over general
  const priority: BodyFocus[] = ['chest', 'back', 'shoulders', 'arms', 'lower', 'core', 'full_body', 'upper'];
  const sorted = allFocus.sort((a, b) => priority.indexOf(a) - priority.indexOf(b));

  return sorted.slice(0, 3);
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function generateClassId(imported: ImportedClass): string {
  const dateStr = imported.date.replace(/-/g, '');
  const classNum = parseClassNumberFromSheetName(imported.sourceSheet);
  return `class_${dateStr}_${classNum || 'x'}`;
}

function getDayOfWeek(isoDate: string): string {
  // Parse as local date to avoid timezone issues
  // Input is ISO format like "2025-01-17"
  const [year, month, day] = isoDate.split('-').map(Number);
  const date = new Date(year, month - 1, day); // month is 0-indexed
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[date.getDay()];
}

function calculateOverallTreadAverage(round1: RoundMetadata, round2: RoundMetadata): number {
  const total = round1.treadAverage * round1.duration + round2.treadAverage * round2.duration;
  const totalDuration = round1.duration + round2.duration;
  return Math.round((total / totalDuration) * 10) / 10;
}

function calculateBodyFocusDistribution(round1: RoundMetadata, round2: RoundMetadata): Record<BodyFocus, number> {
  const dist: Record<BodyFocus, number> = {} as Record<BodyFocus, number>;

  for (const focus of [...round1.primaryBodyFocus, ...round2.primaryBodyFocus]) {
    dist[focus] = (dist[focus] || 0) + 1;
  }

  return dist;
}

function calculateMovementPatternDistribution(round1: RoundMetadata, round2: RoundMetadata): Record<MovementPattern, number> {
  const dist: Record<MovementPattern, number> = {} as Record<MovementPattern, number>;

  for (const pattern of [...round1.movementPatterns, ...round2.movementPatterns]) {
    dist[pattern] = (dist[pattern] || 0) + 1;
  }

  return dist;
}

// ============================================================================
// STORAGE FUNCTIONS
// ============================================================================

export function saveIndexToStorage(index: {
  classes: ClassMetadata[];
  rounds: RoundMetadata[];
  floorBlocks: BlockMetadata[];
  treadBlocks: TreadBlockMetadata[];
}): void {
  try {
    localStorage.setItem(HIERARCHY_STORAGE_KEYS.CLASSES, JSON.stringify(index.classes));
    localStorage.setItem(HIERARCHY_STORAGE_KEYS.ROUNDS, JSON.stringify(index.rounds));
    localStorage.setItem(HIERARCHY_STORAGE_KEYS.FLOOR_BLOCKS, JSON.stringify(index.floorBlocks));
    localStorage.setItem(HIERARCHY_STORAGE_KEYS.TREAD_BLOCKS, JSON.stringify(index.treadBlocks));
  } catch (error) {
    console.error('Failed to save index to storage:', error);
  }
}

export function loadIndexFromStorage(): {
  classes: ClassMetadata[];
  rounds: RoundMetadata[];
  floorBlocks: BlockMetadata[];
  treadBlocks: TreadBlockMetadata[];
} | null {
  try {
    const classes = localStorage.getItem(HIERARCHY_STORAGE_KEYS.CLASSES);
    const rounds = localStorage.getItem(HIERARCHY_STORAGE_KEYS.ROUNDS);
    const floorBlocks = localStorage.getItem(HIERARCHY_STORAGE_KEYS.FLOOR_BLOCKS);
    const treadBlocks = localStorage.getItem(HIERARCHY_STORAGE_KEYS.TREAD_BLOCKS);

    if (!classes || !rounds || !floorBlocks || !treadBlocks) {
      return null;
    }

    return {
      classes: JSON.parse(classes),
      rounds: JSON.parse(rounds),
      floorBlocks: JSON.parse(floorBlocks),
      treadBlocks: JSON.parse(treadBlocks),
    };
  } catch (error) {
    console.error('Failed to load index from storage:', error);
    return null;
  }
}

export function clearIndexFromStorage(): void {
  localStorage.removeItem(HIERARCHY_STORAGE_KEYS.CLASSES);
  localStorage.removeItem(HIERARCHY_STORAGE_KEYS.ROUNDS);
  localStorage.removeItem(HIERARCHY_STORAGE_KEYS.FLOOR_BLOCKS);
  localStorage.removeItem(HIERARCHY_STORAGE_KEYS.TREAD_BLOCKS);
}
