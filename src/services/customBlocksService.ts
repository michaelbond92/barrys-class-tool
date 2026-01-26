// Service for managing custom blocks stored in localStorage

export type BlockType = 'floor' | 'tread';
export type BlockCategory = 'warmups' | 'workouts';

export interface CustomBlock {
  id: string;
  block: string[];
  type: BlockType;
  category: BlockCategory;
  length: number;
  createdAt: string;
  updatedAt: string;
}

interface CustomBlocksStore {
  floor: {
    warmups: { [length: number]: CustomBlock[] };
    workouts: { [length: number]: CustomBlock[] };
  };
  tread: {
    warmups: { [length: number]: CustomBlock[] };
    workouts: { [length: number]: CustomBlock[] };
  };
}

const STORAGE_KEY = 'barrys_custom_blocks';

function generateId(): string {
  return `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function getEmptyStore(): CustomBlocksStore {
  return {
    floor: { warmups: {}, workouts: {} },
    tread: { warmups: {}, workouts: {} }
  };
}

export function loadCustomBlocks(): CustomBlocksStore {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load custom blocks:', e);
  }
  return getEmptyStore();
}

function saveCustomBlocks(store: CustomBlocksStore): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch (e) {
    console.error('Failed to save custom blocks:', e);
  }
}

export function addCustomBlock(
  block: string[],
  type: BlockType,
  category: BlockCategory
): CustomBlock {
  const store = loadCustomBlocks();
  const length = block.length;
  const now = new Date().toISOString();

  const customBlock: CustomBlock = {
    id: generateId(),
    block,
    type,
    category,
    length,
    createdAt: now,
    updatedAt: now
  };

  if (!store[type][category][length]) {
    store[type][category][length] = [];
  }
  store[type][category][length].push(customBlock);

  saveCustomBlocks(store);
  return customBlock;
}

export function updateCustomBlock(
  id: string,
  newBlock: string[]
): CustomBlock | null {
  const store = loadCustomBlocks();

  for (const type of ['floor', 'tread'] as BlockType[]) {
    for (const category of ['warmups', 'workouts'] as BlockCategory[]) {
      for (const length in store[type][category]) {
        const blocks = store[type][category][length];
        const index = blocks.findIndex(b => b.id === id);
        if (index !== -1) {
          blocks[index].block = newBlock;
          blocks[index].updatedAt = new Date().toISOString();
          // Update length if it changed
          blocks[index].length = newBlock.length;

          // If length changed, move to correct bucket
          if (newBlock.length !== parseInt(length)) {
            const [removed] = blocks.splice(index, 1);
            if (!store[type][category][newBlock.length]) {
              store[type][category][newBlock.length] = [];
            }
            store[type][category][newBlock.length].push(removed);
          }

          saveCustomBlocks(store);
          return blocks[index] || store[type][category][newBlock.length].find(b => b.id === id) || null;
        }
      }
    }
  }
  return null;
}

export function deleteCustomBlock(id: string): boolean {
  const store = loadCustomBlocks();

  for (const type of ['floor', 'tread'] as BlockType[]) {
    for (const category of ['warmups', 'workouts'] as BlockCategory[]) {
      for (const length in store[type][category]) {
        const blocks = store[type][category][length];
        const index = blocks.findIndex(b => b.id === id);
        if (index !== -1) {
          blocks.splice(index, 1);
          saveCustomBlocks(store);
          return true;
        }
      }
    }
  }
  return false;
}

export function getCustomBlocks(
  type: BlockType,
  category: BlockCategory,
  length: number
): CustomBlock[] {
  const store = loadCustomBlocks();
  return store[type][category][length] || [];
}

export function getAllCustomBlocks(): CustomBlock[] {
  const store = loadCustomBlocks();
  const all: CustomBlock[] = [];

  for (const type of ['floor', 'tread'] as BlockType[]) {
    for (const category of ['warmups', 'workouts'] as BlockCategory[]) {
      for (const length in store[type][category]) {
        all.push(...store[type][category][length]);
      }
    }
  }

  return all;
}

// Get count of custom blocks by type
export function getCustomBlockCounts(): {
  floorWarmups: number;
  floorWorkouts: number;
  treadWarmups: number;
  treadWorkouts: number;
} {
  const store = loadCustomBlocks();

  const countBlocks = (obj: { [length: number]: CustomBlock[] }) =>
    Object.values(obj).reduce((sum, arr) => sum + arr.length, 0);

  return {
    floorWarmups: countBlocks(store.floor.warmups),
    floorWorkouts: countBlocks(store.floor.workouts),
    treadWarmups: countBlocks(store.tread.warmups),
    treadWorkouts: countBlocks(store.tread.workouts)
  };
}
