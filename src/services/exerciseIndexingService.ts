// ============================================================================
// Exercise Indexing Service
// Builds and manages an exercise-level index for generation
// Tracks individual exercises, their relationships, and usage patterns
// ============================================================================

import { loadIndexFromStorage, saveIndexToStorage } from './indexingService';
import {
  ExerciseMetadata,
  MovementPattern,
  MuscleGroup,
  ExercisePosition,
  GripDemand,
  FinisherType,
  PairedMinute,
  RoundMetadata,
  BlockMetadata,
} from '../types/hierarchyTypes';
import {
  parseExercise,
  detectMovementPattern,
  detectGripDemand,
  isFinisherMove,
  isPowerMove,
  extractModifiers,
} from './exerciseParserService';
import { detectPrimaryPosition } from './positionService';
import { parseTreadEntry } from './treadParser';

// ============================================================================
// TYPES
// ============================================================================

export interface IndexedExercise {
  // Identity
  id: string;
  rawText: string;                    // Original text (e.g., "Tempo Heavy Deadlift")
  normalizedName: string;             // Cleaned name (e.g., "deadlift")

  // Classification
  position: ExercisePosition;
  movementPattern: MovementPattern;
  primaryMuscle: MuscleGroup;
  gripDemand: GripDemand;
  isFinisher: boolean;
  isPower: boolean;

  // Modifiers found
  modifiers: string[];                // ["tempo", "heavy"]

  // Intensity scoring (0-100)
  intensityScore: number;             // Based on modifiers, movement type

  // Tread sync patterns (what tread patterns this exercise pairs well with)
  vibeProfile: VibeProfile;

  // Context from source
  sourceClassIds: string[];           // Classes where this exercise appears
  sourceBlockIds: string[];           // Blocks where this exercise appears
  minutePositions: MinutePosition[];  // Where in rounds it typically appears

  // Relationships
  progressionFrom: string[];          // Exercises this builds from
  progressionTo: string[];            // Exercises this leads into
  commonPairs: string[];              // Exercises often seen with this

  // Usage tracking
  useCount: number;
  lastUsed: string | null;
}

export interface VibeProfile {
  // What tread intensity this exercise matches
  matchesRecovery: boolean;           // Good during RECOVER
  matchesSprint: boolean;             // Good during sprint
  matchesBuild: boolean;              // Good during progressive build
  matchesIncline: boolean;            // Good during incline work

  // Suggested tread speed ranges (effective speed)
  minTreadSpeed: number;              // Minimum tread speed to pair with
  maxTreadSpeed: number;              // Maximum tread speed to pair with

  // Position in energy arc
  preferredEnergyLevel: 'warmup' | 'building' | 'peak' | 'any';
}

export interface MinutePosition {
  roundNumber: 1 | 2;
  minuteInRound: number;              // 0-indexed
  isWarmup: boolean;
  isFinisher: boolean;
  treadContext: TreadContext;
}

export interface TreadContext {
  isRecover: boolean;
  isSprint: boolean;
  hasIncline: boolean;
  effectiveSpeed: number;
}

export interface ExerciseIndex {
  exercises: Map<string, IndexedExercise>;  // normalizedName -> exercise
  byPosition: Map<ExercisePosition, string[]>;
  byMovement: Map<MovementPattern, string[]>;
  byMuscle: Map<MuscleGroup, string[]>;
  byIntensity: {
    low: string[];      // 0-33
    medium: string[];   // 34-66
    high: string[];     // 67-100
  };
  progressions: Map<string, string[]>;  // exercise -> what it leads to
  lastUpdated: string;
}

// Storage key
const EXERCISE_INDEX_KEY = 'barrys_exercise_index';

// ============================================================================
// NORMALIZATION
// ============================================================================

/**
 * Normalize exercise name for consistent indexing
 * Removes reps, modifiers, common variations
 */
export function normalizeExerciseName(rawText: string): string {
  let text = rawText.toLowerCase();

  // Remove rep counts
  text = text.replace(/\d+\s*/g, '');

  // Remove common modifiers
  const modifiersToRemove = [
    'tempo', 'heavy', 'light', 'medium', 'alt', 'alternating',
    'hold', 'pulse', 'burn out', 'bo', 'amrap', 'same',
    'right', 'left', 'r', 'l', 'e/s', 'each side',
    'when done', 'add', 'just', 'only', 'or',
  ];
  for (const mod of modifiersToRemove) {
    text = text.replace(new RegExp(`\\b${mod}\\b`, 'gi'), '');
  }

  // Normalize common abbreviations
  const abbreviations: Record<string, string> = {
    'gm': 'good morning',
    'dl': 'deadlift',
    'rdl': 'romanian deadlift',
    'sdl': 'sumo deadlift',
    'wgs': 'worlds greatest stretch',
    'mc': 'mountain climber',
    'rr': 'renegade row',
    'cp': 'chest press',
    'oh': 'overhead',
    'bw': 'bodyweight',
    'db': 'dumbbell',
    'hi pull': 'high pull',
    'rev': 'reverse',
  };

  for (const [abbr, full] of Object.entries(abbreviations)) {
    text = text.replace(new RegExp(`\\b${abbr}\\b`, 'gi'), full);
  }

  // Clean up
  text = text.replace(/[|:()]/g, ' ');
  text = text.replace(/\s+/g, ' ').trim();

  // Handle multi-exercise strings - take the primary one
  if (text.includes(' to ')) {
    // "squat to lunge" -> take last one as it's typically the "destination"
    const parts = text.split(' to ');
    text = parts[parts.length - 1].trim();
  }

  return text || 'unknown';
}

