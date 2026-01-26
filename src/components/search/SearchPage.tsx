// ============================================================================
// Search Page
// Combines natural language query and similarity search
// ============================================================================

import React, { useState, useCallback, useEffect } from 'react';
import {
  BlockMetadata,
  RoundMetadata,
  ClassMetadata,
  SearchConstraints,
} from '../../types/hierarchyTypes';
import { QueryInput } from '../generator/QueryInput';
import { QueryResults, SearchResult } from '../generator/QueryResults';
import { SimilaritySearch } from './SimilaritySearch';
import { interpretQuery } from '../../services/queryParserService';
import {
  searchBlocks,
  searchRounds,
  searchClasses,
} from '../../services/searchService';
import { loadIndexFromStorage } from '../../services/indexingService';

// ============================================================================
// Types
// ============================================================================

type SearchTab = 'query' | 'similarity';

// ============================================================================
// Main Component
// ============================================================================

export function SearchPage() {
  const [activeTab, setActiveTab] = useState<SearchTab>('query');
  const [constraints, setConstraints] = useState<SearchConstraints | null>(null);
  const [interpretation, setInterpretation] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load data from storage
  const [blocks, setBlocks] = useState<BlockMetadata[]>([]);
  const [rounds, setRounds] = useState<RoundMetadata[]>([]);
  const [classes, setClasses] = useState<ClassMetadata[]>([]);
  const [selectedBlock, setSelectedBlock] = useState<BlockMetadata | undefined>();

  useEffect(() => {
    const index = loadIndexFromStorage();
    if (index) {
      setBlocks(index.floorBlocks || []);
      setRounds(index.rounds || []);
      setClasses(index.classes || []);
    }
  }, []);

  // Handle search
  const handleSearch = useCallback((searchConstraints: SearchConstraints) => {
    setConstraints(searchConstraints);
    setInterpretation(interpretQuery(searchConstraints));
    setLoading(true);
    setError(null);

    try {
      const searchResults: SearchResult[] = [];

      // Search blocks
      const blockResults = searchBlocks(searchConstraints);
      blockResults.forEach((result) => {
        const matchReasons: string[] = [];
        if (searchConstraints.bodyFocus?.length) {
          matchReasons.push(`Body: ${searchConstraints.bodyFocus.join(', ')}`);
        }
        if (searchConstraints.structure?.length) {
          matchReasons.push(`Structure: ${searchConstraints.structure.join(', ')}`);
        }
        if (searchConstraints.minFlowScore) {
          matchReasons.push(`Flow ≥ ${searchConstraints.minFlowScore}`);
        }

        searchResults.push({
          type: 'block',
          item: result.item,
          score: result.score,
          matchReasons: matchReasons.length > 0 ? matchReasons : result.matchedFields,
        });
      });

      // Search rounds
      const roundResults = searchRounds(searchConstraints);
      roundResults.forEach((result) => {
        const matchReasons: string[] = [];
        if (searchConstraints.duration) {
          matchReasons.push(`Duration: ${searchConstraints.duration.min || searchConstraints.duration.max} min`);
        }
        if (searchConstraints.finisherType?.length) {
          matchReasons.push(`Finisher: ${searchConstraints.finisherType.join(', ')}`);
        }
        if (searchConstraints.movementPatterns?.length) {
          matchReasons.push(`Movements: ${searchConstraints.movementPatterns.join(', ')}`);
        }

        searchResults.push({
          type: 'round',
          item: result.item,
          score: result.score,
          matchReasons: matchReasons.length > 0 ? matchReasons : result.matchedFields,
        });
      });

      // Search classes
      const classResults = searchClasses(searchConstraints);
      classResults.forEach((result) => {
        searchResults.push({
          type: 'class',
          item: result.item,
          score: result.score,
          matchReasons: result.matchedFields,
        });
      });

      // Sort by score
      searchResults.sort((a, b) => b.score - a.score);

      setResults(searchResults.slice(0, 20));
    } catch (err: any) {
      setError(err.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSelectBlock = useCallback((block: BlockMetadata) => {
    setSelectedBlock(block);
    setActiveTab('similarity');
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Search</h2>

        {/* Tab Toggle */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('query')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'query'
                ? 'bg-orange-100 text-orange-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Natural Language
          </button>
          <button
            onClick={() => setActiveTab('similarity')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'similarity'
                ? 'bg-orange-100 text-orange-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Similarity Search
          </button>
        </div>

        {activeTab === 'query' ? (
          <div className="space-y-4">
            <QueryInput
              onSearch={handleSearch}
              placeholder="e.g., 10 min push/pull with burpees, something fresh"
            />

            {blocks.length === 0 && rounds.length === 0 ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-700 text-sm">
                  No data imported yet. Go to the <strong>Import</strong> tab to import class data from a spreadsheet.
                </p>
              </div>
            ) : (
              <QueryResults
                results={results}
                loading={loading}
                error={error}
                query={constraints?.textQuery}
                interpretation={interpretation}
                onSelectBlock={handleSelectBlock}
                emptyMessage={constraints ? 'No results match your query. Try different terms.' : 'Enter a search query above to find blocks, rounds, or classes.'}
              />
            )}
          </div>
        ) : (
          <SimilaritySearch
            blocks={blocks}
            rounds={rounds}
            selectedBlock={selectedBlock}
            onSelectBlock={setSelectedBlock}
          />
        )}
      </div>

      {/* Help Section */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-medium text-gray-900 mb-2">Search Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <p className="font-medium text-gray-700 mb-1">Duration & Structure</p>
            <ul className="list-disc list-inside space-y-1">
              <li>"10 min" - rounds of specific length</li>
              <li>"3 min blocks" - block length</li>
              <li>"complexes" or "ladders"</li>
            </ul>
          </div>
          <div>
            <p className="font-medium text-gray-700 mb-1">Body Focus & Movement</p>
            <ul className="list-disc list-inside space-y-1">
              <li>"chest back" or "arms abs"</li>
              <li>"push pull" or "hinge"</li>
              <li>"upper body" or "lower body"</li>
            </ul>
          </div>
          <div>
            <p className="font-medium text-gray-700 mb-1">Finishers</p>
            <ul className="list-disc list-inside space-y-1">
              <li>"ends with burpees"</li>
              <li>"snatch finisher"</li>
              <li>"amrap finish"</li>
            </ul>
          </div>
          <div>
            <p className="font-medium text-gray-700 mb-1">Freshness</p>
            <ul className="list-disc list-inside space-y-1">
              <li>"something fresh"</li>
              <li>"not used recently"</li>
              <li>"exclude recent"</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
