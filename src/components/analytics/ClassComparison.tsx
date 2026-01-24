// ============================================================================
// Class Comparison Component
// Side-by-side comparison of two classes with similarity scoring
// Now includes minute-by-minute exercise comparison
// ============================================================================

import React, { useMemo, useState } from 'react';
import {
  ClassMetadata,
  RoundMetadata,
  MovementPattern,
  BodyFocus,
  FinisherType,
  ExercisePosition,
  PairedMinute,
} from '../../types/hierarchyTypes';
import { FlowScoreBadge } from '../library/FlowScoreIndicator';

// ============================================================================
// Types
// ============================================================================

interface ClassComparisonProps {
  classA: ClassMetadata;
  classB: ClassMetadata;
  roundsA: RoundMetadata[];
  roundsB: RoundMetadata[];
  // Optional: Draft class to compare against historical classes
  draftClass?: {
    label: string;
    round1?: RoundMetadata;
    round2?: RoundMetadata;
  };
}

interface ComparisonMetric {
  label: string;
  valueA: string | number;
  valueB: string | number;
  similarity: number; // 0-1
  isDifferent: boolean;
}

interface SimilarityScore {
  overall: number;
  breakdown: {
    equipment: number;
    duration: number;
    finisher: number;
    bodyFocus: number;
    flowScore: number;
    treadPattern: number;
  };
}

// ============================================================================
// Helper Functions
// ============================================================================

function calculateSetSimilarity<T>(setA: T[], setB: T[]): number {
  if (setA.length === 0 && setB.length === 0) return 1;
  if (setA.length === 0 || setB.length === 0) return 0;

  const unionSize = new Set([...setA, ...setB]).size;
  const intersectionSize = setA.filter(item => setB.includes(item)).length;

  return intersectionSize / unionSize;
}

function calculateNumericSimilarity(a: number, b: number, maxDiff: number): number {
  const diff = Math.abs(a - b);
  return Math.max(0, 1 - diff / maxDiff);
}

function formatDuration(minutes: number): string {
  return `${minutes} min`;
}

function formatBodyFocus(focus: BodyFocus[]): string {
  return focus.slice(0, 3).map(f => f.replace(/_/g, ' ')).join(', ') || 'None';
}

function formatMovementPatterns(patterns: MovementPattern[]): string {
  return patterns.slice(0, 4).map(p => p.replace(/_/g, ' ')).join(', ') || 'None';
}

function formatPositions(positions: ExercisePosition[]): string {
  const unique = [...new Set(positions)];
  return unique.slice(0, 3).map(p => p.replace(/_/g, ' ')).join(', ') || 'None';
}

function getEquipmentDescription(round: RoundMetadata): string {
  const primary = round.equipment?.primary;
  if (!primary) return 'Unknown';
  return `${primary.count} ${primary.type}`;
}

