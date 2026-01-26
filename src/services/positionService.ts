// ============================================================================
// Position Service
// Detects exercise positions and calculates flow scores
// Based on position taxonomy from TECHNICAL_SPEC.md
// ============================================================================

import {
  ExercisePosition,
  FlowScore,
  TransitionCostMatrix,
} from '../types/hierarchyTypes';

// ============================================================================
// POSITION DETECTION PATTERNS
// ============================================================================

const POSITION_PATTERNS: Record<ExercisePosition, RegExp[]> = {
  bench_laying: [
    /chest\s*press/i,
    /skull\s*crush/i,
    /pullover/i,
    /lat\s*pull/i,
    /\bfly\b/i,
    /incline.*press/i,
    /close\s*grip.*press/i,
    /wide.*press/i,
    /hammer.*press/i,
    /toe\s*touch/i,
    /jackknife/i,
    /jacknife/i,
    /suitcase\s*crunch/i,
    /leg\s*raise/i,
    /leg\s*lift/i,
    /crunch(?!.*spider)/i,
    /dead\s*bug/i,
    /hollow/i,
    /cherry\s*picker/i,
    /hip\s*raise/i,
  ],

  bench_sitting: [
    /russian\s*twist/i,
    /boat\s*pose/i,
    /v\s*sit/i,
    /sit\s*up/i,
    /situp/i,
    /power\s*situp/i,
  ],

  bench_front: [
    /box\s*squat/i,
    /bench\s*squat/i,
    /hip\s*thrust/i,
    /concentration\s*curl/i,
  ],

  bench_back: [
    /spider/i,
    /spiderman/i,
  ],

  bench_straddling: [
    /straddle/i,
    /bench.*row/i,
  ],

  bench_standing: [
    /elevated.*lunge/i,
    /step\s*up/i,
  ],

  floor_laying: [
    /plank/i,
    /push\s*up/i,
    /pushup/i,
    /commando/i,
    /x\s*human/i,
    /mountain\s*climber/i,
    /\bmc\b/i,
    /hip\s*dip/i,
    /bird\s*dog/i,
    /birddog/i,
    /cat\s*cow/i,
    /wgs/i,
    /world.*greatest/i,
    /down\s*dog/i,
    /\bdd\b/i,
    /shoulder\s*tap/i,
    /sprawl/i,
    /renegade/i,
    /\brr\b/i,
    /reverse\s*row/i,
    /plank\s*jack/i,
    /beastmaker/i,
    /dumbbell\s*drag/i,
  ],

  floor_standing: [
    /squat(?!.*box|.*bench)/i,
    /deadlift/i,
    /\bdl\b/i,
    /lunge(?!.*elevated)/i,
    /snatch/i,
    /clean/i,
    /swing/i,
    /curl(?!.*concentration)/i,
    /bicep/i,
    /tricep.*ext/i,
    /\boh\b.*ext/i,
    /overhead.*ext/i,
    /shoulder.*press/i,
    /row(?!.*bench|.*renegade)/i,
    /good\s*morning/i,
    /\bgm\b/i,
    /rdl/i,
    /sdl/i,
    /high\s*pull/i,
    /hi\s*pull/i,
    /thruster/i,
    /lateral\s*raise/i,
    /front\s*raise/i,
    /upright.*row/i,
    /shrug/i,
    /reverse.*fly/i,
    /burpee/i,
    /goblet/i,
    /sumo/i,
    /front\s*rack/i,
    /suitcase\s*squat/i,
    /curtsy/i,
    /lungster/i,
    /bent\s*over/i,
    /fast\s*feet/i,
    /windshield/i,
  ],
};

// ============================================================================
// TRANSITION COST MATRIX
// Higher cost = more disruptive transition
// ============================================================================

