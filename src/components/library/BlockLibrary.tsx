import React, { useState, useEffect, useMemo } from 'react';
import { getAllFloorBlocks, getAllTreadBlocks, hasImportedData, getImportedBlockCounts } from '../../data/exerciseBlocks';
import {
  getCustomBlockCounts,
  deleteCustomBlock
} from '../../services/customBlocksService';
import {
  detectFloorBlockTags,
  detectTreadBlockTags,
  TAG_LABELS,
  TAG_COLORS,
  getTagsAsArray,
  blockMatchesSearch,
  FloorBlockTags,
  TreadBlockTags
} from '../../services/blockTagsService';
import {
  analyzeTreadBlock,
  CHARACTER_LABELS,
  TreadBlockProfile
} from '../../services/treadFlowService';
import {
  detectBlockEquipment,
  getEquipmentLabel,
  getEquipmentColor,
  BlockEquipment
} from '../../services/blockEquipmentService';

type BlockType = 'floor' | 'tread';
type BlockCategory = 'warmups' | 'workouts';

interface DisplayBlock {
  block: string[];
  isCustom: boolean;
  customId?: string;
  tags: FloorBlockTags | TreadBlockTags;
  flowProfile?: TreadBlockProfile;  // Only for tread blocks
  equipment?: BlockEquipment;       // Only for floor blocks
}