function calculateOverallSimilarity(
  classA: ClassMetadata,
  classB: ClassMetadata,
  roundsA: RoundMetadata[],
  roundsB: RoundMetadata[]
): SimilarityScore {
  // Equipment similarity
  const r1A = roundsA.find(r => r.roundNumber === 1);
  const r1B = roundsB.find(r => r.roundNumber === 1);
  const r2A = roundsA.find(r => r.roundNumber === 2);
  const r2B = roundsB.find(r => r.roundNumber === 2);

  const equipmentSim = (
    (r1A?.equipment?.primary?.type === r1B?.equipment?.primary?.type ? 0.5 : 0) +
    (r2A?.equipment?.primary?.type === r2B?.equipment?.primary?.type ? 0.5 : 0)
  );

  // Duration similarity
  const durationSim = calculateNumericSimilarity(
    classA.totalDuration,
    classB.totalDuration,
    10
  );

  // Finisher similarity
  const finishersA = roundsA.map(r => r.finisherType).filter(Boolean) as FinisherType[];
  const finishersB = roundsB.map(r => r.finisherType).filter(Boolean) as FinisherType[];
  const finisherSim = calculateSetSimilarity(finishersA, finishersB);

  // Body focus similarity
  const focusA = [...new Set(roundsA.flatMap(r => r.primaryBodyFocus))];
  const focusB = [...new Set(roundsB.flatMap(r => r.primaryBodyFocus))];
  const bodyFocusSim = calculateSetSimilarity(focusA, focusB);

  // Flow score similarity
  const avgFlowA = roundsA.length > 0
    ? roundsA.reduce((sum, r) => sum + r.flowScore, 0) / roundsA.length
    : 0;
  const avgFlowB = roundsB.length > 0
    ? roundsB.reduce((sum, r) => sum + r.flowScore, 0) / roundsB.length
    : 0;
  const flowSim = calculateNumericSimilarity(avgFlowA, avgFlowB, 50);

  // Tread pattern similarity
  const treadPatternsA = roundsA.map(r => r.treadPattern);
  const treadPatternsB = roundsB.map(r => r.treadPattern);
  const treadSim = calculateSetSimilarity(treadPatternsA, treadPatternsB);

  // Overall weighted average
  const overall =
    equipmentSim * 0.15 +
    durationSim * 0.1 +
    finisherSim * 0.2 +
    bodyFocusSim * 0.25 +
    flowSim * 0.15 +
    treadSim * 0.15;

  return {
    overall,
    breakdown: {
      equipment: equipmentSim,
      duration: durationSim,
      finisher: finisherSim,
      bodyFocus: bodyFocusSim,
      flowScore: flowSim,
      treadPattern: treadSim,
    },
  };
}

// ============================================================================
// Sub-Components
// ============================================================================

interface SimilarityMeterProps {
  value: number;
  label?: string;
  showLabel?: boolean;
}

