// ============================================================================
// Query Parser Service
// Parses natural language queries into structured search constraints
// ============================================================================

import {
  SearchConstraints,
  BodyFocus,
  StructureTag,
  MovementPattern,
  FinisherType,
  TreadPattern,
  ExercisePosition,
  WeightType,
} from '../types/hierarchyTypes';

// ============================================================================
// QUERY PATTERNS
// ============================================================================

interface QueryPattern {
  patterns: RegExp[];
  extract: (match: RegExpMatchArray, query: string) => Partial<SearchConstraints>;
}

const QUERY_PATTERNS: QueryPattern[] = [
  // Duration patterns
  {
    patterns: [
      /(\d+)\s*(?:min|minute|minutes)/i,
      /(\d+)\s*(?:min|minute|minutes)\s*round/i,
    ],
    extract: (match) => ({
      duration: { min: parseInt(match[1]) - 1, max: parseInt(match[1]) + 1 },
    }),
  },

  // Body focus patterns
  {
    patterns: [/\bchest\b/i],
    extract: () => ({ bodyFocus: ['chest'] }),
  },
  {
    patterns: [/\bback\b/i],
    extract: () => ({ bodyFocus: ['back'] }),
  },
  {
    patterns: [/\bshoulder/i],
    extract: () => ({ bodyFocus: ['shoulders'] }),
  },
  {
    patterns: [/\barm/i, /\bbicep/i, /\btricep/i],
    extract: () => ({ bodyFocus: ['arms'] }),
  },
  {
    patterns: [/\bleg/i, /\blower\s*body/i, /\bquad/i, /\bham/i, /\bglute/i],
    extract: () => ({ bodyFocus: ['lower'] }),
  },
  {
    patterns: [/\bcore\b/i, /\babs\b/i, /\babdom/i],
    extract: () => ({ bodyFocus: ['core'] }),
  },
  {
    patterns: [/\bupper\s*body/i, /\bupper\b/i],
    extract: () => ({ bodyFocus: ['upper'] }),
  },
  {
    patterns: [/\bfull\s*body/i, /\btotal\s*body/i],
    extract: () => ({ bodyFocus: ['full_body'] }),
  },

  // Movement patterns
  {
    patterns: [/\bpush\b/i, /\bpush.*focus/i, /\bpush.*heavy/i],
    extract: () => ({ movementPatterns: ['push'] }),
  },
  {
    patterns: [/\bpull\b/i, /\bpull.*focus/i, /\bpull.*heavy/i],
    extract: () => ({ movementPatterns: ['pull'] }),
  },
  {
    patterns: [/\bhinge/i, /\bdeadlift.*focus/i],
    extract: () => ({ movementPatterns: ['hinge'] }),
  },
  {
    patterns: [/\bsquat.*focus/i, /\bsquat.*heavy/i],
    extract: () => ({ movementPatterns: ['squat'] }),
  },
  {
    patterns: [/\blunge.*focus/i],
    extract: () => ({ movementPatterns: ['lunge'] }),
  },
  {
    patterns: [/\bpush.*pull/i, /\bpull.*push/i, /\bpush\/pull/i],
    extract: () => ({ movementPatterns: ['push', 'pull'] }),
  },

  // Finisher patterns
  {
    patterns: [/snatch\s*finisher/i, /end.*snatch/i, /finish.*snatch/i],
    extract: () => ({ finisherType: ['snatches'] }),
  },
  {
    patterns: [/burpee\s*finisher/i, /end.*burpee/i, /finish.*burpee/i],
    extract: () => ({ finisherType: ['burpees'] }),
  },
  {
    patterns: [/weighted\s*burpee/i],
    extract: () => ({ finisherType: ['weighted_burpees'] }),
  },
  {
    patterns: [/swing\s*finisher/i, /db\s*swing/i, /dumbbell\s*swing/i],
    extract: () => ({ finisherType: ['db_swings'] }),
  },
  {
    patterns: [/high\s*pull\s*finisher/i, /squat.*hi\s*pull/i],
    extract: () => ({ finisherType: ['squat_to_hi_pull'] }),
  },
  {
    patterns: [/amrap\s*finisher/i, /end.*amrap/i],
    extract: () => ({ finisherType: ['amrap'] }),
  },
  {
    patterns: [/choice\s*finisher/i, /end.*choice/i],
    extract: () => ({ finisherType: ['choice'] }),
  },

  // Structure patterns
  {
    patterns: [/\btempo\b/i, /\bslow\b/i],
    extract: () => ({ structure: ['tempo'] }),
  },
  {
    patterns: [/\bamrap\b/i, /as\s*many/i],
    extract: () => ({ structure: ['amrap'] }),
  },
  {
    patterns: [/\bladder\b/i, /\bpyramid\b/i],
    extract: () => ({ structure: ['ladder'] }),
  },
  {
    patterns: [/\bhold/i, /\bpause/i],
    extract: () => ({ structure: ['hold_pulse'] }),
  },
  {
    patterns: [/\bsame\s*side\b/i, /unilateral/i],
    extract: () => ({ structure: ['same_side'] }),
  },

  // Tread patterns
  {
    patterns: [/\bincline/i, /\bhill/i],
    extract: () => ({ treadPattern: ['incline_heavy'], hasIncline: true }),
  },
  {
    patterns: [/\bsprint.*heavy/i, /\bsprint.*focus/i, /lots.*sprint/i],
    extract: () => ({ treadPattern: ['sprint_focused'] }),
  },
  {
    patterns: [/\binterval/i],
    extract: () => ({ treadPattern: ['intervals'] }),
  },
  {
    patterns: [/\bbuild/i, /\bprogress/i],
    extract: () => ({ treadPattern: ['progressive_build'] }),
  },

  // Flow patterns
  {
    patterns: [/\bsmooth\s*flow/i, /\bgood\s*flow/i, /\bflow\s*score/i],
    extract: () => ({ minFlowScore: 70 }),
  },
  {
    patterns: [/\bgreat\s*flow/i, /\bperfect\s*flow/i],
    extract: () => ({ minFlowScore: 85 }),
  },

  // Grip patterns
  {
    patterns: [/grip\s*break/i, /\bgrip\s*rest/i, /\beasy.*grip/i],
    extract: () => ({ hasGripBreaks: true, maxGripLoad: 6 }),
  },
  {
    patterns: [/\blow\s*grip/i, /\blight.*grip/i],
    extract: () => ({ maxGripLoad: 4 }),
  },

  // Freshness patterns
  {
    patterns: [/\bfresh\b/i, /\bnew\b/i, /haven't\s*used/i, /not\s*used/i],
    extract: () => ({ preferFresh: true }),
  },
  {
    patterns: [/not\s*recent/i, /exclude\s*recent/i],
    extract: () => ({ excludeUsedWithinDays: 14 }),
  },
  {
    patterns: [/very\s*fresh/i, /super\s*fresh/i],
    extract: () => ({ excludeUsedWithinDays: 28, preferFresh: true }),
  },

  // Equipment patterns
  {
    patterns: [/\bheavy\b.*weight/i, /\bheavies\b/i, /heavy\s*dumbbell/i],
    extract: () => ({ equipment: ['heavy'] }),
  },
  {
    patterns: [/\bmedium\b.*weight/i, /\bmediums\b/i],
    extract: () => ({ equipment: ['medium'] }),
  },
  {
    patterns: [/\blight\b.*weight/i],
    extract: () => ({ equipment: ['light'] }),
  },

  // Position patterns
  {
    patterns: [/\bfloor.*heavy/i, /\bstanding.*focus/i],
    extract: () => ({ positions: ['floor_standing'] }),
  },
  {
    patterns: [/\bbench.*focus/i, /\bbench.*heavy/i],
    extract: () => ({ positions: ['bench_laying'] }),
  },
  {
    patterns: [/\bplank.*focus/i, /\bplank.*heavy/i],
    extract: () => ({ positions: ['floor_laying'] }),
  },
];

// ============================================================================
// PARSING FUNCTIONS
// ============================================================================

/**
 * Parse a natural language query into structured search constraints
 */
export function parseQuery(text: string): SearchConstraints {
  const constraints: SearchConstraints = {};
  const normalizedText = text.toLowerCase().trim();

  // Apply each pattern
  for (const { patterns, extract } of QUERY_PATTERNS) {
    for (const pattern of patterns) {
      const match = normalizedText.match(pattern);
      if (match) {
        const partial = extract(match, normalizedText);
        mergeConstraints(constraints, partial);
        break; // Only match once per pattern group
      }
    }
  }

  // Store original text query for fuzzy matching
  if (normalizedText.length > 0) {
    constraints.textQuery = normalizedText;
  }

  return constraints;
}

/**
 * Merge partial constraints into main constraints object
 */
function mergeConstraints(target: SearchConstraints, source: Partial<SearchConstraints>): void {
  for (const [key, value] of Object.entries(source)) {
    if (value === undefined) continue;

    const existingValue = target[key as keyof SearchConstraints];

    if (Array.isArray(value) && Array.isArray(existingValue)) {
      // Merge arrays
      (target as Record<string, unknown>)[key] = [...new Set([...existingValue, ...value])];
    } else if (typeof value === 'object' && typeof existingValue === 'object' && !Array.isArray(value)) {
      // Merge objects (like duration range)
      (target as Record<string, unknown>)[key] = { ...existingValue, ...value };
    } else {
      // Replace value
      (target as Record<string, unknown>)[key] = value;
    }
  }
}

// ============================================================================
// INTERPRETATION
// ============================================================================

/**
 * Generate a human-readable interpretation of parsed constraints
 */
export function interpretQuery(constraints: SearchConstraints): string {
  const parts: string[] = [];

  if (constraints.duration) {
    const { min, max } = constraints.duration;
    if (min !== undefined && max !== undefined) {
      parts.push(`${Math.round((min + max) / 2)} min round`);
    } else if (min !== undefined) {
      parts.push(`at least ${min} min`);
    } else if (max !== undefined) {
      parts.push(`up to ${max} min`);
    }
  }

  if (constraints.bodyFocus && constraints.bodyFocus.length > 0) {
    parts.push(constraints.bodyFocus.join('/') + ' focus');
  }

  if (constraints.movementPatterns && constraints.movementPatterns.length > 0) {
    parts.push(constraints.movementPatterns.join('/') + ' movements');
  }

  if (constraints.finisherType && constraints.finisherType.length > 0) {
    parts.push(`${constraints.finisherType[0]} finisher`);
  }

  if (constraints.structure && constraints.structure.length > 0) {
    parts.push(constraints.structure.join(', ') + ' structure');
  }

  if (constraints.treadPattern && constraints.treadPattern.length > 0) {
    parts.push(constraints.treadPattern[0].replace('_', ' ') + ' tread');
  }

  if (constraints.hasIncline) {
    parts.push('with incline');
  }

  if (constraints.minFlowScore) {
    if (constraints.minFlowScore >= 85) {
      parts.push('great flow');
    } else {
      parts.push('good flow');
    }
  }

  if (constraints.hasGripBreaks) {
    parts.push('with grip breaks');
  }

  if (constraints.maxGripLoad) {
    parts.push(`low grip demand (≤${constraints.maxGripLoad})`);
  }

  if (constraints.preferFresh) {
    parts.push('prefer fresh');
  }

  if (constraints.excludeUsedWithinDays) {
    parts.push(`not used in ${constraints.excludeUsedWithinDays} days`);
  }

  if (constraints.equipment && constraints.equipment.length > 0) {
    parts.push(constraints.equipment.join('/') + ' weights');
  }

  if (parts.length === 0) {
    return 'No specific filters detected';
  }

  return 'I understood: ' + parts.join(', ');
}

/**
 * Check if constraints are empty (no filters applied)
 */
export function isEmptyConstraints(constraints: SearchConstraints): boolean {
  return Object.keys(constraints).length === 0 ||
    (Object.keys(constraints).length === 1 && constraints.textQuery !== undefined);
}

// ============================================================================
// QUERY SUGGESTIONS
// ============================================================================

const EXAMPLE_QUERIES = [
  '10 min push/pull with snatch finisher',
  '12 min round with incline and grip breaks',
  'chest focus with tempo structure',
  'fresh lower body workout',
  '8 min AMRAP finisher with good flow',
  'push heavy with burpee finisher',
  'core focus, not used recently',
  '11 min round, heavy weights, snatches',
  'back focus with smooth flow',
  'interval tread with ladder structure',
];

/**
 * Get random example queries
 */
export function getExampleQueries(count: number = 3): string[] {
  const shuffled = [...EXAMPLE_QUERIES].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/**
 * Get query suggestions based on partial input
 */
export function getSuggestions(partial: string): string[] {
  const lower = partial.toLowerCase();
  const suggestions: string[] = [];

  // Suggest body focus completions
  if (lower.endsWith(' ') || lower.length === 0) {
    suggestions.push(
      'chest focus',
      'back focus',
      'core focus',
      'leg focus',
      'push/pull',
    );
  }

  // Suggest finisher completions
  if (/finish|end/i.test(lower) && !/(snatch|burpee|swing|amrap|choice)/i.test(lower)) {
    suggestions.push(
      'snatch finisher',
      'burpee finisher',
      'swing finisher',
      'AMRAP finisher',
    );
  }

  // Suggest duration completions
  if (/\d+\s*m/i.test(lower) && !/min(ute)?s?\b/i.test(lower)) {
    suggestions.push('min round');
  }

  // Suggest freshness completions
  if (/fresh|new|recent/i.test(lower)) {
    suggestions.push(
      'fresh',
      'very fresh',
      'not used recently',
    );
  }

  return suggestions.slice(0, 5);
}

// ============================================================================
// QUERY VALIDATION
// ============================================================================

/**
 * Validate query and return any warnings
 */
export function validateQuery(constraints: SearchConstraints): string[] {
  const warnings: string[] = [];

  // Check for conflicting patterns
  if (constraints.movementPatterns) {
    const patterns = constraints.movementPatterns;
    if (patterns.includes('push') && patterns.includes('hinge')) {
      warnings.push('Push and hinge are rarely combined in a single block');
    }
  }

  // Check for unrealistic combinations
  if (constraints.duration) {
    const { min, max } = constraints.duration;
    if (max && max < 6) {
      warnings.push('Very short rounds (<6 min) are rare in the data');
    }
    if (min && min > 14) {
      warnings.push('Very long rounds (>14 min) are rare in the data');
    }
  }

  // Check for restrictive freshness
  if (constraints.excludeUsedWithinDays && constraints.excludeUsedWithinDays > 60) {
    warnings.push('Very long freshness window may return limited results');
  }

  return warnings;
}

// ============================================================================
// SCORING HELPERS
// ============================================================================

/**
 * Calculate how well an entity matches the constraints
 * Returns a score from 0-100
 */
export function calculateMatchScore(
  entity: {
    duration?: number;
    bodyFocus?: BodyFocus[];
    movementPatterns?: MovementPattern[];
    finisherType?: FinisherType | null;
    structure?: StructureTag[];
    treadPattern?: TreadPattern;
    hasIncline?: boolean;
    flowScore?: number;
    hasGripBreaks?: boolean;
    gripLoadScore?: number;
  },
  constraints: SearchConstraints
): { score: number; matchedFields: string[] } {
  let score = 0;
  let maxScore = 0;
  const matchedFields: string[] = [];

  // Duration matching (20 points)
  if (constraints.duration && entity.duration !== undefined) {
    maxScore += 20;
    const { min, max } = constraints.duration;
    if ((!min || entity.duration >= min) && (!max || entity.duration <= max)) {
      score += 20;
      matchedFields.push('duration');
    }
  }

  // Body focus matching (15 points)
  if (constraints.bodyFocus && entity.bodyFocus) {
    maxScore += 15;
    const overlap = constraints.bodyFocus.filter(f => entity.bodyFocus!.includes(f));
    if (overlap.length > 0) {
      score += 15 * (overlap.length / constraints.bodyFocus.length);
      matchedFields.push('bodyFocus');
    }
  }

  // Movement pattern matching (15 points)
  if (constraints.movementPatterns && entity.movementPatterns) {
    maxScore += 15;
    const overlap = constraints.movementPatterns.filter(p => entity.movementPatterns!.includes(p));
    if (overlap.length > 0) {
      score += 15 * (overlap.length / constraints.movementPatterns.length);
      matchedFields.push('movementPatterns');
    }
  }

  // Finisher matching (20 points)
  if (constraints.finisherType && entity.finisherType) {
    maxScore += 20;
    if (constraints.finisherType.includes(entity.finisherType)) {
      score += 20;
      matchedFields.push('finisher');
    }
  }

  // Structure matching (10 points)
  if (constraints.structure && entity.structure) {
    maxScore += 10;
    const overlap = constraints.structure.filter(s => entity.structure!.includes(s));
    if (overlap.length > 0) {
      score += 10 * (overlap.length / constraints.structure.length);
      matchedFields.push('structure');
    }
  }

  // Tread pattern matching (10 points)
  if (constraints.treadPattern && entity.treadPattern) {
    maxScore += 10;
    if (constraints.treadPattern.includes(entity.treadPattern)) {
      score += 10;
      matchedFields.push('treadPattern');
    }
  }

  // Incline matching (5 points)
  if (constraints.hasIncline !== undefined && entity.hasIncline !== undefined) {
    maxScore += 5;
    if (constraints.hasIncline === entity.hasIncline) {
      score += 5;
      matchedFields.push('incline');
    }
  }

  // Flow score matching (5 points)
  if (constraints.minFlowScore && entity.flowScore !== undefined) {
    maxScore += 5;
    if (entity.flowScore >= constraints.minFlowScore) {
      score += 5;
      matchedFields.push('flowScore');
    }
  }

  // Grip matching
  if (constraints.hasGripBreaks && entity.hasGripBreaks !== undefined) {
    maxScore += 5;
    if (entity.hasGripBreaks) {
      score += 5;
      matchedFields.push('gripBreaks');
    }
  }

  if (constraints.maxGripLoad && entity.gripLoadScore !== undefined) {
    maxScore += 5;
    if (entity.gripLoadScore <= constraints.maxGripLoad) {
      score += 5;
      matchedFields.push('gripLoad');
    }
  }

  // Normalize to 0-100
  const normalizedScore = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;

  return { score: normalizedScore, matchedFields };
}
