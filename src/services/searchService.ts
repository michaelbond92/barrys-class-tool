// ============================================================================
// Search Service
// Searches across rounds, blocks, and exercises using parsed constraints
// ============================================================================

import {
  SearchConstraints,
  SearchResult,
  RoundMetadata,
  BlockMetadata,
  ClassMetadata,
  FreshnessScore,
} from '../types/hierarchyTypes';
import { loadIndexFromStorage } from './indexingService';
import { calculateFreshness, filterByFreshness } from './usageTrackingService';
import { calculateMatchScore } from './queryParserService';

// ============================================================================
// SEARCH FUNCTIONS
// ============================================================================

/**
 * Search for rounds matching constraints
 */
export function searchRounds(constraints: SearchConstraints): SearchResult<RoundMetadata>[] {
  const index = loadIndexFromStorage();
  if (!index) return [];

  let rounds = [...index.rounds];

  // Apply freshness filters first
  rounds = filterByFreshness(rounds, {
    excludeUsedWithinDays: constraints.excludeUsedWithinDays,
    excludeOverused: true,
    preferFresh: constraints.preferFresh,
  });

  // Calculate match scores
  const results: SearchResult<RoundMetadata>[] = rounds.map(round => {
    const { score, matchedFields } = calculateMatchScore({
      duration: round.duration,
      bodyFocus: round.primaryBodyFocus,
      movementPatterns: round.movementPatterns,
      finisherType: round.finisherType,
      treadPattern: round.treadPattern,
      hasIncline: round.hasIncline,
      flowScore: round.flowScore,
      hasGripBreaks: round.hasGripBreaks,
      gripLoadScore: round.gripLoadScore,
    }, constraints);

    return {
      item: round,
      score,
      matchedFields,
      freshnessScore: calculateFreshness(round.id),
    };
  });

  // Filter out zero scores unless no constraints
  const filtered = Object.keys(constraints).length === 0
    ? results
    : results.filter(r => r.score > 0);

  // Sort by score, then freshness
  return filtered.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return b.freshnessScore.score - a.freshnessScore.score;
  });
}

/**
 * Search for floor blocks matching constraints
 */
export function searchBlocks(constraints: SearchConstraints): SearchResult<BlockMetadata>[] {
  const index = loadIndexFromStorage();
  if (!index) return [];

  let blocks = [...index.floorBlocks];

  // Apply freshness filters
  blocks = filterByFreshness(blocks, {
    excludeUsedWithinDays: constraints.excludeUsedWithinDays,
    excludeOverused: true,
    preferFresh: constraints.preferFresh,
  });

  // Calculate match scores
  const results: SearchResult<BlockMetadata>[] = blocks.map(block => {
    const { score, matchedFields } = calculateMatchScore({
      bodyFocus: block.bodyFocus,
      movementPatterns: block.movementPatterns,
      structure: block.structure,
      flowScore: block.flowScore,
      gripLoadScore: block.gripLoadScore,
    }, constraints);

    return {
      item: block,
      score,
      matchedFields,
      freshnessScore: calculateFreshness(block.id),
    };
  });

  // Filter and sort
  const filtered = Object.keys(constraints).length === 0
    ? results
    : results.filter(r => r.score > 0);

  return filtered.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return b.freshnessScore.score - a.freshnessScore.score;
  });
}

/**
 * Search for classes matching constraints
 */
