import React from 'react';
import { Exercise } from '../../types';
import { Badge } from '../ui/Badge';
import { getFreshnessColor, getFreshnessLabel } from '../../utils/colorUtils';

interface ExerciseCardProps {
  exercise: Exercise & { usageCount: number; isFresh: boolean };
  onSelect?: (exercise: Exercise) => void;
}

export function ExerciseCard({ exercise, onSelect }: ExerciseCardProps) {
  const freshnessColor = getFreshnessColor(exercise.usageCount);
  const freshnessLabel = getFreshnessLabel(exercise.usageCount);

  return (
    <div
      onClick={() => onSelect?.(exercise)}
      className={`bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow ${
        onSelect ? 'cursor-pointer' : ''
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-medium text-gray-900">{exercise.name}</h3>
        <span className={`text-xs px-2 py-0.5 rounded-full ${freshnessColor}`}>
          {freshnessLabel}
        </span>
      </div>

      <div className="flex flex-wrap gap-1 mb-3">
        <Badge variant="info" size="sm">
          {exercise.category}
        </Badge>
        {exercise.isCompound && (
          <Badge variant="default" size="sm">
            Compound
          </Badge>
        )}
        {exercise.isPowerMove && (
          <Badge variant="warning" size="sm">
            Power
          </Badge>
        )}
      </div>

      <div className="text-xs text-gray-500">
        <p className="truncate">
          {exercise.equipment.join(', ')}
        </p>
      </div>
    </div>
  );
}
