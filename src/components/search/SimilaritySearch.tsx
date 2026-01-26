// ============================================================================
// Similarity Search Component
// "More like this" and "Surprise me" search UI
// ============================================================================

import React, { useState, useCallback } from 'react';
import {
  BlockMetadata,
  RoundMetadata,
} from '../../types/hierarchyTypes';
import {
  findSimilarBlocks,
  findSimilarRounds,
  findDifferentBlocks,
  searchByQuery,
  SimilarityResult,
} from '../../services/firebase/vectorSearchService';
import { useAuth } from '../auth/AuthProvider';
import { FlowScoreBadge, FlowScoreBar } from '../library/FlowScoreIndicator';
import { FreshnessDot } from '../library/FreshnessIndicator';
import { calculateFreshnessFromValues } from '../../services/usageTrackingService';

// ============================================================================
// Types
// ============================================================================

type SearchMode = 'similar' | 'different' | 'query';

interface SimilaritySearchProps {
  blocks: BlockMetadata[];
  rounds: RoundMetadata[];
  selectedBlock?: BlockMetadata;
  selectedRound?: RoundMetadata;
  recentBlockIds?: string[];
  onSelectBlock?: (block: BlockMetadata) => void;
  onSelectRound?: (round: RoundMetadata) => void;
  className?: string;
}

// ============================================================================
// Main Component
// ============================================================================

