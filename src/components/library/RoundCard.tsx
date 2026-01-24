// ============================================================================
// RoundCard Component
// Displays round metadata with expandable content
// ============================================================================

import React from 'react';
import { RoundMetadata, FlowScore } from '../../types/hierarchyTypes';
import { FlowScoreBadge } from './FlowScoreIndicator';

function getRatingFromScore(score: number): FlowScore['rating'] {
  if (score >= 85) return 'great';
  if (score >= 70) return 'good';
  if (score >= 50) return 'fair';
  return 'poor';
}

interface RoundCardProps {
  round: RoundMetadata;
  expanded: boolean;
  onToggle: () => void;
}

export function RoundCard({ round, expanded, onToggle }: RoundCardProps) {
  const getFinisherLabel = (type: string | null) => {
    if (!type) return null;
    const labels: Record<string, string> = {
      snatches: 'Snatches',
      burpees: 'Burpees',
      weighted_burpees: 'Weighted Burpees',
      squat_to_hi_pull: 'Squat to Hi Pull',
      deadlift_clean_squat: 'DL Clean Squat',
      db_swings: 'DB Swings',
      amrap: 'AMRAP',
      choice: 'Choice',
    };
    return labels[type] || type;
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
      {/* Header - Always visible */}
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className={`text-lg font-bold ${
            round.roundNumber === 1 ? 'text-indigo-600' : 'text-purple-600'
          }`}>
            R{round.roundNumber}
          </span>
          <div className="text-left">
            <div className="text-sm font-medium text-gray-900">
              {round.duration} min
            </div>
            <div className="text-xs text-gray-500">
              {new Date(round.sourceDate).toLocaleDateString()}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Tread Average */}
          <span className="text-sm px-2 py-1 rounded bg-blue-100 text-blue-700">
            Avg: {round.treadAverage}
          </span>

          {/* Flow Score */}
          <FlowScoreBadge score={round.flowScore} rating={getRatingFromScore(round.flowScore)} />

          {/* Expand Arrow */}
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Expanded Content */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-100">
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3 py-3">
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">{round.sprintCount}</div>
              <div className="text-xs text-gray-500">Sprints</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">{round.recoverCount}</div>
              <div className="text-xs text-gray-500">Recovers</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">{round.maxIncline || 0}%</div>
              <div className="text-xs text-gray-500">Max Incline</div>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-3">
            {/* Body Focus */}
            {round.primaryBodyFocus.map(focus => (
              <span key={focus} className="text-xs px-2 py-0.5 rounded bg-orange-100 text-orange-700">
                {focus}
              </span>
            ))}
            {/* Movement Patterns */}
            {round.movementPatterns.slice(0, 4).map(pattern => (
              <span key={pattern} className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                {pattern}
              </span>
            ))}
            {/* Tread Pattern */}
            <span className="text-xs px-2 py-0.5 rounded bg-purple-100 text-purple-700">
              {round.treadPattern?.replace('_', ' ')}
            </span>
          </div>

          {/* Finisher */}
          {round.finisherType && (
            <div className="mb-3 p-2 bg-red-50 rounded border border-red-200">
              <div className="text-xs text-red-600 font-medium mb-1">Finisher</div>
              <div className="text-sm text-red-700">{getFinisherLabel(round.finisherType)}</div>
              <div className="text-xs text-red-600 mt-1">{round.finisherExercise}</div>
            </div>
          )}

          {/* Equipment */}
          <div className="text-xs text-gray-500">
            <span className="font-medium">Equipment:</span> {round.equipment.rawText}
          </div>

          {/* Minute by Minute Preview */}
          <div className="mt-3 border-t border-gray-100 pt-3">
            <div className="text-xs text-gray-500 font-medium mb-2">Preview</div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <div className="font-medium text-orange-700 mb-1">Floor</div>
                {round.minutes.slice(0, 4).map((minute, i) => (
                  <div key={i} className="text-gray-600 truncate" title={minute.floor.rawText}>
                    {i + 1}. {minute.floor.rawText.slice(0, 30)}...
                  </div>
                ))}
                {round.minutes.length > 4 && (
                  <div className="text-gray-400">+{round.minutes.length - 4} more...</div>
                )}
              </div>
              <div>
                <div className="font-medium text-blue-700 mb-1">Tread</div>
                {round.minutes.slice(0, 4).map((minute, i) => (
                  <div key={i} className={`truncate ${
                    minute.tread.isRecover ? 'text-green-600' :
                    minute.tread.isSprint ? 'text-purple-600' :
                    minute.tread.inclinePercent > 0 ? 'text-red-600' :
                    'text-gray-600'
                  }`} title={minute.tread.rawText}>
                    {i + 1}. {minute.tread.rawText.slice(0, 25)}...
                  </div>
                ))}
                {round.minutes.length > 4 && (
                  <div className="text-gray-400">+{round.minutes.length - 4} more...</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
