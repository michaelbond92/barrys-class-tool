// Block tagging/metadata service with auto-detection

export type FloorStructureTag =
  | 'emom'
  | 'ladder_ascending'
  | 'ladder_descending'
  | 'split_30_30'
  | 'split_45_15'
  | 'combo_movement'
  | 'amrap'
  | 'tempo'
  | 'drop_set'
  | 'hold_pulse'
  | 'superset'
  | 'rep_scheme'
  | 'same_side';  // Right/Left focused

export type FloorMovementTag =
  | 'compound'
  | 'isolation'
  | 'power_explosive'
  | 'mobility';

export type BodyFocusTag =
  | 'upper'
  | 'lower'
  | 'core'
  | 'full_body';

export type TreadPatternTag =
  | 'incline'
  | 'sprint'
  | 'progressive_build'
  | 'pyramid'
  | 'intervals'
  | 'recovery_heavy';

export type IntensityTag = 'high' | 'medium' | 'low';

export interface FloorBlockTags {
  structure: FloorStructureTag[];
  movement: FloorMovementTag[];
  bodyFocus: BodyFocusTag[];
  intensity: IntensityTag;
}

export interface TreadBlockTags {
  pattern: TreadPatternTag[];
  intensity: IntensityTag;
}

export type BlockTags = FloorBlockTags | TreadBlockTags;

// Tag display names for UI
export const TAG_LABELS: Record<string, string> = {
  // Floor Structure
  amrap: 'AMRAP',
  emom: 'EMOM',
  tempo: 'Tempo',
  drop_set: 'Drop Set',
  hold_pulse: 'Hold/Pulse',
  superset: 'Superset',
  ladder: 'Ladder',
  rep_scheme: 'Rep Scheme',
  same_side: 'Same Side',

  // Floor Movement
  compound: 'Compound',
  isolation: 'Isolation',
  power_explosive: 'Power/Explosive',
  mobility: 'Mobility',

  // Body Focus
  upper: 'Upper Body',
  lower: 'Lower Body',
  core: 'Core',
  full_body: 'Full Body',

  // Tread Pattern
  incline: 'Incline',
  sprint: 'Sprint',
  progressive_build: 'Progressive Build',
  pyramid: 'Pyramid',
  intervals: 'Intervals',
  recovery_heavy: 'Recovery Heavy',

  // Intensity
  high: 'High Intensity',
  medium: 'Medium Intensity',
  low: 'Low Intensity'
};

// Tag colors for UI
export const TAG_COLORS: Record<string, string> = {
  // Structure - blue shades
  amrap: 'bg-blue-100 text-blue-700',
  emom: 'bg-blue-100 text-blue-700',
  tempo: 'bg-blue-100 text-blue-700',
  drop_set: 'bg-blue-100 text-blue-700',
  hold_pulse: 'bg-blue-100 text-blue-700',
  superset: 'bg-blue-100 text-blue-700',
  ladder: 'bg-blue-100 text-blue-700',
  rep_scheme: 'bg-blue-100 text-blue-700',
  same_side: 'bg-blue-100 text-blue-700',

  // Movement - green shades
  compound: 'bg-green-100 text-green-700',
  isolation: 'bg-green-100 text-green-700',
  power_explosive: 'bg-green-100 text-green-700',
  mobility: 'bg-green-100 text-green-700',

  // Body Focus - orange shades
  upper: 'bg-orange-100 text-orange-700',
  lower: 'bg-orange-100 text-orange-700',
  core: 'bg-orange-100 text-orange-700',
  full_body: 'bg-orange-100 text-orange-700',

  // Tread Pattern - purple shades
  incline: 'bg-purple-100 text-purple-700',
  sprint: 'bg-purple-100 text-purple-700',
  progressive_build: 'bg-purple-100 text-purple-700',
  pyramid: 'bg-purple-100 text-purple-700',
  intervals: 'bg-purple-100 text-purple-700',
  recovery_heavy: 'bg-purple-100 text-purple-700',

  // Intensity - red/yellow/green
  high: 'bg-red-100 text-red-700',
  medium: 'bg-yellow-100 text-yellow-700',
  low: 'bg-green-100 text-green-700'
};

