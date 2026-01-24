// ============================================================================
// TreeView Component
// Expandable tree structure: Round 1/2 → Classes → Floor/Tread Blocks → Content
// ============================================================================

import React, { useState } from 'react';
import { LibraryData } from './Library';
import { FlowScoreBadge } from './FlowScoreIndicator';
import { FlowScore } from '../../types/hierarchyTypes';

function getRatingFromScore(score: number): FlowScore['rating'] {
  if (score >= 85) return 'great';
  if (score >= 70) return 'good';
  if (score >= 50) return 'fair';
  return 'poor';
}
import { RoundMetadata, BlockMetadata, TreadBlockMetadata } from '../../types/hierarchyTypes';

interface TreeViewProps {
  data: LibraryData;
}

interface TreeNodeProps {
  label: React.ReactNode;
  children?: React.ReactNode;
  defaultExpanded?: boolean;
  icon?: string;
}

function TreeNode({ label, children, defaultExpanded = false, icon = '📁' }: TreeNodeProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <div className="ml-4">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 py-1 hover:bg-gray-100 rounded px-2 w-full text-left"
      >
        <span className="text-sm">{expanded ? '📂' : icon}</span>
        <span className={`flex-1 ${children ? 'font-medium' : ''}`}>{label}</span>
        {children && (
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform ${expanded ? 'rotate-90' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        )}
      </button>
      {expanded && children && (
        <div className="border-l border-gray-200 ml-3">
          {children}
        </div>
      )}
    </div>
  );
}

function FloorBlockNode({ block }: { block: BlockMetadata }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="ml-4">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 py-1 hover:bg-orange-50 rounded px-2 w-full text-left"
      >
        <span className="text-sm">📄</span>
        <span className="flex-1 text-sm text-gray-700">
          {block.content[0]?.slice(0, 40)}...
        </span>
        <FlowScoreBadge score={block.flowScore} rating={getRatingFromScore(block.flowScore)} />
      </button>
      {expanded && (
        <div className="ml-6 mt-2 p-3 bg-orange-50 rounded-lg border border-orange-200">
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
            {block.movementPatterns.map(pattern => (
              <span key={pattern} className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-600">
                {pattern}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function TreadBlockNode({ block }: { block: TreadBlockMetadata }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="ml-4">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 py-1 hover:bg-blue-50 rounded px-2 w-full text-left"
      >
        <span className="text-sm">📄</span>
        <span className="flex-1 text-sm text-gray-700">
          {block.content[0]?.slice(0, 40)}...
        </span>
        <span className={`text-xs px-2 py-0.5 rounded ${
          block.intensity === 'high' ? 'bg-red-100 text-red-700' :
          block.intensity === 'low' ? 'bg-green-100 text-green-700' :
          'bg-yellow-100 text-yellow-700'
        }`}>
          {block.intensity}
        </span>
      </button>
      {expanded && (
        <div className="ml-6 mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
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
            <span>Avg: {block.avgSpeed}</span>
            {block.hasIncline && <span className="text-red-600">Incline: {block.maxIncline}%</span>}
            {block.hasSprint && <span className="text-purple-600">Sprints: {block.sprintCount}</span>}
          </div>
        </div>
      )}
    </div>
  );
}

export function TreeView({ data }: TreeViewProps) {
  // Group data by round number first
  const round1Rounds = data.rounds.filter(r => r.roundNumber === 1);
  const round2Rounds = data.rounds.filter(r => r.roundNumber === 2);

  // Group classes by ID for lookup
  const classesById = data.classes.reduce((acc, c) => {
    acc[c.id] = c;
    return acc;
  }, {} as Record<string, typeof data.classes[0]>);

  // Group blocks by round ID
  const floorBlocksByRound = data.floorBlocks.reduce((acc, b) => {
    const roundId = `${b.sourceClassId}_r${b.sourceRoundNumber}`;
    if (!acc[roundId]) acc[roundId] = [];
    acc[roundId].push(b);
    return acc;
  }, {} as Record<string, BlockMetadata[]>);

  const treadBlocksByRound = data.treadBlocks.reduce((acc, b) => {
    const roundId = `${b.sourceClassId}_r${b.sourceRoundNumber}`;
    if (!acc[roundId]) acc[roundId] = [];
    acc[roundId].push(b);
    return acc;
  }, {} as Record<string, TreadBlockMetadata[]>);

  const renderRoundTree = (rounds: RoundMetadata[], roundNumber: 1 | 2) => (
    <TreeNode
      label={
        <span className="text-gray-900">
          Round {roundNumber} <span className="text-sm text-gray-500">({rounds.length} rounds)</span>
        </span>
      }
      defaultExpanded={roundNumber === 1}
    >
      {rounds.map(round => {
        const classInfo = classesById[round.sourceClassId];
        const floorBlocks = floorBlocksByRound[round.id] || [];
        const treadBlocks = treadBlocksByRound[round.id] || [];

        return (
          <TreeNode
            key={round.id}
            icon="📅"
            label={
              <span className="text-gray-700">
                {classInfo?.dayOfWeek} {new Date(round.sourceDate).toLocaleDateString()}
                <span className="text-sm text-gray-500 ml-2">
                  {round.duration}min, Avg: {round.treadAverage}
                </span>
              </span>
            }
          >
            {/* Floor Blocks */}
            <TreeNode
              icon="🏋️"
              label={
                <span className="text-orange-700">
                  Floor Blocks <span className="text-sm text-orange-500">({floorBlocks.length})</span>
                </span>
              }
            >
              {floorBlocks.map(block => (
                <FloorBlockNode key={block.id} block={block} />
              ))}
            </TreeNode>

            {/* Tread Blocks */}
            <TreeNode
              icon="🏃"
              label={
                <span className="text-blue-700">
                  Tread Blocks <span className="text-sm text-blue-500">({treadBlocks.length})</span>
                </span>
              }
            >
              {treadBlocks.map(block => (
                <TreadBlockNode key={block.id} block={block} />
              ))}
            </TreeNode>
          </TreeNode>
        );
      })}
    </TreeNode>
  );

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="text-sm text-gray-500 mb-4">
        Click folders to expand/collapse. Click blocks to view content.
      </div>

      {data.rounds.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No rounds match your filters
        </div>
      ) : (
        <div className="space-y-2">
          {round1Rounds.length > 0 && renderRoundTree(round1Rounds, 1)}
          {round2Rounds.length > 0 && renderRoundTree(round2Rounds, 2)}
        </div>
      )}
    </div>
  );
}