/**
 * Extract individual exercises from a complex string
 */
export function extractExercises(rawText: string): string[] {
  const exercises: string[] = [];

  // Split by pipe first
  const pipeParts = rawText.split('|').map(s => s.trim()).filter(Boolean);

  for (const part of pipeParts) {
    // Skip "same" references
    if (/^same\b/i.test(part)) continue;

    // Handle "to" chains
    if (part.includes(' to ')) {
      const toParts = part.split(/\s+to\s+/i);
      exercises.push(...toParts.filter(Boolean));
    } else {
      exercises.push(part);
    }
  }

  return exercises.map(e => e.trim()).filter(Boolean);
}

// ============================================================================
// INTENSITY SCORING
// ============================================================================

/**
 * Calculate intensity score (0-100) for an exercise
 */
export function calculateIntensityScore(rawText: string): number {
  let score = 50; // Base score
  const text = rawText.toLowerCase();

  // High intensity indicators (+)
  if (/snatch/i.test(text)) score += 30;
  if (/burpee/i.test(text)) score += 25;
  if (/sprint/i.test(text)) score += 25;
  if (/clean/i.test(text)) score += 20;
  if (/jump/i.test(text)) score += 20;
  if (/amrap/i.test(text)) score += 20;
  if (/burn\s*out|bo\b/i.test(text)) score += 15;
  if (/power/i.test(text)) score += 15;
  if (/explosive/i.test(text)) score += 15;
  if (/heavy/i.test(text)) score += 10;

  // Medium intensity indicators
  if (/deadlift|dl\b/i.test(text)) score += 10;
  if (/squat/i.test(text)) score += 5;
  if (/row/i.test(text)) score += 5;
  if (/press/i.test(text)) score += 5;

  // Low intensity indicators (-)
  if (/tempo/i.test(text)) score -= 15;
  if (/hold/i.test(text)) score -= 10;
  if (/stretch/i.test(text)) score -= 20;
  if (/wgs|world.*greatest/i.test(text)) score -= 20;
  if (/cat.*cow/i.test(text)) score -= 25;
  if (/recover/i.test(text)) score -= 30;

  return Math.max(0, Math.min(100, score));
}

// ============================================================================
// VIBE PROFILE
// ============================================================================

/**
 * Calculate vibe profile for an exercise
 * Determines what tread patterns it matches well with
 */
export function calculateVibeProfile(rawText: string): VibeProfile {
  const intensity = calculateIntensityScore(rawText);
  const isFinisher = isFinisherMove(rawText);
  const isPower = isPowerMove(rawText);
  const text = rawText.toLowerCase();

  // Determine matches
  const matchesRecovery = intensity < 40 || /tempo|hold|stretch/i.test(text);
  const matchesSprint = intensity > 70 || isPower || isFinisher;
  const matchesBuild = intensity >= 40 && intensity <= 80;
  const matchesIncline = /squat|lunge|deadlift|hinge/i.test(text);

  // Determine preferred energy level
  let preferredEnergyLevel: VibeProfile['preferredEnergyLevel'] = 'any';
  if (/wgs|cat.*cow|stretch|good\s*morning/i.test(text)) {
    preferredEnergyLevel = 'warmup';
  } else if (isFinisher || /snatch|burpee/i.test(text)) {
    preferredEnergyLevel = 'peak';
  } else if (intensity > 60) {
    preferredEnergyLevel = 'building';
  }

  // Determine speed ranges
  let minTreadSpeed = 5;
  let maxTreadSpeed = 10;

  if (matchesRecovery) {
    minTreadSpeed = 0;
    maxTreadSpeed = 6;
  } else if (matchesSprint) {
    minTreadSpeed = 7;
    maxTreadSpeed = 12;
  }

  return {
    matchesRecovery,
    matchesSprint,
    matchesBuild,
    matchesIncline,
    minTreadSpeed,
    maxTreadSpeed,
    preferredEnergyLevel,
  };
}

// ============================================================================
// PROGRESSION DETECTION
// ============================================================================

