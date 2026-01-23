import { useState, useCallback, useEffect } from 'react';
import { Exercise, ExerciseCategory, Equipment, STORAGE_KEYS } from '../types';
import { defaultExercises } from '../data/exercises';
import { loadExercises, saveExercises, markExerciseUsed, resetExerciseHistory } from '../services/storageService';
import { calculateExerciseFreshness, ExerciseWithFreshness, filterExercisesByCategory, filterExercisesByEquipment, searchExercises } from '../services/exerciseSelector';

export interface UseExerciseLibraryReturn {
  exercises: Exercise[];
  exercisesWithFreshness: ExerciseWithFreshness[];
  filteredExercises: ExerciseWithFreshness[];
  categoryFilter: ExerciseCategory | 'all';
  equipmentFilter: Equipment | 'all';
  searchQuery: string;
  setCategoryFilter: (category: ExerciseCategory | 'all') => void;
  setEquipmentFilter: (equipment: Equipment | 'all') => void;
  setSearchQuery: (query: string) => void;
  markUsed: (exerciseId: string, date: string) => void;
  resetHistory: () => void;
  refreshFromStorage: () => void;
}

export function useExerciseLibrary(): UseExerciseLibraryReturn {
  const [exercises, setExercises] = useState<Exercise[]>(() => loadExercises());
  const [categoryFilter, setCategoryFilter] = useState<ExerciseCategory | 'all'>('all');
  const [equipmentFilter, setEquipmentFilter] = useState<Equipment | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate freshness for all exercises
  const exercisesWithFreshness = exercises.map(calculateExerciseFreshness);

  // Apply filters
  const filteredExercises = (() => {
    let result = exercisesWithFreshness;

    // Category filter
    if (categoryFilter !== 'all') {
      result = result.filter(ex => ex.category === categoryFilter);
    }

    // Equipment filter
    if (equipmentFilter !== 'all') {
      result = result.filter(ex => ex.equipment.includes(equipmentFilter));
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(ex =>
        ex.name.toLowerCase().includes(query) ||
        ex.category.toLowerCase().includes(query)
      );
    }

    // Sort by freshness (fresh first), then alphabetically
    return result.sort((a, b) => {
      if (a.usageCount !== b.usageCount) {
        return a.usageCount - b.usageCount;
      }
      return a.name.localeCompare(b.name);
    });
  })();

  // Mark an exercise as used
  const markUsed = useCallback((exerciseId: string, date: string) => {
    setExercises(prev => {
      const updated = markExerciseUsed(prev, exerciseId, date);
      saveExercises(updated);
      return updated;
    });
  }, []);

  // Reset all exercise history
  const resetHistory = useCallback(() => {
    setExercises(prev => {
      const updated = resetExerciseHistory(prev);
      saveExercises(updated);
      return updated;
    });
  }, []);

  // Reload exercises from storage
  const refreshFromStorage = useCallback(() => {
    setExercises(loadExercises());
  }, []);

  return {
    exercises,
    exercisesWithFreshness,
    filteredExercises,
    categoryFilter,
    equipmentFilter,
    searchQuery,
    setCategoryFilter,
    setEquipmentFilter,
    setSearchQuery,
    markUsed,
    resetHistory,
    refreshFromStorage
  };
}
