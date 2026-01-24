// ============================================================================
// Exercise Blocks Data Layer
// Provides block data from imported classes (via indexingService)
// All hardcoded blocks have been removed - blocks come from imports only
// ============================================================================

import { Equipment } from '../types';
import { detectBlockEquipment, isEquipmentCompatible, BlockEquipment } from '../services/blockEquipmentService';
import { loadIndexFromStorage } from '../services/indexingService';
import { getCustomBlocks } from '../services/customBlocksService';
import { BlockMetadata, TreadBlockMetadata } from '../types/hierarchyTypes';

// ============================================================================
// Types
// ============================================================================

export type BlockLength = 2 | 3 | 4;
export type BlockCategory = 'warmups' | 'workouts';

export interface BlockLibrary {
  warmups: { [key: number]: string[][] };
  workouts: { [key: number]: string[][] };
}

export interface BlockSelection {
  block: string[];
  index: number; // 1-based index in the library
  total: number; // Total blocks available for this category/length
  isCustom?: boolean; // Whether this is a custom block
  customId?: string; // ID if custom block
  sourceBlockId?: string; // ID of the source block in the index
}

// Extended block info with equipment
export interface FloorBlockInfo {
  block: string[];
  isCustom: boolean;
  customId?: string;
  equipment: BlockEquipment;
  sourceBlockId?: string;
}

export interface TreadBlockInfo {
  block: string[];
  isCustom: boolean;
  customId?: string;
  sourceBlockId?: string;
}

// ============================================================================
// Legacy FLOOR_BLOCKS and TREAD_BLOCKS (empty - data comes from imports)
// These are kept for backwards compatibility but are empty
// ============================================================================

export const FLOOR_BLOCKS: BlockLibrary = {
  warmups: {},
  workouts: {}
};

export const TREAD_BLOCKS: BlockLibrary = {
  warmups: {},
  workouts: {}
};

// ============================================================================
// Data Loading Functions
// ============================================================================

/**
 * Get floor blocks from indexed imported data
 */
function getIndexedFloorBlocks(category: BlockCategory, length: BlockLength): BlockMetadata[] {
  const indexed = loadIndexFromStorage();
  if (!indexed || !indexed.floorBlocks || indexed.floorBlocks.length === 0) {
    return [];
  }

  return indexed.floorBlocks.filter(
    (block: BlockMetadata) => block.category === category && block.length === length
  );
}

/**
 * Get tread blocks from indexed imported data
 */
function getIndexedTreadBlocks(category: BlockCategory, length: BlockLength): TreadBlockMetadata[] {
  const indexed = loadIndexFromStorage();
  if (!indexed || !indexed.treadBlocks || indexed.treadBlocks.length === 0) {
    return [];
  }

  return indexed.treadBlocks.filter(
    (block: TreadBlockMetadata) => block.category === category && block.length === length
  );
}

/**
 * Check if any imported data exists
 */
export function hasImportedData(): boolean {
  const indexed = loadIndexFromStorage();
  return indexed !== null &&
    (indexed.floorBlocks?.length > 0 || indexed.treadBlocks?.length > 0);
}

/**
 * Get count of imported blocks
 */
export function getImportedBlockCounts(): {
  floorWarmups: number;
  floorWorkouts: number;
  treadWarmups: number;
  treadWorkouts: number;
} {
  const indexed = loadIndexFromStorage();
  if (!indexed) {
    return { floorWarmups: 0, floorWorkouts: 0, treadWarmups: 0, treadWorkouts: 0 };
  }

  return {
    floorWarmups: indexed.floorBlocks?.filter((b: BlockMetadata) => b.category === 'warmups').length || 0,
    floorWorkouts: indexed.floorBlocks?.filter((b: BlockMetadata) => b.category === 'workouts').length || 0,
    treadWarmups: indexed.treadBlocks?.filter((b: TreadBlockMetadata) => b.category === 'warmups').length || 0,
    treadWorkouts: indexed.treadBlocks?.filter((b: TreadBlockMetadata) => b.category === 'workouts').length || 0,
  };
}

// ============================================================================
// Block Access Functions
// ============================================================================

/**
 * Get all floor blocks (imported + custom) for a category/length
 * Optionally filter by equipment compatibility
 */
export function getAllFloorBlocks(
  category: BlockCategory,
  length: BlockLength | number,
  equipment?: Equipment
): FloorBlockInfo[] {
  // Get blocks from indexed imported data
  const indexed = getIndexedFloorBlocks(category, length as BlockLength);
  const importedBlocks: FloorBlockInfo[] = indexed.map(block => ({
    block: block.content,
    isCustom: false,
    equipment: detectBlockEquipment(block.content),
    sourceBlockId: block.id
  }));

  // Get custom blocks
  const custom = getCustomBlocks('floor', category, length).map(cb => ({
    block: cb.block,
    isCustom: true,
    customId: cb.id,
    equipment: detectBlockEquipment(cb.block)
  }));

  const allBlocks = [...importedBlocks, ...custom];

  // Filter by equipment if specified
  if (equipment) {
    return allBlocks.filter(b => isEquipmentCompatible(b.equipment, equipment));
  }

  return allBlocks;
}

/**
 * Get all tread blocks (imported + custom) for a category/length
 */
