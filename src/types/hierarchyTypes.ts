// ============================================================================
// Barry's Class Programming Tool - Comprehensive Hierarchy Types
// Three-level data model: Class → Round → Block → Exercise
// ============================================================================

// ===== POSITION TAXONOMY =====
// Physical position on the floor during exercise
// Frequency from 49 Total Body classes analysis

export type ExercisePosition =
  // FLOOR (left side of bench)
  | 'floor_standing'    // 61.5% - Most exercises: squats, lunges, curls, deadlifts
  | 'floor_laying'      // 20.4% - Planks, pushups, mountain climbers, WGS

  // BENCH
  | 'bench_laying'      // 14.3% - Chest press, skull crushers, toe touches, crunches
  | 'bench_sitting'     // 2.7%  - Russian twists, boat pose, situps
  | 'bench_front'       // 0.2%  - Box squats, hip thrusts, concentration curls
  | 'bench_back'        // 0.5%  - Spider crunches, spiderman pushups
  | 'bench_straddling'  // 0.5%  - Bent over rows straddling bench
  | 'bench_standing';   // Rare  - Elevated lunges, step ups

// ===== EQUIPMENT TAXONOMY =====

export type WeightType = 'heavy' | 'medium' | 'light';
export type WeightCount = 1 | 2;

export interface WeightEquipment {
  type: WeightType;
  count: WeightCount;
}

export type BenchSetup = 'flat' | 'incline' | 'mega';
export type AccessoryType = 'booty_band' | 'long_band' | 'mini_band';

// Complete equipment set for a round
export interface EquipmentSet {
  primary: WeightEquipment;           // e.g., { type: 'heavy', count: 2 }
  secondary?: WeightEquipment;        // e.g., { type: 'medium', count: 1 }
  accessory?: AccessoryType;
  benchSetup: BenchSetup;
  rawText: string;                    // Original equipment text from source
}

// ===== MOVEMENT TAXONOMY =====

export type MovementPattern =
  | 'push'       // Chest Press, Pushups, Shoulder Press, Tricep
  | 'pull'       // Row, Curl, Pullover, High Pull
  | 'hinge'      // Deadlift, Good Morning, RDL, Swing
  | 'squat'      // Squat, Goblet, Sumo
  | 'lunge'      // Lunges, Curtsy, Reverse Lunge
  | 'rotation'   // Russian Twist, Woodchop
  | 'carry'      // Farmer carry, Suitcase carry
  | 'plank'      // Plank, Mountain Climbers, Commandos
  | 'power';     // Snatch, Clean, Burpee, Jump

export type MuscleGroup =
  | 'chest' | 'back' | 'shoulders' | 'biceps' | 'triceps'
  | 'quads' | 'hamstrings' | 'glutes' | 'calves'
  | 'core' | 'obliques'
  | 'full_body';

export type BodyFocus =
  | 'upper' | 'lower' | 'core' | 'full_body'
  | 'chest' | 'back' | 'shoulders' | 'arms';

export type GripDemand = 'high' | 'medium' | 'low' | 'none';

// ===== REP TAXONOMY =====

export type RepClassification =
  | 'fixed'      // Fixed rep count: "12 Squats", "3 GM 3 Squats"
  | 'amrap'      // As Many Rounds As Possible
  | 'burnout'    // Rep out / burn out / to failure
  | 'tempo'      // Slow/controlled reps
  | 'hold'       // Isometric hold
  | 'ladder'     // Progressive reps (+1, -1, pyramid)
  | 'timed';     // Time-based (e.g., "30 seconds")

export interface RepScheme {
  type: 'fixed' | 'descending' | 'ascending' | 'ladder' | 'triplet';
  pattern: string;    // "3-3-3", "6-4-2", "12", "+1"
  totalReps?: number;
}

// ===== TREAD TAXONOMY =====

export type TreadPattern =
  | 'progressive_build'
  | 'slingshot'
  | 'intervals'
  | 'incline_heavy'
  | 'recovery_heavy'
  | 'sprint_focused'
  | 'balanced';

export type TreadCharacter =
  | 'speed_build'
  | 'incline_focus'
  | 'interval_heavy'
  | 'recovery_focused'
  | 'sprint_focused'
  | 'balanced';

// ===== FINISHER TAXONOMY =====

export type FinisherType =
  | 'snatches'
  | 'burpees'
  | 'weighted_burpees'
  | 'squat_to_hi_pull'
  | 'deadlift_clean_squat'
  | 'db_swings'
  | 'amrap'
  | 'choice';

// ===== BLOCK TAXONOMY =====

