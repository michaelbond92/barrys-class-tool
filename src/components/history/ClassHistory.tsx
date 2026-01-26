// ============================================================================
// Class History
// Browse imported classes by date, view full workouts, track usage
// ============================================================================

import React, { useState, useEffect, useMemo } from 'react';
import {
  ClassMetadata,
  RoundMetadata,
  BlockMetadata,
  WorkoutType,
  WORKOUT_TYPE_LABELS,
} from '../../types/hierarchyTypes';
import { loadIndexFromStorage } from '../../services/indexingService';
import { FlowScoreBadge } from '../library/FlowScoreIndicator';
import { FreshnessDot } from '../library/FreshnessIndicator';
import { calculateFreshnessFromValues } from '../../services/usageTrackingService';
import { PositionChip } from '../library/PositionSelector';

// ============================================================================
// Types
// ============================================================================

type ViewMode = 'calendar' | 'list';
type DetailView = 'overview' | 'round1' | 'round2';

interface ClassHistoryProps {
  onSelectBlock?: (block: BlockMetadata) => void;
  onSelectRound?: (round: RoundMetadata) => void;
}

// ============================================================================
// Helper Functions
// ============================================================================

function getFlowRating(score: number): 'great' | 'good' | 'fair' | 'poor' {
  if (score >= 80) return 'great';
  if (score >= 60) return 'good';
  if (score >= 40) return 'fair';
  return 'poor';
}

function formatDate(dateStr: string, includeWeekday = true): string {
  // Parse as local date to avoid timezone issues
  // Input is ISO format like "2025-01-17"
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day); // month is 0-indexed

  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  };

  if (includeWeekday) {
    options.weekday = 'short';
  }

  return date.toLocaleDateString('en-US', options);
}

function groupByMonth(classes: ClassMetadata[]): Map<string, ClassMetadata[]> {
  const grouped = new Map<string, ClassMetadata[]>();

  for (const cls of classes) {
    const date = new Date(cls.date);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const existing = grouped.get(key) || [];
    existing.push(cls);
    grouped.set(key, existing);
  }

  return grouped;
}

// ============================================================================
// Sub-Components
// ============================================================================

