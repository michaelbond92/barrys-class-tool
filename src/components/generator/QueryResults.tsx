// ============================================================================
// Query Results Component
// Displays search results from natural language queries
// ============================================================================

import React from 'react';
import {
  BlockMetadata,
  RoundMetadata,
  ClassMetadata,
} from '../../types/hierarchyTypes';
import { FlowScoreBadge } from '../library/FlowScoreIndicator';
import { FreshnessDot } from '../library/FreshnessIndicator';
import { calculateFreshnessFromValues } from '../../services/usageTrackingService';
import { PositionChip } from '../library/PositionSelector';

// Helper to get flow rating from score
function getFlowRating(score: number): 'great' | 'good' | 'fair' | 'poor' {
  if (score >= 80) return 'great';
  if (score >= 60) return 'good';
  if (score >= 40) return 'fair';
  return 'poor';
}

// ============================================================================
// Types
// ============================================================================

export interface SearchResult {
  type: 'block' | 'round' | 'class';
  item: BlockMetadata | RoundMetadata | ClassMetadata;
  score: number;
  matchReasons: string[];
}

interface QueryResultsProps {
  results: SearchResult[];
  loading?: boolean;
  error?: string | null;
  query?: string;
  interpretation?: string;
  onSelectBlock?: (block: BlockMetadata) => void;
  onSelectRound?: (round: RoundMetadata) => void;
  onSelectClass?: (classItem: ClassMetadata) => void;
  emptyMessage?: string;
  className?: string;
}

