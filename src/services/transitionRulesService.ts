// ============================================================================
// Transition Rules Service
// Learned rules from RLHF analysis - patterns that predict YES/NO
//
// IMPORTANT: "YES" means the transition COULD work (possible), not ideal
// These rules apply within blocks OR between blocks
//
// Updated: 2026-01-31 after 300 ratings analysis
// Accuracy: 63% overall, 82% on NO predictions
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

// Supine core exercises - BUT they don't always flow to standing
// They work with SIMPLE standing moves, not complex ones
const SUPINE_CORE_EXERCISES = [
  'jacknife', 'situp', 'crunch', 'toe_touch',
  'leg_lift', 'hip_raise', 'russian_twist', 'lat_pullover'
];

// Dead bug is special - it's an "active rest" position, doesn't flow well
const ACTIVE_REST_EXERCISES = ['dead_bug', 'bird_dog', 'cat_cow'];

// Glute bridge is also special - mostly doesn't flow (5/6 NO in RLHF)
const GLUTE_BRIDGE_EXERCISES = ['glute_bridge', 'hip_thrust'];

// Split squat is a "problem destination" - 100% NO rate in RLHF (10/10)
const PROBLEM_DESTINATIONS = ['split_squat'];

// Pullover exercises don't flow well to other bench exercises (bench→bench fails)
const PULLOVER_EXERCISES = ['pullover', 'lat_pullover', 'lat_pullover_to_crunch'];

// Complex compound movements - supine core doesn't flow to these
const COMPLEX_COMPOUNDS = [
  'sdl_to_reverse_lunge', 'clean_to_press', 'squat_to_hi_pull',
  'lunge_to_curl', 'squat_to_reverse_lunge', 'deadlift_to_row'
];

// Simple standing movements - supine core CAN flow to these
const SIMPLE_STANDING = [
  'squat', 'goblet_squat', 'sumo_squat', 'deadlift', 'rdl',
  'shoulder_press', 'curl_to_press', 'hammer_curl_to_press'
];

// Power/finisher exercises - context dependent
const POWER_FINISHERS = [
  'snatch', 'clean', 'db_swing', 'burpee', 'weighted_burpee',
  'devils_press', 'thruster', 'squat_to_hi_pull', 'clean_to_press'
];

// Warmup exercises - should be early, not mid-flow
const WARMUP_EXERCISES = ['wgs', 'gms', 'cat_cow', 'inchworm', 'hip_opener', 'good_morning_stretch'];

// Plank family - floor laying but prone (face down)
const PLANK_FAMILY = ['plank', 'mountain_climber', 'commando', 'pushup', 'renegade_row', 'plank_drag', 'bear_crawl', 'inchworm'];

// Position zone groupings
const POSITION_ZONES = {
  floor_zone: ['floor_laying', 'floor_kneeling'],
  standing_zone: ['floor_standing'],
  bench_zone: ['bench_laying', 'bench_sitting', 'bench_kneeling'],
};

// Movement pattern families that flow together
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

function isGluteBridgeExercise(exerciseId: string): boolean {
  return GLUTE_BRIDGE_EXERCISES.some(e => exerciseId.includes(e));
}

