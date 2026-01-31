// ============================================================================
// Transition Rules Service
// Learned rules from RLHF analysis - patterns that predict YES/NO
//
// IMPORTANT: "YES" means the transition COULD work (possible), not ideal
// These rules apply within blocks OR between blocks
//
// Updated: 2026-01-31 after 500 ratings analysis
// Accuracy: 67% overall (400 with predictions: 270 correct)
// ============================================================================

import { ExerciseDefinition } from '../data/exerciseReference';

// ============================================================================
// Types
// ============================================================================

export interface TransitionPrediction {
  prediction: 'yes' | 'no' | 'uncertain';
  confidence: number;  // 0-100
  reasons: string[];
  ruleApplied: string | null;
}

// ============================================================================
// Exercise Categories for Special Handling
// ============================================================================

// Supine core exercises - flow both ways with standing
const SUPINE_CORE_EXERCISES = [
  'jacknife', 'situp', 'crunch', 'toe_touch',
  'leg_lift', 'hip_raise', 'russian_twist'
];

// Dead bug is special - it's an "active rest" position
// BUT can receive from standing curls (Hammer Curl → Dead Bug = YES)
const ACTIVE_REST_EXERCISES = ['dead_bug', 'bird_dog', 'cat_cow'];

// Hip thrust/glute bridge - CAN flow to supine core (same floor zone)
const HIP_THRUST_EXERCISES = ['glute_bridge', 'hip_thrust'];

// Split squat - contextual destination (90% NO, but can follow lunges/squats/deadlifts)
const SPLIT_SQUAT_DESTINATIONS = ['split_squat', 'bulgarian_split_squat'];

// Pullover exercises don't flow well to other bench exercises
const PULLOVER_EXERCISES = ['pullover', 'lat_pullover', 'lat_pullover_to_crunch'];

// Complex compound movements - supine core doesn't flow to these
const COMPLEX_COMPOUNDS = [
  'sdl_to_reverse_lunge', 'lunge_to_curl', 'squat_to_reverse_lunge'
];

// Simple standing movements - supine core CAN flow to these
const SIMPLE_STANDING = [
  'squat', 'goblet_squat', 'sumo_squat', 'deadlift', 'rdl',
  'shoulder_press', 'curl_to_press', 'hammer_curl_to_press'
];

// Standing curls that can flow to bench exercises
const STANDING_CURLS = [
  'bicep_curl', 'hammer_curl', 'hammer_curl_to_press', 'curl_to_press'
];

// Bench exercises that receive from standing curls
const BENCH_FROM_CURLS = [
  'skull_crusher', 'skull_crusher_to_close_grip', 'chest_fly', 'chest_press'
];

// Power/finisher exercises
const POWER_FINISHERS = [
  'snatch', 'clean', 'db_swing', 'burpee', 'weighted_burpee',
  'devils_press', 'thruster', 'squat_to_hi_pull', 'clean_to_press'
];

// Warmup exercises - never follow weighted exercises
const WARMUP_EXERCISES = ['wgs', 'gms', 'cat_cow', 'inchworm', 'hip_opener', 'good_morning_stretch', 'gm_to_squat'];

// Plank family - floor laying but prone (face down)
const PLANK_FAMILY = ['plank', 'mountain_climber', 'commando', 'pushup', 'renegade_row', 'plank_drag', 'bear_crawl', 'inchworm'];

// Exercises that can precede split squat (from user notes)
const SPLIT_SQUAT_SOURCES = ['lunge', 'reverse_lunge', 'curtsy_lunge', 'squat', 'goblet_squat', 'deadlift', 'sdl', 'rdl', 'clean', 'single_arm_row'];

// Medium weight exercises (shouldn't flow to heavy)
const MEDIUM_WEIGHT_EXERCISES = ['chest_fly', 'lateral_raise', 'reverse_fly'];

// Heavy weight exercises
const HEAVY_WEIGHT_EXERCISES = ['incline_press', 'chest_press', 'deadlift', 'squat'];

// Bench exercises that don't flow well to standing
const BENCH_NO_STANDING = ['skull_crusher', 'skull_crusher_to_close_grip', 'pullover', 'lat_pullover'];

