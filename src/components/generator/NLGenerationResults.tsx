// ============================================================================
// NLGenerationResults Component
// Displays results from natural language class generation
// ============================================================================

import React from 'react';
import { ClassPlan } from '../../types';
import { NLGenerationResult } from '../../services/nlGeneratorService';

interface NLGenerationResultsProps {
  result: NLGenerationResult;
  onSelectPrimary: () => void;
  onSelectAlternative: (index: number) => void;
  onTryDifferent: () => void;
}

export function NLGenerationResults({
  result,
  onSelectPrimary,
  onSelectAlternative,
  onTryDifferent,
}: NLGenerationResultsProps) {
  return (
    <div className="space-y-6">
      {/* Explanation */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <span className="text-blue-600 text-xl">💡</span>
          <div>
            <div className="font-medium text-blue-900">Why this class?</div>
            <div className="text-sm text-blue-700 mt-1">{result.matchExplanation}</div>
          </div>
        </div>
      </div>

      {/* Primary Result */}
      <div className="border-2 border-orange-400 rounded-lg overflow-hidden bg-white">
        <div className="bg-orange-100 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-orange-600">⭐</span>
            <span className="font-semibold text-orange-900">Best Match</span>
          </div>
          <button
            onClick={onSelectPrimary}
            className="px-4 py-1.5 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors"
          >
            Use This
          </button>
        </div>
        <ClassPreviewCompact classPlan={result.classPlan} />
      </div>

      {/* Alternatives */}
      {result.alternatives.length > 0 && (
        <div>
          <div className="text-sm font-medium text-gray-600 mb-3">Or try one of these alternatives:</div>
          <div className="grid gap-4 md:grid-cols-2">
            {result.alternatives.map((alt, index) => (
              <div key={alt.id} className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                <div className="bg-gray-50 px-4 py-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Alternative {index + 1}</span>
                  <button
                    onClick={() => onSelectAlternative(index)}
                    className="px-3 py-1 text-sm text-orange-600 hover:bg-orange-50 rounded transition-colors"
                  >
                    Use This
                  </button>
                </div>
                <ClassPreviewCompact classPlan={alt} compact />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-center gap-4 pt-4">
        <button
          onClick={onTryDifferent}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
        >
          Try Different Query
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// Compact Class Preview
// ============================================================================

interface ClassPreviewCompactProps {
  classPlan: ClassPlan;
  compact?: boolean;
}

function ClassPreviewCompact({ classPlan, compact = false }: ClassPreviewCompactProps) {
  const totalDuration = classPlan.round1.duration + classPlan.round2.duration;

  return (
    <div className={`p-4 ${compact ? 'text-sm' : ''}`}>
      {/* Stats Row */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="flex items-center gap-1.5">
          <span className="text-gray-400">⏱</span>
          <span className="font-medium">{totalDuration} min</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-gray-400">🏃</span>
          <span className="font-medium">Avg {classPlan.treadAverage.toFixed(1)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-gray-400">💪</span>
          <span>{classPlan.round1.equipment}</span>
        </div>
      </div>

      {/* Round Previews */}
      <div className={`grid gap-4 ${compact ? '' : 'md:grid-cols-2'}`}>
        <RoundPreviewCompact round={classPlan.round1} compact={compact} />
        {!compact && <RoundPreviewCompact round={classPlan.round2} compact={compact} />}
      </div>
    </div>
  );
}

interface RoundPreviewCompactProps {
  round: ClassPlan['round1'];
  compact?: boolean;
}

function RoundPreviewCompact({ round, compact }: RoundPreviewCompactProps) {
  // Get first few exercises from each block
  const floorPreview = round.floor.slice(0, compact ? 2 : 3).map(e => e.exercises);
  const treadPreview = round.tread.slice(0, compact ? 2 : 3).map(e => e.raw);

  return (
    <div className="space-y-2">
      <div className="text-xs font-medium text-gray-500">Round {round.number} ({round.duration} min)</div>

      {/* Floor Preview */}
      <div className="bg-orange-50 rounded p-2">
        <div className="text-xs font-medium text-orange-700 mb-1">Floor</div>
        {floorPreview.map((ex, i) => (
          <div key={i} className={`text-xs text-gray-600 truncate ${compact ? '' : 'py-0.5'}`}>
            {ex.slice(0, 50)}{ex.length > 50 ? '...' : ''}
          </div>
        ))}
        {round.floor.length > (compact ? 2 : 3) && (
          <div className="text-xs text-gray-400">+{round.floor.length - (compact ? 2 : 3)} more</div>
        )}
      </div>

      {/* Tread Preview */}
      <div className="bg-blue-50 rounded p-2">
        <div className="text-xs font-medium text-blue-700 mb-1">Tread</div>
        {treadPreview.map((raw, i) => (
          <div key={i} className={`text-xs text-gray-600 truncate ${compact ? '' : 'py-0.5'}`}>
            {raw.slice(0, 40)}{raw.length > 40 ? '...' : ''}
          </div>
        ))}
        {round.tread.length > (compact ? 2 : 3) && (
          <div className="text-xs text-gray-400">+{round.tread.length - (compact ? 2 : 3)} more</div>
        )}
      </div>
    </div>
  );
}
