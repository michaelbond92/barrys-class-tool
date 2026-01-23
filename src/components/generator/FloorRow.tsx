import React, { useState } from 'react';
import { FloorEntry } from '../../types';
import { EnergyBadge } from '../ui/Badge';

interface FloorRowProps {
  entry: FloorEntry;
  onChange: (entry: FloorEntry) => void;
  isEditing: boolean;
  onSwapClick?: () => void;
}

export function FloorRow({ entry, onChange, isEditing, onSwapClick }: FloorRowProps) {
  const [editValue, setEditValue] = useState(entry.exercises);

  const handleBlur = () => {
    if (editValue !== entry.exercises) {
      onChange({
        ...entry,
        exercises: editValue
      });
    }
  };

  const bgColorClass = {
    L1: 'bg-energy-l1/30',
    L2: 'bg-energy-l2/30',
    L3: 'bg-energy-l3/30'
  }[entry.energyLevel];

  if (isEditing) {
    return (
      <div className={`flex items-center gap-2 px-2 py-1 rounded ${bgColorClass}`}>
        <input
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleBlur}
          className="flex-1 px-2 py-1 border border-gray-200 rounded text-sm bg-white"
        />
        {onSwapClick && (
          <button
            onClick={onSwapClick}
            className="p-1 text-gray-400 hover:text-orange-500"
            title="Swap exercise"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 px-2 py-1 rounded ${bgColorClass}`}>
      <span className="text-sm flex-1">{entry.exercises}</span>
      <EnergyBadge level={entry.energyLevel} />
    </div>
  );
}
