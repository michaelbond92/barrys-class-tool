// ============================================================================
// UnifiedView Component
// Shows all content in single scrollable view with collapsible sections
// ============================================================================

import React, { useState } from 'react';
import { LibraryData } from './Library';
import { RoundCard } from './RoundCard';
import { FlowScoreBadge } from './FlowScoreIndicator';
import { FlowScore } from '../../types/hierarchyTypes';

// Helper to get rating from score
function getRatingFromScore(score: number): FlowScore['rating'] {
  if (score >= 85) return 'great';
  if (score >= 70) return 'good';
  if (score >= 50) return 'fair';
  return 'poor';
}

interface UnifiedViewProps {
  data: LibraryData;
}

export function UnifiedView({ data }: UnifiedViewProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['rounds']));
  const [expandedRoundId, setExpandedRoundId] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
      return next;
    });
  };

  // Group rounds by class
  const roundsByClass = data.rounds.reduce((acc, round) => {
    if (!acc[round.sourceClassId]) {
      acc[round.sourceClassId] = [];
    }
    acc[round.sourceClassId].push(round);
    return acc;
  }, {} as Record<string, typeof data.rounds>);

  // Group floor blocks by category
  const floorBlocksByCategory = {
    warmups: data.floorBlocks.filter(b => b.category === 'warmups'),
    workouts: data.floorBlocks.filter(b => b.category === 'workouts'),
  };

  // Group tread blocks by category
  const treadBlocksByCategory = {
    warmups: data.treadBlocks.filter(b => b.category === 'warmups'),
    workouts: data.treadBlocks.filter(b => b.category === 'workouts'),
  };

  return (
    <div className="space-y-6">
      {/* Classes & Rounds Section */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <button
          onClick={() => toggleSection('rounds')}
          className="w-full px-4 py-3 flex items-center justify-between bg-indigo-50 hover:bg-indigo-100 transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-indigo-900">Classes & Rounds</span>
            <span className="text-sm text-indigo-600">({data.classes.length} classes, {data.rounds.length} rounds)</span>
          </div>
          <svg
            className={`w-5 h-5 text-indigo-600 transition-transform ${expandedSections.has('rounds') ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {expandedSections.has('rounds') && (
          <div className="p-4 space-y-4">
            {data.classes.map(classItem => (
              <div key={classItem.id} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="px-4 py-3 bg-gray-50 flex items-center justify-between">
                  <div>
                    <span className="font-medium text-gray-900">
                      {classItem.dayOfWeek} - {new Date(classItem.date).toLocaleDateString()}
                    </span>
                    <span className="ml-2 text-sm text-gray-500">
                      {classItem.classNumber ? `#${classItem.classNumber}` : ''}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600">{classItem.totalDuration} min</span>
                    <span className="text-sm px-2 py-1 rounded bg-blue-100 text-blue-700">
                      Avg: {classItem.overallTreadAverage}
                    </span>
                  </div>
                </div>

                <div className="p-4 grid md:grid-cols-2 gap-4">
                  {roundsByClass[classItem.id]?.map(round => (
                    <RoundCard
                      key={round.id}
                      round={round}
                      expanded={expandedRoundId === round.id}
                      onToggle={() => setExpandedRoundId(expandedRoundId === round.id ? null : round.id)}
                    />
                  ))}
                </div>
              </div>
            ))}

            {data.classes.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No classes match your filters
              </div>
            )}
          </div>
        )}
      </div>

      {/* Floor Blocks Section */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <button
          onClick={() => toggleSection('floor')}
          className="w-full px-4 py-3 flex items-center justify-between bg-orange-50 hover:bg-orange-100 transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-orange-900">Floor Blocks</span>
            <span className="text-sm text-orange-600">({data.floorBlocks.length} blocks)</span>
          </div>
          <svg
            className={`w-5 h-5 text-orange-600 transition-transform ${expandedSections.has('floor') ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {expandedSections.has('floor') && (
          <div className="p-4 space-y-4">
            {/* Warmups */}
            {floorBlocksByCategory.warmups.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Warmups ({floorBlocksByCategory.warmups.length})</h4>
                <div className="grid gap-3">
                  {floorBlocksByCategory.warmups.slice(0, 10).map(block => (
                    <div key={block.id} className="border border-green-200 rounded-lg p-3 bg-green-50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-green-700">{block.length} min</span>
                        <FlowScoreBadge score={block.flowScore} rating={getRatingFromScore(block.flowScore)} />
                      </div>
                      <div className="space-y-1">
                        {block.content.map((line, i) => (
                          <div key={i} className={`text-sm ${i === block.content.length - 1 ? 'text-red-700 font-medium' : 'text-gray-700'}`}>
                            {line}
                          </div>
                        ))}
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {block.bodyFocus.map(focus => (
                          <span key={focus} className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                            {focus}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                {floorBlocksByCategory.warmups.length > 10 && (
                  <div className="text-sm text-gray-500 mt-2">
                    ...and {floorBlocksByCategory.warmups.length - 10} more warmups
                  </div>
                )}
              </div>
            )}

            {/* Workouts */}
            {floorBlocksByCategory.workouts.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Workouts ({floorBlocksByCategory.workouts.length})</h4>
                <div className="grid gap-3">
                  {floorBlocksByCategory.workouts.slice(0, 10).map(block => (
                    <div key={block.id} className="border border-yellow-200 rounded-lg p-3 bg-yellow-50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-yellow-700">{block.length} min</span>
                        <FlowScoreBadge score={block.flowScore} rating={getRatingFromScore(block.flowScore)} />
                      </div>
                      <div className="space-y-1">
                        {block.content.map((line, i) => (
                          <div key={i} className={`text-sm ${i === block.content.length - 1 ? 'text-red-700 font-medium' : 'text-gray-700'}`}>
                            {line}
                          </div>
                        ))}
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {block.bodyFocus.map(focus => (
                          <span key={focus} className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                            {focus}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                {floorBlocksByCategory.workouts.length > 10 && (
                  <div className="text-sm text-gray-500 mt-2">
                    ...and {floorBlocksByCategory.workouts.length - 10} more workouts
                  </div>
                )}
              </div>
            )}

            {data.floorBlocks.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No floor blocks match your filters
              </div>
            )}
          </div>
        )}
      </div>

      {/* Tread Blocks Section */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <button
          onClick={() => toggleSection('tread')}
          className="w-full px-4 py-3 flex items-center justify-between bg-blue-50 hover:bg-blue-100 transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-blue-900">Tread Blocks</span>
            <span className="text-sm text-blue-600">({data.treadBlocks.length} blocks)</span>
          </div>
          <svg
            className={`w-5 h-5 text-blue-600 transition-transform ${expandedSections.has('tread') ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {expandedSections.has('tread') && (
          <div className="p-4 space-y-4">
            {/* Warmups */}
            {treadBlocksByCategory.warmups.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Warmups ({treadBlocksByCategory.warmups.length})</h4>
                <div className="grid gap-3">
                  {treadBlocksByCategory.warmups.slice(0, 10).map(block => (
                    <div key={block.id} className="border border-green-200 rounded-lg p-3 bg-green-50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-green-700">{block.length} min</span>
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          block.intensity === 'high' ? 'bg-red-100 text-red-700' :
                          block.intensity === 'low' ? 'bg-green-100 text-green-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {block.intensity}
                        </span>
                      </div>
                      <div className="space-y-1">
                        {block.content.map((line, i) => (
                          <div key={i} className={`text-sm ${
                            line.toLowerCase().includes('recover') ? 'text-green-600' :
                            line.toLowerCase().includes('sprint') ? 'text-purple-600' :
                            line.includes('%') ? 'text-red-600' :
                            'text-gray-700'
                          }`}>
                            {line}
                          </div>
                        ))}
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-600">
                        <span>Base: {block.baseSpeed}</span>
                        {block.hasIncline && <span className="text-red-600">Incline: {block.maxIncline}%</span>}
                        {block.hasSprint && <span className="text-purple-600">Sprints: {block.sprintCount}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Workouts */}
            {treadBlocksByCategory.workouts.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Workouts ({treadBlocksByCategory.workouts.length})</h4>
                <div className="grid gap-3">
                  {treadBlocksByCategory.workouts.slice(0, 10).map(block => (
                    <div key={block.id} className="border border-yellow-200 rounded-lg p-3 bg-yellow-50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-yellow-700">{block.length} min</span>
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          block.intensity === 'high' ? 'bg-red-100 text-red-700' :
                          block.intensity === 'low' ? 'bg-green-100 text-green-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {block.intensity}
                        </span>
                      </div>
                      <div className="space-y-1">
                        {block.content.map((line, i) => (
                          <div key={i} className={`text-sm ${
                            line.toLowerCase().includes('recover') ? 'text-green-600' :
                            line.toLowerCase().includes('sprint') ? 'text-purple-600' :
                            line.includes('%') ? 'text-red-600' :
                            'text-gray-700'
                          }`}>
                            {line}
                          </div>
                        ))}
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-600">
                        <span>Base: {block.baseSpeed}</span>
                        {block.hasIncline && <span className="text-red-600">Incline: {block.maxIncline}%</span>}
                        {block.hasSprint && <span className="text-purple-600">Sprints: {block.sprintCount}</span>}
                      </div>
                    </div>
                  ))}
                </div>
                {treadBlocksByCategory.workouts.length > 10 && (
                  <div className="text-sm text-gray-500 mt-2">
                    ...and {treadBlocksByCategory.workouts.length - 10} more workouts
                  </div>
                )}
              </div>
            )}

            {data.treadBlocks.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No tread blocks match your filters
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
