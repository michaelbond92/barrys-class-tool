// ============================================================================
// Position Selector
// Dropdown selector for exercise position tagging with override support
// ============================================================================

import React, { useState } from 'react';
import { ExercisePosition } from '../../types/hierarchyTypes';
import {
  detectPrimaryPosition,
  formatPosition,
  formatPositionShort,
  getPositionIcon,
  hasPositionOverride,
  savePositionOverride,
  removePositionOverride,
} from '../../services/positionService';

interface PositionSelectorProps {
  exerciseText: string;
  currentPosition?: ExercisePosition;
  onChange?: (position: ExercisePosition) => void;
  showLabel?: boolean;
  compact?: boolean;
  className?: string;
}

const ALL_POSITIONS: ExercisePosition[] = [
  'floor_standing',
  'floor_laying',
  'bench_laying',
  'bench_sitting',
  'bench_front',
  'bench_back',
  'bench_straddling',
  'bench_standing',
];

const POSITION_DESCRIPTIONS: Record<ExercisePosition, string> = {
  floor_standing: 'Standing on the floor (squats, curls, lunges)',
  floor_laying: 'Laying/prone on the floor (planks, pushups, WGS)',
  bench_laying: 'Laying on the bench (chest press, skull crushers)',
  bench_sitting: 'Sitting on the bench (russian twists, situps)',
  bench_front: 'In front of the bench (box squats, hip thrusts)',
  bench_back: 'Behind the bench (spider crunches)',
  bench_straddling: 'Straddling the bench (bent over rows)',
  bench_standing: 'Standing on the bench (elevated lunges)',
};

export function PositionSelector({
  exerciseText,
  currentPosition,
  onChange,
  showLabel = true,
  compact = false,
  className = '',
}: PositionSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const detectedPosition = detectPrimaryPosition(exerciseText);
  const activePosition = currentPosition || detectedPosition;
  const isOverridden = hasPositionOverride(exerciseText);

  const handleSelect = (position: ExercisePosition) => {
    if (position === detectedPosition) {
      // Remove override if selecting auto-detected position
      removePositionOverride(exerciseText);
    } else {
      savePositionOverride(exerciseText, position);
    }

    onChange?.(position);
    setIsOpen(false);
  };

  const handleReset = () => {
    removePositionOverride(exerciseText);
    onChange?.(detectedPosition);
    setIsOpen(false);
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          inline-flex items-center gap-1 rounded border
          ${isOverridden
            ? 'bg-purple-50 border-purple-200 text-purple-700'
            : 'bg-gray-50 border-gray-200 text-gray-700'
          }
          ${compact ? 'px-1.5 py-0.5 text-xs' : 'px-2 py-1 text-sm'}
          hover:bg-gray-100 transition-colors
        `}
        title={`${formatPosition(activePosition)}${isOverridden ? ' (overridden)' : ' (auto-detected)'}`}
      >
        <span>{getPositionIcon(activePosition)}</span>
        {showLabel && (
          <span className="font-medium">
            {compact ? formatPositionShort(activePosition) : formatPosition(activePosition)}
          </span>
        )}
        {isOverridden && <span className="text-purple-500">✏️</span>}
        <svg
          className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute left-0 mt-1 w-64 bg-white rounded-lg shadow-lg border z-20">
            <div className="p-2 border-b bg-gray-50 text-xs text-gray-500">
              <div>Auto-detected: <strong>{formatPosition(detectedPosition)}</strong></div>
              {isOverridden && (
                <button
                  onClick={handleReset}
                  className="text-purple-600 hover:underline mt-1"
                >
                  Reset to auto-detected
                </button>
              )}
            </div>

            <div className="max-h-64 overflow-y-auto py-1">
              {ALL_POSITIONS.map((position) => {
                const isActive = position === activePosition;
                const isDetected = position === detectedPosition;

                return (
                  <button
                    key={position}
                    onClick={() => handleSelect(position)}
                    className={`
                      w-full text-left px-3 py-2 text-sm
                      ${isActive ? 'bg-orange-50 text-orange-700' : 'hover:bg-gray-50'}
                      flex items-center gap-2
                    `}
                  >
                    <span className="text-lg">{getPositionIcon(position)}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium flex items-center gap-1">
                        {formatPosition(position)}
                        {isDetected && (
                          <span className="text-xs text-gray-400">(detected)</span>
                        )}
                        {isActive && !isDetected && (
                          <span className="text-xs text-purple-500">(override)</span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {POSITION_DESCRIPTIONS[position]}
                      </div>
                    </div>
                    {isActive && (
                      <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ============================================================================
// Position chip (display only)
// ============================================================================

interface PositionChipProps {
  position: ExercisePosition;
  isOverridden?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

export function PositionChip({
  position,
  isOverridden = false,
  size = 'md',
  className = '',
}: PositionChipProps) {
  const sizeClasses = {
    sm: 'text-xs px-1 py-0.5',
    md: 'text-sm px-1.5 py-0.5',
  };

  return (
    <span
      className={`
        inline-flex items-center gap-0.5 rounded
        ${isOverridden
          ? 'bg-purple-50 text-purple-700 border border-purple-200'
          : 'bg-gray-100 text-gray-600'
        }
        ${sizeClasses[size]}
        ${className}
      `}
      title={formatPosition(position)}
    >
      <span>{getPositionIcon(position)}</span>
      <span>{formatPositionShort(position)}</span>
      {isOverridden && <span className="text-purple-500">✏️</span>}
    </span>
  );
}

// ============================================================================
// Position sequence display
// ============================================================================

interface PositionSequenceProps {
  positions: ExercisePosition[];
  className?: string;
}

export function PositionSequence({ positions, className = '' }: PositionSequenceProps) {
  if (positions.length === 0) return null;

  return (
    <div className={`flex items-center gap-0.5 flex-wrap ${className}`}>
      {positions.map((position, index) => (
        <React.Fragment key={index}>
          <span
            className="text-sm"
            title={formatPosition(position)}
          >
            {getPositionIcon(position)}
          </span>
          {index < positions.length - 1 && (
            <span className="text-gray-300 text-xs">→</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

export default PositionSelector;