// Universal receivers - accept transitions from many sources
const UNIVERSAL_RECEIVERS = ['squat', 'goblet_squat', 'deadlift', 'single_arm_row', 'row'];

// Position zone groupings
const POSITION_ZONES = {
  floor_zone: ['floor_laying', 'floor_kneeling'],
  standing_zone: ['floor_standing'],
  bench_zone: ['bench_laying', 'bench_sitting', 'bench_kneeling'],
};

// Movement pattern families
const MOVEMENT_FAMILIES = {
  plank_family: ['plank', 'mountain_climber', 'commando', 'pushup', 'renegade_row', 'plank_drag', 'bear_crawl', 'inchworm'],
  hinge_family: ['deadlift', 'rdl', 'sdl', 'good_morning', 'clean', 'snatch', 'db_swing'],
  squat_family: ['squat', 'goblet_squat', 'sumo_squat', 'front_squat', 'suitcase_squat'],
  lunge_family: ['lunge', 'reverse_lunge', 'curtsy_lunge', 'lateral_lunge'],
  press_family: ['chest_press', 'shoulder_press', 'incline_press', 'close_grip_press'],
  row_family: ['row', 'bent_over_row', 'upright_row', 'single_arm_row'],
  core_supine: ['situp', 'crunch', 'toe_touch', 'jacknife', 'russian_twist', 'leg_lift', 'hip_raise'],
};

// ============================================================================
// Helper Functions
// ============================================================================

function getPositionZone(position: string): string | null {
  for (const [zone, positions] of Object.entries(POSITION_ZONES)) {
    if (positions.includes(position)) return zone;
  }
  return null;
}

function getMovementFamily(exerciseId: string): string | null {
  const normalized = exerciseId.toLowerCase().replace(/[^a-z_]/g, '');
  for (const [family, exercises] of Object.entries(MOVEMENT_FAMILIES)) {
    if (exercises.some(e => normalized.includes(e.replace(/_/g, '')))) {
      return family;
    }
  }
  return null;
}

function isSupineCoreExercise(exerciseId: string): boolean {
  return SUPINE_CORE_EXERCISES.some(e => exerciseId.includes(e));
}

function isActiveRestExercise(exerciseId: string): boolean {
  return ACTIVE_REST_EXERCISES.some(e => exerciseId.includes(e));
}

function isHipThrustExercise(exerciseId: string): boolean {
  return HIP_THRUST_EXERCISES.some(e => exerciseId.includes(e));
}

function isSplitSquatDestination(exerciseId: string): boolean {
  return SPLIT_SQUAT_DESTINATIONS.some(e => exerciseId.includes(e));
}

function canPrecedeSplitSquat(exerciseId: string): boolean {
  return SPLIT_SQUAT_SOURCES.some(e => exerciseId.includes(e));
}

function isMediumWeight(exerciseId: string): boolean {
  return MEDIUM_WEIGHT_EXERCISES.some(e => exerciseId.includes(e));
}

function isHeavyWeight(exerciseId: string): boolean {
  return HEAVY_WEIGHT_EXERCISES.some(e => exerciseId.includes(e));
}

function isBenchNoStanding(exerciseId: string): boolean {
  return BENCH_NO_STANDING.some(e => exerciseId.includes(e));
}

function isPulloverExercise(exerciseId: string): boolean {
  return PULLOVER_EXERCISES.some(e => exerciseId.includes(e));
}

function isComplexCompound(exerciseId: string): boolean {
  return COMPLEX_COMPOUNDS.some(e => exerciseId.includes(e));
}

function isSimpleStanding(exerciseId: string): boolean {
  return SIMPLE_STANDING.some(e => exerciseId.includes(e));
}

function isStandingCurl(exerciseId: string): boolean {
  return STANDING_CURLS.some(e => exerciseId.includes(e));
}

function isBenchFromCurls(exerciseId: string): boolean {
  return BENCH_FROM_CURLS.some(e => exerciseId.includes(e));
}

function isPowerFinisher(exerciseId: string): boolean {
  return POWER_FINISHERS.some(e => exerciseId.includes(e));
}

function isWarmupExercise(exerciseId: string): boolean {
  return WARMUP_EXERCISES.some(e => exerciseId.includes(e));
}

