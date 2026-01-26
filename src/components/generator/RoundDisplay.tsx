import React, { useState, useMemo } from 'react';
import { Round, TreadEntry, FloorEntry } from '../../types';
import { TreadRow } from './TreadRow';
import { FloorRow } from './FloorRow';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import {
  getNextFloorBlock,
  getNextTreadBlock,
  BlockCategory
} from '../../data/exerciseBlocks';
import { addCustomBlock } from '../../services/customBlocksService';
import { formatMinuteRange } from '../../utils/formatUtils';

interface RoundDisplayProps {
  round: Round;
  onRoundChange: (round: Round) => void;
  isEditing: boolean;
}

// Group entries by blockIndex to identify block boundaries
interface BlockInfo {
  blockIndex: number;
  startIdx: number;
  endIdx: number;
  blockType: 'warmup' | 'workout';
  libraryIndex: number;
  libraryTotal: number;
  blockLength: number;
  isCustomBlock: boolean;
}

function getBlocksFromEntries(entries: (TreadEntry | FloorEntry)[]): BlockInfo[] {
  const blocks: BlockInfo[] = [];
  let currentBlock: BlockInfo | null = null;

  entries.forEach((entry, idx) => {
    if (!currentBlock || entry.blockIndex !== currentBlock.blockIndex) {
      if (currentBlock) {
        blocks.push(currentBlock);
      }
      currentBlock = {
        blockIndex: entry.blockIndex || 0,
        startIdx: idx,
        endIdx: idx,
        blockType: entry.blockType || 'workout',
        libraryIndex: entry.libraryIndex || 0,
        libraryTotal: entry.libraryTotal || 0,
        blockLength: entry.blockLength || 3,
        isCustomBlock: entry.isCustomBlock || false
      };
    } else {
      currentBlock.endIdx = idx;
    }
  });

  if (currentBlock) {
    blocks.push(currentBlock);
  }

  return blocks;
}

