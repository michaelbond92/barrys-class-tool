// ============================================================================
// Flow Score Indicator
// Displays flow score with color coding and optional details
// ============================================================================

import React from 'react';
import { FlowScore, EnhancedFlowScore } from '../../types/hierarchyTypes';
import {
  getFlowRatingColor,
  getFlowRatingBgColor,
} from '../../services/positionService';

interface FlowScoreIndicatorProps {
  flowScore: FlowScore | EnhancedFlowScore;
  showDetails?: boolean;
  showBreakdown?: boolean;  // Show enhanced breakdown if available
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

// Type guard to check if we have enhanced flow score
function isEnhancedFlowScore(score: FlowScore | EnhancedFlowScore): score is EnhancedFlowScore {
  return 'positionScore' in score && score.positionScore !== undefined;
}

export function FlowScoreIndicator({
  flowScore,
  showDetails = false,
  showBreakdown = false,
  size = 'md',
  className = '',
}: FlowScoreIndicatorProps) {
  const { score, rating, totalTransitionCost, uniquePositions, warnings } = flowScore;
  const isEnhanced = isEnhancedFlowScore(flowScore);

  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-sm px-2 py-1',
    lg: 'text-base px-3 py-1.5',
  };

  const colorClass = getFlowRatingColor(rating);
  const bgColorClass = getFlowRatingBgColor(rating);

  const ratingEmoji = {
    great: '🟢',
    good: '🔵',
    fair: '🟡',
    poor: '🔴',
  };

  // Helper to get score color
  const getScoreColor = (s: number) => {
    if (s >= 85) return 'text-green-600';
    if (s >= 70) return 'text-blue-600';
    if (s >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className={`inline-flex flex-col ${className}`}>
      <div
        className={`inline-flex items-center gap-1 rounded ${bgColorClass} ${sizeClasses[size]}`}
        title={`Flow Score: ${score}/100 (${rating})`}
      >
        <span>{ratingEmoji[rating]}</span>
        <span className={`font-medium ${colorClass}`}>{score}</span>
        {size !== 'sm' && (
          <span className={`${colorClass} capitalize`}>{rating}</span>
        )}
      </div>

      {/* Enhanced breakdown */}
      {showBreakdown && isEnhanced && (
        <div className="mt-2 text-xs space-y-1">
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            <div className="flex justify-between">
              <span className="text-gray-500">Position:</span>
              <span className={getScoreColor(flowScore.positionScore)}>{flowScore.positionScore}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Weight Path:</span>
              <span className={getScoreColor(flowScore.weightPathScore)}>{flowScore.weightPathScore}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Plane:</span>
              <span className={getScoreColor(flowScore.movementPlaneScore)}>{flowScore.movementPlaneScore}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Grip:</span>
              <span className={getScoreColor(flowScore.gripFatigueScore)}>{flowScore.gripFatigueScore}</span>
            </div>
          </div>
          {flowScore.planeViolations > 0 && (
            <div className="text-amber-600">
              ⚠️ {flowScore.planeViolations} plane mismatch{flowScore.planeViolations > 1 ? 'es' : ''}
            </div>
          )}
          {flowScore.consecutiveHighGrip >= 3 && (
            <div className="text-amber-600">
              ⚠️ {flowScore.consecutiveHighGrip} consecutive high-grip exercises
            </div>
          )}
        </div>
      )}

      {showDetails && (
        <div className="mt-1 text-xs text-gray-500 space-y-0.5">
          <div>Transitions: {totalTransitionCost} cost</div>
          <div>Positions: {uniquePositions} unique</div>
          {warnings.length > 0 && (
            <div className="text-amber-600">
              {warnings.map((w, i) => (
                <div key={i}>⚠️ {w}</div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Compact variant for inline use
// ============================================================================

interface FlowScoreBadgeProps {
  score: number;
  rating: FlowScore['rating'];
  className?: string;
}

export function FlowScoreBadge({ score, rating, className = '' }: FlowScoreBadgeProps) {
  const colorClass = getFlowRatingColor(rating);
  const bgColorClass = getFlowRatingBgColor(rating);

  return (
    <span
      className={`inline-flex items-center gap-0.5 text-xs px-1 py-0.5 rounded ${bgColorClass} ${colorClass} ${className}`}
      title={`Flow: ${score}/100`}
    >
      <span className="font-medium">{score}</span>
    </span>
  );
}

// ============================================================================
// Flow visualization as a bar
// ============================================================================

interface FlowScoreBarProps {
  score: number;
  className?: string;
}

export function FlowScoreBar({ score, className = '' }: FlowScoreBarProps) {
  const getBarColor = (s: number): string => {
    if (s >= 85) return 'bg-green-500';
    if (s >= 70) return 'bg-blue-500';
    if (s >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className={`h-2 bg-gray-200 rounded-full overflow-hidden ${className}`}>
      <div
        className={`h-full ${getBarColor(score)} transition-all duration-300`}
        style={{ width: `${score}%` }}
      />
    </div>
  );
}

export default FlowScoreIndicator;