function isPlankFamily(exerciseId: string): boolean {
  return PLANK_FAMILY.some(e => exerciseId.includes(e));
}

function isUniversalReceiver(exerciseId: string): boolean {
  return UNIVERSAL_RECEIVERS.some(e => exerciseId.includes(e));
}

// ============================================================================
// Core Prediction Function
// ============================================================================

export function predictTransition(
  from: ExerciseDefinition,
  to: ExerciseDefinition
): TransitionPrediction {
  const reasons: string[] = [];
  let prediction: 'yes' | 'no' | 'uncertain' = 'uncertain';
  let confidence = 50;
  let ruleApplied: string | null = null;

  const fromId = from.id.toLowerCase();
  const toId = to.id.toLowerCase();

  // -------------------------------------------------------------------------
  // RULE 1: Split Squat destination - contextual (90% NO, but some work)
  // Can follow: lunges, squats, deadlifts, single arm row, clean
  // -------------------------------------------------------------------------
  if (isSplitSquatDestination(toId)) {
    if (canPrecedeSplitSquat(fromId)) {
      prediction = 'yes';
      confidence = 75;
      reasons.push('Split squat can follow lunges/squats/deadlifts');
      ruleApplied = 'split_squat_valid_source';
      return { prediction, confidence, reasons, ruleApplied };
    } else {
      prediction = 'no';
      confidence = 90;
      reasons.push('Split squat rarely follows this exercise (90% NO rate)');
      ruleApplied = 'split_squat_invalid_source';
      return { prediction, confidence, reasons, ruleApplied };
    }
  }

  // -------------------------------------------------------------------------
  // RULE 2: Weighted → Warmup = NO
  // Never go from weighted exercise into warmup
  // -------------------------------------------------------------------------
  if (isWarmupExercise(toId) && !isWarmupExercise(fromId)) {
    prediction = 'no';
    confidence = 90;
    reasons.push('Never go from weighted exercise into warmup');
    ruleApplied = 'weighted_to_warmup';
    return { prediction, confidence, reasons, ruleApplied };
  }

  // -------------------------------------------------------------------------
  // RULE 3: Medium → Heavy weight = NO
  // Chest Fly → Incline Press doesn't work (weight mismatch)
  // -------------------------------------------------------------------------
  if (isMediumWeight(fromId) && isHeavyWeight(toId)) {
    prediction = 'no';
    confidence = 85;
    reasons.push('Medium weight → heavy weight is awkward transition');
    ruleApplied = 'weight_mismatch';
    return { prediction, confidence, reasons, ruleApplied };
  }

  // -------------------------------------------------------------------------
  // RULE 4: Bench exercises → Universal receivers = contextual
  // Skull crusher → squat/row usually NO (need to get up from bench)
  // -------------------------------------------------------------------------
  if (isBenchNoStanding(fromId) && isUniversalReceiver(toId)) {
    prediction = 'no';
    confidence = 80;
    reasons.push('Bench exercises don\'t flow well to standing receivers');
    ruleApplied = 'bench_to_standing';
    return { prediction, confidence, reasons, ruleApplied };
  }

  // -------------------------------------------------------------------------
  // RULE 3: Standing Curls → Bench = YES
  // Bicep Curl → Skull Crusher, Hammer Curl → Chest Fly works
  // -------------------------------------------------------------------------
  if (isStandingCurl(fromId) && isBenchFromCurls(toId)) {
    prediction = 'yes';
    confidence = 85;
    reasons.push('Standing curls → bench exercises works');
    ruleApplied = 'curls_to_bench';
    return { prediction, confidence, reasons, ruleApplied };
  }

  // -------------------------------------------------------------------------
  // RULE 4: Standing Curls → Supine Core = YES
  // Hammer Curl → Russian Twist, Bicep Curl → Situp works
  // -------------------------------------------------------------------------
  if (isStandingCurl(fromId) && isSupineCoreExercise(toId)) {
    prediction = 'yes';
    confidence = 80;
    reasons.push('Standing curls → supine core works');
    ruleApplied = 'curls_to_supine';
    return { prediction, confidence, reasons, ruleApplied };
  }

  // -------------------------------------------------------------------------
  // RULE 5: Standing → Supine Core = YES (lie down to do core)
  // Squat to Press → Jacknife, any standing → core works
  // -------------------------------------------------------------------------
  if (from.position === 'floor_standing' && isSupineCoreExercise(toId)) {
    prediction = 'yes';
    confidence = 80;
    reasons.push('Standing → supine core (lie down for core)');
    ruleApplied = 'standing_to_supine';
    return { prediction, confidence, reasons, ruleApplied };
  }

  // -------------------------------------------------------------------------
  // RULE 6: Hip Thrust → Supine Core = YES (same floor zone)
  // Hip Thrust → Jacknife, Hip Thrust → Russian Twist works
  // -------------------------------------------------------------------------
  if (isHipThrustExercise(fromId) && isSupineCoreExercise(toId)) {
    prediction = 'yes';
    confidence = 85;
    reasons.push('Hip thrust → supine core (same floor zone)');
    ruleApplied = 'hip_thrust_to_supine';
    return { prediction, confidence, reasons, ruleApplied };
  }

  // -------------------------------------------------------------------------
  // RULE 7: Supine Core → Supine Core = YES
  // Lat Pullover to Crunch → Sit Up works
  // -------------------------------------------------------------------------
  if (isSupineCoreExercise(fromId) && isSupineCoreExercise(toId)) {
    prediction = 'yes';
    confidence = 90;
    reasons.push('Supine core → supine core (same position)');
    ruleApplied = 'supine_to_supine';
    return { prediction, confidence, reasons, ruleApplied };
  }

  // -------------------------------------------------------------------------
  // RULE 8: Pullover exercises → other bench = NO
  // -------------------------------------------------------------------------
  if (isPulloverExercise(fromId) && from.position === 'bench_laying' && to.position === 'bench_laying') {
    prediction = 'no';
    confidence = 90;
    reasons.push('Pullover → other bench exercises doesn\'t flow');
    ruleApplied = 'pullover_to_bench';
    return { prediction, confidence, reasons, ruleApplied };
  }

  // -------------------------------------------------------------------------
  // RULE 9: Plank family → supine/glute = contextual
  // Renegade Row to Pushup → Glute Bridge = YES (end of plank work)
  // -------------------------------------------------------------------------
  if (isPlankFamily(fromId) && isHipThrustExercise(toId)) {
    // Renegade row variants can flow to glute bridge
    if (fromId.includes('renegade')) {
      prediction = 'yes';
      confidence = 75;
      reasons.push('Renegade row → glute bridge (transition to floor)');
      ruleApplied = 'renegade_to_glute';
      return { prediction, confidence, reasons, ruleApplied };
    }
  }

  // -------------------------------------------------------------------------
  // RULE 10: Supine Core → Complex Compounds = NO
  // -------------------------------------------------------------------------
  if (isSupineCoreExercise(fromId) && isComplexCompound(toId)) {
    prediction = 'no';
    confidence = 85;
    reasons.push('Supine core → complex compound is too much');
    ruleApplied = 'supine_to_complex';
    return { prediction, confidence, reasons, ruleApplied };
  }

  // -------------------------------------------------------------------------
  // RULE 11: Supine Core → Simple Standing = YES
  // -------------------------------------------------------------------------
  if (isSupineCoreExercise(fromId) && isSimpleStanding(toId)) {
    prediction = 'yes';
    confidence = 80;
    reasons.push('Supine core → simple standing flows (sit up and stand)');
    ruleApplied = 'supine_to_simple_standing';
    return { prediction, confidence, reasons, ruleApplied };
  }

  // -------------------------------------------------------------------------
  // RULE 12: Same bench_laying position (excluding pullover)
  // -------------------------------------------------------------------------
  if (from.position === 'bench_laying' && to.position === 'bench_laying') {
    if (!isPulloverExercise(fromId) && !isPulloverExercise(toId)) {
      prediction = 'yes';
      confidence = 85;
      reasons.push('Same bench position (non-pullover)');
      ruleApplied = 'bench_same_position';
      return { prediction, confidence, reasons, ruleApplied };
    }
  }

  // -------------------------------------------------------------------------
  // RULE 13: Power → Supine Core = YES (power finisher → rest on floor)
  // Clean to Press → Sit Up works
  // -------------------------------------------------------------------------
  if (isPowerFinisher(fromId) && isSupineCoreExercise(toId)) {
    prediction = 'yes';
    confidence = 80;
    reasons.push('Power finisher → supine core (rest after power)');
    ruleApplied = 'power_to_supine';
    return { prediction, confidence, reasons, ruleApplied };
  }

  // -------------------------------------------------------------------------
  // RULE 14: High grip → High grip = NO (fatigue)
  // -------------------------------------------------------------------------
  if (from.gripDemand === 'high' && to.gripDemand === 'high') {
    prediction = 'no';
    confidence = 75;
    reasons.push('Back-to-back high grip demand');
    ruleApplied = 'grip_fatigue';
    return { prediction, confidence, reasons, ruleApplied };
  }

  // -------------------------------------------------------------------------
  // RULE 15: Warmup → Power = NO (wrong sequence)
  // -------------------------------------------------------------------------
  if (isWarmupExercise(fromId) && isPowerFinisher(toId)) {
    prediction = 'no';
    confidence = 90;
    reasons.push('Warmup → Power is wrong sequence');
    ruleApplied = 'warmup_to_power';
    return { prediction, confidence, reasons, ruleApplied };
  }

  // -------------------------------------------------------------------------
  // RULE 16: Same movement family = contextual
  // -------------------------------------------------------------------------
  const fromFamily = getMovementFamily(fromId);
  const toFamily = getMovementFamily(toId);

  if (fromFamily && toFamily && fromFamily === toFamily) {
    if (fromFamily === 'squat_family') {
      prediction = 'uncertain';
      confidence = 60;
      reasons.push('Same squat family but may have issues');
    } else {
      prediction = 'yes';
      confidence = 75;
      reasons.push(`Same movement family (${fromFamily})`);
      ruleApplied = 'same_family';
    }
  }

  // -------------------------------------------------------------------------
  // RULE 17: Weight path compatibility (weak signal)
  // -------------------------------------------------------------------------
  if (from.weightPath && to.weightPath && prediction === 'uncertain') {
    if (from.weightPath.end === to.weightPath.start) {
      confidence = Math.max(confidence, 60);
      reasons.push(`Weight path flows (${from.weightPath.end} → ${to.weightPath.start})`);
    }
  }

  // If still uncertain, provide default reasoning
  if (prediction === 'uncertain') {
    if (reasons.length === 0) {
      reasons.push('No strong rules apply - needs human judgment');
    }
  }

  return { prediction, confidence, reasons, ruleApplied };
}

