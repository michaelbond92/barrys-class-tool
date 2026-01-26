// ============================================================================
// Freshness Indicator
// Displays freshness status with color coding
// ============================================================================

import React from 'react';
import { FreshnessScore } from '../../types/hierarchyTypes';

interface FreshnessIndicatorProps {
  freshness: FreshnessScore;
  showLabel?: boolean;
  showCount?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function FreshnessIndicator({
  freshness,
  showLabel = true,
  showCount = false,
  size = 'md',
  className = '',
}: FreshnessIndicatorProps) {
  const { score, color, label, useCount, isOverused } = freshness;

  const colorClasses = {
    green: 'bg-green-100 text-green-700 border-green-200',
    yellow: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    red: 'bg-red-100 text-red-700 border-red-200',
    gray: 'bg-gray-100 text-gray-600 border-gray-200',
  };

  const dotColors = {
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
    gray: 'bg-gray-400',
  };

  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-sm px-2 py-1',
    lg: 'text-base px-3 py-1.5',
  };

  const dotSizes = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
  };

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded border ${colorClasses[color]} ${sizeClasses[size]} ${className}`}
      title={`${label}${showCount ? ` (used ${useCount} times)` : ''}`}
    >
      <span className={`${dotSizes[size]} rounded-full ${dotColors[color]}`} />

      {showLabel && (
        <span className="font-medium whitespace-nowrap">
          {isOverused && '⚠️ '}
          {label}
        </span>
      )}

      {showCount && useCount > 0 && (
        <span className="text-gray-500">×{useCount}</span>
      )}
    </div>
  );
}

// ============================================================================
// Compact dot-only indicator
// ============================================================================

interface FreshnessDotProps {
  color: FreshnessScore['color'];
  className?: string;
  title?: string;
}

export function FreshnessDot({ color, className = '', title }: FreshnessDotProps) {
  const dotColors = {
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
    gray: 'bg-gray-400',
  };

  return (
    <span
      className={`inline-block w-2 h-2 rounded-full ${dotColors[color]} ${className}`}
      title={title}
    />
  );
}

// ============================================================================
// Freshness badge with icon
// ============================================================================

interface FreshnessBadgeProps {
  freshness: FreshnessScore;
  className?: string;
}

export function FreshnessBadge({ freshness, className = '' }: FreshnessBadgeProps) {
  const { color, label, isOverused } = freshness;

  const icons = {
    green: '✨',
    yellow: '⏰',
    red: '🔄',
    gray: '🆕',
  };

  const bgColors = {
    green: 'bg-green-50',
    yellow: 'bg-yellow-50',
    red: 'bg-red-50',
    gray: 'bg-gray-50',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${bgColors[color]} ${className}`}
      title={label}
    >
      {isOverused ? '⚠️' : icons[color]}
      <span>{isOverused ? 'Overused' : color === 'gray' ? 'New' : ''}</span>
    </span>
  );
}

// ============================================================================
// Overuse warning
// ============================================================================

interface OveruseWarningProps {
  isOverused: boolean;
  useCount: number;
  className?: string;
}

export function OveruseWarning({ isOverused, useCount, className = '' }: OveruseWarningProps) {
  if (!isOverused) return null;

  return (
    <div
      className={`flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded ${className}`}
    >
      <span>⚠️</span>
      <span>Used {useCount}× recently - consider alternatives</span>
    </div>
  );
}

export default FreshnessIndicator;