export const TRANSITION_COSTS: TransitionCostMatrix = {
  bench_laying: {
    bench_laying: 0,
    bench_sitting: 1,      // Just sit up
    bench_front: 1,        // Swing legs around
    bench_back: 2,         // Flip over, move to back
    bench_straddling: 2,   // Get up, straddle
    bench_standing: 3,     // Stand ON bench - awkward
    floor_laying: 2,       // Get off bench, get on floor
    floor_standing: 2,     // Get off bench, stand
  },
  bench_sitting: {
    bench_laying: 1,       // Lay back down
    bench_sitting: 0,
    bench_front: 1,        // Scoot to front
    bench_back: 2,         // Move to back
    bench_straddling: 1,   // Swing legs over
    bench_standing: 3,     // Stand ON bench
    floor_laying: 2,       // Get off, get down
    floor_standing: 2,     // Get off, stand
  },
  bench_front: {
    bench_laying: 1,
    bench_sitting: 1,
    bench_front: 0,
    bench_back: 2,
    bench_straddling: 2,
    bench_standing: 3,
    floor_laying: 2,
    floor_standing: 1,     // Just step back
  },
  bench_back: {
    bench_laying: 2,
    bench_sitting: 2,
    bench_front: 2,
    bench_back: 0,
    bench_straddling: 1,   // Nearby position
    bench_standing: 3,
    floor_laying: 1,       // Already near floor
    floor_standing: 1,     // Stand up from back
  },
  bench_straddling: {
    bench_laying: 2,
    bench_sitting: 1,
    bench_front: 2,
    bench_back: 1,
    bench_straddling: 0,
    bench_standing: 3,
    floor_laying: 2,
    floor_standing: 1,     // Just stand up
  },
  bench_standing: {
    bench_laying: 3,
    bench_sitting: 3,
    bench_front: 2,
    bench_back: 3,
    bench_straddling: 3,
    bench_standing: 0,
    floor_laying: 3,
    floor_standing: 2,     // Just step down
  },
  floor_laying: {
    bench_laying: 2,
    bench_sitting: 2,
    bench_front: 2,
    bench_back: 1,         // Already near bench back
    bench_straddling: 2,
    bench_standing: 3,
    floor_laying: 0,
    floor_standing: 1,     // Just stand up
  },
  floor_standing: {
    bench_laying: 2,
    bench_sitting: 2,
    bench_front: 1,        // Step to bench front
    bench_back: 1,         // Step to bench back
    bench_straddling: 2,
    bench_standing: 3,     // Step onto bench - most disruptive
    floor_laying: 1,       // Get down
    floor_standing: 0,
  },
};

// ============================================================================
// POSITION DETECTION FUNCTIONS
// ============================================================================

/**
 * Detect all positions present in an exercise text
 * Returns array because some exercises transition between positions
 */
export function detectPositions(exerciseText: string): ExercisePosition[] {
  const positions: Set<ExercisePosition> = new Set();
  const text = exerciseText.toLowerCase();

  // Check each position's patterns
  for (const [position, patterns] of Object.entries(POSITION_PATTERNS)) {
    for (const pattern of patterns) {
      if (pattern.test(text)) {
        positions.add(position as ExercisePosition);
        break; // Only need one match per position
      }
    }
  }

  // If no positions detected, default to floor_standing (most common)
  if (positions.size === 0) {
    positions.add('floor_standing');
  }

  return Array.from(positions);
}

/**
 * Detect the primary (most demanding) position for an exercise
 */
export function detectPrimaryPosition(exerciseText: string): ExercisePosition {
  const positions = detectPositions(exerciseText);

  // If only one position, return it
  if (positions.length === 1) {
    return positions[0];
  }

  // Priority order: bench positions are usually primary when mixed
  const priorityOrder: ExercisePosition[] = [
    'bench_standing',
    'bench_laying',
    'bench_sitting',
    'bench_front',
    'bench_back',
    'bench_straddling',
    'floor_laying',
    'floor_standing',
  ];

  for (const pos of priorityOrder) {
    if (positions.includes(pos)) {
      return pos;
    }
  }

  return 'floor_standing';
}

/**
 * Check if exercise text contains a transition (pipe or "to")
 */
export function hasPositionTransition(exerciseText: string): boolean {
  const positions = detectPositions(exerciseText);
  return positions.length > 1;
}

// ============================================================================
// FLOW SCORING FUNCTIONS
// ============================================================================

/**
 * Calculate flow score for a sequence of positions
 */