export function RoundDisplay({ round, onRoundChange, isEditing }: RoundDisplayProps) {
  // Track which blocks have been modified (for save button)
  const [modifiedBlocks, setModifiedBlocks] = useState<Set<string>>(new Set());

  const treadBlocks = useMemo(() => getBlocksFromEntries(round.tread), [round.tread]);
  const floorBlocks = useMemo(() => getBlocksFromEntries(round.floor), [round.floor]);

  const handleTreadChange = (index: number, entry: TreadEntry) => {
    const newTread = [...round.tread];
    newTread[index] = entry;
    onRoundChange({ ...round, tread: newTread });

    // Mark this block as modified
    const blockInfo = treadBlocks.find(b => index >= b.startIdx && index <= b.endIdx);
    if (blockInfo) {
      setModifiedBlocks(prev => new Set(prev).add(`tread-${blockInfo.blockIndex}`));
    }
  };

  const handleFloorChange = (index: number, entry: FloorEntry) => {
    const newFloor = [...round.floor];
    newFloor[index] = entry;
    onRoundChange({ ...round, floor: newFloor });

    // Mark this block as modified
    const blockInfo = floorBlocks.find(b => index >= b.startIdx && index <= b.endIdx);
    if (blockInfo) {
      setModifiedBlocks(prev => new Set(prev).add(`floor-${blockInfo.blockIndex}`));
    }
  };

  const handleForecastChange = (forecast: string) => {
    onRoundChange({ ...round, forecast });
  };

  // Shuffle to next tread block
  const handleShuffleTread = (blockInfo: BlockInfo) => {
    const category: BlockCategory = blockInfo.blockType === 'warmup' ? 'warmups' : 'workouts';
    const nextBlock = getNextTreadBlock(category, blockInfo.blockLength, blockInfo.libraryIndex);

    if (nextBlock) {
      const newTread = [...round.tread];
      const blockEntries = newTread.slice(blockInfo.startIdx, blockInfo.endIdx + 1);

      // Update each entry in this block with new content
      blockEntries.forEach((entry, i) => {
        const newRaw = nextBlock.block[i] || nextBlock.block[nextBlock.block.length - 1];
        newTread[blockInfo.startIdx + i] = {
          ...entry,
          raw: newRaw,
          libraryIndex: nextBlock.index,
          libraryTotal: nextBlock.total,
          isCustomBlock: nextBlock.isCustom
        };
      });

      onRoundChange({ ...round, tread: newTread });
    }
  };

  // Shuffle to next floor block
  const handleShuffleFloor = (blockInfo: BlockInfo) => {
    const category: BlockCategory = blockInfo.blockType === 'warmup' ? 'warmups' : 'workouts';
    const nextBlock = getNextFloorBlock(category, blockInfo.blockLength, blockInfo.libraryIndex, round.equipment);

    if (nextBlock) {
      const newFloor = [...round.floor];
      const blockEntries = newFloor.slice(blockInfo.startIdx, blockInfo.endIdx + 1);

      // Update each entry in this block with new content
      blockEntries.forEach((entry, i) => {
        const newExercises = nextBlock.block[i] || nextBlock.block[nextBlock.block.length - 1];
        newFloor[blockInfo.startIdx + i] = {
          ...entry,
          exercises: newExercises,
          libraryIndex: nextBlock.index,
          libraryTotal: nextBlock.total,
          isCustomBlock: nextBlock.isCustom
        };
      });

      onRoundChange({ ...round, floor: newFloor });
    }
  };

  // Save modified block as custom block
  const handleSaveTreadBlock = (blockInfo: BlockInfo) => {
    const blockEntries = round.tread.slice(blockInfo.startIdx, blockInfo.endIdx + 1);
    const blockContent = blockEntries.map(e => e.raw);
    const category: BlockCategory = blockInfo.blockType === 'warmup' ? 'warmups' : 'workouts';

    addCustomBlock(blockContent, 'tread', category);

    // Clear modified state and update entries to show as custom
    setModifiedBlocks(prev => {
      const next = new Set(prev);
      next.delete(`tread-${blockInfo.blockIndex}`);
      return next;
    });

    alert(`Tread block saved as custom ${category.slice(0, -1)} block!`);
  };

  const handleSaveFloorBlock = (blockInfo: BlockInfo) => {
    const blockEntries = round.floor.slice(blockInfo.startIdx, blockInfo.endIdx + 1);
    const blockContent = blockEntries.map(e => e.exercises);
    const category: BlockCategory = blockInfo.blockType === 'warmup' ? 'warmups' : 'workouts';

    addCustomBlock(blockContent, 'floor', category);

    // Clear modified state
    setModifiedBlocks(prev => {
      const next = new Set(prev);
      next.delete(`floor-${blockInfo.blockIndex}`);
      return next;
    });

    alert(`Floor block saved as custom ${category.slice(0, -1)} block!`);
  };

  const maxRows = Math.max(round.tread.length, round.floor.length);

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Header */}
      <div className="bg-header text-white px-4 py-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">Round {round.number}</h3>
          <span className="text-orange-100">
            {round.duration} min | {round.equipment}
          </span>
        </div>
      </div>

      {/* Forecast */}
      <div className="px-4 py-2 bg-orange-50 border-b border-orange-100">
        {isEditing ? (
          <Input
            placeholder="Floor forecast (optional)"
            value={round.forecast || ''}
            onChange={(e) => handleForecastChange(e.target.value)}
            className="text-sm"
          />
        ) : (
          <p className="text-sm text-gray-600">
            <span className="font-medium">Floor Forecast:</span>{' '}
            {round.forecast || 'Not set'}
          </p>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-4 py-2 text-sm font-medium text-gray-600 w-16">Min</th>
              <th className="text-left px-4 py-2 text-sm font-medium text-gray-600">Tread</th>
              <th className="text-left px-4 py-2 text-sm font-medium text-gray-600">Floor</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: maxRows }).map((_, index) => {
              const treadEntry = round.tread[index];
              const floorEntry = round.floor[index];
              const prevTreadEntry = index > 0 ? round.tread[index - 1] : null;
              const prevFloorEntry = index > 0 ? round.floor[index - 1] : null;

              // Check if this is the start of a new block
              const isNewTreadBlock = treadEntry?.blockIndex !== prevTreadEntry?.blockIndex;
              const isNewFloorBlock = floorEntry?.blockIndex !== prevFloorEntry?.blockIndex;
              const isNewBlock = isNewTreadBlock || isNewFloorBlock;

              // Get block info for shuffle/save buttons
              const treadBlockInfo = treadBlocks.find(b => index >= b.startIdx && index <= b.endIdx);
              const floorBlockInfo = floorBlocks.find(b => index >= b.startIdx && index <= b.endIdx);

              const isTreadModified = treadBlockInfo && modifiedBlocks.has(`tread-${treadBlockInfo.blockIndex}`);
              const isFloorModified = floorBlockInfo && modifiedBlocks.has(`floor-${floorBlockInfo.blockIndex}`);

              return (
                <tr
                  key={index}
                  className={`border-b border-gray-100 hover:bg-gray-50 ${
                    isNewBlock ? 'border-t-2 border-t-gray-300' : ''
                  }`}
                >
                  <td className="px-4 py-2 font-mono text-sm text-gray-500">
                    {treadEntry?.minute || floorEntry?.minute || `${index}-${index + 1}`}
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex items-start gap-2">
                      {treadEntry && isNewTreadBlock && treadEntry.libraryIndex && treadBlockInfo && (
                        <div className="flex items-center gap-1">
                          <span
                            className={`text-xs px-1.5 py-0.5 rounded font-medium whitespace-nowrap cursor-pointer ${
                              treadEntry.blockType === 'warmup'
                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                            } ${treadEntry.isCustomBlock ? 'ring-1 ring-purple-400' : ''}`}
                            title={`Tread ${treadEntry.blockType === 'warmup' ? 'Warmup' : 'Workout'} Block #${treadEntry.libraryIndex} of ${treadEntry.libraryTotal}${treadEntry.isCustomBlock ? ' (Custom)' : ''} - Click to shuffle`}
                            onClick={() => isEditing && handleShuffleTread(treadBlockInfo)}
                          >
                            T{treadEntry.blockType === 'warmup' ? 'W' : ''}{treadEntry.libraryIndex}
                            {treadEntry.isCustomBlock && '*'}
                          </span>
                          {isEditing && (
                            <button
                              onClick={() => handleShuffleTread(treadBlockInfo)}
                              className="text-xs text-gray-400 hover:text-gray-600"
                              title="Shuffle to next block"
                            >
                              ↻
                            </button>
                          )}
                          {isEditing && isTreadModified && (
                            <button
                              onClick={() => handleSaveTreadBlock(treadBlockInfo)}
                              className="text-xs px-1 py-0.5 bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
                              title="Save as new custom block"
                            >
                              Save
                            </button>
                          )}
                        </div>
                      )}
                      {treadEntry && (!isNewTreadBlock || !treadEntry.libraryIndex) && (
                        <span className="w-8"></span>
                      )}
                      {treadEntry && (
                        <TreadRow
                          entry={treadEntry}
                          onChange={(e) => handleTreadChange(index, e)}
                          isEditing={isEditing}
                        />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex items-start gap-2">
                      {floorEntry && isNewFloorBlock && floorEntry.libraryIndex && floorBlockInfo && (
                        <div className="flex items-center gap-1">
                          <span
                            className={`text-xs px-1.5 py-0.5 rounded font-medium whitespace-nowrap cursor-pointer ${
                              floorEntry.blockType === 'warmup'
                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                            } ${floorEntry.isCustomBlock ? 'ring-1 ring-purple-400' : ''}`}
                            title={`Floor ${floorEntry.blockType === 'warmup' ? 'Warmup' : 'Workout'} Block #${floorEntry.libraryIndex} of ${floorEntry.libraryTotal}${floorEntry.isCustomBlock ? ' (Custom)' : ''} - Click to shuffle`}
                            onClick={() => isEditing && handleShuffleFloor(floorBlockInfo)}
                          >
                            F{floorEntry.blockType === 'warmup' ? 'W' : ''}{floorEntry.libraryIndex}
                            {floorEntry.isCustomBlock && '*'}
                          </span>
                          {isEditing && (
                            <button
                              onClick={() => handleShuffleFloor(floorBlockInfo)}
                              className="text-xs text-gray-400 hover:text-gray-600"
                              title="Shuffle to next block"
                            >
                              ↻
                            </button>
                          )}
                          {isEditing && isFloorModified && (
                            <button
                              onClick={() => handleSaveFloorBlock(floorBlockInfo)}
                              className="text-xs px-1 py-0.5 bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
                              title="Save as new custom block"
                            >
                              Save
                            </button>
                          )}
                        </div>
                      )}
                      {floorEntry && (!isNewFloorBlock || !floorEntry.libraryIndex) && (
                        <span className="w-8"></span>
                      )}
                      {floorEntry && (
                        <FloorRow
                          entry={floorEntry}
                          onChange={(e) => handleFloorChange(index, e)}
                          isEditing={isEditing}
                        />
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
