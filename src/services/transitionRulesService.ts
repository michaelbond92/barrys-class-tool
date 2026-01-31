// ============================================================================
// Transition Rules Service
// Learned rules from RLHF analysis - patterns that predict YES/NO
//
// IMPORTANT: "YES" means the transition COULD work (possible), not ideal
// These rules apply within blocks OR between blocks
//
// Updated: 2026-01-31 after 200 ratings analysis
// Accuracy: 78% on high-confidence predictions
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

// Supine core exercises that naturally flow INTO standing (you sit up and stand)
const SUPINE_CORE_TO_STANDING = [
  'jacknife', 'situp', 'crunch', 'toe_touch', 'dead_bug',
  'leg_lift', 'hip_raise', 'russian_twist', 'lat_pullover'
];

// Dead bug is special - it's an "active rest" position, doesn't flow well
const ACTIVE_REST_EXERCISES = ['dead_bug', 'bird_dog', 'cat_cow'];

// Exercises that work on the bench but flow to standing (upper body continuity)
const BENCH_UPPER_TO_STANDING_OK = [
  'chest_fly', 'chest_press', 'incline_press', 'pullover',
  'skull_crusher', 'skull_crusher_to_close_grip'
];

// Standing upper body exercises (can receive from bench upper)
const STANDING_UPPER = [
  'shoulder_press', 'bicep_curl', 'hammer_curl', 'tricep_extension',
  'curl_to_press', 'hammer_curl_to_press', 'clean_to_press'
];

// Power/finisher exercises - often end blocks, can receive from many positions
const POWER_FINISHERS = [
  'snatch', 'clean', 'db_swing', 'burpee', 'weighted_burpee',
  'devils_press', 'thruster', 'squat_to_hi_pull', 'clean_to_press'
];

// Warmup exercises - should be early, not mid-flow
const WARMUP_EXERCISES = ['wgs', 'gms', 'cat_cow', 'inchworm', 'hip_opener', 'good_morning_stretch'];

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
  squat_family: ['squat', 'goblet_squat', 'sumo_squat', 'front_squat', 'suitcase_squat', 'split_squat', 'bulgarian_split_squat'],
  lunge_family: ['lunge', 'reverse_lunge', 'curtsy_lunge', 'lateral_lunge'],
  press_family: ['chest_press', 'shoulder_press', 'incline_press', 'close_grip_press'],
  row_family: ['row', 'bent_over_row', 'upright_row', 'renegade_row', 'single_arm_row'],
  core_supine: ['situp', 'crunch', 'toe_touch', 'jacknife', 'russian_twist', 'leg_lift', 'hip_raise'],
  core_bench: ['skull_crusher', 'chest_fly', 'pullover', 'lat_pullover_to_crunch'],
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
  return SUPINE_CORE_TO_STANDING.some(e => exerciseId.includes(e));
}

function isActiveRestExercise(exerciseId: string): boolean {
  return ACTIVE_REST_EXERCISES.some(e => exerciseId.includes(e));
}

function isBenchUpperExercise(exerciseId: string): boolean {
  return BENCH_UPPER_TO_STANDING_OK.some(e => exerciseId.includes(e));
}

function isStandingUpperExercise(exerciseId: string): boolean {
  return STANDING_UPPER.some(e => exerciseId.includes(e));
}

function isPowerFinisher(exerciseId: string): boolean {
  return POWER_FINISHERS.some(e => exerciseId.includes(e));
}