export function searchClasses(constraints: SearchConstraints): SearchResult<ClassMetadata>[] {
  const index = loadIndexFromStorage();
  if (!index) return [];

  let classes = [...index.classes];

  // Apply freshness filters
  classes = filterByFreshness(classes, {
    excludeUsedWithinDays: constraints.excludeUsedWithinDays,
    excludeOverused: true,
    preferFresh: constraints.preferFresh,
  });

  // Calculate match scores - combine both rounds
  const results: SearchResult<ClassMetadata>[] = classes.map(cls => {
    // Score based on both rounds
    const r1Score = calculateMatchScore({
      duration: cls.round1.duration,
      bodyFocus: cls.round1.primaryBodyFocus,
      movementPatterns: cls.round1.movementPatterns,
      finisherType: cls.round1.finisherType,
      treadPattern: cls.round1.treadPattern,
      hasIncline: cls.round1.hasIncline,
      flowScore: cls.round1.flowScore,
      hasGripBreaks: cls.round1.hasGripBreaks,
      gripLoadScore: cls.round1.gripLoadScore,
    }, constraints);

    const r2Score = calculateMatchScore({
      duration: cls.round2.duration,
      bodyFocus: cls.round2.primaryBodyFocus,
      movementPatterns: cls.round2.movementPatterns,
      finisherType: cls.round2.finisherType,
      treadPattern: cls.round2.treadPattern,
      hasIncline: cls.round2.hasIncline,
      flowScore: cls.round2.flowScore,
      hasGripBreaks: cls.round2.hasGripBreaks,
      gripLoadScore: cls.round2.gripLoadScore,
    }, constraints);

    // Average the scores
    const avgScore = Math.round((r1Score.score + r2Score.score) / 2);
    const matchedFields = [...new Set([...r1Score.matchedFields, ...r2Score.matchedFields])];

    return {
      item: cls,
      score: avgScore,
      matchedFields,
      freshnessScore: calculateFreshness(cls.id),
    };
  });

  const filtered = Object.keys(constraints).length === 0
    ? results
    : results.filter(r => r.score > 0);

  return filtered.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return b.freshnessScore.score - a.freshnessScore.score;
  });
}

// ============================================================================
// TEXT SEARCH
// ============================================================================

/**
 * Fuzzy text search across block content
 */
export function textSearchBlocks(query: string, limit: number = 20): BlockMetadata[] {
  const index = loadIndexFromStorage();
  if (!index || !query) return [];

  const lowerQuery = query.toLowerCase();
  const terms = lowerQuery.split(/\s+/).filter(t => t.length >= 2);

  if (terms.length === 0) return [];

  // Score blocks by how many terms they match
  const scored = index.floorBlocks.map(block => {
    const text = block.content.join(' ').toLowerCase() + ' ' + block.exerciseSequence.toLowerCase();
    let matches = 0;

    for (const term of terms) {
      if (text.includes(term)) {
        matches++;
      }
    }

    return { block, matches };
  });

  // Filter and sort
  return scored
    .filter(s => s.matches > 0)
    .sort((a, b) => b.matches - a.matches)
    .slice(0, limit)
    .map(s => s.block);
}

/**
 * Text search across rounds
 */
export function textSearchRounds(query: string, limit: number = 20): RoundMetadata[] {
  const index = loadIndexFromStorage();
  if (!index || !query) return [];

  const lowerQuery = query.toLowerCase();
  const terms = lowerQuery.split(/\s+/).filter(t => t.length >= 2);

  if (terms.length === 0) return [];

  const scored = index.rounds.map(round => {
    const text = round.exerciseSequence.toLowerCase() +
      ' ' + round.finisherExercise.toLowerCase() +
      ' ' + (round.equipment.rawText || '').toLowerCase();
    let matches = 0;

    for (const term of terms) {
      if (text.includes(term)) {
        matches++;
      }
    }

    return { round, matches };
  });

  return scored
    .filter(s => s.matches > 0)
    .sort((a, b) => b.matches - a.matches)
    .slice(0, limit)
    .map(s => s.round);
}

// ============================================================================
// SIMILARITY SEARCH (for future embeddings)
// ============================================================================

/**
 * Find blocks similar to a given block
 * Uses content overlap for now, will use embeddings later
 */
export function findSimilarBlocks(blockId: string, limit: number = 5): BlockMetadata[] {
  const index = loadIndexFromStorage();
  if (!index) return [];

  const sourceBlock = index.floorBlocks.find(b => b.id === blockId);
  if (!sourceBlock) return [];

  // Simple similarity: body focus, movement patterns, structure overlap
  const scored = index.floorBlocks
    .filter(b => b.id !== blockId)
    .map(block => {
      let score = 0;

      // Body focus overlap
      const focusOverlap = sourceBlock.bodyFocus.filter(f => block.bodyFocus.includes(f)).length;
      score += focusOverlap * 3;

      // Movement pattern overlap
      const patternOverlap = sourceBlock.movementPatterns.filter(p => block.movementPatterns.includes(p)).length;
      score += patternOverlap * 2;

      // Structure overlap
      const structureOverlap = sourceBlock.structure.filter(s => block.structure.includes(s)).length;
      score += structureOverlap * 2;

      // Position similarity
      if (sourceBlock.dominantPosition === block.dominantPosition) {
        score += 2;
      }

      // Same category
      if (sourceBlock.category === block.category) {
        score += 1;
      }

      // Same length
      if (sourceBlock.length === block.length) {
        score += 1;
      }

      return { block, score };
    });

  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(s => s.block);
}