export type StructureTag =
  | 'amrap'
  | 'emom'
  | 'tempo'
  | 'drop_set'
  | 'hold_pulse'
  | 'superset'
  | 'ladder'
  | 'rep_scheme'
  | 'same_side';

export type MovementTag =
  | 'compound'
  | 'isolation'
  | 'power_explosive'
  | 'mobility';

export type Intensity = 'high' | 'medium' | 'low';
export type BlockPosition = 'early' | 'middle' | 'late' | 'finisher';
export type ArcType = 'build' | 'steady' | 'peak' | 'recovery';

// ===== EXERCISE MODIFIERS =====

export interface ExerciseModifiers {
  tempo: boolean;
  alternating: boolean;
  burnout: boolean;
  hold: boolean;
  pulse: boolean;
  heavy: boolean;
  wide: boolean;
  narrow: boolean;
  singleArm: boolean;
  incline: boolean;
  unilateral: 'right' | 'left' | 'both' | null;
}

// ============================================================================
// LEVEL 3: EXERCISE METADATA
// Single minute of exercises
// ============================================================================

export interface ExerciseMetadata {
  // ===== IDENTITY =====
  id: string;
  rawText: string;                    // Original text from source
  exercises: string[];                // Parsed individual exercises

  // ===== POSITION =====
  positions: ExercisePosition[];      // All positions in this minute
  primaryPosition: ExercisePosition;  // Most demanding position
  hasPositionTransition: boolean;     // Transitions within minute

  // ===== BODY TARGETING =====
  primaryMuscle: MuscleGroup;
  secondaryMuscles: MuscleGroup[];
  movementPattern: MovementPattern;

  // ===== MODIFIERS =====
  modifiers: ExerciseModifiers;

  // ===== REP STRUCTURE =====
  repClassification: RepClassification;
  repScheme?: RepScheme;

  // ===== LOAD =====
  gripDemand: GripDemand;
  isFinisherMove: boolean;
  isPowerMove: boolean;

  // ===== CONTEXT =====
  minuteInBlock: number;              // 0-indexed position in block
  minuteInRound: number;              // 0-indexed position in round
  isBlockFinisher: boolean;           // Last minute of block
  isRoundFinisher: boolean;           // Last minute of round

  // ===== FRESHNESS =====
  lastUsed: string | null;            // ISO date
  useCount: number;
}

// ============================================================================
// LEVEL 3: TREAD MINUTE METADATA
// Single minute of tread data
// ============================================================================

export interface SpeedSet {
  low: number;
  mid: number;
  high: number;
}

export interface TreadMinuteMetadata {
  // ===== IDENTITY =====
  id: string;
  rawText: string;                    // Original tread notation

  // ===== SPEEDS =====
  speeds: SpeedSet[];                 // Can have multiple speed sets (for pipes)
  lowestSpeed: number;
  highestSpeed: number;
  effectiveSpeed: number;             // Adjusted for incline

  // ===== CHARACTERISTICS =====
  isRecover: boolean;
  isSprint: boolean;
  inclinePercent: number;
  hasInterval: boolean;               // Contains | pipe notation

  // ===== CONTEXT =====
  minuteInBlock: number;
  minuteInRound: number;

  // ===== DISPLAY =====
  textColor: 'black' | 'red' | 'purple';
}

// ============================================================================
// PAIRED MINUTE - Tread + Floor Together
// ============================================================================

export interface PairedMinute {
  minuteLabel: string;                // "0-1", "1-2", etc.
  minuteIndex: number;                // 0-indexed
  tread: TreadMinuteMetadata;
  floor: ExerciseMetadata;
  notes?: string;
}

// ============================================================================
// LEVEL 2: BLOCK METADATA
// 2-4 consecutive minutes forming a mini-arc
// ============================================================================

export interface BlockMetadata {
  // ===== IDENTITY =====
  id: string;
  content: string[];                  // Original exercise strings
  length: 2 | 3 | 4;
  category: 'warmups' | 'workouts';

  // ===== SOURCE PROVENANCE =====
  sourceClassId: string;              // Which class this came from
  sourceRoundNumber: 1 | 2;
  sourceMinuteStart: number;          // Start minute in original round
  sourceMinuteEnd: number;            // End minute in original round

  // ===== POSITION =====
  positions: ExercisePosition[];      // All positions in this block
  dominantPosition: ExercisePosition; // Most common position
  positionSequence: ExercisePosition[];

  // ===== FLOW =====
  flowScore: number;                  // 0-100
  flowRating: 'great' | 'good' | 'fair' | 'poor';
  totalTransitionCost: number;
  hasExcessiveTransitions: boolean;

