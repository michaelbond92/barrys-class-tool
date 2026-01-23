import React, { useState } from 'react';
import { Exercise, ExerciseCategory, Equipment } from '../../types';
import { Modal } from '../ui/Modal';
import { SearchBar } from '../library/SearchBar';
import { CategoryFilter } from '../library/CategoryFilter';
import { ExerciseWithFreshness } from '../../services/exerciseSelector';
import { getFreshnessColor, getFreshnessLabel } from '../../utils/colorUtils';

interface ExerciseSwapperProps {
  isOpen: boolean;
  onClose: () => void;
  currentExercise: string;
  exercises: ExerciseWithFreshness[];
  onSelect: (exercise: Exercise) => void;
}

export function ExerciseSwapper({
  isOpen,
  onClose,
  currentExercise,
  exercises,
  onSelect
}: ExerciseSwapperProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<ExerciseCategory | 'all'>('all');

  const filteredExercises = exercises.filter(ex => {
    if (categoryFilter !== 'all' && ex.category !== categoryFilter) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (!ex.name.toLowerCase().includes(query) && !ex.category.toLowerCase().includes(query)) {
        return false;
      }
    }
    return true;
  });

  const handleSelect = (exercise: Exercise) => {
    onSelect(exercise);
    onClose();
    setSearchQuery('');
    setCategoryFilter('all');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Swap Exercise" size="lg">
      <div className="space-y-4">
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-sm text-gray-600">
            Current: <span className="font-medium text-gray-900">{currentExercise}</span>
          </p>
        </div>

        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search exercises..."
        />

        <CategoryFilter
          selected={categoryFilter}
          onChange={setCategoryFilter}
        />

        <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
          {filteredExercises.length === 0 ? (
            <p className="text-center text-gray-500 py-4">No exercises found</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredExercises.map((exercise) => {
                const freshnessColor = getFreshnessColor(exercise.usageCount);
                const freshnessLabel = getFreshnessLabel(exercise.usageCount);

                return (
                  <button
                    key={exercise.id}
                    onClick={() => handleSelect(exercise)}
                    className="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{exercise.name}</p>
                      <p className="text-sm text-gray-500">{exercise.category}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${freshnessColor}`}>
                      {freshnessLabel}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
