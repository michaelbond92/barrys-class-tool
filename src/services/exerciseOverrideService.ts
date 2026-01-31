// ============================================================================
// Exercise Override Service
// Stores user modifications to exercise definitions in localStorage
// ============================================================================

import { ExerciseDefinition, ALL_EXERCISES } from '../data/exerciseReference';
import { WeightPath, MovementPlane, EquipmentOption } from '../data/types';

const STORAGE_KEY = 'barrys_exercise_overrides';

// Partial exercise definition for storing just the modified fields
export type ExerciseOverride = Partial<Omit<ExerciseDefinition, 'id'>> & { id: string };

// ============================================================================
// Storage Functions
// ============================================================================

export function loadOverrides(): Map<string, ExerciseOverride> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return new Map();

    const arr = JSON.parse(stored) as ExerciseOverride[];
    return new Map(arr.map(o => [o.id, o]));
  } catch (e) {
    console.error('Failed to load exercise overrides:', e);
    return new Map();
  }
}

export function saveOverrides(overrides: Map<string, ExerciseOverride>): void {
  try {
    const arr = Array.from(overrides.values());
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
  } catch (e) {
    console.error('Failed to save exercise overrides:', e);
  }
}

export function saveOverride(override: ExerciseOverride): void {
  const overrides = loadOverrides();
  overrides.set(override.id, override);
  saveOverrides(overrides);
}

export function deleteOverride(exerciseId: string): void {
  const overrides = loadOverrides();
  overrides.delete(exerciseId);
  saveOverrides(overrides);
}

// ============================================================================
// Merged Exercise Functions
// ============================================================================

/**
 * Get an exercise with any user overrides applied
 */
export function getExerciseWithOverrides(exerciseId: string): ExerciseDefinition | undefined {
  const base = ALL_EXERCISES.find(e => e.id === exerciseId);
  if (!base) return undefined;

  const overrides = loadOverrides();
  const override = overrides.get(exerciseId);

  if (!override) return base;

  // Merge base with override (override wins)
  return { ...base, ...override };
}

/**
 * Get all exercises with overrides applied
 */
export function getAllExercisesWithOverrides(): ExerciseDefinition[] {
  const overrides = loadOverrides();

  return ALL_EXERCISES.map(base => {
    const override = overrides.get(base.id);
    if (!override) return base;
    return { ...base, ...override };
  });
}

/**
 * Check if an exercise has user overrides
 */
export function hasOverride(exerciseId: string): boolean {
  const overrides = loadOverrides();
  return overrides.has(exerciseId);
}

/**
 * Get the override for an exercise (if any)
 */
export function getOverride(exerciseId: string): ExerciseOverride | undefined {
  const overrides = loadOverrides();
  return overrides.get(exerciseId);
}

/**
 * Get count of exercises with overrides
 */
export function getOverrideCount(): number {
  return loadOverrides().size;
}

// ============================================================================
// Metadata Accessors
// Read from base exercise definition (override > base > undefined)
// Note: Metadata is now baked into exerciseReference.ts directly.
// These helpers remain for convenience and override support.
// ============================================================================

/**
 * Get the effective weight path for an exercise (override > base > undefined)
 */
export function getWeightPath(exerciseId: string): WeightPath | undefined {
  const exercise = getExerciseWithOverrides(exerciseId);
  return exercise?.weightPath;
}

/**
 * Get the effective movement plane for an exercise (override > base > undefined)
 */
export function getMovementPlane(exerciseId: string): MovementPlane | undefined {
  const exercise = getExerciseWithOverrides(exerciseId);
  return exercise?.movementPlane;
}

/**
 * Get the effective equipment options for an exercise (override > base > undefined)
 */
export function getEquipmentOptions(exerciseId: string): EquipmentOption[] | undefined {
  const exercise = getExerciseWithOverrides(exerciseId);
  return exercise?.equipmentOptions;
}
