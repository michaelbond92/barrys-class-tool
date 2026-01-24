// ============================================================================
// Library Component
// Hierarchical view of Rounds → Blocks → Exercises
// Three view modes: Unified | Tree | Tabs
// ============================================================================

import React, { useState, useMemo } from 'react';
import { loadIndexFromStorage } from '../../services/indexingService';
import { hasImportedData, getImportedBlockCounts } from '../../data/exerciseBlocks';
import { getCustomBlockCounts } from '../../services/customBlocksService';
import { UnifiedView } from './UnifiedView';
import { TreeView } from './TreeView';
import { TabsView } from './TabsView';
import { WorkoutType, WORKOUT_TYPE_LABELS, BodyFocus, RoundMetadata, BlockMetadata, TreadBlockMetadata, ClassMetadata } from '../../types/hierarchyTypes';

// ============================================================================
// Types
// ============================================================================

export type ViewMode = 'unified' | 'tree' | 'tabs';

export interface LibraryFilters {
  workoutType: WorkoutType | 'all';
  roundNumber: 1 | 2 | 'all';
  bodyFocus: BodyFocus | 'all';
  minFlowScore: number;
  searchQuery: string;
}

export interface LibraryData {
  classes: ClassMetadata[];
  rounds: RoundMetadata[];
  floorBlocks: BlockMetadata[];
  treadBlocks: TreadBlockMetadata[];
}

// ============================================================================
// Component
// ============================================================================