  // ===== STRUCTURE TAGS =====
  structure: StructureTag[];
  movement: MovementTag[];
  bodyFocus: BodyFocus[];
  intensity: Intensity;

  // ===== CHARACTERISTICS =====
  typicalPosition: BlockPosition;     // Where this block usually appears
  arcType: ArcType;
  isRightSideBlock: boolean;
  isLeftSideBlock: boolean;
  hasSameKeyword: boolean;
  hasChoiceKeyword: boolean;

  // ===== LOAD =====
  movementPatterns: MovementPattern[];
  gripLoadScore: number;              // 0-10
  gripIntensiveMinutes: number;

  // ===== EQUIPMENT =====
  requiredEquipment: {
    requiresHeavy: boolean;
    requiresMedium: boolean;
    requiresLight: boolean;
    canBeBodyweight: boolean;
    requiresBench: boolean;
    benchSetup?: BenchSetup;
  };

  // ===== FOR EMBEDDINGS =====
  exerciseSequence: string;           // Normalized text for embedding
  embedding?: number[];

  // ===== FRESHNESS =====
  lastUsed: string | null;
  useCount: number;
  useDates: string[];
}

// ============================================================================
// LEVEL 2: TREAD BLOCK METADATA
// ============================================================================

export interface TreadBlockMetadata {
  // ===== IDENTITY =====
  id: string;
  content: string[];                  // Original tread notation strings
  length: 2 | 3 | 4;
  category: 'warmups' | 'workouts';

  // ===== SOURCE PROVENANCE =====
  sourceClassId: string;
  sourceRoundNumber: 1 | 2;
  sourceMinuteStart: number;
  sourceMinuteEnd: number;

  // ===== PROFILE =====
  character: TreadCharacter;
  baseSpeed: number;
  maxSpeed: number;
  avgSpeed: number;
  speedRange: number;

  // ===== INCLINE =====
  hasIncline: boolean;
  maxIncline: number;
  inclineMinutes: number;

  // ===== PATTERNS =====
  hasRecover: boolean;
  recoverCount: number;
  recoverRatio: number;
  hasSprint: boolean;
  sprintCount: number;
  hasIntervals: boolean;
  intervalCount: number;

  // ===== INTENSITY =====
  intensity: Intensity;

  // ===== FOR EMBEDDINGS =====
  embedding?: number[];

  // ===== FRESHNESS =====
  lastUsed: string | null;
  useCount: number;
}

// ============================================================================
// LEVEL 1: ROUND METADATA
// Complete round (8-14 minutes) with tread + floor paired
// ============================================================================

export interface RoundMetadata {
  // ===== IDENTITY =====
  id: string;
  roundNumber: 1 | 2;

  // ===== SOURCE =====
  sourceClassId: string;
  sourceDate: string;                 // ISO date
  sourceSheet: string;                // Original sheet name e.g., "1.17.25 (119)"

  // ===== STRUCTURE =====
  duration: number;                   // 8-14 minutes
  equipment: EquipmentSet;
  forecast?: string;

  // ===== CONTENT =====
  minutes: PairedMinute[];            // All minutes with tread+floor
  blockIds: string[];                 // References to floor blocks
  treadBlockIds: string[];            // References to tread blocks

  // ===== TREAD PROFILE =====
  treadPattern: TreadPattern;
  treadCharacter: TreadCharacter;
  sprintCount: number;
  recoverCount: number;
  hasIncline: boolean;
  maxIncline: number;
  treadAverage: number;

  // ===== FLOOR PROFILE =====
  primaryBodyFocus: BodyFocus[];
  movementPatterns: MovementPattern[];
  dominantPosition: ExercisePosition;
  positionSequence: ExercisePosition[];
  flowScore: number;
  gripLoadScore: number;
  hasGripBreaks: boolean;

  // ===== FINISHER =====
  finisherType: FinisherType | null;
  finisherExercise: string;

  // ===== FOR EMBEDDINGS =====
  exerciseSequence: string;
  embedding?: number[];

  // ===== FRESHNESS =====
  lastUsed: string | null;
  useCount: number;
  useDates: string[];
}

// ============================================================================
// TOP LEVEL: CLASS METADATA
// Complete class with both rounds
// ============================================================================

// Workout types offered at Barry's
export type WorkoutType =
  | 'total_body'
  | 'chest_back_abs'
  | 'arms_abs'
  | 'legs_glutes'
  | 'full_body_stretch'
  | 'other';