export function SimilaritySearch({
  blocks,
  rounds,
  selectedBlock,
  selectedRound,
  recentBlockIds = [],
  onSelectBlock,
  onSelectRound,
  className = '',
}: SimilaritySearchProps) {
  const { user } = useAuth();
  const [mode, setMode] = useState<SearchMode>('similar');
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [blockResults, setBlockResults] = useState<SimilarityResult<BlockMetadata>[]>([]);
  const [roundResults, setRoundResults] = useState<SimilarityResult<RoundMetadata>[]>([]);

  const userId = user?.uid || 'anonymous';

  // Search for similar blocks
  const searchSimilarBlocks = useCallback(async () => {
    if (!selectedBlock) return;

    setSearching(true);
    setError(null);

    try {
      const results = await findSimilarBlocks(userId, blocks, selectedBlock, 10);
      setBlockResults(results);
      setRoundResults([]);
    } catch (err: any) {
      setError(err.message || 'Search failed');
    } finally {
      setSearching(false);
    }
  }, [userId, blocks, selectedBlock]);

  // Search for similar rounds
  const searchSimilarRounds = useCallback(async () => {
    if (!selectedRound) return;

    setSearching(true);
    setError(null);

    try {
      const results = await findSimilarRounds(userId, rounds, selectedRound, 10);
      setRoundResults(results);
      setBlockResults([]);
    } catch (err: any) {
      setError(err.message || 'Search failed');
    } finally {
      setSearching(false);
    }
  }, [userId, rounds, selectedRound]);

  // Search for different blocks
  const searchDifferentBlocks = useCallback(async () => {
    setSearching(true);
    setError(null);

    try {
      const results = await findDifferentBlocks(userId, blocks, recentBlockIds, 10);
      setBlockResults(results);
      setRoundResults([]);
    } catch (err: any) {
      setError(err.message || 'Search failed');
    } finally {
      setSearching(false);
    }
  }, [userId, blocks, recentBlockIds]);

  // Search by query
  const searchByText = useCallback(async () => {
    if (!query.trim()) return;

    setSearching(true);
    setError(null);

    try {
      const results = await searchByQuery(userId, blocks, query, 10);
      setBlockResults(results);
      setRoundResults([]);
    } catch (err: any) {
      setError(err.message || 'Search failed');
    } finally {
      setSearching(false);
    }
  }, [userId, blocks, query]);

  // Handle search
  const handleSearch = useCallback(() => {
    switch (mode) {
      case 'similar':
        if (selectedBlock) searchSimilarBlocks();
        else if (selectedRound) searchSimilarRounds();
        break;
      case 'different':
        searchDifferentBlocks();
        break;
      case 'query':
        searchByText();
        break;
    }
  }, [mode, selectedBlock, selectedRound, searchSimilarBlocks, searchSimilarRounds, searchDifferentBlocks, searchByText]);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Mode selector */}
      <div className="flex gap-2">
        <button
          onClick={() => setMode('similar')}
          disabled={!selectedBlock && !selectedRound}
          className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
            mode === 'similar'
              ? 'bg-orange-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50'
          }`}
        >
          More Like This
        </button>
        <button
          onClick={() => setMode('different')}
          className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
            mode === 'different'
              ? 'bg-orange-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Surprise Me
        </button>
        <button
          onClick={() => setMode('query')}
          className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
            mode === 'query'
              ? 'bg-orange-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Semantic Search
        </button>
      </div>

      {/* Search input for query mode */}
      {mode === 'query' && (
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Describe what you're looking for..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
          <button
            onClick={handleSearch}
            disabled={!query.trim() || searching}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
          >
            Search
          </button>
        </div>
      )}

      {/* Context info */}
      {mode === 'similar' && (
        <div className="text-sm text-gray-600">
          {selectedBlock ? (
            <span>Finding blocks similar to: <strong>{selectedBlock.content[0]}</strong></span>
          ) : selectedRound ? (
            <span>Finding rounds similar to: <strong>{selectedRound.duration}min {selectedRound.finisherType || 'round'}</strong></span>
          ) : (
            <span className="text-gray-400">Select a block or round to find similar content</span>
          )}
        </div>
      )}

      {mode === 'different' && (
        <div className="text-sm text-gray-600">
          Finding content different from your recent {recentBlockIds.length} selections
        </div>
      )}

      {/* Search button for non-query modes */}
      {mode !== 'query' && (
        <button
          onClick={handleSearch}
          disabled={searching || (mode === 'similar' && !selectedBlock && !selectedRound)}
          className="w-full py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 transition-colors"
        >
          {searching ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Searching...
            </span>
          ) : mode === 'similar' ? (
            'Find Similar'
          ) : (
            'Find Something Different'
          )}
        </button>
      )}

      {/* Error message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Results */}
      {(blockResults.length > 0 || roundResults.length > 0) && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">
            {blockResults.length > 0 ? `${blockResults.length} Blocks Found` : `${roundResults.length} Rounds Found`}
          </h4>

          {/* Block results */}
          {blockResults.map((result, index) => (
            <BlockResultCard
              key={result.item.id}
              result={result}
              rank={index + 1}
              onSelect={() => onSelectBlock?.(result.item)}
            />
          ))}

          {/* Round results */}
          {roundResults.map((result, index) => (
            <RoundResultCard
              key={result.item.id}
              result={result}
              rank={index + 1}
              onSelect={() => onSelectRound?.(result.item)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Result Cards
// ============================================================================

interface BlockResultCardProps {
  result: SimilarityResult<BlockMetadata>;
  rank: number;
  onSelect?: () => void;
}

function BlockResultCard({ result, rank, onSelect }: BlockResultCardProps) {
  const { item: block, similarity, explanation } = result;
  const freshness = calculateFreshnessFromValues(block.lastUsed, block.useCount);

  return (
    <div
      className="p-3 bg-white border border-gray-200 rounded-lg hover:border-orange-300 cursor-pointer transition-colors"
      onClick={onSelect}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <span className="text-sm font-medium text-gray-400 w-6">#{rank}</span>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-900 truncate">
              {block.content.slice(0, 2).join(' → ')}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {block.length}min • {block.bodyFocus.slice(0, 2).join(', ')}
            </div>
            {explanation && (
              <div className="text-xs text-orange-600 mt-1">
                {explanation}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <FlowScoreBar score={block.flowScore} className="w-12" />
          <FreshnessDot color={freshness.color} title={freshness.label} />
          <SimilarityBadge similarity={similarity} />
        </div>
      </div>
    </div>
  );
}

interface RoundResultCardProps {
  result: SimilarityResult<RoundMetadata>;
  rank: number;
  onSelect?: () => void;
}

function RoundResultCard({ result, rank, onSelect }: RoundResultCardProps) {
  const { item: round, similarity, explanation } = result;
  const freshness = calculateFreshnessFromValues(round.lastUsed, round.useCount);

  return (
    <div
      className="p-3 bg-white border border-gray-200 rounded-lg hover:border-orange-300 cursor-pointer transition-colors"
      onClick={onSelect}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <span className="text-sm font-medium text-gray-400 w-6">#{rank}</span>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-900">
              {round.duration}min Round
              {round.finisherType && ` • ${round.finisherType.replace(/_/g, ' ')} finisher`}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {round.primaryBodyFocus.slice(0, 2).join(', ')} • {round.treadPattern} tread
            </div>
            {explanation && (
              <div className="text-xs text-orange-600 mt-1">
                {explanation}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <FlowScoreBar score={round.flowScore} className="w-12" />
          <FreshnessDot color={freshness.color} title={freshness.label} />
          <SimilarityBadge similarity={similarity} />
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Sub-components
// ============================================================================

interface SimilarityBadgeProps {
  similarity: number;
}

function SimilarityBadge({ similarity }: SimilarityBadgeProps) {
  const percentage = Math.round(similarity * 100);

  let bgColor = 'bg-green-100 text-green-700';
  if (percentage < 40) bgColor = 'bg-red-100 text-red-700';
  else if (percentage < 70) bgColor = 'bg-yellow-100 text-yellow-700';

  return (
    <span className={`text-xs px-2 py-0.5 rounded-full ${bgColor}`}>
      {percentage}%
    </span>
  );
}

// ============================================================================
// Quick Actions Component
// ============================================================================

interface QuickSearchActionsProps {
  block?: BlockMetadata;
  round?: RoundMetadata;
  onFindSimilar?: () => void;
  onFindDifferent?: () => void;
  className?: string;
}

export function QuickSearchActions({
  block,
  round,
  onFindSimilar,
  onFindDifferent,
  className = '',
}: QuickSearchActionsProps) {
  if (!block && !round) return null;

  return (
    <div className={`flex gap-2 ${className}`}>
      <button
        onClick={onFindSimilar}
        className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
      >
        More like this
      </button>
      <button
        onClick={onFindDifferent}
        className="text-xs px-2 py-1 bg-purple-50 text-purple-600 rounded hover:bg-purple-100 transition-colors"
      >
        Something different
      </button>
    </div>
  );
}

export default SimilaritySearch;