export function Library() {
  const [viewMode, setViewMode] = useState<ViewMode>('unified');
  const [filters, setFilters] = useState<LibraryFilters>({
    workoutType: 'all',
    roundNumber: 'all',
    bodyFocus: 'all',
    minFlowScore: 0,
    searchQuery: '',
  });

  // Load data from storage
  const data = useMemo<LibraryData | null>(() => {
    return loadIndexFromStorage();
  }, []);

  const hasData = hasImportedData();
  const importedCounts = useMemo(() => getImportedBlockCounts(), []);
  const customCounts = useMemo(() => getCustomBlockCounts(), []);

  // Apply filters to data
  const filteredData = useMemo<LibraryData | null>(() => {
    if (!data) return null;

    let filteredClasses = data.classes;
    let filteredRounds = data.rounds;
    let filteredFloorBlocks = data.floorBlocks;
    let filteredTreadBlocks = data.treadBlocks;

    // Filter by workout type
    if (filters.workoutType !== 'all') {
      filteredClasses = filteredClasses.filter(c => c.workoutType === filters.workoutType);
      const classIds = new Set(filteredClasses.map(c => c.id));
      filteredRounds = filteredRounds.filter(r => classIds.has(r.sourceClassId));
      filteredFloorBlocks = filteredFloorBlocks.filter(b => classIds.has(b.sourceClassId));
      filteredTreadBlocks = filteredTreadBlocks.filter(b => classIds.has(b.sourceClassId));
    }

    // Filter by round number
    if (filters.roundNumber !== 'all') {
      filteredRounds = filteredRounds.filter(r => r.roundNumber === filters.roundNumber);
      filteredFloorBlocks = filteredFloorBlocks.filter(b => b.sourceRoundNumber === filters.roundNumber);
      filteredTreadBlocks = filteredTreadBlocks.filter(b => b.sourceRoundNumber === filters.roundNumber);
    }

    // Filter by body focus
    if (filters.bodyFocus !== 'all') {
      filteredFloorBlocks = filteredFloorBlocks.filter(b =>
        b.bodyFocus.includes(filters.bodyFocus as BodyFocus)
      );
      filteredRounds = filteredRounds.filter(r =>
        r.primaryBodyFocus.includes(filters.bodyFocus as BodyFocus)
      );
    }

    // Filter by flow score
    if (filters.minFlowScore > 0) {
      filteredFloorBlocks = filteredFloorBlocks.filter(b => b.flowScore >= filters.minFlowScore);
      filteredRounds = filteredRounds.filter(r => r.flowScore >= filters.minFlowScore);
    }

    // Filter by search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filteredFloorBlocks = filteredFloorBlocks.filter(b =>
        b.content.some(c => c.toLowerCase().includes(query)) ||
        b.bodyFocus.some(f => f.includes(query)) ||
        b.movementPatterns.some(p => p.includes(query))
      );
      filteredTreadBlocks = filteredTreadBlocks.filter(b =>
        b.content.some(c => c.toLowerCase().includes(query))
      );
    }

    return {
      classes: filteredClasses,
      rounds: filteredRounds,
      floorBlocks: filteredFloorBlocks,
      treadBlocks: filteredTreadBlocks,
    };
  }, [data, filters]);

  // Handle filter changes
  const updateFilter = <K extends keyof LibraryFilters>(key: K, value: LibraryFilters[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      workoutType: 'all',
      roundNumber: 'all',
      bodyFocus: 'all',
      minFlowScore: 0,
      searchQuery: '',
    });
  };

  const hasActiveFilters = filters.workoutType !== 'all' ||
    filters.roundNumber !== 'all' ||
    filters.bodyFocus !== 'all' ||
    filters.minFlowScore > 0 ||
    filters.searchQuery.length > 0;

  // Total counts
  const totalFloorBlocks = importedCounts.floorWarmups + importedCounts.floorWorkouts +
    customCounts.floorWarmups + customCounts.floorWorkouts;
  const totalTreadBlocks = importedCounts.treadWarmups + importedCounts.treadWorkouts +
    customCounts.treadWarmups + customCounts.treadWorkouts;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Library</h1>
        <p className="text-gray-600 mt-2">
          Browse classes, rounds, and blocks from your imported data
        </p>
      </div>

      {/* Empty state */}
      {!hasData && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
          <div className="text-4xl mb-4">📊</div>
          <h3 className="text-lg font-semibold text-blue-900 mb-2">No Data Available</h3>
          <p className="text-blue-700 mb-4">
            Import a class spreadsheet to populate your library.
          </p>
          <p className="text-sm text-blue-600">
            Go to the <span className="font-semibold">Import</span> tab to upload your class data.
          </p>
        </div>
      )}

      {hasData && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-indigo-700">{data?.classes.length || 0}</div>
              <div className="text-sm text-indigo-600">Classes</div>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-emerald-700">{data?.rounds.length || 0}</div>
              <div className="text-sm text-emerald-600">Rounds</div>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-orange-700">{totalFloorBlocks}</div>
              <div className="text-sm text-orange-600">Floor Blocks</div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-700">{totalTreadBlocks}</div>
              <div className="text-sm text-blue-600">Tread Blocks</div>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex justify-center gap-2">
            <button
              onClick={() => setViewMode('unified')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === 'unified'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Unified
            </button>
            <button
              onClick={() => setViewMode('tree')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === 'tree'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tree
            </button>
            <button
              onClick={() => setViewMode('tabs')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === 'tabs'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tabs
            </button>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex flex-wrap gap-4 items-center">
              {/* Search */}
              <div className="flex-1 min-w-48">
                <input
                  type="text"
                  placeholder="Search blocks..."
                  value={filters.searchQuery}
                  onChange={(e) => updateFilter('searchQuery', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              {/* Workout Type */}
              <select
                value={filters.workoutType}
                onChange={(e) => updateFilter('workoutType', e.target.value as WorkoutType | 'all')}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                <option value="all">All Types</option>
                {Object.entries(WORKOUT_TYPE_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>

              {/* Round Number */}
              <select
                value={filters.roundNumber}
                onChange={(e) => updateFilter('roundNumber', e.target.value === 'all' ? 'all' : Number(e.target.value) as 1 | 2)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                <option value="all">All Rounds</option>
                <option value="1">Round 1</option>
                <option value="2">Round 2</option>
              </select>

              {/* Body Focus */}
              <select
                value={filters.bodyFocus}
                onChange={(e) => updateFilter('bodyFocus', e.target.value as BodyFocus | 'all')}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                <option value="all">All Focus</option>
                <option value="upper">Upper</option>
                <option value="lower">Lower</option>
                <option value="core">Core</option>
                <option value="chest">Chest</option>
                <option value="back">Back</option>
                <option value="shoulders">Shoulders</option>
                <option value="arms">Arms</option>
                <option value="full_body">Full Body</option>
              </select>

              {/* Flow Score */}
              <select
                value={filters.minFlowScore}
                onChange={(e) => updateFilter('minFlowScore', Number(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                <option value="0">Any Flow</option>
                <option value="50">Fair+ (50+)</option>
                <option value="70">Good+ (70+)</option>
                <option value="85">Great (85+)</option>
              </select>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>

          {/* Results Count */}
          {filteredData && (
            <div className="text-gray-600 text-sm">
              Showing: {filteredData.classes.length} classes,{' '}
              {filteredData.rounds.length} rounds,{' '}
              {filteredData.floorBlocks.length} floor blocks,{' '}
              {filteredData.treadBlocks.length} tread blocks
            </div>
          )}

          {/* Content based on view mode */}
          {filteredData && (
            <>
              {viewMode === 'unified' && <UnifiedView data={filteredData} />}
              {viewMode === 'tree' && <TreeView data={filteredData} />}
              {viewMode === 'tabs' && <TabsView data={filteredData} />}
            </>
          )}
        </>
      )}
    </div>
  );
}