function isWarmupExercise(exerciseId: string): boolean {
  return WARMUP_EXERCISES.some(e => exerciseId.includes(e));
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
  // RULE 1: Same position (laying/bench) = YES (100% in RLHF)
  // -------------------------------------------------------------------------
  if (from.position === to.position) {
    if (from.position === 'floor_laying' || from.position === 'bench_laying') {
      // Exception: Dead bug doesn't flow well from other exercises
      if (isActiveRestExercise(toId) && !isActiveRestExercise(fromId)) {
        prediction = 'no';
        confidence = 80;
        reasons.push(`${to.name} is an active rest exercise - doesn't flow from ${from.name}`);
        ruleApplied = 'active_rest_exception';
        return { prediction, confidence, reasons, ruleApplied };
      }

      prediction = 'yes';
      confidence = 95;
      reasons.push(`Same position (${from.position}) - 100% approval rate`);
      ruleApplied = 'same_position_laying';
      return { prediction, confidence, reasons, ruleApplied };
    }
    // floor_standing has only 40% approval, so less confident
    confidence = 70;
    reasons.push(`Same position (${from.position})`);
  }

  // -------------------------------------------------------------------------
  // RULE 2: Supine Core → Standing = YES (you sit up and stand)
  // This overrides the bench→standing rule
  // -------------------------------------------------------------------------
  if (isSupineCoreExercise(fromId) && to.position === 'floor_standing') {
    prediction = 'yes';
    confidence = 85;
    reasons.push('Supine core → standing flows naturally (sit up and stand)');
    ruleApplied = 'supine_to_standing';
    return { prediction, confidence, reasons, ruleApplied };
  }

  // -------------------------------------------------------------------------
  // RULE 3: Bench Upper Body → Standing Upper Body = YES (muscle continuity)
  // -------------------------------------------------------------------------
  if (isBenchUpperExercise(fromId) && isStandingUpperExercise(toId)) {
    prediction = 'yes';
    confidence = 85;
    reasons.push('Bench upper → standing upper (muscle group continuity)');
    ruleApplied = 'bench_upper_to_standing_upper';
    return { prediction, confidence, reasons, ruleApplied };
  }

  // -------------------------------------------------------------------------
  // RULE 4: Power finishers can receive from supine core (end of block flow)
  // -------------------------------------------------------------------------
  if (isSupineCoreExercise(fromId) && isPowerFinisher(toId)) {
    prediction = 'yes';
    confidence = 80;
    reasons.push('Supine core → power finisher (block transition)');
    ruleApplied = 'supine_to_finisher';
    return { prediction, confidence, reasons, ruleApplied };
  }

  // -------------------------------------------------------------------------
  // RULE 5: Standing → Bench = usually NO (awkward transition)
  // Exception: If going to bench for intentional position change
  // -------------------------------------------------------------------------
  const fromZone = getPositionZone(from.position);
  const toZone = getPositionZone(to.position);

  if (fromZone === 'standing_zone' && toZone === 'bench_zone') {
    prediction = 'no';
    confidence = 85;
    reasons.push('Standing → Bench transition is awkward within a block');
    ruleApplied = 'standing_to_bench';
  }

  // -------------------------------------------------------------------------
  // RULE 6: Floor plank → Standing = contextual
  // Plank family can transition to standing if it ends in a "up" position
  // -------------------------------------------------------------------------
  const fromFamily = getMovementFamily(fromId);
  const toFamily = getMovementFamily(toId);

  if (fromFamily === 'plank_family' && to.position === 'floor_standing') {
    // Plank exercises that end "up" (pushup, renegade row) can flow to standing
    if (fromId.includes('pushup') || fromId.includes('renegade') || fromId.includes('inchworm')) {
      prediction = 'yes';
      confidence = 80;
      reasons.push('Plank exercise ends upright, flows to standing');
      ruleApplied = 'plank_to_standing';
    } else {
      prediction = 'uncertain';
      confidence = 60;
      reasons.push('Plank → standing depends on the specific exercises');
    }
  }

  // -------------------------------------------------------------------------
  // RULE 7: Same movement family = likely YES
  // -------------------------------------------------------------------------
  if (fromFamily && toFamily && fromFamily === toFamily) {
    if (prediction !== 'no') {
      prediction = 'yes';
      confidence = Math.max(confidence, 80);
      reasons.push(`Same movement family (${fromFamily})`);
      ruleApplied = ruleApplied || 'same_family';
    }
  }

  // -------------------------------------------------------------------------
  // RULE 8: High grip → High grip = NO (fatigue)
  // -------------------------------------------------------------------------
  if (from.gripDemand === 'high' && to.gripDemand === 'high') {
    if (prediction !== 'yes' || confidence < 80) {
      prediction = 'no';
      confidence = Math.max(confidence, 75);
      reasons.push('Back-to-back high grip demand');
      ruleApplied = ruleApplied || 'grip_fatigue';
    }
  }

  // -------------------------------------------------------------------------
  // RULE 9: Warmup → Power = NO (wrong sequence within block)
  // -------------------------------------------------------------------------
  if (isWarmupExercise(fromId) && isPowerFinisher(toId)) {
    prediction = 'no';
    confidence = 90;
    reasons.push('Warmup → Power is wrong sequence');
    ruleApplied = 'warmup_to_power';
  }

  // -------------------------------------------------------------------------
  // RULE 10: Weight path compatibility (bonus points)
  // -------------------------------------------------------------------------
  if (from.weightPath && to.weightPath) {
    if (from.weightPath.end === to.weightPath.start) {
      if (prediction === 'uncertain') {
        prediction = 'yes';
        confidence = Math.max(confidence, 70);
        reasons.push(`Weight path flows (${from.weightPath.end} → ${to.weightPath.start})`);
        ruleApplied = ruleApplied || 'weight_path_flow';
      }
    }
  }

  // -------------------------------------------------------------------------
  // RULE 11: Universal receivers (squat, deadlift) accept many transitions
  // -------------------------------------------------------------------------
  const universalReceivers = ['squat', 'goblet_squat', 'deadlift', 'rdl'];
  if (universalReceivers.some(r => toId.includes(r))) {
    if (prediction === 'uncertain') {
      prediction = 'yes';
      confidence = Math.max(confidence, 65);
      reasons.push(`${to.name} is a universal receiver`);
      ruleApplied = ruleApplied || 'universal_receiver';
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
