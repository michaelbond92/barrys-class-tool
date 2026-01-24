// ============================================================================
// Analytics Dashboard
// Shows usage patterns, muscle group distribution, and finisher trends
// ============================================================================

import React, { useMemo, useState } from 'react';
import {
  ClassMetadata,
  RoundMetadata,
  BlockMetadata,
  ExerciseMetadata,
  FinisherType,
  MuscleGroup,
  MovementPattern,
  ExercisePosition,
  FreshnessScore,
} from '../../types/hierarchyTypes';
import { FreshnessIndicator } from '../library/FreshnessIndicator';
import { calculateFreshnessFromValues } from '../../services/usageTrackingService';

// ============================================================================
// Types
// ============================================================================

interface AnalyticsDashboardProps {
  classes: ClassMetadata[];
  rounds: RoundMetadata[];
  blocks: BlockMetadata[];
  exercises: ExerciseMetadata[];
  dateRange?: { start: Date; end: Date };
}

interface UsageCount {
  id: string;
  name: string;
  count: number;
  freshness?: FreshnessScore;
}

interface DistributionItem {
  label: string;
  value: number;
  percentage: number;
  color: string;
}

// ============================================================================
// Color Maps
// ============================================================================

const FINISHER_COLORS: Record<FinisherType, string> = {
  snatches: '#ef4444',
  burpees: '#f97316',
  weighted_burpees: '#eab308',
  squat_to_hi_pull: '#22c55e',
  deadlift_clean_squat: '#14b8a6',
  db_swings: '#3b82f6',
  amrap: '#8b5cf6',
  choice: '#ec4899',
};

const MUSCLE_COLORS: Record<MuscleGroup, string> = {
  chest: '#ef4444',
  back: '#3b82f6',
  shoulders: '#8b5cf6',
  biceps: '#ec4899',
  triceps: '#f97316',
  core: '#22c55e',
  obliques: '#14b8a6',
  quads: '#eab308',
  hamstrings: '#84cc16',
  glutes: '#6366f1',
  calves: '#78716c',
  full_body: '#64748b',
};

const MOVEMENT_COLORS: Record<MovementPattern, string> = {
  push: '#ef4444',
  pull: '#3b82f6',
  hinge: '#22c55e',
  squat: '#eab308',
  lunge: '#8b5cf6',
  rotation: '#ec4899',
  carry: '#f97316',
  plank: '#14b8a6',
  power: '#6366f1',
};

const POSITION_COLORS: Record<ExercisePosition, string> = {
  floor_standing: '#3b82f6',
  floor_laying: '#22c55e',
  bench_laying: '#ef4444',
  bench_sitting: '#8b5cf6',
  bench_front: '#eab308',
  bench_back: '#ec4899',
  bench_straddling: '#14b8a6',
  bench_standing: '#f97316',
};

// ============================================================================
// Helper Functions
// ============================================================================

function countFinishers(rounds: RoundMetadata[]): Map<FinisherType, number> {
  const counts = new Map<FinisherType, number>();

  for (const round of rounds) {
    if (round.finisherType) {
      counts.set(round.finisherType, (counts.get(round.finisherType) || 0) + 1);
    }
  }

  return counts;
}

function countMuscleGroups(exercises: ExerciseMetadata[]): Map<MuscleGroup, number> {
  const counts = new Map<MuscleGroup, number>();

  for (const exercise of exercises) {
    counts.set(exercise.primaryMuscle, (counts.get(exercise.primaryMuscle) || 0) + 1);
    for (const muscle of exercise.secondaryMuscles) {
      counts.set(muscle, (counts.get(muscle) || 0) + 0.5); // Weight secondary less
    }
  }

  return counts;
}

function countMovementPatterns(exercises: ExerciseMetadata[]): Map<MovementPattern, number> {
  const counts = new Map<MovementPattern, number>();

  for (const exercise of exercises) {
    counts.set(exercise.movementPattern, (counts.get(exercise.movementPattern) || 0) + 1);
  }

  return counts;
}

function countPositions(exercises: ExerciseMetadata[]): Map<ExercisePosition, number> {
  const counts = new Map<ExercisePosition, number>();

  for (const exercise of exercises) {
    counts.set(exercise.primaryPosition, (counts.get(exercise.primaryPosition) || 0) + 1);
  }

  return counts;
}

