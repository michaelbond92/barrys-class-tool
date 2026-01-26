// ============================================================================
// Usage Tracking Service
// Tracks usage of exercises, blocks, and rounds for freshness calculations
// ============================================================================

import {
  UsageRecord,
  FreshnessScore,
  HIERARCHY_STORAGE_KEYS,
} from '../types/hierarchyTypes';

// ============================================================================
// CONSTANTS
// ============================================================================

const FRESHNESS_THRESHOLDS = {
  GREEN_DAYS: 28,   // >4 weeks ago = very fresh
  YELLOW_DAYS: 14,  // 2-4 weeks ago = moderately fresh
  RED_DAYS: 14,     // <2 weeks ago = recently used
  OVERUSE_COUNT: 3, // >3 times in 4 weeks = overused
  OVERUSE_WINDOW_DAYS: 28,
};

// ============================================================================
// STORAGE
// ============================================================================

function loadUsageHistory(): UsageRecord[] {
  try {
    const stored = localStorage.getItem(HIERARCHY_STORAGE_KEYS.USAGE_HISTORY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load usage history:', error);
  }
  return [];
}

function saveUsageHistory(records: UsageRecord[]): void {
  try {
    localStorage.setItem(HIERARCHY_STORAGE_KEYS.USAGE_HISTORY, JSON.stringify(records));
  } catch (error) {
    console.error('Failed to save usage history:', error);
  }
}

// ============================================================================
// RECORDING USAGE
// ============================================================================

/**
 * Record that an entity was used
 */
export function recordUsage(
  entityId: string,
  entityType: 'exercise' | 'block' | 'round' | 'class',
  context?: string
): void {
  const records = loadUsageHistory();

  const newRecord: UsageRecord = {
    entityId,
    entityType,
    usedAt: new Date().toISOString(),
    context,
  };

  records.push(newRecord);

  // Keep only last 1000 records to prevent storage bloat
  const trimmed = records.slice(-1000);
  saveUsageHistory(trimmed);
}

/**
 * Record usage for multiple entities at once (e.g., when a class is used)
 */
export function recordBulkUsage(
  entities: Array<{ entityId: string; entityType: 'exercise' | 'block' | 'round' | 'class' }>,
  context?: string
): void {
  const records = loadUsageHistory();
  const now = new Date().toISOString();

  for (const entity of entities) {
    records.push({
      entityId: entity.entityId,
      entityType: entity.entityType,
      usedAt: now,
      context,
    });
  }

  const trimmed = records.slice(-1000);
  saveUsageHistory(trimmed);
}

/**
 * Record usage when a class is exported
 */
export function recordClassUsage(
  classId: string,
  roundIds: string[],
  blockIds: string[],
  exerciseIds: string[],
  date: string
): void {
  const context = `class on ${date}`;

  const entities: Array<{ entityId: string; entityType: 'exercise' | 'block' | 'round' | 'class' }> = [
    { entityId: classId, entityType: 'class' },
    ...roundIds.map(id => ({ entityId: id, entityType: 'round' as const })),
    ...blockIds.map(id => ({ entityId: id, entityType: 'block' as const })),
    ...exerciseIds.map(id => ({ entityId: id, entityType: 'exercise' as const })),
  ];

  recordBulkUsage(entities, context);
}

// ============================================================================
// FRESHNESS CALCULATION
// ============================================================================

/**
 * Get usage records for an entity
 */
export function getUsageRecords(entityId: string): UsageRecord[] {
  const records = loadUsageHistory();
  return records.filter(r => r.entityId === entityId);
}

/**
 * Get the last used date for an entity
 */
export function getLastUsedDate(entityId: string): Date | null {
  const records = getUsageRecords(entityId);
  if (records.length === 0) return null;

  const dates = records.map(r => new Date(r.usedAt));
  return new Date(Math.max(...dates.map(d => d.getTime())));
}

/**
 * Get usage count for an entity
 */
export function getUsageCount(entityId: string): number {
  return getUsageRecords(entityId).length;
}

/**
 * Get usage count in a time window
 */
export function getUsageCountInWindow(entityId: string, days: number): number {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);

  const records = getUsageRecords(entityId);
  return records.filter(r => new Date(r.usedAt) >= cutoff).length;
}

/**
 * Check if entity is overused (>3 times in 4 weeks)
 */
export function isOverused(entityId: string): boolean {
  const count = getUsageCountInWindow(entityId, FRESHNESS_THRESHOLDS.OVERUSE_WINDOW_DAYS);
  return count > FRESHNESS_THRESHOLDS.OVERUSE_COUNT;
}

/**
 * Calculate freshness score from raw values
 * Use this when you already have lastUsed and useCount data
 */
