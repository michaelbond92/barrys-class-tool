import { Exercise, ExerciseCategory, ClassType, Equipment, EnergyLevel } from '../types';
import { countUsageInLastNWeeks } from '../utils/dateUtils';
import { CLASS_TYPE_CONFIGS } from '../data/classTypes';

const FRESHNESS_WEEKS = 4;
const MAX_USAGE_IN_PERIOD = 2;

export interface ExerciseWithFreshness extends Exercise {
  usageCount: number;
  isFresh: boolean;
}

export function calculateExerciseFreshness(exercise: Exercise): ExerciseWithFreshness {
  const usageCount = countUsageInLastNWeeks(exercise.usageHistory, FRESHNESS_WEEKS);
  return {
    ...exercise,
    usageCount,
    isFresh: usageCount < MAX_USAGE_IN_PERIOD
  };
}

export function getEligibleExercises(
  exercises: Exercise[],
  categories: ExerciseCategory[],
  equipment: Equipment
): ExerciseWithFreshness[] {
  return exercises
    .filter(ex => {
      // Must be in one of the target categories
      if (!categories.includes(ex.category)) return false;
      // Must support the equipment
      if (!ex.equipment.includes(equipment)) return false;
      return true;
    })
    .map(calculateExerciseFreshness)
    .filter(ex => ex.isFresh);
}

export function selectExerciseFromCategory(
  exercises: ExerciseWithFreshness[],
  preferredCategories: ExerciseCategory[],
  usedInClass: Set<string>,
  options: {
    preferCompound?: boolean;
    preferPowerMove?: boolean;
  } = {}
): ExerciseWithFreshness | null {
  const { preferCompound = false, preferPowerMove = false } = options;

  // Filter to preferred categories and not yet used
  let candidates = exercises.filter(
    ex => preferredCategories.includes(ex.category) && !usedInClass.has(ex.id)
  );

  if (candidates.length === 0) {
    // Fall back to any category not yet used
    candidates = exercises.filter(ex => !usedInClass.has(ex.id));
  }

  if (candidates.length === 0) return null;

  // Sort by preferences
  candidates.sort((a, b) => {
    // Prefer fresher exercises
    if (a.usageCount !== b.usageCount) {
      return a.usageCount - b.usageCount;
    }
    // Prefer compound if requested
    if (preferCompound && a.isCompound !== b.isCompound) {
      return a.isCompound ? -1 : 1;
    }
    // Prefer power moves if requested
    if (preferPowerMove && a.isPowerMove !== b.isPowerMove) {
      return a.isPowerMove ? -1 : 1;
    }
    // Random tiebreaker
    return Math.random() - 0.5;
  });

  return candidates[0];
}

export function getCategoriesForClassType(classType: ClassType): ExerciseCategory[] {
  const config = CLASS_TYPE_CONFIGS[classType];
  return [...config.primaryCategories, ...config.secondaryCategories];
}

export function getCategoriesForPhase(
  classType: ClassType,
  phase: EnergyLevel
): ExerciseCategory[] {
  const config = CLASS_TYPE_CONFIGS[classType];

  switch (phase) {
    case 'L1':
      // Warmup: compound movements from any category
      return ['compound', ...config.primaryCategories];
    case 'L2':
      // Building: primary focus
      return config.primaryCategories;
    case 'L3':
      // Finisher: power moves or core
      return ['power', 'core'];
  }
}

export function selectExercisesForPhase(
  exercises: ExerciseWithFreshness[],
  classType: ClassType,
  phase: EnergyLevel,
  count: number,
  usedInClass: Set<string>
): ExerciseWithFreshness[] {
  const categories = getCategoriesForPhase(classType, phase);
  const selected: ExerciseWithFreshness[] = [];

  const options = {
    preferCompound: phase === 'L1',
    preferPowerMove: phase === 'L3'
  };

  for (let i = 0; i < count; i++) {
    const exercise = selectExerciseFromCategory(
      exercises,
      categories,
      usedInClass,
      options
    );

    if (exercise) {
      selected.push(exercise);
      usedInClass.add(exercise.id);
    }
  }

  return selected;
}

export function filterExercisesByCategory(
  exercises: Exercise[],
  category: ExerciseCategory | 'all'
): Exercise[] {
  if (category === 'all') return exercises;
  return exercises.filter(ex => ex.category === category);
}

export function filterExercisesByEquipment(
  exercises: Exercise[],
  equipment: Equipment | 'all'
): Exercise[] {
  if (equipment === 'all') return exercises;
  return exercises.filter(ex => ex.equipment.includes(equipment));
}

export function searchExercises(exercises: Exercise[], query: string): Exercise[] {
  const lowerQuery = query.toLowerCase();
  return exercises.filter(ex =>
    ex.name.toLowerCase().includes(lowerQuery) ||
    ex.category.toLowerCase().includes(lowerQuery)
  );
}