function getTopExercises(exercises: ExerciseMetadata[], limit: number = 10): UsageCount[] {
  const counts = new Map<string, { count: number; lastUsed?: string }>();

  for (const exercise of exercises) {
    const existing = counts.get(exercise.rawText) || { count: 0 };
    counts.set(exercise.rawText, {
      count: existing.count + 1,
      lastUsed: exercise.lastUsed
        ? (existing.lastUsed && existing.lastUsed > exercise.lastUsed ? existing.lastUsed : exercise.lastUsed)
        : existing.lastUsed,
    });
  }

  return Array.from(counts.entries())
    .map(([name, data]) => ({
      id: name,
      name,
      count: data.count,
      freshness: calculateFreshnessFromValues(data.lastUsed || null, data.count),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

function getTopBlocks(blocks: BlockMetadata[], limit: number = 10): UsageCount[] {
  return blocks
    .filter(b => b.useCount > 0)
    .map(b => ({
      id: b.id,
      name: b.content.slice(0, 2).join(' / '),
      count: b.useCount,
      freshness: calculateFreshnessFromValues(b.lastUsed, b.useCount),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

function mapToDistribution<T extends string>(
  counts: Map<T, number>,
  colors: Record<T, string>,
  labels?: Record<T, string>
): DistributionItem[] {
  const total = Array.from(counts.values()).reduce((a, b) => a + b, 0);
  if (total === 0) return [];

  return Array.from(counts.entries())
    .map(([key, value]) => ({
      label: labels?.[key] || key.replace(/_/g, ' '),
      value,
      percentage: (value / total) * 100,
      color: colors[key] || '#64748b',
    }))
    .sort((a, b) => b.value - a.value);
}

// ============================================================================
// Sub-Components
// ============================================================================

interface PieChartProps {
  data: DistributionItem[];
  title: string;
  size?: number;
}

function PieChart({ data, title, size = 200 }: PieChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Calculate pie segments
  const segments = useMemo(() => {
    let currentAngle = -90; // Start at top
    return data.map((item, index) => {
      const angle = (item.percentage / 100) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;
      currentAngle = endAngle;

      // Calculate path for pie segment
      const startRad = (startAngle * Math.PI) / 180;
      const endRad = (endAngle * Math.PI) / 180;
      const radius = size / 2 - 10;
      const centerX = size / 2;
      const centerY = size / 2;

      const x1 = centerX + radius * Math.cos(startRad);
      const y1 = centerY + radius * Math.sin(startRad);
      const x2 = centerX + radius * Math.cos(endRad);
      const y2 = centerY + radius * Math.sin(endRad);

      const largeArc = angle > 180 ? 1 : 0;

      const path = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

      return { ...item, path, index };
    });
  }, [data, size]);

  if (data.length === 0) {
    return (
      <div className="text-center text-gray-400 py-8">
        No data available
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-900">{title}</h3>

      <div className="flex items-start gap-4">
        {/* Pie chart */}
        <svg width={size} height={size} className="flex-shrink-0">
          {segments.map((segment) => (
            <path
              key={segment.index}
              d={segment.path}
              fill={segment.color}
              opacity={hoveredIndex === null || hoveredIndex === segment.index ? 1 : 0.5}
              onMouseEnter={() => setHoveredIndex(segment.index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="transition-opacity cursor-pointer"
            />
          ))}
        </svg>

        {/* Legend */}
        <div className="flex-1 space-y-1 text-sm">
          {data.slice(0, 8).map((item, index) => (
            <div
              key={index}
              className={`flex items-center gap-2 ${
                hoveredIndex === index ? 'font-semibold' : ''
              }`}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div
                className="w-3 h-3 rounded-sm flex-shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="capitalize truncate">{item.label}</span>
              <span className="text-gray-500 ml-auto">
                {item.percentage.toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface BarChartProps {
  data: UsageCount[];
  title: string;
  showFreshness?: boolean;
}

function BarChart({ data, title, showFreshness = false }: BarChartProps) {
  const maxCount = Math.max(...data.map(d => d.count), 1);

  if (data.length === 0) {
    return (
      <div className="text-center text-gray-400 py-8">
        No data available
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-900">{title}</h3>

      <div className="space-y-2">
        {data.map((item, index) => (
          <div key={item.id} className="flex items-center gap-2">
            <span className="text-gray-500 text-sm w-6">{index + 1}.</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm truncate">{item.name}</span>
                {showFreshness && item.freshness && (
                  <FreshnessIndicator
                    freshness={item.freshness}
                    size="sm"
                    showLabel={false}
                  />
                )}
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden mt-1">
                <div
                  className="h-full bg-orange-500 rounded-full"
                  style={{ width: `${(item.count / maxCount) * 100}%` }}
                />
              </div>
            </div>
            <span className="text-sm font-medium text-gray-700 w-8 text-right">
              {item.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface ImbalanceWarningProps {
  data: DistributionItem[];
  type: 'muscle' | 'movement' | 'position';
}

function ImbalanceWarning({ data, type }: ImbalanceWarningProps) {
  const warnings: string[] = [];

  if (data.length < 2) return null;

  const highest = data[0];

  // Check for significant imbalances
  if (highest.percentage > 30) {
    warnings.push(`High focus on ${highest.label} (${highest.percentage.toFixed(0)}%)`);
  }

  if (type === 'movement') {
    // Check push/pull balance
    const pushItem = data.find(d => d.label === 'push');
    const pullItem = data.find(d => d.label === 'pull');
    if (pushItem && pullItem) {
      const ratio = pushItem.percentage / (pullItem.percentage || 1);
      if (ratio > 1.5) {
        warnings.push('Push movements significantly outweigh pull movements');
      } else if (ratio < 0.67) {
        warnings.push('Pull movements significantly outweigh push movements');
      }
    }
  }

  if (type === 'muscle') {
    // Check upper/lower balance
    const upperMuscles = ['chest', 'back', 'shoulders', 'biceps', 'triceps'];
    const lowerMuscles = ['quads', 'hamstrings', 'glutes', 'calves'];

    const upperTotal = data
      .filter(d => upperMuscles.includes(d.label))
      .reduce((sum, d) => sum + d.percentage, 0);
    const lowerTotal = data
      .filter(d => lowerMuscles.includes(d.label))
      .reduce((sum, d) => sum + d.percentage, 0);

    if (upperTotal > lowerTotal * 2) {
      warnings.push('Upper body work significantly outweighs lower body');
    } else if (lowerTotal > upperTotal * 2) {
      warnings.push('Lower body work significantly outweighs upper body');
    }
  }

  if (warnings.length === 0) return null;

  return (
    <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
      <div className="flex items-start gap-2">
        <span className="text-amber-600">⚠️</span>
        <div className="space-y-1 text-sm text-amber-800">
          {warnings.map((warning, i) => (
            <div key={i}>{warning}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function AnalyticsDashboard({
  classes,
  rounds,
  blocks,
  exercises,
  dateRange,
}: AnalyticsDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'exercises' | 'patterns' | 'freshness'>('overview');

  // Filter by date range if provided
  const filteredClasses = useMemo(() => {
    if (!dateRange) return classes;
    return classes.filter(c => {
      const classDate = new Date(c.date);
      return classDate >= dateRange.start && classDate <= dateRange.end;
    });
  }, [classes, dateRange]);

  const filteredRounds = useMemo(() => {
    if (!dateRange) return rounds;
    const classIds = new Set(filteredClasses.map(c => c.id));
    return rounds.filter(r => classIds.has(r.sourceClassId));
  }, [rounds, filteredClasses, dateRange]);

  // Compute distributions
  const finisherDistribution = useMemo(
    () => mapToDistribution(countFinishers(filteredRounds), FINISHER_COLORS),
    [filteredRounds]
  );

  const muscleDistribution = useMemo(
    () => mapToDistribution(countMuscleGroups(exercises), MUSCLE_COLORS),
    [exercises]
  );

  const movementDistribution = useMemo(
    () => mapToDistribution(countMovementPatterns(exercises), MOVEMENT_COLORS),
    [exercises]
  );

  const positionDistribution = useMemo(
    () => mapToDistribution(countPositions(exercises), POSITION_COLORS),
    [exercises]
  );

  // Compute top items
  const topExercises = useMemo(() => getTopExercises(exercises), [exercises]);
  const topBlocks = useMemo(() => getTopBlocks(blocks), [blocks]);

  // Summary stats
  const stats = useMemo(() => ({
    totalClasses: filteredClasses.length,
    totalRounds: filteredRounds.length,
    totalBlocks: blocks.length,
    totalExercises: exercises.length,
    avgFlowScore: filteredRounds.length > 0
      ? filteredRounds.reduce((sum, r) => sum + r.flowScore, 0) / filteredRounds.length
      : 0,
    avgTreadSpeed: filteredRounds.length > 0
      ? filteredRounds.reduce((sum, r) => sum + r.treadAverage, 0) / filteredRounds.length
      : 0,
  }), [filteredClasses, filteredRounds, blocks, exercises]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Analytics Dashboard</h2>
        {dateRange && (
          <span className="text-sm text-gray-500">
            {dateRange.start.toLocaleDateString()} - {dateRange.end.toLocaleDateString()}
          </span>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">{stats.totalClasses}</div>
          <div className="text-sm text-gray-500">Classes</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">{stats.totalBlocks}</div>
          <div className="text-sm text-gray-500">Unique Blocks</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">{stats.avgFlowScore.toFixed(0)}</div>
          <div className="text-sm text-gray-500">Avg Flow Score</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">{stats.avgTreadSpeed.toFixed(1)}</div>
          <div className="text-sm text-gray-500">Avg Tread Speed</div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-4">
          {(['overview', 'exercises', 'patterns', 'freshness'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-1 border-b-2 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <PieChart data={finisherDistribution} title="Finisher Distribution" />
            </div>
            <div>
              <PieChart data={muscleDistribution} title="Muscle Group Focus" />
              <ImbalanceWarning data={muscleDistribution} type="muscle" />
            </div>
          </div>
        )}

        {activeTab === 'exercises' && (
          <div className="grid md:grid-cols-2 gap-8">
            <BarChart data={topExercises} title="Most Used Exercises" showFreshness />
            <BarChart data={topBlocks} title="Most Used Blocks" showFreshness />
          </div>
        )}

        {activeTab === 'patterns' && (
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <PieChart data={movementDistribution} title="Movement Patterns" />
              <ImbalanceWarning data={movementDistribution} type="movement" />
            </div>
            <div>
              <PieChart data={positionDistribution} title="Position Distribution" />
              <ImbalanceWarning data={positionDistribution} type="position" />
            </div>
          </div>
        )}

        {activeTab === 'freshness' && (
          <div className="space-y-6">
            <h3 className="font-semibold text-gray-900">Overused Content</h3>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Recently overused exercises */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700">
                  Exercises used 3+ times in 4 weeks
                </h4>
                {exercises
                  .filter(e => {
                    const fourWeeksAgo = new Date();
                    fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);
                    const lastUsedDate = e.lastUsed ? new Date(e.lastUsed) : null;
                    return lastUsedDate && lastUsedDate > fourWeeksAgo && e.useCount >= 3;
                  })
                  .slice(0, 10)
                  .map(e => (
                    <div
                      key={e.id}
                      className="flex items-center justify-between p-2 bg-red-50 rounded-lg"
                    >
                      <span className="text-sm">{e.rawText}</span>
                      <span className="text-xs text-red-600">
                        {e.useCount}x in 4 weeks
                      </span>
                    </div>
                  ))
                }
                {exercises.filter(e => {
                  const fourWeeksAgo = new Date();
                  fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);
                  const lastUsedDate = e.lastUsed ? new Date(e.lastUsed) : null;
                  return lastUsedDate && lastUsedDate > fourWeeksAgo && e.useCount >= 3;
                }).length === 0 && (
                  <div className="text-sm text-gray-500">
                    No overused exercises found
                  </div>
                )}
              </div>

              {/* Fresh content suggestions */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700">
                  Fresh blocks (unused in 4+ weeks)
                </h4>
                {blocks
                  .filter(b => {
                    const fourWeeksAgo = new Date();
                    fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);
                    const lastUsedDate = b.lastUsed ? new Date(b.lastUsed) : null;
                    return !lastUsedDate || lastUsedDate < fourWeeksAgo;
                  })
                  .slice(0, 10)
                  .map(b => (
                    <div
                      key={b.id}
                      className="flex items-center justify-between p-2 bg-green-50 rounded-lg"
                    >
                      <span className="text-sm truncate">
                        {b.content.slice(0, 2).join(' / ')}
                      </span>
                      <FreshnessIndicator
                        freshness={calculateFreshnessFromValues(b.lastUsed, b.useCount)}
                        size="sm"
                        showLabel={false}
                      />
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AnalyticsDashboard;
