// ============================================================================
// Shared Types for Barry's Class Tool
// ============================================================================

export type ExercisePosition =
  | 'floor_standing'
  | 'floor_laying'
  | 'bench_laying'
  | 'bench_sitting'
  | 'bench_front'
  | 'bench_back'
  | 'bench_straddling'
  | 'bench_standing';

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
  bench_laying: 'Bench - Laying',
  bench_sitting: 'Bench - Sitting',
  bench_front: 'Bench - Front',
  bench_back: 'Bench - Back',
  bench_straddling: 'Bench - Straddling',
  bench_standing: 'Bench - Standing On',
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
