// ============================================================================
// TabsView Component
// Tab-based view: Rounds | Blocks | Exercises tabs
// ============================================================================

import React, { useState } from 'react';
import { LibraryData } from './Library';
import { RoundCard } from './RoundCard';
import { FlowScoreBadge } from './FlowScoreIndicator';
import { FlowScore } from '../../types/hierarchyTypes';

function getRatingFromScore(score: number): FlowScore['rating'] {
  if (score >= 85) return 'great';
  if (score >= 70) return 'good';
  if (score >= 50) return 'fair';
  return 'poor';
}
import { BlockMetadata, TreadBlockMetadata } from '../../types/hierarchyTypes';

interface TabsViewProps {
  data: LibraryData;
}

type TabId = 'rounds' | 'floor-blocks' | 'tread-blocks';

export function TabsView({ data }: TabsViewProps) {
  const [activeTab, setActiveTab] = useState<TabId>('rounds');
  const [expandedRoundId, setExpandedRoundId] = useState<string | null>(null);

  const tabs: { id: TabId; label: string; count: number }[] = [
    { id: 'rounds', label: 'Rounds', count: data.rounds.length },
    { id: 'floor-blocks', label: 'Floor Blocks', count: data.floorBlocks.length },
    { id: 'tread-blocks', label: 'Tread Blocks', count: data.treadBlocks.length },
  ];

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Tab Headers */}
      <div className="flex border-b border-gray-200">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-4 py-3 text-center font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-orange-600 border-b-2 border-orange-500 bg-orange-50'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            {tab.label}
            <span className="ml-2 text-sm text-gray-400">({tab.count})</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-4">
        {activeTab === 'rounds' && (
          <RoundsTab
            data={data}
            expandedRoundId={expandedRoundId}
            onExpandRound={setExpandedRoundId}
          />
        )}
        {activeTab === 'floor-blocks' && <FloorBlocksTab blocks={data.floorBlocks} />}
        {activeTab === 'tread-blocks' && <TreadBlocksTab blocks={data.treadBlocks} />}
      </div>
    </div>
  );
}

// ============================================================================
// Rounds Tab
// ============================================================================

interface RoundsTabProps {
  data: LibraryData;
  expandedRoundId: string | null;
  onExpandRound: (id: string | null) => void;
}

function RoundsTab({ data, expandedRoundId, onExpandRound }: RoundsTabProps) {
  if (data.rounds.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No rounds match your filters
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {data.rounds.map(round => (
        <RoundCard
          key={round.id}
          round={round}
          expanded={expandedRoundId === round.id}
          onToggle={() => onExpandRound(expandedRoundId === round.id ? null : round.id)}
        />
      ))}
    </div>
  );
}

// ============================================================================
// Floor Blocks Tab
// ============================================================================

interface FloorBlocksTabProps {
  blocks: BlockMetadata[];
}

function FloorBlocksTab({ blocks }: FloorBlocksTabProps) {
  const [sortBy, setSortBy] = useState<'flowScore' | 'length' | 'category'>('flowScore');

  const sortedBlocks = [...blocks].sort((a, b) => {
    switch (sortBy) {
      case 'flowScore':
        return b.flowScore - a.flowScore;
      case 'length':
        return b.length - a.length;
      case 'category':
        return a.category.localeCompare(b.category);
      default:
        return 0;
    }
  });

  if (blocks.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No floor blocks match your filters
      </div>
    );
  }

  return (
    <div>
      {/* Sort Controls */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm text-gray-600">Sort by:</span>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="text-sm border border-gray-300 rounded px-2 py-1"
        >
          <option value="flowScore">Flow Score</option>
          <option value="length">Length</option>
          <option value="category">Category</option>
        </select>
      </div>

      {/* Block Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sortedBlocks.map(block => (
          <div
            key={block.id}
            className={`border rounded-lg p-4 ${
              block.category === 'warmups'
                ? 'border-green-200 bg-green-50'
                : 'border-yellow-200 bg-yellow-50'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded ${
                  block.category === 'warmups'
                    ? 'bg-green-200 text-green-700'
                    : 'bg-yellow-200 text-yellow-700'
                }`}>
                  {block.category}
                </span>
                <span className="text-sm text-gray-600">{block.length} min</span>
              </div>
              <FlowScoreBadge score={block.flowScore} rating={getRatingFromScore(block.flowScore)} />
            </div>

            <div className="space-y-1 mb-3">
              {block.content.map((line, i) => (
                <div key={i} className={`text-sm ${
                  i === block.content.length - 1 ? 'text-red-700 font-medium' : 'text-gray-700'
                }`}>
                  {line}
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-1">
              {block.bodyFocus.slice(0, 3).map(focus => (
                <span key={focus} className="text-xs px-2 py-0.5 rounded bg-gray-200 text-gray-600">
                  {focus}
                </span>
              ))}
              {block.movementPatterns.slice(0, 2).map(pattern => (
                <span key={pattern} className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-600">
                  {pattern}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// Tread Blocks Tab
// ============================================================================

interface TreadBlocksTabProps {
  blocks: TreadBlockMetadata[];
}

function TreadBlocksTab({ blocks }: TreadBlocksTabProps) {
  const [sortBy, setSortBy] = useState<'intensity' | 'avgSpeed' | 'category'>('avgSpeed');

  const sortedBlocks = [...blocks].sort((a, b) => {
    switch (sortBy) {
      case 'avgSpeed':
        return b.avgSpeed - a.avgSpeed;
      case 'intensity':
        const intensityOrder = { high: 3, medium: 2, low: 1 };
        return intensityOrder[b.intensity] - intensityOrder[a.intensity];
      case 'category':
        return a.category.localeCompare(b.category);
      default:
        return 0;
    }
  });

  if (blocks.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No tread blocks match your filters
      </div>
    );
  }

  return (
    <div>
      {/* Sort Controls */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm text-gray-600">Sort by:</span>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="text-sm border border-gray-300 rounded px-2 py-1"
        >
          <option value="avgSpeed">Average Speed</option>
          <option value="intensity">Intensity</option>
          <option value="category">Category</option>
        </select>
      </div>

      {/* Block Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sortedBlocks.map(block => (
          <div
            key={block.id}
            className={`border rounded-lg p-4 ${
              block.category === 'warmups'
                ? 'border-green-200 bg-green-50'
                : 'border-blue-200 bg-blue-50'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded ${
                  block.category === 'warmups'
                    ? 'bg-green-200 text-green-700'
                    : 'bg-blue-200 text-blue-700'
                }`}>
                  {block.category}
                </span>
                <span className="text-sm text-gray-600">{block.length} min</span>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded ${
                block.intensity === 'high' ? 'bg-red-100 text-red-700' :
                block.intensity === 'low' ? 'bg-green-100 text-green-700' :
                'bg-yellow-100 text-yellow-700'
              }`}>
                {block.intensity}
              </span>
            </div>

            <div className="space-y-1 mb-3">
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

            <div className="flex flex-wrap gap-2 text-xs text-gray-600">
              <span className="px-2 py-0.5 bg-gray-100 rounded">Base: {block.baseSpeed}</span>
              <span className="px-2 py-0.5 bg-gray-100 rounded">Avg: {block.avgSpeed}</span>
              {block.hasIncline && (
                <span className="px-2 py-0.5 bg-red-100 text-red-600 rounded">
                  {block.maxIncline}% incline
                </span>
              )}
              {block.hasSprint && (
                <span className="px-2 py-0.5 bg-purple-100 text-purple-600 rounded">
                  {block.sprintCount} sprint{block.sprintCount > 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