function isProblemDestination(exerciseId: string): boolean {
  return PROBLEM_DESTINATIONS.some(e => exerciseId.includes(e));
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

function isPowerFinisher(exerciseId: string): boolean {
  return POWER_FINISHERS.some(e => exerciseId.includes(e));
}

function isWarmupExercise(exerciseId: string): boolean {
  return WARMUP_EXERCISES.some(e => exerciseId.includes(e));
}

function isPlankFamily(exerciseId: string): boolean {
  return PLANK_FAMILY.some(e => exerciseId.includes(e));
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
  // RULE 1: Split Squat as destination = ALWAYS NO (100% in RLHF - 10/10)
  // -------------------------------------------------------------------------
  if (isProblemDestination(toId)) {
    prediction = 'no';
    confidence = 95;
    reasons.push('Split squat as destination has 100% NO rate');
    ruleApplied = 'split_squat_destination';
    return { prediction, confidence, reasons, ruleApplied };
  }

  // -------------------------------------------------------------------------
  // RULE 2: Glute Bridge transitions are mostly NO (5/6 in RLHF)
  // -------------------------------------------------------------------------
  if (isGluteBridgeExercise(fromId)) {
    prediction = 'no';
    confidence = 85;
    reasons.push('Glute bridge transitions rarely work (83% NO rate)');
    ruleApplied = 'glute_bridge_source';
    return { prediction, confidence, reasons, ruleApplied };
  }

  // -------------------------------------------------------------------------
  // RULE 3: Active rest exercises don't flow well
  // -------------------------------------------------------------------------
  if (isActiveRestExercise(toId) && !isActiveRestExercise(fromId)) {
    prediction = 'no';
    confidence = 85;
    reasons.push(`${to.name} is active rest - doesn't flow from other exercises`);
    ruleApplied = 'active_rest_destination';
    return { prediction, confidence, reasons, ruleApplied };
  }

  // -------------------------------------------------------------------------
  // RULE 4: Pullover → other bench exercises = NO
  // Pullover → Skull Crusher, Incline Press, etc. all failed in RLHF
  // -------------------------------------------------------------------------
  if (isPulloverExercise(fromId) && from.position === 'bench_laying' && to.position === 'bench_laying') {
    prediction = 'no';
    confidence = 90;
    reasons.push('Pullover → other bench exercises doesn\'t flow');
    ruleApplied = 'pullover_to_bench';
    return { prediction, confidence, reasons, ruleApplied };
  }

  // -------------------------------------------------------------------------
  // RULE 5: Plank family → supine (glute bridge, etc.) = NO
  // Flipping over mid-block is awkward
  // -------------------------------------------------------------------------
  if (isPlankFamily(fromId) && (isGluteBridgeExercise(toId) || isActiveRestExercise(toId))) {
    prediction = 'no';
    confidence = 90;
    reasons.push('Plank → supine (flip over) is awkward');
    ruleApplied = 'plank_to_supine';
    return { prediction, confidence, reasons, ruleApplied };
  }

  // -------------------------------------------------------------------------
  // RULE 6: Supine Core → Complex Compounds = NO
  // Sit up → SDL to Reverse Lunge, Clean to Press, etc.
  // -------------------------------------------------------------------------
  if (isSupineCoreExercise(fromId) && isComplexCompound(toId)) {
    prediction = 'no';
    confidence = 85;
    reasons.push('Supine core → complex compound is too much');
    ruleApplied = 'supine_to_complex';
    return { prediction, confidence, reasons, ruleApplied };
  }

  // -------------------------------------------------------------------------
  // RULE 7: Supine Core → Simple Standing = YES
  // Sit up → Squat, Deadlift, Shoulder Press works
  // -------------------------------------------------------------------------
  if (isSupineCoreExercise(fromId) && isSimpleStanding(toId)) {
    prediction = 'yes';
    confidence = 80;
    reasons.push('Supine core → simple standing flows (sit up and stand)');
    ruleApplied = 'supine_to_simple_standing';
    return { prediction, confidence, reasons, ruleApplied };
  }

  // -------------------------------------------------------------------------
  // RULE 8: Same bench_laying position (excluding pullover)
  // Chest Fly → Skull Crusher works, but not pullover transitions
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
  // RULE 9: Standing → Bench = usually NO (awkward transition)
  // -------------------------------------------------------------------------
  const fromZone = getPositionZone(from.position);
  const toZone = getPositionZone(to.position);

  if (fromZone === 'standing_zone' && toZone === 'bench_zone') {
    prediction = 'no';
    confidence = 85;
    reasons.push('Standing → Bench transition is awkward within a block');
    ruleApplied = 'standing_to_bench';
    return { prediction, confidence, reasons, ruleApplied };
  }

  // -------------------------------------------------------------------------
  // RULE 10: High grip → High grip = NO (fatigue)
  // -------------------------------------------------------------------------
  if (from.gripDemand === 'high' && to.gripDemand === 'high') {
    prediction = 'no';
    confidence = 75;
    reasons.push('Back-to-back high grip demand');
    ruleApplied = 'grip_fatigue';
    return { prediction, confidence, reasons, ruleApplied };
  }

  // -------------------------------------------------------------------------
  // RULE 11: Warmup → Power = NO (wrong sequence within block)
  // -------------------------------------------------------------------------
  if (isWarmupExercise(fromId) && isPowerFinisher(toId)) {
    prediction = 'no';
    confidence = 90;
    reasons.push('Warmup → Power is wrong sequence');
    ruleApplied = 'warmup_to_power';
    return { prediction, confidence, reasons, ruleApplied };
  }

  // -------------------------------------------------------------------------
  // RULE 12: Same movement family = contextual
  // Works for some families but not others (squat family excluding split_squat)
  // -------------------------------------------------------------------------
  const fromFamily = getMovementFamily(fromId);
  const toFamily = getMovementFamily(toId);

  if (fromFamily && toFamily && fromFamily === toFamily) {
    // Squat family has issues (Bulgarian → Split = NO)
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
  // RULE 13: Weight path compatibility (weak signal now)
  // -------------------------------------------------------------------------
  if (from.weightPath && to.weightPath && prediction === 'uncertain') {
    if (from.weightPath.end === to.weightPath.start) {
      confidence = Math.max(confidence, 60);
      reasons.push(`Weight path flows (${from.weightPath.end} → ${to.weightPath.start})`);
    }
  }

  // -------------------------------------------------------------------------
  // RULE 14: Universal receivers - ONLY simple squat/deadlift
  // -------------------------------------------------------------------------
  const universalReceivers = ['squat', 'goblet_squat', 'deadlift'];
  if (universalReceivers.some(r => toId === r || toId.startsWith(r + '_'))) {
    if (prediction === 'uncertain') {
      prediction = 'yes';
      confidence = 65;
      reasons.push(`${to.name} is a universal receiver`);
      ruleApplied = 'universal_receiver';
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