/**
 * Detect exercise progressions from a "to" chain
 * e.g., "Row to Squat to Hi Pull to Snatch" shows progression
 */
export function detectProgressions(rawText: string): { from: string; to: string }[] {
  const progressions: { from: string; to: string }[] = [];

  if (!rawText.includes(' to ')) return progressions;

  const parts = rawText.split(/\s+to\s+/i).map(s => s.trim()).filter(Boolean);

  for (let i = 0; i < parts.length - 1; i++) {
    const from = normalizeExerciseName(parts[i]);
    const to = normalizeExerciseName(parts[i + 1]);
    if (from !== to && from !== 'unknown' && to !== 'unknown') {
      progressions.push({ from, to });
    }
  }

  return progressions;
}

// ============================================================================
// INDEX BUILDING
// ============================================================================

/**
 * Build exercise index from imported data
 */
export function buildExerciseIndex(): ExerciseIndex {
  const indexed = loadIndexFromStorage();
  if (!indexed) {
    return createEmptyIndex();
  }

  const exercises = new Map<string, IndexedExercise>();
  const byPosition = new Map<ExercisePosition, string[]>();
  const byMovement = new Map<MovementPattern, string[]>();
  const byMuscle = new Map<MuscleGroup, string[]>();
  const byIntensity = { low: [] as string[], medium: [] as string[], high: [] as string[] };
  const progressions = new Map<string, string[]>();

  // Process all rounds
  for (const round of indexed.rounds) {
    processRoundForIndex(
      round,
      exercises,
      byPosition,
      byMovement,
      byMuscle,
      byIntensity,
      progressions
    );
  }

  return {
    exercises,
    byPosition,
    byMovement,
    byMuscle,
    byIntensity,
    progressions,
    lastUpdated: new Date().toISOString(),
  };
}

function processRoundForIndex(
  round: RoundMetadata,
  exercises: Map<string, IndexedExercise>,
  byPosition: Map<ExercisePosition, string[]>,
  byMovement: Map<MovementPattern, string[]>,
  byMuscle: Map<MuscleGroup, string[]>,
  byIntensity: { low: string[]; medium: string[]; high: string[] },
  progressions: Map<string, string[]>
): void {
  const isWarmup = round.roundNumber === 1;

  for (let i = 0; i < round.minutes.length; i++) {
    const minute = round.minutes[i];
    const isWarmupMinute = isWarmup && i < 3 && minute.isWarmup !== false;
    const isFinisherMinute = i === round.minutes.length - 1;

    // Extract exercises from this minute
    const rawExercises = extractExercises(minute.floor.rawText);

    // Build tread context
    const treadContext: TreadContext = {
      isRecover: minute.tread.isRecover,
      isSprint: minute.tread.isSprint,
      hasIncline: minute.tread.inclinePercent > 0,
      effectiveSpeed: minute.tread.effectiveSpeed,
    };

    for (const rawEx of rawExercises) {
      const normalizedName = normalizeExerciseName(rawEx);
      if (normalizedName === 'unknown') continue;

      // Get or create indexed exercise
      let indexedEx = exercises.get(normalizedName);

      if (!indexedEx) {
        // Create new entry
        const position = detectPrimaryPosition(rawEx);
        const movement = detectMovementPattern(rawEx);
        const grip = detectGripDemand(rawEx);
        const modifiers = extractModifiers(rawEx);
        const intensity = calculateIntensityScore(rawEx);
        const vibe = calculateVibeProfile(rawEx);

        indexedEx = {
          id: `ex_${normalizedName.replace(/\s+/g, '_')}`,
          rawText: rawEx,
          normalizedName,
          position,
          movementPattern: movement,
          primaryMuscle: minute.floor.primaryMuscle,
          gripDemand: grip,
          isFinisher: isFinisherMove(rawEx),
          isPower: isPowerMove(rawEx),
          modifiers: Object.entries(modifiers)
            .filter(([_, v]) => v === true)
            .map(([k]) => k),
          intensityScore: intensity,
          vibeProfile: vibe,
          sourceClassIds: [],
          sourceBlockIds: [],
          minutePositions: [],
          progressionFrom: [],
          progressionTo: [],
          commonPairs: [],
          useCount: 0,
          lastUsed: null,
        };

        exercises.set(normalizedName, indexedEx);

        // Add to category maps
        addToMap(byPosition, position, normalizedName);
        addToMap(byMovement, movement, normalizedName);
        addToMap(byMuscle, minute.floor.primaryMuscle, normalizedName);

        // Add to intensity bucket
        if (intensity < 34) byIntensity.low.push(normalizedName);
        else if (intensity < 67) byIntensity.medium.push(normalizedName);
        else byIntensity.high.push(normalizedName);
      }

      // Update context
      if (!indexedEx.sourceClassIds.includes(round.sourceClassId)) {
        indexedEx.sourceClassIds.push(round.sourceClassId);
      }

      indexedEx.minutePositions.push({
        roundNumber: round.roundNumber,
        minuteInRound: i,
        isWarmup: isWarmupMinute,
        isFinisher: isFinisherMinute,
        treadContext,
      });

      indexedEx.useCount++;
    }

    // Detect progressions from "to" chains
    const progs = detectProgressions(minute.floor.rawText);
    for (const prog of progs) {
      addToMap(progressions, prog.from, prog.to);

      // Update exercise entries
      const fromEx = exercises.get(prog.from);
      const toEx = exercises.get(prog.to);

      if (fromEx && !fromEx.progressionTo.includes(prog.to)) {
        fromEx.progressionTo.push(prog.to);
      }
      if (toEx && !toEx.progressionFrom.includes(prog.from)) {
        toEx.progressionFrom.push(prog.from);
      }
    }
  }
}