export function calculateFlowScore(positions: ExercisePosition[]): FlowScore {
  if (positions.length === 0) {
    return {
      score: 100,
      rating: 'great',
      totalTransitionCost: 0,
      uniquePositions: 0,
      warnings: [],
    };
  }

  if (positions.length === 1) {
    return {
      score: 100,
      rating: 'great',
      totalTransitionCost: 0,
      uniquePositions: 1,
      warnings: [],
    };
  }

  let totalCost = 0;
  const warnings: string[] = [];

  // Calculate total transition cost
  for (let i = 1; i < positions.length; i++) {
    const from = positions[i - 1];
    const to = positions[i];
    const cost = getTransitionCost(from, to);
    totalCost += cost;

    if (cost === 3) {
      warnings.push(`Major transition: ${formatPosition(from)} → ${formatPosition(to)}`);
    }
  }

  // Flag bench_standing usage
  if (positions.includes('bench_standing')) {
    warnings.push('Includes bench_standing (standing on bench)');
    totalCost += 5; // Extra penalty
  }

  const uniquePositions = new Set(positions).size;

  // Score calculation
  let score = 100;
  score -= totalCost * 5;                           // Each cost point = -5
  score -= Math.max(0, uniquePositions - 3) * 10;   // >3 unique = -10 each

  score = Math.max(0, Math.min(100, score));

  // Rating
  let rating: FlowScore['rating'];
  if (score >= 85) rating = 'great';
  else if (score >= 70) rating = 'good';
  else if (score >= 50) rating = 'fair';
  else rating = 'poor';

  return {
    score,
    rating,
    totalTransitionCost: totalCost,
    uniquePositions,
    warnings,
  };
}

/**
 * Get transition cost between two positions
 */
export function getTransitionCost(from: ExercisePosition, to: ExercisePosition): number {
  return TRANSITION_COSTS[from]?.[to] ?? 2;
}

/**
 * Calculate flow score for a block of exercises
 */
export function calculateBlockFlowScore(exercises: string[]): FlowScore {
  const positions = exercises.map(ex => detectPrimaryPosition(ex));
  return calculateFlowScore(positions);
}

/**
 * Get dominant position for a block
 */
export function getDominantPosition(exercises: string[]): ExercisePosition {
  const positions = exercises.map(ex => detectPrimaryPosition(ex));

  // Count occurrences
  const counts: Record<ExercisePosition, number> = {} as Record<ExercisePosition, number>;
  for (const pos of positions) {
    counts[pos] = (counts[pos] || 0) + 1;
  }

  // Find max
  let maxPos: ExercisePosition = 'floor_standing';
  let maxCount = 0;

  for (const [pos, count] of Object.entries(counts)) {
    if (count > maxCount) {
      maxCount = count;
      maxPos = pos as ExercisePosition;
    }
  }

  return maxPos;
}

/**
 * Get position sequence for a block
 */
export function getPositionSequence(exercises: string[]): ExercisePosition[] {
  return exercises.map(ex => detectPrimaryPosition(ex));
}

// ============================================================================
// FORMATTING HELPERS
// ============================================================================

const POSITION_LABELS: Record<ExercisePosition, string> = {
  floor_standing: 'Floor Standing',
  floor_laying: 'Floor Laying',
  bench_laying: 'Bench Laying',
  bench_sitting: 'Bench Sitting',
  bench_front: 'Bench Front',
  bench_back: 'Bench Back',
  bench_straddling: 'Bench Straddling',
  bench_standing: 'Bench Standing',
};

const POSITION_SHORT_LABELS: Record<ExercisePosition, string> = {
  floor_standing: 'FS',
  floor_laying: 'FL',
  bench_laying: 'BL',
  bench_sitting: 'BS',
  bench_front: 'BF',
  bench_back: 'BB',
  bench_straddling: 'BStr',
  bench_standing: 'BStd',
};

const POSITION_ICONS: Record<ExercisePosition, string> = {
  floor_standing: '🧍',
  floor_laying: '🏋️',
  bench_laying: '🛋️',
  bench_sitting: '🪑',
  bench_front: '⬛',
  bench_back: '◻️',
  bench_straddling: '🦵',
  bench_standing: '⬆️',
};

export function formatPosition(position: ExercisePosition): string {
  return POSITION_LABELS[position] || position;
}

export function formatPositionShort(position: ExercisePosition): string {
  return POSITION_SHORT_LABELS[position] || position;
}