// ============================================
// AUTO-DETECTION LOGIC
// ============================================

// Keywords for detecting floor structure
const STRUCTURE_PATTERNS: Record<FloorStructureTag, RegExp[]> = {
  emom: [/\bEMOM\b/i, /\bevery\s*min/i, /\/\//],
  ladder_ascending: [/\(\+\d+\)/],
  ladder_descending: [/\(-\d+\)/],
  split_30_30: [/\|/],
  split_45_15: [/\w+\s*\/\s*\w+/],  // Exercise / Exercise (not R/L)
  combo_movement: [/\b\w+\s+to\s+\w+\b/i],  // Squat to Press patterns
  amrap: [/\bAMRAP\b/i, /\bas many as\b/i],
  tempo: [/\bTempo\b/i, /\b\d-\d-\d\b/],
  drop_set: [/\bDrop\s*Set\b/i, /\bSHAKE\b/i],
  hold_pulse: [/\bHold\b/i, /\bPulse\b/i, /\bPause\b/i, /\b:\s*Hold\b/i],
  superset: [/\|/],  // Pipe connecting exercises
  rep_scheme: [/^\d+\s+\w/m, /\b\d+\s+(Right|Left|R|L)\b/i],
  same_side: [/\bSame\b/i, /\bRight\b.*\bLeft\b/i, /\bR\/L\b/i]
};

// Keywords for detecting floor movement type
const MOVEMENT_PATTERNS: Record<FloorMovementTag, RegExp[]> = {
  compound: [
    /\bSquat\s+to\s+Press\b/i,
    /\bClean\s+to\s+Press\b/i,
    /\bDeadlift\s+to\s+Row\b/i,
    /\bLunge\s+to\b/i,
    /\bBurpee\b/i,
    /\bThrust\b/i
  ],
  isolation: [
    /\bCurl\b/i,
    /\bTricep\s+Ext/i,
    /\bLateral\s+Raise\b/i,
    /\bFly\b/i,
    /\bKickback\b/i
  ],
  power_explosive: [
    /\bJump\b/i,
    /\bSnatch\b/i,
    /\bSwing\b/i,
    /\bHigh\s+Pull\b/i,
    /\bPower\b/i,
    /\bExplosive\b/i,
    /\bClean\b/i
  ],
  mobility: [
    /\bStretch\b/i,
    /\bWorld.?s\s+Greatest\b/i,
    /\bWGS\b/i,
    /\bCat\s+Cow\b/i,
    /\bDown\s+Dog\b/i,
    /\bMobility\b/i
  ]
};

// Keywords for detecting body focus
const BODY_FOCUS_PATTERNS: Record<BodyFocusTag, RegExp[]> = {
  upper: [
    /\bPress\b/i,
    /\bRow\b/i,
    /\bCurl\b/i,
    /\bTricep\b/i,
    /\bShoulder\b/i,
    /\bChest\b/i,
    /\bPush\s*up\b/i,
    /\bPull\b/i,
    /\bFly\b/i
  ],
  lower: [
    /\bSquat\b/i,
    /\bLunge\b/i,
    /\bDeadlift\b/i,
    /\bLeg\b/i,
    /\bCalf\b/i,
    /\bGlute\b/i,
    /\bHip\b/i,
    /\bRDL\b/i,
    /\bSDL\b/i
  ],
  core: [
    /\bCore\b/i,
    /\bAb\b/i,
    /\bCrunch\b/i,
    /\bPlank\b/i,
    /\bTwist\b/i,
    /\bSit\s*up\b/i,
    /\bMountain\s+Climber\b/i,
    /\bBicycle\b/i,
    /\bJackknife\b/i
  ],
  full_body: [
    /\bBurpee\b/i,
    /\bThrust\b/i,
    /\bClean\b/i
  ]
};

// Tread pattern detection
const TREAD_PATTERNS: Record<TreadPatternTag, RegExp[]> = {
  incline: [/\d+%/],
  sprint: [/\bSprint\b/i, /\bAll\s+Out\b/i],
  progressive_build: [/^\d+,\s*\d+,\s*\d+$/m],  // Simple speed sets
  pyramid: [],  // Hard to detect, usually manual
  intervals: [/\|/],  // Multiple speed sets with pipe
  recovery_heavy: [/\bRecover\b/i]
};

/**
 * Auto-detect tags for a floor block
 */
export function detectFloorBlockTags(block: string[]): FloorBlockTags {
  const content = block.join(' ');

  // Detect structure tags
  const structure: FloorStructureTag[] = [];
  for (const [tag, patterns] of Object.entries(STRUCTURE_PATTERNS)) {
    if (patterns.some(p => p.test(content))) {
      structure.push(tag as FloorStructureTag);
    }
  }

  // Detect movement tags
  const movement: FloorMovementTag[] = [];
  for (const [tag, patterns] of Object.entries(MOVEMENT_PATTERNS)) {
    if (patterns.some(p => p.test(content))) {
      movement.push(tag as FloorMovementTag);
    }
  }

  // Detect body focus
  const bodyFocus: BodyFocusTag[] = [];
  let upperScore = 0, lowerScore = 0, coreScore = 0;

  for (const pattern of BODY_FOCUS_PATTERNS.upper) {
    if (pattern.test(content)) upperScore++;
  }
  for (const pattern of BODY_FOCUS_PATTERNS.lower) {
    if (pattern.test(content)) lowerScore++;
  }
  for (const pattern of BODY_FOCUS_PATTERNS.core) {
    if (pattern.test(content)) coreScore++;
  }

  // Check for full body exercises
  if (BODY_FOCUS_PATTERNS.full_body.some(p => p.test(content))) {
    bodyFocus.push('full_body');
  }

  // Add dominant body focus(es)
  const maxScore = Math.max(upperScore, lowerScore, coreScore);
  if (maxScore > 0) {
    if (upperScore === maxScore) bodyFocus.push('upper');
    if (lowerScore === maxScore) bodyFocus.push('lower');
    if (coreScore === maxScore) bodyFocus.push('core');

    // If multiple areas are equally targeted, it might be full body
    if (upperScore > 0 && lowerScore > 0 && !bodyFocus.includes('full_body')) {
      bodyFocus.push('full_body');
    }
  }

  // Detect intensity based on indicators
  let intensity: IntensityTag = 'medium';

  // High intensity indicators
  if (/\bBurpee\b/i.test(content) ||
      /\bJump\b/i.test(content) ||
      /\bSnatch\b/i.test(content) ||
      /\bPower\b/i.test(content) ||
      /\bExplosive\b/i.test(content)) {
    intensity = 'high';
  }
  // Low intensity indicators
  else if (/\bStretch\b/i.test(content) ||
           /\bMobility\b/i.test(content) ||
           /\bTempo\b/i.test(content) ||
           /\bCat\s+Cow\b/i.test(content)) {
    intensity = 'low';
  }

  return { structure, movement, bodyFocus, intensity };
}

/**
 * Auto-detect tags for a tread block
 */
export function detectTreadBlockTags(block: string[]): TreadBlockTags {
  const content = block.join(' ');

  // Detect patterns
  const pattern: TreadPatternTag[] = [];

  // Check for incline
  if (/\d+%/.test(content)) {
    pattern.push('incline');
  }

  // Check for sprint
  if (/\bSprint\b/i.test(content)) {
    pattern.push('sprint');
  }

  // Check for intervals (multiple speed sets with pipe)
  if ((content.match(/\|/g) || []).length >= 1) {
    pattern.push('intervals');
  }

  // Check for recovery heavy
  const recoverCount = (content.match(/\bRecover\b/gi) || []).length;
  if (recoverCount >= 2 || recoverCount / block.length > 0.3) {
    pattern.push('recovery_heavy');
  }

  // Check for progressive build (speeds generally increasing)
  const speeds = content.match(/(\d+\.?\d*),\s*(\d+\.?\d*),\s*(\d+\.?\d*)/g);
  if (speeds && speeds.length >= 2) {
    const firstSpeed = parseFloat(speeds[0].split(',')[0]);
    const lastSpeed = parseFloat(speeds[speeds.length - 1].split(',')[0]);
    if (lastSpeed > firstSpeed) {
      pattern.push('progressive_build');
    }
  }

  // Determine intensity
  let intensity: IntensityTag = 'medium';

  // High intensity: sprints, high inclines, high speeds
  if (pattern.includes('sprint') || /[89]\d*%/.test(content)) {
    intensity = 'high';
  }
  // Low intensity: recovery heavy, low speeds
  else if (pattern.includes('recovery_heavy')) {
    intensity = 'low';
  }
  // Check speed values
  else {
    const allSpeeds = content.match(/\d+\.?\d*/g)?.map(Number) || [];
    const avgSpeed = allSpeeds.length > 0
      ? allSpeeds.reduce((a, b) => a + b, 0) / allSpeeds.length
      : 6;

    if (avgSpeed >= 8) intensity = 'high';
    else if (avgSpeed <= 5.5) intensity = 'low';
  }

  return { pattern, intensity };
}

/**
 * Get all tags as a flat array of strings for searching
 */
export function getTagsAsArray(tags: BlockTags): string[] {
  const result: string[] = [];

  if ('structure' in tags) {
    // Floor block
    result.push(...tags.structure);
    result.push(...tags.movement);
    result.push(...tags.bodyFocus);
  } else {
    // Tread block
    result.push(...tags.pattern);
  }

  result.push(tags.intensity);

  return result;
}

/**
 * Check if a block matches a search query
 */
export function blockMatchesSearch(
  block: string[],
  tags: BlockTags,
  searchQuery: string
): boolean {
  const query = searchQuery.toLowerCase().trim();
  if (!query) return true;

  // Check block content
  const content = block.join(' ').toLowerCase();
  if (content.includes(query)) return true;

  // Check tag labels
  const tagArray = getTagsAsArray(tags);
  for (const tag of tagArray) {
    const label = TAG_LABELS[tag]?.toLowerCase() || tag.toLowerCase();
    if (label.includes(query) || tag.includes(query)) {
      return true;
    }
  }

  return false;
}

// ============================================
// MANUAL TAG STORAGE (for custom blocks)
// ============================================

const MANUAL_TAGS_KEY = 'barrys_block_manual_tags';

interface ManualTagsStore {
  [blockId: string]: string[];  // Additional tags added manually
}

export function loadManualTags(): ManualTagsStore {
  try {
    const stored = localStorage.getItem(MANUAL_TAGS_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

export function saveManualTag(blockId: string, tag: string): void {
  const store = loadManualTags();
  if (!store[blockId]) store[blockId] = [];
  if (!store[blockId].includes(tag)) {
    store[blockId].push(tag);
    localStorage.setItem(MANUAL_TAGS_KEY, JSON.stringify(store));
  }
}

export function removeManualTag(blockId: string, tag: string): void {
  const store = loadManualTags();
  if (store[blockId]) {
    store[blockId] = store[blockId].filter(t => t !== tag);
    if (store[blockId].length === 0) {
      delete store[blockId];
    }
    localStorage.setItem(MANUAL_TAGS_KEY, JSON.stringify(store));
  }
}

export function getManualTags(blockId: string): string[] {
  const store = loadManualTags();
  return store[blockId] || [];
}
