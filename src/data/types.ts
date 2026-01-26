// ============================================================================
// Shared Types for Barry's Class Tool
// ============================================================================

// ============================================================================
// Body Position Types
// ============================================================================

export type ExercisePosition =
  | 'floor_standing'      // Standing on floor
  | 'floor_laying'        // Lying/plank on floor
  | 'floor_kneeling'      // Kneeling on floor
  | 'bench_laying'        // Lying on bench
  | 'bench_sitting'       // Sitting on bench
  | 'bench_kneeling'      // Kneeling on bench (banded kickbacks, etc.)
  | 'bench_front'         // Standing at front of bench, facing away
  | 'bench_back'          // Standing behind bench
  | 'bench_straddling'    // Straddling the bench
  | 'bench_standing'      // Standing on bench
  | 'bench_facing';       // Standing at bench, facing it (lateral movements)

// ============================================================================
// Weight Position & Path Types (for compound flow detection)
// ============================================================================

// Where the weight is during the movement
export type WeightPosition =
  | 'floor'           // On the ground (deadlift start)
  | 'sides'           // Hanging at sides (standing, arms down)
  | 'chest'           // At chest level (goblet position)
  | 'shoulders'       // At shoulders (rack position, clean catch)
  | 'overhead'        // Above head (press top)
  | 'extended'        // Arms extended forward (chest press top, fly)
  | 'behind_head'     // Behind head (skull crusher bottom, tricep ext)
  | 'none';           // No weight / bodyweight

// Weight path through a movement (enables compound detection)
// Example: Bicep Curl = { start: 'sides', mid: 'shoulders', end: 'sides' }
// Example: Shoulder Press = { start: 'shoulders', mid: 'overhead', end: 'shoulders' }
// Curl → Press works because curl.mid === press.start
export interface WeightPath {
  start: WeightPosition;
  mid: WeightPosition;      // Peak/transition point - key for compounds
  end: WeightPosition;
}

// Movement plane (affects what exercises can sequence together)
export type MovementPlane =
  | 'sagittal'        // Forward/backward (squats, lunges, presses)
  | 'frontal'         // Side-to-side (lateral raises, lateral lunges)
  | 'transverse';     // Rotational (Russian twist, woodchop)

// Equipment configuration
export interface EquipmentOption {
  type: 'heavy' | 'medium' | 'light' | 'band' | 'none';
  count: 1 | 2;
}

// ============================================================================
// Original Types
// ============================================================================

export type MovementPattern =
  | 'push'
  | 'pull'
  | 'hinge'
  | 'squat'
  | 'lunge'
  | 'rotation'
  | 'carry'
  | 'plank'
  | 'power';

export type MuscleGroup =
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'biceps'
  | 'triceps'
  | 'quads'
  | 'hamstrings'
  | 'glutes'
  | 'calves'
  | 'core'
  | 'obliques'
  | 'full_body'
  | 'hip_flexors';

export type RepClassification =
  | 'fixed'
  | 'amrap'
  | 'burnout'
  | 'tempo'
  | 'hold'
  | 'ladder'
  | 'timed';

export type Intensity = 'high' | 'medium' | 'low';

export type GripDemand = 'high' | 'medium' | 'low' | 'none';

export type BodyFocus =
  | 'upper'
  | 'lower'
  | 'core'
  | 'full_body'
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'arms';

export type WeightType = 'heavy' | 'medium' | 'light';

export type BenchSetup = 'flat' | 'incline' | 'mega';

export type FinisherType =
  | 'snatches'
  | 'burpees'
  | 'weighted_burpees'
  | 'squat_to_hi_pull'
  | 'deadlift_clean_squat'
  | 'db_swings'
  | 'amrap'
  | 'choice';

export type TreadPattern =
  | 'progressive_build'
  | 'slingshot'
  | 'intervals'
  | 'incline_heavy'
  | 'recovery_heavy'
  | 'sprint_focused'
  | 'balanced';

// ============================================================================
// Position Labels (for UI display)
// ============================================================================

export const POSITION_LABELS: Record<ExercisePosition, string> = {
  floor_standing: 'Floor - Standing',
  floor_laying: 'Floor - Laying/Plank',
  floor_kneeling: 'Floor - Kneeling',
  bench_laying: 'Bench - Laying',
  bench_sitting: 'Bench - Sitting',
  bench_kneeling: 'Bench - Kneeling',
  bench_front: 'Bench - Front',
  bench_back: 'Bench - Back',
  bench_straddling: 'Bench - Straddling',
  bench_standing: 'Bench - Standing On',
  bench_facing: 'Bench - Facing (Lateral)',
};

export const WEIGHT_POSITION_LABELS: Record<WeightPosition, string> = {
  floor: 'Floor',
  sides: 'At Sides',
  chest: 'At Chest',
  shoulders: 'At Shoulders',
  overhead: 'Overhead',
  extended: 'Arms Extended',
  behind_head: 'Behind Head',
  none: 'No Weight',
};

export const MOVEMENT_PLANE_LABELS: Record<MovementPlane, string> = {
  sagittal: 'Sagittal (Forward/Back)',
  frontal: 'Frontal (Side-to-Side)',
  transverse: 'Transverse (Rotation)',
};

export const MOVEMENT_LABELS: Record<MovementPattern, string> = {
  push: 'Push',
  pull: 'Pull',
  hinge: 'Hinge',
  squat: 'Squat',
  lunge: 'Lunge',
  rotation: 'Rotation',
  carry: 'Carry',
  plank: 'Plank/Core',
  power: 'Power/Explosive',
};

export const MUSCLE_LABELS: Record<MuscleGroup, string> = {
  chest: 'Chest',
  back: 'Back',
  shoulders: 'Shoulders',
  biceps: 'Biceps',
  triceps: 'Triceps',
  quads: 'Quads',
  hamstrings: 'Hamstrings',
  glutes: 'Glutes',
  calves: 'Calves',
  core: 'Core',
  obliques: 'Obliques',
  full_body: 'Full Body',
  hip_flexors: 'Hip Flexors',
};