export function calculateFreshnessFromValues(
  lastUsed: string | null,
  useCount: number,
  overuseThreshold: number = FRESHNESS_THRESHOLDS.OVERUSE_COUNT
): FreshnessScore {
  // Never used = maximally fresh
  if (!lastUsed) {
    return {
      score: 100,
      color: 'gray',
      label: 'Never used',
      lastUsed: null,
      useCount: 0,
      isOverused: false,
    };
  }

  const lastUsedDate = new Date(lastUsed);
  const now = new Date();
  const daysSinceUse = Math.floor((now.getTime() - lastUsedDate.getTime()) / (1000 * 60 * 60 * 24));

  // Check for overuse (>3 times in 4 weeks)
  const fourWeeksAgo = new Date();
  fourWeeksAgo.setDate(fourWeeksAgo.getDate() - FRESHNESS_THRESHOLDS.OVERUSE_WINDOW_DAYS);
  const isRecentlyUsed = lastUsedDate >= fourWeeksAgo;
  const overused = isRecentlyUsed && useCount >= overuseThreshold;

  let score: number;
  let color: 'green' | 'yellow' | 'red' | 'gray';
  let label: string;

  if (daysSinceUse >= FRESHNESS_THRESHOLDS.GREEN_DAYS) {
    score = 100;
    color = 'green';
    label = `Fresh (${daysSinceUse} days ago)`;
  } else if (daysSinceUse >= FRESHNESS_THRESHOLDS.YELLOW_DAYS) {
    score = 70;
    color = 'yellow';
    label = `${Math.floor(daysSinceUse / 7)} weeks ago`;
  } else {
    score = 30;
    color = 'red';
    label = daysSinceUse === 0 ? 'Used today' : `${daysSinceUse} days ago`;
  }

  // Penalty for overuse
  if (overused) {
    score = Math.max(0, score - 30);
    label += ' (overused)';
  }

  return {
    score,
    color,
    label,
    lastUsed,
    useCount,
    isOverused: overused,
  };
}

/**
 * Calculate freshness score for an entity by ID
 */
export function calculateFreshness(entityId: string): FreshnessScore {
  const lastUsed = getLastUsedDate(entityId);
  const useCount = getUsageCount(entityId);
  const overused = isOverused(entityId);

  // Never used = maximally fresh
  if (!lastUsed) {
    return {
      score: 100,
      color: 'gray',
      label: 'Never used',
      lastUsed: null,
      useCount: 0,
      isOverused: false,
    };
  }

  const now = new Date();
  const daysSinceUse = Math.floor((now.getTime() - lastUsed.getTime()) / (1000 * 60 * 60 * 24));

  let score: number;
  let color: 'green' | 'yellow' | 'red' | 'gray';
  let label: string;

  if (daysSinceUse >= FRESHNESS_THRESHOLDS.GREEN_DAYS) {
    score = 100;
    color = 'green';
    label = `Fresh (${daysSinceUse} days ago)`;
  } else if (daysSinceUse >= FRESHNESS_THRESHOLDS.YELLOW_DAYS) {
    score = 70;
    color = 'yellow';
    label = `${Math.floor(daysSinceUse / 7)} weeks ago`;
  } else {
    score = 30;
    color = 'red';
    label = daysSinceUse === 0 ? 'Used today' : `${daysSinceUse} days ago`;
  }

  // Penalty for overuse
  if (overused) {
    score = Math.max(0, score - 30);
    label += ' (overused)';
  }

  return {
    score,
    color,
    label,
    lastUsed: lastUsed.toISOString(),
    useCount,
    isOverused: overused,
  };
}

/**
 * Get freshness for multiple entities
 */
export function calculateBulkFreshness(entityIds: string[]): Map<string, FreshnessScore> {
  const result = new Map<string, FreshnessScore>();

  for (const id of entityIds) {
    result.set(id, calculateFreshness(id));
  }

  return result;
}

// ============================================================================
// OVERUSE DETECTION
// ============================================================================

/**
 * Find overused patterns in recent usage
 */
export function getOverusedPatterns(): {
  exercises: string[];
  blocks: string[];
  rounds: string[];
} {
  const records = loadUsageHistory();
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - FRESHNESS_THRESHOLDS.OVERUSE_WINDOW_DAYS);

  const recentRecords = records.filter(r => new Date(r.usedAt) >= cutoff);

  // Count usage by entity
  const counts = new Map<string, { type: string; count: number }>();

  for (const record of recentRecords) {
    const existing = counts.get(record.entityId);
    if (existing) {
      existing.count++;
    } else {
      counts.set(record.entityId, { type: record.entityType, count: 1 });
    }
  }

  // Find overused
  const exercises: string[] = [];
  const blocks: string[] = [];
  const rounds: string[] = [];

  for (const [id, { type, count }] of counts) {
    if (count > FRESHNESS_THRESHOLDS.OVERUSE_COUNT) {
      switch (type) {
        case 'exercise':
          exercises.push(id);
          break;
        case 'block':
          blocks.push(id);
          break;
        case 'round':
          rounds.push(id);
          break;
      }
    }
  }

  return { exercises, blocks, rounds };
}

