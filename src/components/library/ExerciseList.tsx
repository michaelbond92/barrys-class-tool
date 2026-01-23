import React from 'react';
import { Exercise } from '../../types';
import { ExerciseCard } from './ExerciseCard';
import { ExerciseWithFreshness } from '../../services/exerciseSelector';

interface ExerciseListProps {
  exercises: ExerciseWithFreshness[];
  onSelect?: (exercise: Exercise) => void;
}

export function ExerciseList({ exercises, onSelect }: ExerciseListProps) {
  if (exercises.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p>No exercises found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {exercises.map((exercise) => (
        <ExerciseCard
          key={exercise.id}
          exercise={exercise}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
