import React from 'react';
import { TreadEntry } from '../../types';
import { formatTreadAverage } from '../../utils/formatUtils';
import { getAverageColor, getTreadTextColor } from '../../utils/colorUtils';

interface TreadResultsProps {
  entries: TreadEntry[];
  average: number;
  countableMinutes: number;
  totalMinutes: number;
  recoverMinutes: number;
  maxAverage?: number;
}

export function TreadResults({
  entries,
  average,
  countableMinutes,
  totalMinutes,
  recoverMinutes,
  maxAverage = 7.75
}: TreadResultsProps) {
  if (entries.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Results</h2>
        <p className="text-gray-500 text-center py-8">
          Enter tread data to see calculated results
        </p>
      </div>
    );
  }

  const averageColor = getAverageColor(average, maxAverage);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Results</h2>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-500">Tread Average</p>
          <p className={`text-3xl font-bold ${averageColor}`}>
            {formatTreadAverage(average)}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Max: {maxAverage}
          </p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-500">Minutes</p>
          <p className="text-3xl font-bold text-gray-900">{totalMinutes}</p>
          <p className="text-xs text-gray-400 mt-1">
            {countableMinutes} counted, {recoverMinutes} recover
          </p>
        </div>
      </div>

      {/* Parsed Entries Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-2 px-2 font-medium text-gray-600">Min</th>
              <th className="text-left py-2 px-2 font-medium text-gray-600">Raw</th>
              <th className="text-left py-2 px-2 font-medium text-gray-600">Low</th>
              <th className="text-left py-2 px-2 font-medium text-gray-600">Incline</th>
              <th className="text-left py-2 px-2 font-medium text-gray-600">Effective</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, index) => {
              const textColorClass = entry.isRecover
                ? 'text-gray-400'
                : entry.textColor === 'purple'
                ? 'text-hero'
                : entry.textColor === 'red'
                ? 'text-incline'
                : 'text-gray-900';

              return (
                <tr
                  key={index}
                  className={`border-b border-gray-100 ${entry.isRecover ? 'bg-gray-50' : ''}`}
                >
                  <td className="py-2 px-2 font-mono">{entry.minute}</td>
                  <td className={`py-2 px-2 font-mono ${textColorClass}`}>
                    {entry.raw}
                  </td>
                  <td className="py-2 px-2 font-mono">
                    {entry.isRecover ? '-' : entry.lowestSpeed}
                  </td>
                  <td className="py-2 px-2 font-mono">
                    {entry.inclinePercent > 0 ? `${entry.inclinePercent}%` : '-'}
                  </td>
                  <td className="py-2 px-2 font-mono font-medium">
                    {entry.isRecover ? '-' : entry.effectiveSpeed.toFixed(1)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="mt-4 flex gap-4 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-gray-200"></span>
          Recover (excluded)
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-incline"></span>
          Incline
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-hero"></span>
          Sprint
        </span>
      </div>
    </div>
  );
}