/**
 * Get most used entities
 */
export function getMostUsed(
  entityType: 'exercise' | 'block' | 'round' | 'class',
  limit: number = 10
): Array<{ entityId: string; count: number }> {
  const records = loadUsageHistory().filter(r => r.entityType === entityType);

  // Count by entity
  const counts = new Map<string, number>();
  for (const record of records) {
    counts.set(record.entityId, (counts.get(record.entityId) || 0) + 1);
  }

  // Sort and limit
  return Array.from(counts)
    .map(([entityId, count]) => ({ entityId, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

/**
 * Get recently used entities
 */
export function getRecentlyUsed(
  entityType: 'exercise' | 'block' | 'round' | 'class',
  limit: number = 10
): Array<{ entityId: string; usedAt: string }> {
  const records = loadUsageHistory().filter(r => r.entityType === entityType);

  // Group by entity, keep most recent
  const latest = new Map<string, string>();
  for (const record of records) {
    const existing = latest.get(record.entityId);
    if (!existing || record.usedAt > existing) {
      latest.set(record.entityId, record.usedAt);
    }
  }

  // Sort and limit
  return Array.from(latest)
    .map(([entityId, usedAt]) => ({ entityId, usedAt }))
    .sort((a, b) => b.usedAt.localeCompare(a.usedAt))
    .slice(0, limit);
}

// ============================================================================
// FILTERING BY FRESHNESS
// ============================================================================

/**
 * Filter entities by freshness criteria
 */
export function filterByFreshness<T extends { id: string }>(
  entities: T[],
  options: {
    excludeUsedWithinDays?: number;
    excludeOverused?: boolean;
    preferFresh?: boolean;
  }
): T[] {
  let filtered = [...entities];

  if (options.excludeUsedWithinDays) {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - options.excludeUsedWithinDays);

    filtered = filtered.filter(entity => {
      const lastUsed = getLastUsedDate(entity.id);
      return !lastUsed || lastUsed < cutoff;
    });
  }

  if (options.excludeOverused) {
    filtered = filtered.filter(entity => !isOverused(entity.id));
  }

  if (options.preferFresh) {
    // Sort by freshness (higher score = fresher = earlier in list)
    filtered.sort((a, b) => {
      const aFresh = calculateFreshness(a.id);
      const bFresh = calculateFreshness(b.id);
      return bFresh.score - aFresh.score;
    });
  }

  return filtered;
}

// ============================================================================
// UTILITY
// ============================================================================

/**
 * Clear all usage history
 */
export function clearUsageHistory(): void {
  localStorage.removeItem(HIERARCHY_STORAGE_KEYS.USAGE_HISTORY);
}

/**
 * Get usage statistics
 */
export function getUsageStats(): {
  totalRecords: number;
  uniqueEntities: number;
  oldestRecord: string | null;
  newestRecord: string | null;
} {
  const records = loadUsageHistory();

  if (records.length === 0) {
    return {
      totalRecords: 0,
      uniqueEntities: 0,
      oldestRecord: null,
      newestRecord: null,
    };
  }

  const uniqueIds = new Set(records.map(r => r.entityId));
  const dates = records.map(r => r.usedAt).sort();

  return {
    totalRecords: records.length,
    uniqueEntities: uniqueIds.size,
    oldestRecord: dates[0],
    newestRecord: dates[dates.length - 1],
  };
}

/**
 * Export usage history for backup
 */
export function exportUsageHistory(): string {
  const records = loadUsageHistory();
  return JSON.stringify(records, null, 2);
}

/**
 * Import usage history from backup
 */
export function importUsageHistory(jsonString: string): { success: boolean; count: number; error?: string } {
  try {
    const records = JSON.parse(jsonString);

    if (!Array.isArray(records)) {
      return { success: false, count: 0, error: 'Invalid format: expected array' };
    }

    // Validate records
    for (const record of records) {
      if (!record.entityId || !record.entityType || !record.usedAt) {
        return { success: false, count: 0, error: 'Invalid record format' };
      }
    }

    // Merge with existing
    const existing = loadUsageHistory();
    const merged = [...existing, ...records];
    const trimmed = merged.slice(-1000);

    saveUsageHistory(trimmed);

    return { success: true, count: records.length };
  } catch (error) {
    return { success: false, count: 0, error: String(error) };
  }
}