// ============================================================================
// Helper Components
// ============================================================================

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 80 ? 'bg-green-100 text-green-800' :
                score >= 60 ? 'bg-yellow-100 text-yellow-800' :
                score >= 40 ? 'bg-orange-100 text-orange-800' :
                'bg-red-100 text-red-800';

  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${color}`}>
      {Math.round(score)}% match
    </span>
  );
}

function BlockResult({
  block,
  score,
  matchReasons,
  onSelect
}: {
  block: BlockMetadata;
  score: number;
  matchReasons: string[];
  onSelect?: (block: BlockMetadata) => void;
}) {
  const freshness = calculateFreshnessFromValues(
    block.lastUsed || null,
    block.useCount
  );

  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 p-4 hover:border-orange-300 transition-colors ${onSelect ? 'cursor-pointer' : ''}`}
      onClick={() => onSelect?.(block)}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-500 uppercase">
            {block.category} • {block.length} min
          </span>
          <ScoreBadge score={score} />
        </div>
        <div className="flex items-center gap-2">
          <FreshnessDot color={freshness.color} title={freshness.label} />
          {block.flowScore !== undefined && (
            <FlowScoreBadge score={block.flowScore} rating={getFlowRating(block.flowScore)} />
          )}
        </div>
      </div>

      <div className="space-y-1 mb-3">
        {block.content.map((line, idx) => (
          <p key={idx} className="text-sm text-gray-700">{line}</p>
        ))}
      </div>

      {block.positions && block.positions.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {block.positions.slice(0, 4).map((pos, idx) => (
            <PositionChip key={idx} position={pos} size="sm" />
          ))}
          {block.positions.length > 4 && (
            <span className="text-xs text-gray-400">+{block.positions.length - 4} more</span>
          )}
        </div>
      )}

      {matchReasons.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2 pt-2 border-t border-gray-100">
          {matchReasons.map((reason, idx) => (
            <span key={idx} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
              {reason}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function RoundResult({
  round,
  score,
  matchReasons,
  onSelect
}: {
  round: RoundMetadata;
  score: number;
  matchReasons: string[];
  onSelect?: (round: RoundMetadata) => void;
}) {
  const freshness = calculateFreshnessFromValues(
    round.lastUsed || null,
    round.useCount
  );

  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 p-4 hover:border-orange-300 transition-colors ${onSelect ? 'cursor-pointer' : ''}`}
      onClick={() => onSelect?.(round)}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-500 uppercase">
            Round {round.roundNumber} • {round.duration} min
          </span>
          <ScoreBadge score={score} />
        </div>
        <div className="flex items-center gap-2">
          <FreshnessDot color={freshness.color} title={freshness.label} />
          {round.flowScore !== undefined && (
            <span className="text-xs text-gray-500">Flow: {round.flowScore}</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-500 text-xs mb-1">Body Focus</p>
          <div className="flex flex-wrap gap-1">
            {round.primaryBodyFocus?.slice(0, 3).map((focus, idx) => (
              <span key={idx} className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded text-xs">
                {focus}
              </span>
            ))}
          </div>
        </div>
        <div>
          <p className="text-gray-500 text-xs mb-1">Movements</p>
          <div className="flex flex-wrap gap-1">
            {round.movementPatterns?.slice(0, 3).map((pattern, idx) => (
              <span key={idx} className="bg-green-50 text-green-700 px-2 py-0.5 rounded text-xs">
                {pattern}
              </span>
            ))}
          </div>
        </div>
      </div>

      {round.finisherType && (
        <p className="text-xs text-gray-500 mt-2">
          Finisher: <span className="text-orange-600 font-medium">{round.finisherType.replace(/_/g, ' ')}</span>
        </p>
      )}

      {matchReasons.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2 pt-2 border-t border-gray-100">
          {matchReasons.map((reason, idx) => (
            <span key={idx} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
              {reason}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function ClassResult({
  classItem,
  score,
  matchReasons,
  onSelect
}: {
  classItem: ClassMetadata;
  score: number;
  matchReasons: string[];
  onSelect?: (classItem: ClassMetadata) => void;
}) {
  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 p-4 hover:border-orange-300 transition-colors ${onSelect ? 'cursor-pointer' : ''}`}
      onClick={() => onSelect?.(classItem)}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-900">
            {new Date(classItem.date).toLocaleDateString()}
          </span>
          <ScoreBadge score={score} />
        </div>
        <span className="text-xs text-gray-500">
          {classItem.totalDuration} min total
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-500 text-xs mb-1">Round 1 ({classItem.round1.duration} min)</p>
          <p className="text-gray-700">{classItem.round1.equipment?.primary?.type || 'N/A'}</p>
        </div>
        <div>
          <p className="text-gray-500 text-xs mb-1">Round 2 ({classItem.round2.duration} min)</p>
          <p className="text-gray-700">{classItem.round2.equipment?.primary?.type || 'N/A'}</p>
        </div>
      </div>

      {matchReasons.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2 pt-2 border-t border-gray-100">
          {matchReasons.map((reason, idx) => (
            <span key={idx} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
              {reason}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function QueryResults({
  results,
  loading = false,
  error = null,
  query,
  interpretation,
  onSelectBlock,
  onSelectRound,
  onSelectClass,
  emptyMessage = 'No results found. Try adjusting your search.',
  className = '',
}: QueryResultsProps) {
  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-3" />
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
        <p className="text-red-700 text-sm">{error}</p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className={`bg-gray-50 border border-gray-200 rounded-lg p-8 text-center ${className}`}>
        <svg className="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <p className="text-gray-500">{emptyMessage}</p>
        {query && (
          <p className="text-gray-400 text-sm mt-1">Query: "{query}"</p>
        )}
      </div>
    );
  }

  return (
    <div className={className}>
      {interpretation && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <p className="text-blue-700 text-sm">
            <span className="font-medium">Searching for:</span> {interpretation}
          </p>
        </div>
      )}

      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-gray-500">
          Found {results.length} result{results.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="space-y-3">
        {results.map((result, idx) => {
          if (result.type === 'block') {
            return (
              <BlockResult
                key={`block-${idx}`}
                block={result.item as BlockMetadata}
                score={result.score}
                matchReasons={result.matchReasons}
                onSelect={onSelectBlock}
              />
            );
          } else if (result.type === 'round') {
            return (
              <RoundResult
                key={`round-${idx}`}
                round={result.item as RoundMetadata}
                score={result.score}
                matchReasons={result.matchReasons}
                onSelect={onSelectRound}
              />
            );
          } else {
            return (
              <ClassResult
                key={`class-${idx}`}
                classItem={result.item as ClassMetadata}
                score={result.score}
                matchReasons={result.matchReasons}
                onSelect={onSelectClass}
              />
            );
          }
        })}
      </div>
    </div>
  );
}
