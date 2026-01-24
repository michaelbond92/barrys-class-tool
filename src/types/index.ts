// ===== EXERCISE TYPES =====
export type ExerciseCategory =
  | 'chest' | 'back' | 'shoulders' | 'arms'
  | 'legs' | 'core' | 'power' | 'compound';

export type ClassType =
  | 'total_body'
  | 'chest_back_abs'
  | 'arms_abs'
  | 'legs_core';

export type Equipment =
  | '2 Heavy Dumbbells'
  | '2 Mediums'
  | '2 Light Dumbbells'
  | 'Bodyweight';

export type EnergyLevel = 'L1' | 'L2' | 'L3';

export interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  isCompound: boolean;
  isPowerMove: boolean;
  equipment: Equipment[];
  lastUsed?: string;
  usageHistory: string[];
}

// ===== TREAD TYPES =====
export interface SpeedSet {
  low: number;
  mid: number;
  high: number;
}

export interface TreadEntry {
  minute: string;
  raw: string;
  speeds: SpeedSet[];
  isRecover: boolean;
  isSprint: boolean;
  inclinePercent: number;
  lowestSpeed: number;
  effectiveSpeed: number;
  textColor: 'black' | 'red' | 'purple';
  blockIndex?: number;        // Which block this entry belongs to (1-based)
  blockType?: 'warmup' | 'workout';  // Type of block
}

// ===== FLOOR TYPES =====
export interface FloorEntry {
  minute: string;
  exercises: string;
  exerciseIds: string[];
  energyLevel: EnergyLevel;
  notes?: string;
  blockIndex?: number;        // Which block this entry belongs to (1-based)
  blockType?: 'warmup' | 'workout';  // Type of block
}

// ===== CLASS TYPES =====
export interface Round {
  number: 1 | 2;
  duration: number;
  equipment: Equipment;
  forecast?: string;
  tread: TreadEntry[];
  floor: FloorEntry[];
}

export interface ClassPlan {
  id: string;
  date: string;
  classType: ClassType;
  round1: Round;
  round2: Round;
  treadAverage: number;
  createdAt: string;
  updatedAt: string;
}

// ===== GENERATION CONFIG =====
export interface GeneratorConfig {
  classType: ClassType;
  date: string;
  round1Duration: number;
  round2Duration: number;
  round1Equipment: Equipment;
  round2Equipment: Equipment;
  maxTreadAverage: number;
}

// ===== PHASE ALLOCATION =====
export interface PhaseAllocation {
  l1Minutes: number;
  l2Minutes: number;
  l3Minutes: number;
}

// ===== STORAGE KEYS =====
export const STORAGE_KEYS = {
  EXERCISES: 'barrys_exercises',
  CLASS_HISTORY: 'barrys_class_history',
  DRAFT_CLASS: 'barrys_draft_class',
  USER_PREFS: 'barrys_preferences'
} as const;