function SimilarityMeter({ value, label, showLabel = true }: SimilarityMeterProps) {
  const percentage = Math.round(value * 100);

  let color = 'bg-green-500';
  if (percentage < 40) color = 'bg-red-500';
  else if (percentage < 70) color = 'bg-yellow-500';

  return (
    <div className="space-y-1">
      {showLabel && label && (
        <div className="text-xs text-gray-500">{label}</div>
      )}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full ${color} rounded-full transition-all`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="text-xs font-medium text-gray-700 w-8">
          {percentage}%
        </span>
      </div>
    </div>
  );
}

interface MetricRowProps {
  metric: ComparisonMetric;
}

function MetricRow({ metric }: MetricRowProps) {
  return (
    <div className={`grid grid-cols-3 gap-4 py-2 border-b border-gray-100 ${
      metric.isDifferent ? 'bg-amber-50' : ''
    }`}>
      <div className="text-sm text-gray-500">{metric.label}</div>
      <div className={`text-sm font-medium ${
        metric.isDifferent ? 'text-amber-700' : 'text-gray-900'
      }`}>
        {metric.valueA}
      </div>
      <div className={`text-sm font-medium ${
        metric.isDifferent ? 'text-amber-700' : 'text-gray-900'
      }`}>
        {metric.valueB}
      </div>
    </div>
  );
}

function getFlowRating(score: number): 'great' | 'good' | 'fair' | 'poor' {
  if (score >= 85) return 'great';
  if (score >= 70) return 'good';
  if (score >= 50) return 'fair';
  return 'poor';
}

interface RoundComparisonProps {
  roundA?: RoundMetadata;
  roundB?: RoundMetadata;
  roundNumber: 1 | 2;
}

// ============================================================================
// Minute-by-Minute Exercise Comparison
// ============================================================================

interface MinuteComparisonRowProps {
  minuteIndex: number;
  minuteA?: PairedMinute;
  minuteB?: PairedMinute;
  minuteC?: PairedMinute;
  showThirdColumn: boolean;
}

function MinuteComparisonRow({ minuteIndex, minuteA, minuteB, minuteC, showThirdColumn }: MinuteComparisonRowProps) {
  const floorA = minuteA?.floor?.rawText || '-';
  const floorB = minuteB?.floor?.rawText || '-';
  const floorC = minuteC?.floor?.rawText || '-';

  const treadA = minuteA?.tread?.rawText || '-';
  const treadB = minuteB?.tread?.rawText || '-';
  const treadC = minuteC?.tread?.rawText || '-';

  // Check if exercises are similar
  const floorSimilar = floorA === floorB || (showThirdColumn && (floorA === floorC || floorB === floorC));
  const treadSimilar = treadA === treadB || (showThirdColumn && (treadA === treadC || treadB === treadC));

  return (
    <div className={`border-b border-gray-100 ${minuteIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
      {/* Floor Row */}
      <div className="grid gap-2 py-2 px-2" style={{ gridTemplateColumns: showThirdColumn ? '40px 1fr 1fr 1fr' : '40px 1fr 1fr' }}>
        <div className="text-xs font-medium text-orange-600 flex items-center">
          {minuteIndex + 1}F
        </div>
        <div className={`text-xs ${!floorSimilar ? 'font-medium' : 'text-gray-600'}`}>
          {floorA}
        </div>
        <div className={`text-xs ${!floorSimilar ? 'font-medium' : 'text-gray-600'}`}>
          {floorB}
        </div>
        {showThirdColumn && (
          <div className={`text-xs ${!floorSimilar ? 'font-medium' : 'text-gray-600'}`}>
            {floorC}
          </div>
        )}
      </div>

      {/* Tread Row */}
      <div className="grid gap-2 py-2 px-2 border-t border-gray-50" style={{ gridTemplateColumns: showThirdColumn ? '40px 1fr 1fr 1fr' : '40px 1fr 1fr' }}>
        <div className="text-xs font-medium text-blue-600 flex items-center">
          {minuteIndex + 1}T
        </div>
        <div className={`text-xs ${!treadSimilar ? 'font-medium' : 'text-gray-600'} ${
          minuteA?.tread?.isRecover ? 'text-green-600' :
          minuteA?.tread?.isSprint ? 'text-purple-600' :
          (minuteA?.tread?.inclinePercent || 0) > 0 ? 'text-red-600' : ''
        }`}>
          {treadA}
        </div>
        <div className={`text-xs ${!treadSimilar ? 'font-medium' : 'text-gray-600'} ${
          minuteB?.tread?.isRecover ? 'text-green-600' :
          minuteB?.tread?.isSprint ? 'text-purple-600' :
          (minuteB?.tread?.inclinePercent || 0) > 0 ? 'text-red-600' : ''
        }`}>
          {treadB}
        </div>
        {showThirdColumn && (
          <div className={`text-xs ${!treadSimilar ? 'font-medium' : 'text-gray-600'} ${
            minuteC?.tread?.isRecover ? 'text-green-600' :
            minuteC?.tread?.isSprint ? 'text-purple-600' :
            (minuteC?.tread?.inclinePercent || 0) > 0 ? 'text-red-600' : ''
          }`}>
            {treadC}
          </div>
        )}
      </div>
    </div>
  );
}

interface MinuteByMinuteComparisonProps {
  roundA?: RoundMetadata;
  roundB?: RoundMetadata;
  roundC?: RoundMetadata;
  roundNumber: 1 | 2;
  labelA: string;
  labelB: string;
  labelC?: string;
}

function MinuteByMinuteComparison({
  roundA,
  roundB,
  roundC,
  roundNumber,
  labelA,
  labelB,
  labelC
}: MinuteByMinuteComparisonProps) {
  const showThirdColumn = !!roundC && !!labelC;
  const maxMinutes = Math.max(
    roundA?.minutes?.length || 0,
    roundB?.minutes?.length || 0,
    roundC?.minutes?.length || 0
  );

  if (maxMinutes === 0) return null;

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
        <h4 className="font-semibold text-gray-900">Round {roundNumber} - Minute by Minute</h4>
      </div>

      {/* Header */}
      <div
        className="grid gap-2 py-2 px-2 bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase"
        style={{ gridTemplateColumns: showThirdColumn ? '40px 1fr 1fr 1fr' : '40px 1fr 1fr' }}
      >
        <div>Min</div>
        <div className="truncate">{labelA}</div>
        <div className="truncate">{labelB}</div>
        {showThirdColumn && <div className="truncate">{labelC}</div>}
      </div>

      {/* Minute rows */}
      <div className="max-h-96 overflow-y-auto">
        {Array.from({ length: maxMinutes }).map((_, i) => (
          <MinuteComparisonRow
            key={i}
            minuteIndex={i}
            minuteA={roundA?.minutes?.[i]}
            minuteB={roundB?.minutes?.[i]}
            minuteC={roundC?.minutes?.[i]}
            showThirdColumn={showThirdColumn}
          />
        ))}
      </div>
    </div>
  );
}