function addToMap<K, V>(map: Map<K, V[]>, key: K, value: V): void {
  const arr = map.get(key) || [];
  if (!arr.includes(value)) {
    arr.push(value);
    map.set(key, arr);
  }
}

function createEmptyIndex(): ExerciseIndex {
  return {
    exercises: new Map(),
    byPosition: new Map(),
    byMovement: new Map(),
    byMuscle: new Map(),
    byIntensity: { low: [], medium: [], high: [] },
    progressions: new Map(),
    lastUpdated: new Date().toISOString(),
  };
}

// ============================================================================
// STORAGE
// ============================================================================

/**
 * Save exercise index to storage
 */
export function saveExerciseIndex(index: ExerciseIndex): void {
  const serializable = {
    exercises: Object.fromEntries(index.exercises),
    byPosition: Object.fromEntries(index.byPosition),
    byMovement: Object.fromEntries(index.byMovement),
    byMuscle: Object.fromEntries(index.byMuscle),
    byIntensity: index.byIntensity,
    progressions: Object.fromEntries(index.progressions),
    lastUpdated: index.lastUpdated,
  };

  localStorage.setItem(EXERCISE_INDEX_KEY, JSON.stringify(serializable));
}

/**
 * Load exercise index from storage
 */
export function loadExerciseIndex(): ExerciseIndex | null {
  try {
    const stored = localStorage.getItem(EXERCISE_INDEX_KEY);
    if (!stored) return null;

    const parsed = JSON.parse(stored);

    return {
      exercises: new Map(Object.entries(parsed.exercises || {})) as Map<string, IndexedExercise>,
      byPosition: new Map(Object.entries(parsed.byPosition || {})) as Map<ExercisePosition, string[]>,
      byMovement: new Map(Object.entries(parsed.byMovement || {})) as Map<MovementPattern, string[]>,
      byMuscle: new Map(Object.entries(parsed.byMuscle || {})) as Map<MuscleGroup, string[]>,
      byIntensity: parsed.byIntensity || { low: [], medium: [], high: [] },
      progressions: new Map(Object.entries(parsed.progressions || {})) as Map<string, string[]>,
      lastUpdated: parsed.lastUpdated || new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

// ============================================================================
// QUERYING
// ============================================================================

/**
 * Find exercises matching criteria
 */
export function findExercises(
  index: ExerciseIndex,
  criteria: {
    position?: ExercisePosition;
    movement?: MovementPattern;
    muscle?: MuscleGroup;
    minIntensity?: number;
    maxIntensity?: number;
    matchesSprint?: boolean;
    matchesRecovery?: boolean;
    preferWarmup?: boolean;
    preferFinisher?: boolean;
    excludeUsedRecently?: boolean;
  }
): IndexedExercise[] {
  let candidates = Array.from(index.exercises.values());

  // Filter by position
  if (criteria.position) {
    candidates = candidates.filter(e => e.position === criteria.position);
  }

  // Filter by movement
  if (criteria.movement) {
    candidates = candidates.filter(e => e.movementPattern === criteria.movement);
  }

  // Filter by muscle
  if (criteria.muscle) {
    candidates = candidates.filter(e => e.primaryMuscle === criteria.muscle);
  }

  // Filter by intensity range
  if (criteria.minIntensity !== undefined) {
    candidates = candidates.filter(e => e.intensityScore >= criteria.minIntensity!);
  }
  if (criteria.maxIntensity !== undefined) {
    candidates = candidates.filter(e => e.intensityScore <= criteria.maxIntensity!);
  }

  // Filter by vibe
  if (criteria.matchesSprint) {
    candidates = candidates.filter(e => e.vibeProfile.matchesSprint);
  }
  if (criteria.matchesRecovery) {
    candidates = candidates.filter(e => e.vibeProfile.matchesRecovery);
  }

  // Filter by preferred position
  if (criteria.preferWarmup) {
    candidates = candidates.filter(e =>
      e.vibeProfile.preferredEnergyLevel === 'warmup' ||
      e.vibeProfile.preferredEnergyLevel === 'any'
    );
  }
  if (criteria.preferFinisher) {
    candidates = candidates.filter(e =>
      e.vibeProfile.preferredEnergyLevel === 'peak' ||
      e.isFinisher
    );
  }

  return candidates;
}

/**
 * Find exercises that match a tread context
 */
export function findExercisesForTread(
  index: ExerciseIndex,
  treadContext: TreadContext
): IndexedExercise[] {
  return Array.from(index.exercises.values()).filter(e => {
    const vibe = e.vibeProfile;

    // Match based on tread type
    if (treadContext.isRecover && !vibe.matchesRecovery) return false;
    if (treadContext.isSprint && !vibe.matchesSprint) return false;
    if (treadContext.hasIncline && !vibe.matchesIncline) return false;

    // Check speed range
    if (treadContext.effectiveSpeed < vibe.minTreadSpeed) return false;
    if (treadContext.effectiveSpeed > vibe.maxTreadSpeed) return false;

    return true;
  });
}

/**
 * Get exercises that commonly follow a given exercise
 */
export function getNextExercises(
  index: ExerciseIndex,
  currentExercise: string
): IndexedExercise[] {
  const normalized = normalizeExerciseName(currentExercise);
  const progressionTargets = index.progressions.get(normalized) || [];

  return progressionTargets
    .map(name => index.exercises.get(name))
    .filter((e): e is IndexedExercise => e !== undefined);
}

// ============================================================================
// NL PROMPT SCORING
// Score exercises against natural language prompts
// ============================================================================

// Per-round constraints for complex prompts
export interface RoundConstraints {
  duration?: number;                    // "12 minutes"
  movements?: MovementPattern[];        // "push", "pull"
  muscles?: MuscleGroup[];              // "back", "chest"
  mustInclude?: string[];               // "deadlifts", "snatches"
  mustExclude?: string[];               // "no burpees"
  treadIncline?: boolean;               // "incline" or "no incline"
  treadSprints?: boolean;               // "sprints" or "no sprints"
  treadEndurance?: boolean;             // "endurance runs" - steady pace, fewer sprints
  intensity?: 'low' | 'medium' | 'high';
  equipment?: 'heavy' | 'medium' | 'light';  // "heavies", "mediums", "lights"
  compoundFocus?: boolean;              // "compound focused"
}

export interface NLParseResult {
  // Global preferences (apply to both rounds unless overridden)
  movements: MovementPattern[];
  muscles: MuscleGroup[];
  modifiers: string[];
  intensity: 'low' | 'medium' | 'high' | null;
  finisherType: string | null;
  keywords: string[];

  // Vibe/structure preferences (null = no preference, true = want more, false = exclude)
  vibePreferences: {
    combos: boolean | null;      // "lots of compound movements" or "no combos"
    emom: boolean | null;        // "include EMOM" or "no EMOM"
    ladders: boolean | null;     // "use ladders" or "no ladders"
    splits: boolean | null;      // "add splits" or "no splits"
    freshOnly: boolean | null;   // "only fresh exercises" or "mix it up"
  };

  // Per-round constraints (overrides global when specified)
  round1?: RoundConstraints;
  round2?: RoundConstraints;
}

/**
 * Parse a natural language prompt into structured criteria
 */
export function parseNLPrompt(prompt: string): NLParseResult {
  const lower = prompt.toLowerCase();
  const result: NLParseResult = {
    movements: [],
    muscles: [],
    modifiers: [],
    intensity: null,
    finisherType: null,
    keywords: [],
    vibePreferences: {
      combos: null,
      emom: null,
      ladders: null,
      splits: null,
      freshOnly: null,
    },
  };

  // Detect vibe preferences
  // NOTE: Check exclusions FIRST before checking inclusions

  // Combos / compound movements
  if (/no\s+combo|no\s+compound|without\s+combo|without\s+compound|simple\s+exercise|basic\s+exercise/i.test(lower)) {
    result.vibePreferences.combos = false;
  } else if (/\b(lots?\s+of\s+)?(combo|compound|combination)/i.test(lower) ||
      /more\s+compound/i.test(lower) ||
      /squat\s+to\s+press|deadlift\s+to\s+row/i.test(lower)) {
    result.vibePreferences.combos = true;
  }

  // EMOM
  if (/\b(include|with|add|use)\s+emom/i.test(lower) ||
      /emom\s+style/i.test(lower)) {
    result.vibePreferences.emom = true;
  } else if (/no\s+emom|without\s+emom|skip\s+emom/i.test(lower)) {
    result.vibePreferences.emom = false;
  }

  // Ladders
  if (/\b(include|with|add|use)\s+ladder/i.test(lower) ||
      /ladder\s+pattern|progressive/i.test(lower)) {
    result.vibePreferences.ladders = true;
  } else if (/no\s+ladder|without\s+ladder/i.test(lower)) {
    result.vibePreferences.ladders = false;
  }

  // Splits
  if (/\b(include|with|add|use)\s+split/i.test(lower) ||
      /30.?30|45.?15/i.test(lower)) {
    result.vibePreferences.splits = true;
  } else if (/no\s+split|without\s+split/i.test(lower)) {
    result.vibePreferences.splits = false;
  }

  // Freshness
  if (/fresh|new|haven.?t\s+used|unused|different/i.test(lower)) {
    result.vibePreferences.freshOnly = true;
  } else if (/mix|variety|anything|repeat|favorite/i.test(lower)) {
    result.vibePreferences.freshOnly = false;
  }

  // Detect movement patterns
  const movementPatterns: Record<MovementPattern, RegExp[]> = {
    push: [/push/i, /press/i, /chest/i, /tricep/i],
    pull: [/pull/i, /row/i, /curl/i, /back/i, /bicep/i],
    hinge: [/hinge/i, /deadlift/i, /rdl/i, /swing/i, /good\s*morning/i],
    squat: [/squat/i, /goblet/i, /sumo/i],
    lunge: [/lunge/i, /split/i, /step.*up/i],
    rotation: [/twist/i, /rotate/i, /oblique/i],
    plank: [/plank/i, /core/i, /ab/i],
    power: [/power/i, /explosive/i, /snatch/i, /clean/i, /burpee/i, /jump/i],
    carry: [/carry/i, /farmer/i],
  };

  for (const [pattern, regexes] of Object.entries(movementPatterns)) {
    for (const regex of regexes) {
      if (regex.test(lower)) {
        result.movements.push(pattern as MovementPattern);
        break;
      }
    }
  }

  // Detect muscle groups
  const musclePatterns: Record<MuscleGroup, RegExp[]> = {
    chest: [/chest/i, /pec/i],
    back: [/back/i, /lat/i],
    shoulders: [/shoulder/i, /delt/i],
    biceps: [/bicep/i, /curl/i],
    triceps: [/tricep/i],
    quads: [/quad/i, /leg/i],
    hamstrings: [/hamstring/i, /ham/i],
    glutes: [/glute/i, /butt/i, /booty/i],
    calves: [/calf/i, /calves/i],
    core: [/core/i, /ab/i, /stomach/i],
    obliques: [/oblique/i, /side/i],
    full_body: [/full\s*body/i, /total\s*body/i, /compound/i],
  };

  for (const [muscle, regexes] of Object.entries(musclePatterns)) {
    for (const regex of regexes) {
      if (regex.test(lower)) {
        result.muscles.push(muscle as MuscleGroup);
        break;
      }
    }
  }

  // Detect modifiers
  if (/heavy/i.test(lower)) result.modifiers.push('heavy');
  if (/tempo/i.test(lower)) result.modifiers.push('tempo');
  if (/hold/i.test(lower)) result.modifiers.push('hold');
  if (/burn\s*out/i.test(lower)) result.modifiers.push('burnout');
  if (/amrap/i.test(lower)) result.modifiers.push('amrap');
  if (/alternating|alt\b/i.test(lower)) result.modifiers.push('alternating');

  // Detect intensity
  if (/high\s*intensity|intense|hard|challenging/i.test(lower)) {
    result.intensity = 'high';
  } else if (/low\s*intensity|easy|gentle|light/i.test(lower)) {
    result.intensity = 'low';
  } else if (/medium|moderate/i.test(lower)) {
    result.intensity = 'medium';
  }

  // Detect finisher type
  if (/snatch/i.test(lower)) result.finisherType = 'snatches';
  if (/burpee/i.test(lower)) result.finisherType = 'burpees';
  if (/swing/i.test(lower)) result.finisherType = 'db_swings';

  // Extract other keywords
  const keywords = lower.match(/\b\w{4,}\b/g) || [];
  result.keywords = keywords.filter(k =>
    !['with', 'that', 'have', 'want', 'like', 'some', 'more', 'less'].includes(k)
  );

  // ============================================
  // PER-ROUND CONSTRAINTS PARSING
  // Uses direct pattern matching to avoid cross-contamination
  // ============================================

  // ============================================
  // DURATION PATTERNS - HIGHEST PRIORITY
  // ============================================

  // "X and Y minutes" pattern
  const andMinutesMatch = lower.match(/(\d+)\s*(?:min|minutes?)\s+and\s+(\d+)\s*(?:min|minutes?)/i);
  if (andMinutesMatch) {
    if (!result.round1) result.round1 = {};
    if (!result.round2) result.round2 = {};
    result.round1.duration = parseInt(andMinutesMatch[1], 10);
    result.round2.duration = parseInt(andMinutesMatch[2], 10);
  }

  // ============================================
  // MOVEMENT PATTERNS - Direct detection
  // ============================================

  // "first round is a push" or "round 1 is push"
  const r1Movement = lower.match(/(?:first\s+round|round\s*1|r1)\s+(?:is\s+)?(?:a\s+)?(push|pull|hinge|squat|power)/i);
  if (r1Movement) {
    if (!result.round1) result.round1 = {};
    result.round1.movements = [r1Movement[1] as MovementPattern];
  }

  // "second is pull" or "second round is pull"
  const r2Movement = lower.match(/(?:second\s+(?:round\s+)?|round\s*2|r2)\s*(?:is\s+)?(?:a\s+)?(push|pull|hinge|squat|power)/i);
  if (r2Movement) {
    if (!result.round2) result.round2 = {};
    result.round2.movements = [r2Movement[1] as MovementPattern];
  }

  // "push workout round 1" pattern
  const directR1Movement = lower.match(/(push|pull|hinge|squat|power)\s+(?:\w+\s+)?(?:round\s*1|first\s+round)/i);
  if (directR1Movement) {
    if (!result.round1) result.round1 = {};
    if (!result.round1.movements) result.round1.movements = [];
    if (!result.round1.movements.includes(directR1Movement[1] as MovementPattern)) {
      result.round1.movements.push(directR1Movement[1] as MovementPattern);
    }
  }

  const directR2Movement = lower.match(/(push|pull|hinge|squat|power)\s+(?:\w+\s+)?(?:round\s*2|second\s+round)/i);
  if (directR2Movement) {
    if (!result.round2) result.round2 = {};
    if (!result.round2.movements) result.round2.movements = [];
    if (!result.round2.movements.includes(directR2Movement[1] as MovementPattern)) {
      result.round2.movements.push(directR2Movement[1] as MovementPattern);
    }
  }

  // ============================================
  // MUSCLE & EXERCISE PATTERNS - "X in round Y"
  // Split by sentences to avoid cross-contamination
  // ============================================

  // Helper to parse muscles and exercises from content
  const parseMusclesAndExercises = (content: string) => {
    const muscles: MuscleGroup[] = [];
    const mustInclude: string[] = [];
    if (/\bchest\b/i.test(content)) muscles.push('chest');
    if (/\bback\b/i.test(content)) muscles.push('back');
    if (/\bleg/i.test(content)) muscles.push('quads');
    if (/\bshoulder/i.test(content)) muscles.push('shoulders');
    if (/\bcore\b|\babs?\b/i.test(content)) muscles.push('core');
    if (/\bdeadlifts?\b/i.test(content)) mustInclude.push('deadlift');
    if (/\bsnatch/i.test(content)) mustInclude.push('snatch');
    if (/\bburpee/i.test(content)) mustInclude.push('burpee');
    if (/\bclean\b/i.test(content)) mustInclude.push('clean');
    return { muscles, mustInclude };
  };

  // Split by sentences and look for round references
  const sentences = lower.split(/[.!?]+/).filter(s => s.trim());

  for (const sentence of sentences) {
    // Check for "X in round 1" pattern
    const r1Match = sentence.match(/(.+?)\s+(?:in|for)\s+(?:the\s+)?(?:first\s+round|round\s*1|r1)(?:\s|$|,)/i);
    if (r1Match) {
      const content = r1Match[1];
      const parsed = parseMusclesAndExercises(content);
      if (parsed.muscles.length > 0) {
        if (!result.round1) result.round1 = {};
        result.round1.muscles = parsed.muscles;
      }
      if (parsed.mustInclude.length > 0) {
        if (!result.round1) result.round1 = {};
        result.round1.mustInclude = parsed.mustInclude;
      }
    }

    // Check for "X in round 2" pattern
    const r2Match = sentence.match(/(.+?)\s+(?:in|for)\s+(?:the\s+)?(?:second\s+round|round\s*2|r2)(?:\s|$|,)/i);
    if (r2Match) {
      const content = r2Match[1];
      const parsed = parseMusclesAndExercises(content);
      if (parsed.muscles.length > 0) {
        if (!result.round2) result.round2 = {};
        result.round2.muscles = parsed.muscles;
      }
      if (parsed.mustInclude.length > 0) {
        if (!result.round2) result.round2 = {};
        result.round2.mustInclude = parsed.mustInclude;
      }
    }
  }

  // ============================================
  // EQUIPMENT PATTERNS
  // ============================================

  // "Heavies in Round 1"
  if (/heav(?:y|ies)\s+(?:in\s+)?(?:round\s*1|r1|first\s+round)/i.test(lower)) {
    if (!result.round1) result.round1 = {};
    result.round1.equipment = 'heavy';
  }

  // "Mediums in Round 2"
  if (/medium(?:s)?\s+(?:in\s+)?(?:round\s*2|r2|second\s+round)/i.test(lower)) {
    if (!result.round2) result.round2 = {};
    result.round2.equipment = 'medium';
  }

  // ============================================
  // INCLINE PATTERNS
  // ============================================

  // "incline on round 1" or "incline round 1"
  if (/incline\s+(?:on\s+|in\s+)?(?:round\s*1|r1|first\s+round)/i.test(lower)) {
    if (!result.round1) result.round1 = {};
    result.round1.treadIncline = true;
  }

  // "incline round 2" - check it's not negated in same context
  if (/incline\s+(?:on\s+|in\s+)?(?:round\s*2|r2|second\s+round)/i.test(lower)) {
    // Only set if NOT followed by negation in same sentence
    if (!/incline[^.]*and\s+not\s+(?:on\s+)?(?:round\s*(?:2|two)|r2|second)/i.test(lower)) {
      if (!result.round2) result.round2 = {};
      result.round2.treadIncline = true;
    }
  }

  // Handle incline negation: "and not on round 2" or "not on round two"
  if (/incline[^.]*\band\s+not\s+(?:on\s+|in\s+)?(?:round\s*(?:2|two)|r2|second)/i.test(lower) ||
      /\bnot\s+(?:on\s+|in\s+)?round\s*two\b/i.test(lower)) {
    if (!result.round2) result.round2 = {};
    result.round2.treadIncline = false;
  }

  // ============================================
  // ENDURANCE PATTERNS
  // ============================================

  if (/endurance\s+(?:runs?\s+)?(?:for\s+|in\s+)?(?:round\s*1|r1|first\s+round)/i.test(lower)) {
    if (!result.round1) result.round1 = {};
    result.round1.treadEndurance = true;
    result.round1.treadSprints = false;
  }

  if (/endurance\s+(?:runs?\s+)?(?:for\s+|in\s+)?(?:round\s*2|r2|second\s+round)/i.test(lower)) {
    if (!result.round2) result.round2 = {};
    result.round2.treadEndurance = true;
    result.round2.treadSprints = false;
  }

  // ============================================
  // COMPOUND FOCUS PATTERNS
  // ============================================

  // "round 2 I want to be compound movement focused"
  if (/(?:round\s*2|r2|second\s+round)[^.]*compound\s*(?:movement\s*)?focus/i.test(lower)) {
    if (!result.round2) result.round2 = {};
    result.round2.compoundFocus = true;
  }

  if (/(?:round\s*1|r1|first\s+round)[^.]*compound\s*(?:movement\s*)?focus/i.test(lower)) {
    if (!result.round1) result.round1 = {};
    result.round1.compoundFocus = true;
  }

  return result;
}

/**
 * Score an exercise against an NL prompt
 * Returns 0-100 score
 */
export function scoreExerciseForPrompt(
  exercise: IndexedExercise,
  parsed: NLParseResult
): number {
  let score = 50; // Base score

  // Movement pattern match (high weight)
  if (parsed.movements.includes(exercise.movementPattern)) {
    score += 25;
  }

  // Muscle group match
  if (parsed.muscles.includes(exercise.primaryMuscle)) {
    score += 20;
  }

  // Modifier match
  for (const mod of parsed.modifiers) {
    if (exercise.modifiers.includes(mod)) {
      score += 10;
    }
  }

  // Intensity match
  if (parsed.intensity) {
    const exIntensity = exercise.intensityScore;
    if (parsed.intensity === 'high' && exIntensity > 70) score += 15;
    else if (parsed.intensity === 'medium' && exIntensity >= 40 && exIntensity <= 70) score += 15;
    else if (parsed.intensity === 'low' && exIntensity < 40) score += 15;
  }

  // Finisher match
  if (parsed.finisherType && exercise.isFinisher) {
    if (exercise.rawText.toLowerCase().includes(parsed.finisherType.replace('_', ' '))) {
      score += 20;
    } else if (exercise.isFinisher) {
      score += 10;
    }
  }

  // Keyword matching (lower weight)
  const exerciseWords = exercise.rawText.toLowerCase().split(/\s+/);
  for (const keyword of parsed.keywords) {
    if (exerciseWords.some(w => w.includes(keyword) || keyword.includes(w))) {
      score += 5;
    }
  }

  return Math.min(100, Math.max(0, score));
}

/**
 * Find exercises matching an NL prompt
 */
export function findExercisesForPrompt(
  index: ExerciseIndex,
  prompt: string,
  limit: number = 20
): { exercise: IndexedExercise; score: number }[] {
  const parsed = parseNLPrompt(prompt);
  const candidates = Array.from(index.exercises.values());

  const scored = candidates.map(exercise => ({
    exercise,
    score: scoreExerciseForPrompt(exercise, parsed),
  }));

  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, limit);
}