export function getPositionIcon(position: ExercisePosition): string {
  return POSITION_ICONS[position] || '❓';
}

export function getFlowRatingColor(rating: FlowScore['rating']): string {
  switch (rating) {
    case 'great': return 'text-green-600';
    case 'good': return 'text-blue-600';
    case 'fair': return 'text-yellow-600';
    case 'poor': return 'text-red-600';
    default: return 'text-gray-600';
  }
}

export function getFlowRatingBgColor(rating: FlowScore['rating']): string {
  switch (rating) {
    case 'great': return 'bg-green-100';
    case 'good': return 'bg-blue-100';
    case 'fair': return 'bg-yellow-100';
    case 'poor': return 'bg-red-100';
    default: return 'bg-gray-100';
  }
}

// ============================================================================
// POSITION OVERRIDE FUNCTIONS
// ============================================================================

const OVERRIDE_STORAGE_KEY = 'barrys_position_overrides';

interface PositionOverride {
  exerciseText: string;
  originalPosition: ExercisePosition;
  overridePosition: ExercisePosition;
  createdAt: string;
}

let overrideCache: Map<string, ExercisePosition> | null = null;

function loadOverrides(): Map<string, ExercisePosition> {
  if (overrideCache) return overrideCache;

  try {
    const stored = localStorage.getItem(OVERRIDE_STORAGE_KEY);
    if (stored) {
      const overrides: PositionOverride[] = JSON.parse(stored);
      overrideCache = new Map(overrides.map(o => [normalizeExerciseText(o.exerciseText), o.overridePosition]));
    } else {
      overrideCache = new Map();
    }
  } catch {
    overrideCache = new Map();
  }

  return overrideCache;
}

function normalizeExerciseText(text: string): string {
  return text.toLowerCase().trim().replace(/\s+/g, ' ');
}

/**
 * Get position with override applied if exists
 */
export function getPositionWithOverride(exerciseText: string): ExercisePosition {
  const overrides = loadOverrides();
  const normalized = normalizeExerciseText(exerciseText);

  const override = overrides.get(normalized);
  if (override) return override;

  return detectPrimaryPosition(exerciseText);
}

/**
 * Check if position has been overridden
 */
export function hasPositionOverride(exerciseText: string): boolean {
  const overrides = loadOverrides();
  return overrides.has(normalizeExerciseText(exerciseText));
}

/**
 * Save a position override
 */
export function savePositionOverride(
  exerciseText: string,
  position: ExercisePosition
): void {
  const normalized = normalizeExerciseText(exerciseText);
  const originalPosition = detectPrimaryPosition(exerciseText);

  // Load existing overrides
  let overrides: PositionOverride[] = [];
  try {
    const stored = localStorage.getItem(OVERRIDE_STORAGE_KEY);
    if (stored) {
      overrides = JSON.parse(stored);
    }
  } catch {
    overrides = [];
  }

  // Remove existing override for this exercise if exists
  overrides = overrides.filter(o => normalizeExerciseText(o.exerciseText) !== normalized);

  // Add new override (only if different from auto-detected)
  if (position !== originalPosition) {
    overrides.push({
      exerciseText: exerciseText.trim(),
      originalPosition,
      overridePosition: position,
      createdAt: new Date().toISOString(),
    });
  }

  // Save
  localStorage.setItem(OVERRIDE_STORAGE_KEY, JSON.stringify(overrides));

  // Clear cache
  overrideCache = null;
}

/**
 * Remove a position override
 */
export function removePositionOverride(exerciseText: string): void {
  const normalized = normalizeExerciseText(exerciseText);

  try {
    const stored = localStorage.getItem(OVERRIDE_STORAGE_KEY);
    if (stored) {
      let overrides: PositionOverride[] = JSON.parse(stored);
      overrides = overrides.filter(o => normalizeExerciseText(o.exerciseText) !== normalized);
      localStorage.setItem(OVERRIDE_STORAGE_KEY, JSON.stringify(overrides));
    }
  } catch {
    // Ignore errors
  }

  // Clear cache
  overrideCache = null;
}

/**
 * Get all position overrides
 */
export function getAllPositionOverrides(): PositionOverride[] {
  try {
    const stored = localStorage.getItem(OVERRIDE_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // Ignore errors
  }
  return [];
}