export function BlockLibrary() {
  const [blockType, setBlockType] = useState<BlockType>('floor');
  const [category, setCategory] = useState<BlockCategory>('warmups');
  const [selectedLength, setSelectedLength] = useState<number>(3);
  const [customCounts, setCustomCounts] = useState(getCustomBlockCounts());
  const [refreshKey, setRefreshKey] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());

  // Refresh custom counts when needed
  useEffect(() => {
    setCustomCounts(getCustomBlockCounts());
  }, [refreshKey]);

  // Get all blocks with tags, flow profiles, and equipment
  const allBlocks = useMemo((): DisplayBlock[] => {
    const rawBlocks = blockType === 'floor'
      ? getAllFloorBlocks(category, selectedLength)
      : getAllTreadBlocks(category, selectedLength);

    return rawBlocks.map(b => ({
      ...b,
      tags: blockType === 'floor'
        ? detectFloorBlockTags(b.block)
        : detectTreadBlockTags(b.block),
      flowProfile: blockType === 'tread' ? analyzeTreadBlock(b.block) : undefined,
      equipment: blockType === 'floor' ? detectBlockEquipment(b.block) : undefined
    }));
  }, [blockType, category, selectedLength, refreshKey]);

  // Filter blocks based on search and selected tags
  const filteredBlocks = useMemo(() => {
    return allBlocks.filter(displayBlock => {
      // Check search query
      if (searchQuery && !blockMatchesSearch(displayBlock.block, displayBlock.tags, searchQuery)) {
        return false;
      }

      // Check selected tags
      if (selectedTags.size > 0) {
        const blockTagArray = getTagsAsArray(displayBlock.tags);
        const hasAllTags = Array.from(selectedTags).every(tag => blockTagArray.includes(tag));
        if (!hasAllTags) return false;
      }

      return true;
    });
  }, [allBlocks, searchQuery, selectedTags]);

  // Get unique tags from current blocks for filter chips
  const availableTags = useMemo(() => {
    const tagCounts = new Map<string, number>();

    allBlocks.forEach(block => {
      const tags = getTagsAsArray(block.tags);
      tags.forEach(tag => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      });
    });

    return Array.from(tagCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([tag]) => tag);
  }, [allBlocks]);

  // Get available lengths from the data
  const availableLengths = useMemo(() => {
    // Check what lengths have data
    const lengths: number[] = [];
    [2, 3, 4].forEach(len => {
      const floorBlocks = blockType === 'floor'
        ? getAllFloorBlocks(category, len)
        : getAllTreadBlocks(category, len);
      if (floorBlocks.length > 0) {
        lengths.push(len);
      }
    });
    return lengths.length > 0 ? lengths : [2, 3, 4]; // Default if no data
  }, [blockType, category, refreshKey]);

  // Get counts for summary from imported data
  const importedCounts = useMemo(() => getImportedBlockCounts(), [refreshKey]);
  const { floorWarmups: floorWarmupCount, floorWorkouts: floorWorkoutCount,
          treadWarmups: treadWarmupCount, treadWorkouts: treadWorkoutCount } = importedCounts;

  // Check if we have any data
  const hasData = useMemo(() => hasImportedData(), [refreshKey]);

  const handleDeleteCustomBlock = (customId: string) => {
    if (window.confirm('Are you sure you want to delete this custom block?')) {
      deleteCustomBlock(customId);
      setRefreshKey(prev => prev + 1);
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => {
      const next = new Set(prev);
      if (next.has(tag)) {
        next.delete(tag);
      } else {
        next.add(tag);
      }
      return next;
    });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTags(new Set());
  };

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
          {customCounts.floorWarmups > 0 && (
            <div className="text-xs text-purple-600 mt-1">+{customCounts.floorWarmups} custom</div>
          )}
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-yellow-700">{floorWorkoutCount}</div>
          <div className="text-sm text-yellow-600">Floor Workouts</div>
          {customCounts.floorWorkouts > 0 && (
            <div className="text-xs text-purple-600 mt-1">+{customCounts.floorWorkouts} custom</div>
          )}
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-700">{treadWarmupCount}</div>
          <div className="text-sm text-blue-600">Tread Warmups</div>
          {customCounts.treadWarmups > 0 && (
            <div className="text-xs text-purple-600 mt-1">+{customCounts.treadWarmups} custom</div>
          )}
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-700">{treadWorkoutCount}</div>
          <div className="text-sm text-purple-600">Tread Workouts</div>
          {customCounts.treadWorkouts > 0 && (
            <div className="text-xs text-purple-600 mt-1">+{customCounts.treadWorkouts} custom</div>
          )}
        </div>
      </div>

      {/* Empty state - no imported data */}
      {!hasData && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
          <div className="text-4xl mb-4">📊</div>
          <h3 className="text-lg font-semibold text-blue-900 mb-2">No Blocks Available</h3>
          <p className="text-blue-700 mb-4">
            Import a class spreadsheet to populate your block library.
          </p>
          <p className="text-sm text-blue-600">
            Go to the <span className="font-semibold">Import</span> tab to upload your class data.
          </p>
        </div>
      )}

      {/* Search Bar and content - only show if we have data */}
      {hasData && (
      <>
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex gap-4 items-center">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search blocks by content or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          {(searchQuery || selectedTags.size > 0) && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Tag Filter Chips */}
        {availableTags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="text-sm text-gray-500 py-1">Filter by:</span>
            {availableTags.slice(0, 12).map(tag => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`text-xs px-2 py-1 rounded-full transition-all ${
                  selectedTags.has(tag)
                    ? 'ring-2 ring-offset-1 ring-gray-400 ' + TAG_COLORS[tag]
                    : TAG_COLORS[tag] + ' opacity-70 hover:opacity-100'
                }`}
              >
                {TAG_LABELS[tag] || tag}
                {selectedTags.has(tag) && ' ✓'}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-wrap gap-4 items-center">
          {/* Block Type Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => { setBlockType('floor'); setSelectedTags(new Set()); }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                blockType === 'floor'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Floor Blocks
            </button>
            <button
              onClick={() => { setBlockType('tread'); setSelectedTags(new Set()); }}
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
        Showing {filteredBlocks.length} of {allBlocks.length} {blockType} {category} ({selectedLength} min each)
        {filteredBlocks.filter(b => b.isCustom).length > 0 && (
          <span className="text-purple-600 ml-2">
            ({filteredBlocks.filter(b => b.isCustom).length} custom)
          </span>
        )}
      </div>

      {/* Block List */}
      <div className="grid gap-4">
        {filteredBlocks.map((displayBlock, index) => {
          const tagArray = getTagsAsArray(displayBlock.tags);

          return (
            <div
              key={displayBlock.customId || `${blockType}-${category}-${selectedLength}-${index}`}
              className={`bg-white rounded-lg shadow p-4 border-l-4 ${
                displayBlock.isCustom
                  ? 'border-purple-500 ring-1 ring-purple-200'
                  : category === 'warmups'
                    ? 'border-green-500'
                    : 'border-yellow-500'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-500">
                    Block #{index + 1} • {displayBlock.block.length} min
                  </span>
                  {displayBlock.isCustom && (
                    <span className="text-xs px-2 py-0.5 rounded bg-purple-100 text-purple-700">
                      CUSTOM
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded ${
                    blockType === 'floor'
                      ? 'bg-orange-100 text-orange-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {blockType === 'floor' ? 'FLOOR' : 'TREAD'}
                  </span>
                  {displayBlock.isCustom && displayBlock.customId && (
                    <button
                      onClick={() => handleDeleteCustomBlock(displayBlock.customId!)}
                      className="text-xs px-2 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                      title="Delete custom block"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>

              {/* Tags */}
              {tagArray.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {tagArray.map(tag => (
                    <span
                      key={tag}
                      className={`text-xs px-2 py-0.5 rounded ${TAG_COLORS[tag] || 'bg-gray-100 text-gray-700'}`}
                    >
                      {TAG_LABELS[tag] || tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Equipment (Floor blocks only) */}
              {blockType === 'floor' && displayBlock.equipment && (
                <div className="mb-3">
                  <span
                    className={`text-xs px-2 py-1 rounded font-medium ${getEquipmentColor(displayBlock.equipment)}`}
                    title="Required equipment for this block"
                  >
                    {getEquipmentLabel(displayBlock.equipment)}
                  </span>
                </div>
              )}

              {/* Flow Profile (Tread blocks only) */}
              {blockType === 'tread' && displayBlock.flowProfile && (
                <div className="flex flex-wrap gap-3 mb-3 text-xs text-gray-600 bg-gray-50 rounded p-2">
                  <span title="Base speed (lowest in first set)">
                    <span className="font-medium">Base:</span> {displayBlock.flowProfile.baseSpeed}
                  </span>
                  {displayBlock.flowProfile.hasIncline && (
                    <span className="text-red-600" title="Maximum incline percentage">
                      <span className="font-medium">Incline:</span> {displayBlock.flowProfile.maxIncline}%
                    </span>
                  )}
                  {displayBlock.flowProfile.hasSprint && (
                    <span className="text-purple-600" title="Number of sprint entries">
                      <span className="font-medium">Sprints:</span> {displayBlock.flowProfile.sprintCount}
                    </span>
                  )}
                  {displayBlock.flowProfile.hasRecover && (
                    <span className="text-green-600" title="Number of recovery entries">
                      <span className="font-medium">Recovers:</span> {displayBlock.flowProfile.recoverCount}
                    </span>
                  )}
                  <span className={`font-medium px-1.5 py-0.5 rounded ${
                    displayBlock.flowProfile.intensity === 'high' ? 'bg-red-100 text-red-700' :
                    displayBlock.flowProfile.intensity === 'low' ? 'bg-green-100 text-green-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {displayBlock.flowProfile.intensity.charAt(0).toUpperCase() + displayBlock.flowProfile.intensity.slice(1)}
                  </span>
                  <span className="text-blue-600" title="Block character/style">
                    {CHARACTER_LABELS[displayBlock.flowProfile.character]}
                  </span>
                </div>
              )}

              <div className="space-y-1">
                {displayBlock.block.map((line, lineIndex) => (
                  <div
                    key={lineIndex}
                    className={`flex items-center gap-2 p-2 rounded ${
                      lineIndex === displayBlock.block.length - 1
                        ? 'bg-red-50 border border-red-200'
                        : 'bg-gray-50'
                    }`}
                  >
                    <span className="text-xs text-gray-400 w-6">{lineIndex + 1}</span>
                    <span className={`flex-1 ${
                      lineIndex === displayBlock.block.length - 1 ? 'font-medium text-red-700' : 'text-gray-700'
                    }`}>
                      {line}
                    </span>
                    {lineIndex === displayBlock.block.length - 1 && (
                      <span className="text-xs text-red-500">Hero</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {filteredBlocks.length === 0 && hasData && (
        <div className="text-center py-8 text-gray-500">
          {allBlocks.length === 0
            ? 'No blocks found for this combination'
            : 'No blocks match your search criteria'}
        </div>
      )}
      </>
      )}
    </div>
  );
}