export function getAllTreadBlocks(
  category: BlockCategory,
  length: BlockLength | number
): TreadBlockInfo[] {
  // Get blocks from indexed imported data
  const indexed = getIndexedTreadBlocks(category, length as BlockLength);
  const importedBlocks: TreadBlockInfo[] = indexed.map(block => ({
    block: block.content,
    isCustom: false,
    sourceBlockId: block.id
  }));

  // Get custom blocks
  const custom = getCustomBlocks('tread', category, length).map(cb => ({
    block: cb.block,
    isCustom: true,
    customId: cb.id
  }));

  return [...importedBlocks, ...custom];
}

/**
 * Get a random floor block for a category/length
 */
export function getRandomFloorBlock(
  category: BlockCategory,
  length: BlockLength | number,
  equipment?: Equipment
): BlockSelection | null {
  const allBlocks = getAllFloorBlocks(category, length as BlockLength, equipment);
  if (allBlocks.length === 0) return null;

  const index = Math.floor(Math.random() * allBlocks.length);
  const selected = allBlocks[index];

  return {
    block: selected.block,
    index: index + 1,
    total: allBlocks.length,
    isCustom: selected.isCustom,
    customId: selected.customId,
    sourceBlockId: selected.sourceBlockId
  };
}

/**
 * Get a random tread block for a category/length
 */
export function getRandomTreadBlock(
  category: BlockCategory,
  length: BlockLength | number
): BlockSelection | null {
  const allBlocks = getAllTreadBlocks(category, length as BlockLength);
  if (allBlocks.length === 0) return null;

  const index = Math.floor(Math.random() * allBlocks.length);
  const selected = allBlocks[index];

  return {
    block: selected.block,
    index: index + 1,
    total: allBlocks.length,
    isCustom: selected.isCustom,
    customId: selected.customId,
    sourceBlockId: selected.sourceBlockId
  };
}

/**
 * Get a specific floor block by index (for shuffling)
 */
export function getFloorBlockByIndex(
  category: BlockCategory,
  length: BlockLength | number,
  index: number,
  equipment?: Equipment
): BlockSelection | null {
  const allBlocks = getAllFloorBlocks(category, length as BlockLength, equipment);
  if (index < 1 || index > allBlocks.length) return null;

  const selected = allBlocks[index - 1];
  return {
    block: selected.block,
    index,
    total: allBlocks.length,
    isCustom: selected.isCustom,
    customId: selected.customId,
    sourceBlockId: selected.sourceBlockId
  };
}

/**
 * Get a specific tread block by index (for shuffling)
 */
export function getTreadBlockByIndex(
  category: BlockCategory,
  length: BlockLength | number,
  index: number
): BlockSelection | null {
  const allBlocks = getAllTreadBlocks(category, length as BlockLength);
  if (index < 1 || index > allBlocks.length) return null;

  const selected = allBlocks[index - 1];
  return {
    block: selected.block,
    index,
    total: allBlocks.length,
    isCustom: selected.isCustom,
    customId: selected.customId,
    sourceBlockId: selected.sourceBlockId
  };
}

/**
 * Get next floor block (for shuffling through blocks)
 */
export function getNextFloorBlock(
  category: BlockCategory,
  length: BlockLength | number,
  currentIndex: number,
  equipment?: Equipment
): BlockSelection | null {
  const allBlocks = getAllFloorBlocks(category, length as BlockLength, equipment);
  if (allBlocks.length === 0) return null;

  const nextIndex = currentIndex >= allBlocks.length ? 1 : currentIndex + 1;
  return getFloorBlockByIndex(category, length, nextIndex, equipment);
}

/**
 * Get next tread block (for shuffling through blocks)
 */
export function getNextTreadBlock(
  category: BlockCategory,
  length: BlockLength | number,
  currentIndex: number
): BlockSelection | null {
  const allBlocks = getAllTreadBlocks(category, length as BlockLength);
  if (allBlocks.length === 0) return null;

  const nextIndex = currentIndex >= allBlocks.length ? 1 : currentIndex + 1;
  return getTreadBlockByIndex(category, length, nextIndex);
}

/**
 * Get available lengths for a category
 * Based on imported data and custom blocks
 */
export function getAvailableLengths(category: BlockCategory): number[] {
  const indexed = loadIndexFromStorage();
  const lengths = new Set<number>();

  // Add lengths from imported floor blocks
  if (indexed?.floorBlocks) {
    indexed.floorBlocks
      .filter((b: BlockMetadata) => b.category === category)
      .forEach((b: BlockMetadata) => lengths.add(b.length));
  }

  // Add lengths from imported tread blocks
  if (indexed?.treadBlocks) {
    indexed.treadBlocks
      .filter((b: TreadBlockMetadata) => b.category === category)
      .forEach((b: TreadBlockMetadata) => lengths.add(b.length));
  }

  // Add lengths from custom blocks
  const customFloor = getCustomBlocks('floor', category, 2)
    .concat(getCustomBlocks('floor', category, 3))
    .concat(getCustomBlocks('floor', category, 4));
  const customTread = getCustomBlocks('tread', category, 2)
    .concat(getCustomBlocks('tread', category, 3))
    .concat(getCustomBlocks('tread', category, 4));

  customFloor.forEach(cb => lengths.add(cb.block.length));
  customTread.forEach(cb => lengths.add(cb.block.length));

  // If no data exists, return default lengths
  if (lengths.size === 0) {
    return [2, 3, 4];
  }

  return Array.from(lengths).sort((a, b) => a - b);
}