// ============================================================================
// Batch Functions
// ============================================================================

export function filterUncertainPairs(
  pairs: Array<{ from: ExerciseDefinition; to: ExerciseDefinition }>
): {
  needsReview: Array<{ from: ExerciseDefinition; to: ExerciseDefinition; prediction: TransitionPrediction }>;
  autoYes: Array<{ from: ExerciseDefinition; to: ExerciseDefinition; prediction: TransitionPrediction }>;
  autoNo: Array<{ from: ExerciseDefinition; to: ExerciseDefinition; prediction: TransitionPrediction }>;
} {
  const needsReview: Array<{ from: ExerciseDefinition; to: ExerciseDefinition; prediction: TransitionPrediction }> = [];
  const autoYes: Array<{ from: ExerciseDefinition; to: ExerciseDefinition; prediction: TransitionPrediction }> = [];
  const autoNo: Array<{ from: ExerciseDefinition; to: ExerciseDefinition; prediction: TransitionPrediction }> = [];

  for (const pair of pairs) {
    const prediction = predictTransition(pair.from, pair.to);

    if (prediction.prediction === 'yes' && prediction.confidence >= 85) {
      autoYes.push({ ...pair, prediction });
    } else if (prediction.prediction === 'no' && prediction.confidence >= 85) {
      autoNo.push({ ...pair, prediction });
    } else {
      needsReview.push({ ...pair, prediction });
    }
  }

  return { needsReview, autoYes, autoNo };
}

export default {
  predictTransition,
  filterUncertainPairs
};
