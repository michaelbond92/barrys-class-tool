import React from 'react';
import { getAverageColor } from '../../utils/colorUtils';
import { formatTreadAverage } from '../../utils/formatUtils';

interface TreadAverageIndicatorProps {
  average: number;
  maxAverage: number;
}

export function TreadAverageIndicator({ average, maxAverage }: TreadAverageIndicatorProps) {
  const color = getAverageColor(average, maxAverage);
  const percentage = Math.min((average / maxAverage) * 100, 100);
  const isOverMax = average > maxAverage;

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-600">Tread Average</span>
        <span className={`text-2xl font-bold ${color}`}>
          {formatTreadAverage(average)}
        </span>
      </div>

      {/* Progress bar */}
      <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`absolute left-0 top-0 h-full transition-all duration-300 ${
            isOverMax ? 'bg-red-500' : average / maxAverage > 0.9 ? 'bg-yellow-500' : 'bg-green-500'
          }`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
        {/* Max marker */}
        <div
          className="absolute top-0 w-0.5 h-full bg-gray-600"
          style={{ left: '100%', transform: 'translateX(-1px)' }}
        />
      </div>

      <div className="flex justify-between mt-1 text-xs text-gray-500">
        <span>0</span>
        <span>Max: {maxAverage}</span>
      </div>

      {isOverMax && (
        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Average exceeds maximum
        </p>
      )}
    </div>
  );
}