function RoundDetail({
  round,
  blocks,
  roundNumber,
  onSelectBlock,
}: {
  round: RoundMetadata;
  blocks: BlockMetadata[];
  roundNumber: 1 | 2;
  onSelectBlock?: (block: BlockMetadata) => void;
}) {
  const roundBlocks = blocks.filter(b =>
    b.sourceClassId === round.sourceClassId && b.sourceRoundNumber === roundNumber
  );

  return (
    <div className="space-y-4">
      {/* Round Header */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium text-gray-900">Round {roundNumber}</h4>
          <p className="text-sm text-gray-500">
            {round.duration} min • {round.equipment?.primary?.type || 'N/A'}
            {round.equipment?.primary?.count === 2 ? ' x2' : ''}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {round.flowScore !== undefined && (
            <FlowScoreBadge score={round.flowScore} rating={getFlowRating(round.flowScore)} />
          )}
          {round.finisherType && (
            <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-medium">
              {round.finisherType.replace(/_/g, ' ')}
            </span>
          )}
        </div>
      </div>

      {/* Tread Section */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h5 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Tread
        </h5>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-blue-600">Pattern:</span>{' '}
            <span className="text-blue-900">{round.treadPattern || 'N/A'}</span>
          </div>
          <div>
            <span className="text-blue-600">Avg Speed:</span>{' '}
            <span className="text-blue-900">{round.treadAverage?.toFixed(1) || 'N/A'}</span>
          </div>
          <div>
            <span className="text-blue-600">Sprints:</span>{' '}
            <span className="text-blue-900">{round.sprintCount || 0}</span>
          </div>
          <div>
            <span className="text-blue-600">Recovers:</span>{' '}
            <span className="text-blue-900">{round.recoverCount || 0}</span>
          </div>
        </div>
      </div>

      {/* Floor Section */}
      <div className="bg-green-50 rounded-lg p-4">
        <h5 className="font-medium text-green-900 mb-2 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          Floor
        </h5>

        {/* Body Focus & Movements */}
        <div className="flex flex-wrap gap-1 mb-3">
          {round.primaryBodyFocus?.map((focus, idx) => (
            <span key={idx} className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs">
              {focus}
            </span>
          ))}
          {round.movementPatterns?.map((pattern, idx) => (
            <span key={idx} className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">
              {pattern}
            </span>
          ))}
        </div>

        {/* Blocks */}
        <div className="space-y-2">
          {roundBlocks.map((block, idx) => (
            <div
              key={block.id}
              className={`bg-white rounded-lg p-3 border border-green-200 ${onSelectBlock ? 'cursor-pointer hover:border-green-400' : ''}`}
              onClick={() => onSelectBlock?.(block)}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-500">
                  Block {idx + 1} • {block.length} min • {block.category}
                </span>
                <div className="flex items-center gap-1">
                  {block.flowScore !== undefined && (
                    <FlowScoreBadge score={block.flowScore} rating={getFlowRating(block.flowScore)} className="text-xs" />
                  )}
                </div>
              </div>
              <div className="space-y-1">
                {block.content.map((line, lineIdx) => (
                  <p key={lineIdx} className="text-sm text-gray-700">{line}</p>
                ))}
              </div>
              {block.positions && block.positions.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {block.positions.slice(0, 4).map((pos, posIdx) => (
                    <PositionChip key={posIdx} position={pos} size="sm" />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ClassCard({
  cls,
  isSelected,
  onClick,
}: {
  cls: ClassMetadata;
  isSelected: boolean;
  onClick: () => void;
}) {
  const freshness = calculateFreshnessFromValues(cls.lastUsed, cls.useCount);

  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-lg border cursor-pointer transition-all ${
        isSelected
          ? 'border-orange-500 bg-orange-50 ring-2 ring-orange-200'
          : 'border-gray-200 bg-white hover:border-orange-300'
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="font-medium text-gray-900">
            {cls.dayOfWeek}, {formatDate(cls.date, false)}
          </p>
          {cls.workoutType && (
            <p className="text-xs text-orange-600 font-medium">
              {WORKOUT_TYPE_LABELS[cls.workoutType]}
            </p>
          )}
        </div>
        <FreshnessDot color={freshness.color} title={freshness.label} />
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
        <div>R1: {cls.round1.duration}min</div>
        <div>R2: {cls.round2.duration}min</div>
      </div>

      {cls.classNumber && (
        <p className="text-xs text-gray-400 mt-2">Class #{cls.classNumber}</p>
      )}
    </div>
  );
}

// ============================================================================
// Search Component
// ============================================================================

function ExerciseSearch({
  blocks,
  classes,
}: {
  blocks: BlockMetadata[];
  classes: ClassMetadata[];
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<{
    exercise: string;
    occurrences: { classDate: string; blockId: string; dayOfWeek: string }[];
  }[]>([]);

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    const term = searchTerm.toLowerCase();
    const exerciseMap = new Map<string, { classDate: string; blockId: string; dayOfWeek: string }[]>();

    for (const block of blocks) {
      const cls = classes.find(c => c.id === block.sourceClassId);
      if (!cls) continue;

      for (const line of block.content) {
        if (line.toLowerCase().includes(term)) {
          const key = line;
          const occurrences = exerciseMap.get(key) || [];
          occurrences.push({
            classDate: cls.date,
            blockId: block.id,
            dayOfWeek: cls.dayOfWeek,
          });
          exerciseMap.set(key, occurrences);
        }
      }
    }

    // Sort by most recent
    const sortedResults = Array.from(exerciseMap.entries())
      .map(([exercise, occurrences]) => ({
        exercise,
        occurrences: occurrences.sort((a, b) =>
          new Date(b.classDate).getTime() - new Date(a.classDate).getTime()
        ),
      }))
      .sort((a, b) => {
        const aLatest = new Date(a.occurrences[0]?.classDate || 0).getTime();
        const bLatest = new Date(b.occurrences[0]?.classDate || 0).getTime();
        return bLatest - aLatest;
      });

    setResults(sortedResults.slice(0, 20));
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Search for an exercise (e.g., 'chest press', 'snatch')"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          Search
        </button>
      </div>

      {results.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm text-gray-500">Found {results.length} matching exercise(s)</p>
          {results.map((result, idx) => (
            <div key={idx} className="bg-white rounded-lg border border-gray-200 p-4">
              <p className="font-medium text-gray-900 mb-2">{result.exercise}</p>
              <div className="space-y-1">
                {result.occurrences.slice(0, 5).map((occ, occIdx) => (
                  <p key={occIdx} className="text-sm text-gray-600">
                    <span className="text-orange-600">
                      {occ.dayOfWeek}, {formatDate(occ.classDate, false)}
                    </span>
                    {occIdx === 0 && (
                      <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                        Most recent
                      </span>
                    )}
                  </p>
                ))}
                {result.occurrences.length > 5 && (
                  <p className="text-xs text-gray-400">
                    ...and {result.occurrences.length - 5} more occurrences
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {searchTerm && results.length === 0 && (
        <p className="text-gray-500 text-center py-4">No exercises found matching "{searchTerm}"</p>
      )}
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function ClassHistory({ onSelectBlock, onSelectRound }: ClassHistoryProps) {
  const [classes, setClasses] = useState<ClassMetadata[]>([]);
  const [blocks, setBlocks] = useState<BlockMetadata[]>([]);
  const [selectedClass, setSelectedClass] = useState<ClassMetadata | null>(null);
  const [detailView, setDetailView] = useState<DetailView>('overview');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [showSearch, setShowSearch] = useState(false);
  const [loading, setLoading] = useState(true);
  const [workoutTypeFilter, setWorkoutTypeFilter] = useState<WorkoutType | 'all'>('all');

  useEffect(() => {
    const index = loadIndexFromStorage();
    if (index) {
      // Sort classes by date (most recent first)
      const sortedClasses = (index.classes || []).sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setClasses(sortedClasses);
      setBlocks(index.floorBlocks || []);
    }
    setLoading(false);
  }, []);

  // Filter classes by workout type
  const filteredClasses = useMemo(() => {
    if (workoutTypeFilter === 'all') return classes;
    return classes.filter(cls => cls.workoutType === workoutTypeFilter);
  }, [classes, workoutTypeFilter]);

  const groupedClasses = useMemo(() => groupByMonth(filteredClasses), [filteredClasses]);

  // Get unique workout types from data
  const availableWorkoutTypes = useMemo(() => {
    const types = new Set(classes.map(cls => cls.workoutType).filter(Boolean));
    return Array.from(types) as WorkoutType[];
  }, [classes]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
      </div>
    );
  }

  if (classes.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Class History</h3>
        <p className="text-gray-500">
          Import class data from a spreadsheet to view your workout history.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Class History</h2>
            <p className="text-sm text-gray-500">
              {filteredClasses.length} of {classes.length} classes
              {workoutTypeFilter !== 'all' && ` (${WORKOUT_TYPE_LABELS[workoutTypeFilter]})`}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {/* Workout Type Filter */}
            <select
              value={workoutTypeFilter}
              onChange={(e) => setWorkoutTypeFilter(e.target.value as WorkoutType | 'all')}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="all">All Workout Types</option>
              {availableWorkoutTypes.map(type => (
                <option key={type} value={type}>{WORKOUT_TYPE_LABELS[type]}</option>
              ))}
            </select>

            <button
              onClick={() => setShowSearch(!showSearch)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                showSearch
                  ? 'bg-orange-100 text-orange-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                When did I last...
              </span>
            </button>
          </div>
        </div>

        {/* Exercise Search */}
        {showSearch && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <ExerciseSearch blocks={blocks} classes={classes} />
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Class List */}
        <div className="lg:col-span-1 space-y-4">
          {Array.from(groupedClasses.entries()).map(([monthKey, monthClasses]) => {
            const [year, month] = monthKey.split('-');
            const monthName = new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('en-US', {
              month: 'long',
              year: 'numeric',
            });

            return (
              <div key={monthKey}>
                <h3 className="text-sm font-medium text-gray-500 mb-2">{monthName}</h3>
                <div className="space-y-2">
                  {monthClasses.map((cls) => (
                    <ClassCard
                      key={cls.id}
                      cls={cls}
                      isSelected={selectedClass?.id === cls.id}
                      onClick={() => {
                        setSelectedClass(cls);
                        setDetailView('overview');
                      }}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Class Detail */}
        <div className="lg:col-span-2">
          {selectedClass ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {/* Detail Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {selectedClass.dayOfWeek}, {formatDate(selectedClass.date, false)}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {selectedClass.workoutType && (
                      <span className="text-orange-600 font-medium">
                        {WORKOUT_TYPE_LABELS[selectedClass.workoutType]} •
                      </span>
                    )}
                    {' '}{selectedClass.totalDuration} min total
                    {selectedClass.classNumber && ` • Class #${selectedClass.classNumber}`}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setDetailView('overview')}
                    className={`px-3 py-1 rounded text-sm font-medium ${
                      detailView === 'overview'
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setDetailView('round1')}
                    className={`px-3 py-1 rounded text-sm font-medium ${
                      detailView === 'round1'
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Round 1
                  </button>
                  <button
                    onClick={() => setDetailView('round2')}
                    className={`px-3 py-1 rounded text-sm font-medium ${
                      detailView === 'round2'
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Round 2
                  </button>
                </div>
              </div>

              {/* Detail Content */}
              {detailView === 'overview' ? (
                <div className="space-y-6">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold text-gray-900">
                        {selectedClass.overallTreadAverage?.toFixed(1) || 'N/A'}
                      </p>
                      <p className="text-xs text-gray-500">Tread Avg</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold text-gray-900">
                        {selectedClass.totalSprintCount || 0}
                      </p>
                      <p className="text-xs text-gray-500">Sprints</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold text-gray-900">
                        {selectedClass.round1.duration}
                      </p>
                      <p className="text-xs text-gray-500">R1 Duration</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold text-gray-900">
                        {selectedClass.round2.duration}
                      </p>
                      <p className="text-xs text-gray-500">R2 Duration</p>
                    </div>
                  </div>

                  {/* Quick Round Summaries */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div
                      className="bg-blue-50 rounded-lg p-4 cursor-pointer hover:bg-blue-100 transition-colors"
                      onClick={() => setDetailView('round1')}
                    >
                      <h4 className="font-medium text-blue-900 mb-2">Round 1</h4>
                      <p className="text-sm text-blue-700">
                        {selectedClass.round1.duration} min • {selectedClass.round1.equipment?.primary?.type || 'N/A'}
                      </p>
                      {selectedClass.round1.finisherType && (
                        <p className="text-xs text-blue-600 mt-1">
                          Finisher: {selectedClass.round1.finisherType.replace(/_/g, ' ')}
                        </p>
                      )}
                    </div>
                    <div
                      className="bg-green-50 rounded-lg p-4 cursor-pointer hover:bg-green-100 transition-colors"
                      onClick={() => setDetailView('round2')}
                    >
                      <h4 className="font-medium text-green-900 mb-2">Round 2</h4>
                      <p className="text-sm text-green-700">
                        {selectedClass.round2.duration} min • {selectedClass.round2.equipment?.primary?.type || 'N/A'}
                      </p>
                      {selectedClass.round2.finisherType && (
                        <p className="text-xs text-green-600 mt-1">
                          Finisher: {selectedClass.round2.finisherType.replace(/_/g, ' ')}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Body Focus Distribution */}
                  {selectedClass.bodyFocusDistribution && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Body Focus</h4>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(selectedClass.bodyFocusDistribution)
                          .filter(([_, count]) => count > 0)
                          .sort((a, b) => b[1] - a[1])
                          .map(([focus, count]) => (
                            <span
                              key={focus}
                              className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                            >
                              {focus}: {count}
                            </span>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : detailView === 'round1' ? (
                <RoundDetail
                  round={selectedClass.round1}
                  blocks={blocks}
                  roundNumber={1}
                  onSelectBlock={onSelectBlock}
                />
              ) : (
                <RoundDetail
                  round={selectedClass.round2}
                  blocks={blocks}
                  roundNumber={2}
                  onSelectBlock={onSelectBlock}
                />
              )}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-8 text-center h-full flex items-center justify-center">
              <div>
                <svg className="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-gray-500">Select a class to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
