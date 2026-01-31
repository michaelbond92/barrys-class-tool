// ============================================================================
// Transition Scoring Service
// Uses both Barry's real class data AND user RLHF ratings to score transitions
// ============================================================================

import transitionData from '../data/transitionData.json';
import { ALL_EXERCISES, ExerciseDefinition, findExercise } from '../data/exerciseReference';

// ============================================================================
// Types
// ============================================================================

export interface TransitionScore {
  score: number;           // 0-100
  confidence: 'high' | 'medium' | 'low';
  source: 'user_yes' | 'user_no' | 'barry_proven' | 'calculated';
  details: string;
}

interface UserRating {
  from: string;
  to: string;
  note: string | null;
}

// ============================================================================
// Data Loading
// ============================================================================

// Pre-process user ratings into lookup maps
const userYesMap = new Map<string, UserRating>();
const userNoMap = new Map<string, UserRating>();

function normalizeForLookup(name: string): string {
  return name.toLowerCase()
    .replace(/[^a-z\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Build lookup maps from user ratings
(transitionData.userRatings.yes as UserRating[]).forEach(r => {
  const key = `${normalizeForLookup(r.from)}|${normalizeForLookup(r.to)}`;
  userYesMap.set(key, r);
});

(transitionData.userRatings.no as UserRating[]).forEach(r => {
  const key = `${normalizeForLookup(r.from)}|${normalizeForLookup(r.to)}`;
  userNoMap.set(key, r);
});

// Pre-process Barry's transitions
const barrysTransitionCounts = new Map<string, number>();
Object.entries(transitionData.barrysTransitions).forEach(([pair, count]) => {
  // Normalize the transition pair
  const parts = pair.split(' → ');
  if (parts.length === 2) {
    const key = `${normalizeForLookup(parts[0])}|${normalizeForLookup(parts[1])}`;
    barrysTransitionCounts.set(key, (barrysTransitionCounts.get(key) || 0) + (count as number));
  }
});

// ============================================================================
// Core Scoring Functions
// ============================================================================

/**
 * Score a transition between two exercises
 * Priority:
 * 1. User YES rating = 95 (high confidence)
 * 2. User NO rating = 15 (high confidence)
 * 3. Barry's proven transition = 70-85 based on frequency (medium confidence)
 * 4. Calculated from exercise properties = 30-70 (low confidence)
 */
export function scoreTransition(
  fromExercise: ExerciseDefinition | string,
  toExercise: ExerciseDefinition | string
): TransitionScore {
  // Resolve to exercise definitions if strings provided
  const from = typeof fromExercise === 'string'
    ? findExercise(fromExercise) || { name: fromExercise } as ExerciseDefinition
    : fromExercise;
  const to = typeof toExercise === 'string'
    ? findExercise(toExercise) || { name: toExercise } as ExerciseDefinition
    : toExercise;

  const lookupKey = `${normalizeForLookup(from.name)}|${normalizeForLookup(to.name)}`;

  // 1. Check user YES ratings (highest priority, trusted feedback)
  if (userYesMap.has(lookupKey)) {
    const rating = userYesMap.get(lookupKey)!;
    return {
      score: 95,
      confidence: 'high',
      source: 'user_yes',
      details: rating.note || 'User rated this transition as flowing well'
    };
  }

  // 2. Check user NO ratings (highest priority, trusted feedback)
  if (userNoMap.has(lookupKey)) {
    const rating = userNoMap.get(lookupKey)!;
    return {
      score: 15,
      confidence: 'high',
      source: 'user_no',
      details: rating.note || 'User rated this transition as awkward/poor'
    };
  }

  // 3. Check Barry's proven transitions
  const barrysCount = barrysTransitionCounts.get(lookupKey);
  if (barrysCount && barrysCount > 0) {
    // Scale score based on frequency: 1x = 70, 5+ = 85
    const freqBonus = Math.min(barrysCount - 1, 4) * 3.75;
    const score = Math.round(70 + freqBonus);
    return {
      score,
      confidence: 'medium',
      source: 'barry_proven',
      details: `Used ${barrysCount}x in Barry's real classes`
    };
  }

  // 4. Calculate from exercise properties
  return calculateTransitionScore(from, to);
}

/**
 * Calculate transition score based on exercise properties
 * Uses position, weight path, movement plane, and grip demand
 */
function calculateTransitionScore(
  from: ExerciseDefinition,
  to: ExerciseDefinition
): TransitionScore {
  let score = 50; // Base score
  const factors: string[] = [];

  // Position compatibility (most important - from user feedback)
  if (from.position && to.position) {
    if (from.position === to.position) {
      score += 20;
      factors.push('Same position (+20)');
    } else if (
      (from.position === 'floor_laying' && to.position === 'floor_standing') ||
      (from.position === 'floor_standing' && to.position === 'floor_laying')
    ) {
      score -= 10;
      factors.push('Floor position change (-10)');
    } else if (
      from.position.startsWith('bench') !== to.position.startsWith('bench')
    ) {
      score -= 20;
      factors.push('Bench<->Floor transition (-20)');
    }
  }

  // Weight path compatibility
  if (from.weightPath && to.weightPath) {
    if (from.weightPath.end === to.weightPath.start) {
      score += 15;
      factors.push('Weight path flows (+15)');
    } else {
      score -= 5;
      factors.push('Weight path mismatch (-5)');
    }
  }

  // Movement plane compatibility
  if (from.movementPlane && to.movementPlane) {
    if (from.movementPlane === to.movementPlane) {
      score += 10;
      factors.push('Same movement plane (+10)');
    } else if (
      (from.movementPlane === 'frontal' && to.movementPlane !== 'frontal') ||
      (from.movementPlane !== 'frontal' && to.movementPlane === 'frontal')
    ) {
      score -= 15;
      factors.push('Sagittal<->Frontal plane (-15)');
    }
  }

  // Grip fatigue consideration
  if (from.gripDemand === 'high' && to.gripDemand === 'high') {
    score -= 10;
    factors.push('Back-to-back high grip (-10)');
  }

  // Clamp score
  score = Math.max(10, Math.min(90, score));

  return {
    score,
    confidence: 'low',
    source: 'calculated',
    details: factors.length > 0 ? factors.join(', ') : 'Calculated from exercise properties'
  };
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Get all transitions from user YES ratings (for training/analysis)
 */
export function getUserApprovedTransitions(): Array<{ from: string; to: string; note: string | null }> {
  return transitionData.userRatings.yes as UserRating[];
}

/**
 * Get all transitions from user NO ratings (for training/analysis)
 */
export function getUserRejectedTransitions(): Array<{ from: string; to: string; note: string | null }> {
  return transitionData.userRatings.no as UserRating[];
}

/**
 * Get Barry's most common transitions
 */
export function getBarrysTopTransitions(limit: number = 20): Array<{ pair: string; count: number }> {
  return Object.entries(transitionData.barrysTransitions)
    .sort((a, b) => (b[1] as number) - (a[1] as number))
    .slice(0, limit)
    .map(([pair, count]) => ({ pair, count: count as number }));
}

/**
 * Get transition stats
 */
export function getTransitionStats() {
  return {
    userYes: transitionData.stats.userYes,
    userNo: transitionData.stats.userNo,
    userSkip: transitionData.stats.userSkip,
    barrysTotal: transitionData.stats.totalBarrysTransitions,
    barrysUnique: transitionData.stats.uniqueBarrysTransitions
  };
}

/**
 * Score an entire block of exercises
 */
export function scoreBlockTransitions(exercises: string[]): {
  averageScore: number;
  transitions: Array<{
    from: string;
    to: string;
    score: TransitionScore;
  }>;
} {
  if (exercises.length < 2) {
    return { averageScore: 100, transitions: [] };
  }

  const transitions: Array<{ from: string; to: string; score: TransitionScore }> = [];

  for (let i = 0; i < exercises.length - 1; i++) {
    const from = exercises[i];
    const to = exercises[i + 1];
    const score = scoreTransition(from, to);
    transitions.push({ from, to, score });
  }

  const averageScore = Math.round(
    transitions.reduce((sum, t) => sum + t.score.score, 0) / transitions.length
  );

  return { averageScore, transitions };
}

export default {
  scoreTransition,
  scoreBlockTransitions,
  getUserApprovedTransitions,
  getUserRejectedTransitions,
  getBarrysTopTransitions,
  getTransitionStats
};