function RoundComparison({ roundA, roundB, roundNumber }: RoundComparisonProps) {
  if (!roundA || !roundB) return null;

  const metrics: ComparisonMetric[] = [
    {
      label: 'Duration',
      valueA: formatDuration(roundA.duration),
      valueB: formatDuration(roundB.duration),
      similarity: calculateNumericSimilarity(roundA.duration, roundB.duration, 5),
      isDifferent: roundA.duration !== roundB.duration,
    },
    {
      label: 'Finisher',
      valueA: roundA.finisherType?.replace(/_/g, ' ') || 'None',
      valueB: roundB.finisherType?.replace(/_/g, ' ') || 'None',
      similarity: roundA.finisherType === roundB.finisherType ? 1 : 0,
      isDifferent: roundA.finisherType !== roundB.finisherType,
    },
    {
      label: 'Flow Score',
      valueA: roundA.flowScore.toFixed(0),
      valueB: roundB.flowScore.toFixed(0),
      similarity: calculateNumericSimilarity(roundA.flowScore, roundB.flowScore, 50),
      isDifferent: Math.abs(roundA.flowScore - roundB.flowScore) > 15,
    },
    {
      label: 'Body Focus',
      valueA: formatBodyFocus(roundA.primaryBodyFocus),
      valueB: formatBodyFocus(roundB.primaryBodyFocus),
      similarity: calculateSetSimilarity(roundA.primaryBodyFocus, roundB.primaryBodyFocus),
      isDifferent: !roundA.primaryBodyFocus.every(f => roundB.primaryBodyFocus.includes(f)),
    },
    {
      label: 'Movement Patterns',
      valueA: formatMovementPatterns(roundA.movementPatterns),
      valueB: formatMovementPatterns(roundB.movementPatterns),
      similarity: calculateSetSimilarity(roundA.movementPatterns, roundB.movementPatterns),
      isDifferent: !roundA.movementPatterns.every(p => roundB.movementPatterns.includes(p)),
    },
    {
      label: 'Tread Avg',
      valueA: roundA.treadAverage.toFixed(1),
      valueB: roundB.treadAverage.toFixed(1),
      similarity: calculateNumericSimilarity(roundA.treadAverage, roundB.treadAverage, 2),
      isDifferent: Math.abs(roundA.treadAverage - roundB.treadAverage) > 0.5,
    },
    {
      label: 'Positions',
      valueA: formatPositions(roundA.positionSequence),
      valueB: formatPositions(roundB.positionSequence),
      similarity: calculateSetSimilarity(roundA.positionSequence, roundB.positionSequence),
      isDifferent: roundA.dominantPosition !== roundB.dominantPosition,
    },
  ];

  return (
    <div className="space-y-4">
      <h4 className="font-semibold text-gray-900">Round {roundNumber}</h4>

      <div className="grid grid-cols-3 gap-4 text-xs font-medium text-gray-500 uppercase tracking-wider pb-2 border-b border-gray-200">
        <div>Metric</div>
        <div>Class A</div>
        <div>Class B</div>
      </div>

      {metrics.map((metric, i) => (
        <MetricRow key={i} metric={metric} />
      ))}
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function ClassComparison({
  classA,
  classB,
  roundsA,
  roundsB,
  draftClass,
}: ClassComparisonProps) {
  const [showMinuteByMinute, setShowMinuteByMinute] = useState(true);

  const similarity = useMemo(
    () => calculateOverallSimilarity(classA, classB, roundsA, roundsB),
    [classA, classB, roundsA, roundsB]
  );

  const round1A = roundsA.find(r => r.roundNumber === 1);
  const round1B = roundsB.find(r => r.roundNumber === 1);
  const round2A = roundsA.find(r => r.roundNumber === 2);
  const round2B = roundsB.find(r => r.roundNumber === 2);

  // Labels for columns
  const labelA = draftClass ? 'Draft' : `${classA.dayOfWeek} ${new Date(classA.date).toLocaleDateString()}`;
  const labelB = `${classA.dayOfWeek} ${new Date(classA.date).toLocaleDateString()}`;
  const labelC = `${classB.dayOfWeek} ${new Date(classB.date).toLocaleDateString()}`;

  // If draft class, use draft for A column, classA for B, classB for C
  const effectiveRound1A = draftClass?.round1 || round1A;
  const effectiveRound1B = draftClass ? round1A : round1B;
  const effectiveRound1C = draftClass ? round1B : undefined;

  const effectiveRound2A = draftClass?.round2 || round2A;
  const effectiveRound2B = draftClass ? round2A : round2B;
  const effectiveRound2C = draftClass ? round2B : undefined;

  const classMetrics: ComparisonMetric[] = [
    {
      label: 'Date',
      valueA: new Date(classA.date).toLocaleDateString(),
      valueB: new Date(classB.date).toLocaleDateString(),
      similarity: 0, // Not meaningful for dates
      isDifferent: false,
    },
    {
      label: 'Total Duration',
      valueA: formatDuration(classA.totalDuration),
      valueB: formatDuration(classB.totalDuration),
      similarity: similarity.breakdown.duration,
      isDifferent: classA.totalDuration !== classB.totalDuration,
    },
    {
      label: 'R1 Equipment',
      valueA: round1A ? getEquipmentDescription(round1A) : 'Unknown',
      valueB: round1B ? getEquipmentDescription(round1B) : 'Unknown',
      similarity: round1A?.equipment?.primary?.type === round1B?.equipment?.primary?.type ? 1 : 0,
      isDifferent: round1A?.equipment?.primary?.type !== round1B?.equipment?.primary?.type,
    },
    {
      label: 'R2 Equipment',
      valueA: round2A ? getEquipmentDescription(round2A) : 'Unknown',
      valueB: round2B ? getEquipmentDescription(round2B) : 'Unknown',
      similarity: round2A?.equipment?.primary?.type === round2B?.equipment?.primary?.type ? 1 : 0,
      isDifferent: round2A?.equipment?.primary?.type !== round2B?.equipment?.primary?.type,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Class Comparison</h2>
          {draftClass && (
            <p className="text-sm text-gray-500 mt-1">
              Comparing your draft class to {draftClass ? '2' : '1'} previous class{draftClass ? 'es' : ''}
            </p>
          )}
        </div>
        <div className="flex items-center gap-4">
          {/* View Toggle */}
          <button
            onClick={() => setShowMinuteByMinute(!showMinuteByMinute)}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              showMinuteByMinute
                ? 'bg-orange-100 text-orange-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {showMinuteByMinute ? 'Hide' : 'Show'} Exercises
          </button>
          <div className="text-right">
            <div className="text-3xl font-bold text-gray-900">
              {Math.round(similarity.overall * 100)}%
            </div>
            <div className="text-sm text-gray-500">Overall Similarity</div>
          </div>
        </div>
      </div>

      {/* Similarity Breakdown */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="font-semibold text-gray-900 mb-4">Similarity Breakdown</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <SimilarityMeter value={similarity.breakdown.equipment} label="Equipment" />
          <SimilarityMeter value={similarity.breakdown.duration} label="Duration" />
          <SimilarityMeter value={similarity.breakdown.finisher} label="Finisher" />
          <SimilarityMeter value={similarity.breakdown.bodyFocus} label="Body Focus" />
          <SimilarityMeter value={similarity.breakdown.flowScore} label="Flow Score" />
          <SimilarityMeter value={similarity.breakdown.treadPattern} label="Tread Pattern" />
        </div>
      </div>

      {/* Class Overview */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="font-semibold text-gray-900 mb-4">Class Overview</h3>

        <div className="grid grid-cols-3 gap-4 text-xs font-medium text-gray-500 uppercase tracking-wider pb-2 border-b border-gray-200">
          <div>Metric</div>
          <div>Class A</div>
          <div>Class B</div>
        </div>

        {classMetrics.map((metric, i) => (
          <MetricRow key={i} metric={metric} />
        ))}
      </div>

      {/* Round Comparisons */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <RoundComparison roundA={round1A} roundB={round1B} roundNumber={1} />
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <RoundComparison roundA={round2A} roundB={round2B} roundNumber={2} />
        </div>
      </div>

      {/* Minute-by-Minute Exercise Comparison */}
      {showMinuteByMinute && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Exercise Comparison (Minute by Minute)</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <MinuteByMinuteComparison
              roundA={effectiveRound1A}
              roundB={effectiveRound1B}
              roundC={effectiveRound1C}
              roundNumber={1}
              labelA={draftClass ? draftClass.label : labelB}
              labelB={draftClass ? labelB : labelC}
              labelC={draftClass ? labelC : undefined}
            />
            <MinuteByMinuteComparison
              roundA={effectiveRound2A}
              roundB={effectiveRound2B}
              roundC={effectiveRound2C}
              roundNumber={2}
              labelA={draftClass ? draftClass.label : labelB}
              labelB={draftClass ? labelB : labelC}
              labelC={draftClass ? labelC : undefined}
            />
          </div>
        </div>
      )}

      {/* Key Differences */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="font-semibold text-gray-900 mb-4">Key Differences</h3>

        <div className="space-y-3">
          {/* Finisher differences */}
          {round1A?.finisherType !== round1B?.finisherType && (
            <div className="flex items-start gap-2 text-sm">
              <span className="text-amber-500">▸</span>
              <span>
                Round 1 finisher: <strong>{round1A?.finisherType || 'None'}</strong> vs{' '}
                <strong>{round1B?.finisherType || 'None'}</strong>
              </span>
            </div>
          )}
          {round2A?.finisherType !== round2B?.finisherType && (
            <div className="flex items-start gap-2 text-sm">
              <span className="text-amber-500">▸</span>
              <span>
                Round 2 finisher: <strong>{round2A?.finisherType || 'None'}</strong> vs{' '}
                <strong>{round2B?.finisherType || 'None'}</strong>
              </span>
            </div>
          )}

          {/* Flow score differences */}
          {round1A && round1B && Math.abs(round1A.flowScore - round1B.flowScore) > 20 && (
            <div className="flex items-start gap-2 text-sm">
              <span className="text-amber-500">▸</span>
              <span>
                Round 1 flow score differs significantly:{' '}
                <FlowScoreBadge score={round1A.flowScore} rating={getFlowRating(round1A.flowScore)} /> vs{' '}
                <FlowScoreBadge score={round1B.flowScore} rating={getFlowRating(round1B.flowScore)} />
              </span>
            </div>
          )}

          {/* Equipment differences */}
          {round1A?.equipment?.primary?.type !== round1B?.equipment?.primary?.type && (
            <div className="flex items-start gap-2 text-sm">
              <span className="text-amber-500">▸</span>
              <span>
                Round 1 equipment: <strong>{round1A ? getEquipmentDescription(round1A) : 'Unknown'}</strong> vs{' '}
                <strong>{round1B ? getEquipmentDescription(round1B) : 'Unknown'}</strong>
              </span>
            </div>
          )}
          {round2A?.equipment?.primary?.type !== round2B?.equipment?.primary?.type && (
            <div className="flex items-start gap-2 text-sm">
              <span className="text-amber-500">▸</span>
              <span>
                Round 2 equipment: <strong>{round2A ? getEquipmentDescription(round2A) : 'Unknown'}</strong> vs{' '}
                <strong>{round2B ? getEquipmentDescription(round2B) : 'Unknown'}</strong>
              </span>
            </div>
          )}

          {/* Body focus differences */}
          {round1A && round1B && !round1A.primaryBodyFocus.every(f => round1B.primaryBodyFocus.includes(f)) && (
            <div className="flex items-start gap-2 text-sm">
              <span className="text-amber-500">▸</span>
              <span>
                Round 1 body focus differs:{' '}
                <strong>{formatBodyFocus(round1A.primaryBodyFocus)}</strong> vs{' '}
                <strong>{formatBodyFocus(round1B.primaryBodyFocus)}</strong>
              </span>
            </div>
          )}

          {/* No differences case */}
          {similarity.overall > 0.9 && (
            <div className="text-sm text-green-600">
              These classes are very similar with only minor variations.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ClassComparison;