/**
 * Find blocks different from a given block (for variety)
 */
export function findDifferentBlocks(blockId: string, limit: number = 5): BlockMetadata[] {
  const index = loadIndexFromStorage();
  if (!index) return [];

  const sourceBlock = index.floorBlocks.find(b => b.id === blockId);
  if (!sourceBlock) return [];

  // Inverse of similarity
  const scored = index.floorBlocks
    .filter(b => b.id !== blockId)
    .map(block => {
      let difference = 0;

      // Different body focus
      const focusOverlap = sourceBlock.bodyFocus.filter(f => block.bodyFocus.includes(f)).length;
      difference += (sourceBlock.bodyFocus.length - focusOverlap);

      // Different movement patterns
      const patternOverlap = sourceBlock.movementPatterns.filter(p => block.movementPatterns.includes(p)).length;
      difference += (sourceBlock.movementPatterns.length - patternOverlap);

      // Different position
      if (sourceBlock.dominantPosition !== block.dominantPosition) {
        difference += 2;
      }

      // Different category
      if (sourceBlock.category !== block.category) {
        difference += 1;
      }

      return { block, difference };
    });

  // Prefer fresh blocks that are different
  return scored
    .sort((a, b) => b.difference - a.difference)
    .slice(0, limit * 2) // Get extra for freshness filtering
    .map(s => s.block)
    .slice(0, limit);
}

/**
 * Find similar rounds
 */
export function findSimilarRounds(roundId: string, limit: number = 5): RoundMetadata[] {
  const index = loadIndexFromStorage();
  if (!index) return [];

  const sourceRound = index.rounds.find(r => r.id === roundId);
  if (!sourceRound) return [];

  const scored = index.rounds
    .filter(r => r.id !== roundId)
    .map(round => {
      let score = 0;

      // Duration similarity
      score += Math.max(0, 5 - Math.abs(sourceRound.duration - round.duration));

      // Body focus overlap
      const focusOverlap = sourceRound.primaryBodyFocus.filter(f => round.primaryBodyFocus.includes(f)).length;
      score += focusOverlap * 2;

      // Movement pattern overlap
      const patternOverlap = sourceRound.movementPatterns.filter(p => round.movementPatterns.includes(p)).length;
      score += patternOverlap * 2;

      // Same finisher type
      if (sourceRound.finisherType === round.finisherType) {
        score += 3;
      }

      // Same tread pattern
      if (sourceRound.treadPattern === round.treadPattern) {
        score += 2;
      }

      return { round, score };
    });

  return scored
    .filter(s => s.score > 2)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(s => s.round);
}

// ============================================================================
// STATISTICS
// ============================================================================

/**
 * Get search statistics
 */
export function getSearchStats(): {
  totalRounds: number;
  totalFloorBlocks: number;
  totalTreadBlocks: number;
  totalClasses: number;
  indexLoaded: boolean;
} {
  const index = loadIndexFromStorage();

  if (!index) {
    return {
      totalRounds: 0,
      totalFloorBlocks: 0,
      totalTreadBlocks: 0,
      totalClasses: 0,
      indexLoaded: false,
    };
  }

  return {
    totalRounds: index.rounds.length,
    totalFloorBlocks: index.floorBlocks.length,
    totalTreadBlocks: index.treadBlocks.length,
    totalClasses: index.classes.length,
    indexLoaded: true,
  };
}

/**
 * Get distribution of a field across blocks
 */
export function getBlockDistribution<K extends keyof BlockMetadata>(
  field: K
): Map<BlockMetadata[K] extends Array<infer T> ? T : BlockMetadata[K], number> {
  const index = loadIndexFromStorage();
  if (!index) return new Map();

  const distribution = new Map<unknown, number>();

  for (const block of index.floorBlocks) {
    const value = block[field];

    if (Array.isArray(value)) {
      for (const item of value) {
        distribution.set(item, (distribution.get(item) || 0) + 1);
      }
    } else {
      distribution.set(value, (distribution.get(value) || 0) + 1);
    }
  }

  return distribution as Map<BlockMetadata[K] extends Array<infer T> ? T : BlockMetadata[K], number>;
}
