import React, { useState } from 'react';
import { FLOOR_BLOCKS, TREAD_BLOCKS } from '../../data/exerciseBlocks';

type BlockType = 'floor' | 'tread';
type BlockCategory = 'warmups' | 'workouts';

export function BlockLibrary() {
  const [blockType, setBlockType] = useState<BlockType>('floor');
  const [category, setCategory] = useState<BlockCategory>('warmups');
  const [selectedLength, setSelectedLength] = useState<number>(3);

  const blocks = blockType === 'floor' ? FLOOR_BLOCKS : TREAD_BLOCKS;
  const categoryBlocks = blocks[category];
  const availableLengths = Object.keys(categoryBlocks).map(Number).sort((a, b) => a - b);
  const currentBlocks = categoryBlocks[selectedLength] || [];

  // Get counts for summary
  const floorWarmupCount = Object.values(FLOOR_BLOCKS.warmups).flat().length;
  const floorWorkoutCount = Object.values(FLOOR_BLOCKS.workouts).flat().length;
  const treadWarmupCount = Object.values(TREAD_BLOCKS.warmups).flat().length;
  const treadWorkoutCount = Object.values(TREAD_BLOCKS.workouts).flat().length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Block Library</h1>
        <p className="text-gray-600 mt-2">
          Browse floor and tread blocks extracted from real Total Body classes
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-700">{floorWarmupCount}</div>
          <div className="text-sm text-green-600">Floor Warmups</div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-yellow-700">{floorWorkoutCount}</div>
          <div className="text-sm text-yellow-600">Floor Workouts</div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-700">{treadWarmupCount}</div>
          <div className="text-sm text-blue-600">Tread Warmups</div>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-700">{treadWorkoutCount}</div>
          <div className="text-sm text-purple-600">Tread Workouts</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-wrap gap-4 items-center">
          {/* Block Type Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setBlockType('floor')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                blockType === 'floor'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Floor Blocks
            </button>
            <button
              onClick={() => setBlockType('tread')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                blockType === 'tread'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tread Blocks
            </button>
          </div>

          {/* Category Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setCategory('warmups')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                category === 'warmups'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Warmups
            </button>
            <button
              onClick={() => setCategory('workouts')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                category === 'workouts'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Workouts
            </button>
          </div>

          {/* Length Filter */}
          <div className="flex gap-2 items-center">
            <span className="text-gray-600">Length:</span>
            {availableLengths.map(len => (
              <button
                key={len}
                onClick={() => setSelectedLength(len)}
                className={`px-3 py-1 rounded font-medium transition-colors ${
                  selectedLength === len
                    ? 'bg-gray-800 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {len} min
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="text-gray-600">
        Showing {currentBlocks.length} {blockType} {category} ({selectedLength} min each)
      </div>

      {/* Block List */}
      <div className="grid gap-4">
        {currentBlocks.map((block, index) => (
          <div
            key={index}
            className={`bg-white rounded-lg shadow p-4 border-l-4 ${
              category === 'warmups' ? 'border-green-500' : 'border-yellow-500'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-500">
                Block #{index + 1} • {block.length} min
              </span>
              <span className={`text-xs px-2 py-1 rounded ${
                blockType === 'floor'
                  ? 'bg-orange-100 text-orange-700'
                  : 'bg-blue-100 text-blue-700'
              }`}>
                {blockType === 'floor' ? 'FLOOR' : 'TREAD'}
              </span>
            </div>
            <div className="space-y-1">
              {block.map((line, lineIndex) => (
                <div
                  key={lineIndex}
                  className={`flex items-center gap-2 p-2 rounded ${
                    lineIndex === block.length - 1
                      ? 'bg-red-50 border border-red-200'
                      : 'bg-gray-50'
                  }`}
                >
                  <span className="text-xs text-gray-400 w-6">{lineIndex + 1}</span>
                  <span className={`flex-1 ${
                    lineIndex === block.length - 1 ? 'font-medium text-red-700' : 'text-gray-700'
                  }`}>
                    {line}
                  </span>
                  {lineIndex === block.length - 1 && (
                    <span className="text-xs text-red-500">Hero</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {currentBlocks.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No blocks found for this combination
        </div>
      )}
    </div>
  );
}