export const WORKOUT_TYPE_LABELS: Record<WorkoutType, string> = {
  total_body: 'Total Body',
  chest_back_abs: 'Chest/Back/Abs',
  arms_abs: 'Arms & Abs',
  legs_glutes: 'Legs & Glutes',
  full_body_stretch: 'Full Body Stretch',
  other: 'Other',
};

export interface ClassMetadata {
  // ===== IDENTITY =====
  id: string;
  date: string;                       // ISO date
  sourceSheet: string;                // Original sheet name
  classNumber?: number;               // e.g., 119, 128, 146
  dayOfWeek: string;                  // e.g., "Friday", "Sunday"
  workoutType: WorkoutType;           // Type of class (Total Body, Arms & Abs, etc.)

  // ===== STRUCTURE =====
  totalDuration: number;              // round1 + round2 duration
  round1: RoundMetadata;
  round2: RoundMetadata;

  // ===== AGGREGATE STATS =====
  overallTreadAverage: number;
  totalSprintCount: number;
  totalRecoverCount: number;
  bodyFocusDistribution: Record<BodyFocus, number>;
  movementPatternDistribution: Record<MovementPattern, number>;

  // ===== FRESHNESS =====
  lastUsed: string | null;
  useCount: number;
}

// ============================================================================
// FLOW SCORING
// ============================================================================

export interface FlowScore {
  score: number;                      // 0-100
  rating: 'great' | 'good' | 'fair' | 'poor';
  totalTransitionCost: number;
  uniquePositions: number;
  warnings: string[];
}

// Transition cost matrix (position -> position -> cost)
export type TransitionCostMatrix = Record<ExercisePosition, Record<ExercisePosition, number>>;

// ============================================================================
// POSITION OVERRIDE
// Manual corrections to auto-detected positions
// ============================================================================

export interface PositionOverride {
  exerciseId: string;
  exerciseText: string;
  originalPosition: ExercisePosition;
  overridePosition: ExercisePosition;
  createdAt: string;
  createdBy?: string;
}

// ============================================================================
// USAGE TRACKING
// ============================================================================

export interface UsageRecord {
  entityId: string;
  entityType: 'exercise' | 'block' | 'round' | 'class';
  usedAt: string;                     // ISO date
  context?: string;                   // e.g., "class on 2025-01-17"
}

export interface FreshnessScore {
  score: number;                      // 0-100 (higher = fresher)
  color: 'green' | 'yellow' | 'red' | 'gray';
  label: string;                      // e.g., "Fresh", "Used 2 weeks ago"
  lastUsed: string | null;
  useCount: number;
  isOverused: boolean;                // >3 times in 4 weeks
}

// ============================================================================
// SEARCH & FILTER
// ============================================================================

export interface SearchConstraints {
  // Round-level
  duration?: { min?: number; max?: number };
  equipment?: WeightType[];
  finisherType?: FinisherType[];
  treadPattern?: TreadPattern[];
  hasIncline?: boolean;

  // Block-level
  bodyFocus?: BodyFocus[];
  structure?: StructureTag[];
  minFlowScore?: number;
  positions?: ExercisePosition[];

  // Movement-level
  movementPatterns?: MovementPattern[];
  hasGripBreaks?: boolean;
  maxGripLoad?: number;

  // Freshness
  excludeUsedWithinDays?: number;
  preferFresh?: boolean;

  // Text search
  textQuery?: string;
}

export interface SearchResult<T> {
  item: T;
  score: number;
  matchedFields: string[];
  freshnessScore: FreshnessScore;
}

// ============================================================================
// IMPORT/EXPORT
// ============================================================================

export interface ImportedClass {
  sourceSheet: string;
  date: string;
  round1: {
    equipment: string;
    forecast?: string;
    minutes: Array<{
      minute: string;
      tread: string;
      floor: string;
      notes?: string;
    }>;
  };
  round2: {
    equipment: string;
    forecast?: string;
    minutes: Array<{
      minute: string;
      tread: string;
      floor: string;
      notes?: string;
    }>;
  };
  parseErrors: string[];
  parseWarnings: string[];
}

// ============================================================================
// STORAGE KEYS
// ============================================================================

export const HIERARCHY_STORAGE_KEYS = {
  CLASSES: 'barrys_classes',
  ROUNDS: 'barrys_rounds',
  FLOOR_BLOCKS: 'barrys_floor_blocks',
  TREAD_BLOCKS: 'barrys_tread_blocks',
  EXERCISES: 'barrys_exercise_index',
  POSITION_OVERRIDES: 'barrys_position_overrides',
  USAGE_HISTORY: 'barrys_usage_history',
  EMBEDDINGS: 'barrys_embeddings',
  VERSION_HISTORY: 'barrys_version_history',
} as const;
