// Tread Block Flow Analysis Service
// Analyzes block characteristics and scores compatibility for smooth class progression

export interface TreadBlockProfile {
  // Speed characteristics
  baseSpeed: number;           // Lowest speed in the first speed set (e.g., 6 from "6, 7, 8")
  maxSpeed: number;            // Highest speed mentioned
  speedRange: number;          // Difference between max and min speeds
  avgSpeed: number;            // Average of all speeds

  // Incline characteristics
  hasIncline: boolean;
  maxIncline: number;          // Highest incline % (0 if none)
  inclineMinutes: number;      // How many minutes have incline

  // Structure characteristics
  hasRecover: boolean;
  recoverCount: number;        // Number of RECOVER entries
  recoverRatio: number;        // Recover entries / total entries

  hasSprint: boolean;
  sprintCount: number;

  hasIntervals: boolean;       // Multiple speed sets per minute (pipes)
  intervalCount: number;       // How many entries have intervals

  // Overall character
  intensity: 'low' | 'medium' | 'high';
  character: TreadCharacter;
}

export type TreadCharacter =
  | 'speed_build'      // Gradually increasing speeds
  | 'incline_focus'    // Significant incline work
  | 'interval_heavy'   // Lots of speed changes
  | 'recovery_focused' // High recovery ratio
  | 'sprint_focused'   // Sprint-heavy
  | 'balanced';        // Mixed/moderate

/**
 * Analyze a tread block and create its profile
 */
export function analyzeTreadBlock(block: string[]): TreadBlockProfile {
  const allSpeeds: number[] = [];
  const firstSpeeds: number[] = []; // First speed from each entry
  let maxIncline = 0;
  let inclineMinutes = 0;
  let recoverCount = 0;
  let sprintCount = 0;
  let intervalCount = 0;

  for (const line of block) {
    const lower = line.toLowerCase();

    // Check for recover
    if (lower.includes('recover')) {
      recoverCount++;
      continue;
    }

    // Check for sprint
    if (lower.includes('sprint')) {
      sprintCount++;
    }

    // Check for incline
    const inclineMatch = line.match(/(\d+)%/);
    if (inclineMatch) {
      const incline = parseInt(inclineMatch[1]);
      maxIncline = Math.max(maxIncline, incline);
      inclineMinutes++;
    }

    // Check for intervals (pipes indicating multiple speed sets)
    if (line.includes('|')) {
      intervalCount++;
    }

    // Extract all speed numbers
    const speedMatches = line.match(/(\d+\.?\d*),\s*(\d+\.?\d*),\s*(\d+\.?\d*)/g);
    if (speedMatches) {
      for (const match of speedMatches) {
        const nums = match.match(/\d+\.?\d*/g);
        if (nums) {
          nums.forEach(n => allSpeeds.push(parseFloat(n)));
        }
      }

      // Get first speed from first speed set
      const firstMatch = speedMatches[0].match(/\d+\.?\d*/g);
      if (firstMatch) {
        firstSpeeds.push(parseFloat(firstMatch[0]));
      }
    }
  }

  // Calculate speed stats
  const baseSpeed = firstSpeeds.length > 0 ? Math.min(...firstSpeeds) : 6;
  const maxSpeed = allSpeeds.length > 0 ? Math.max(...allSpeeds) : 8;
  const avgSpeed = allSpeeds.length > 0
    ? allSpeeds.reduce((a, b) => a + b, 0) / allSpeeds.length
    : 7;
  const speedRange = maxSpeed - (allSpeeds.length > 0 ? Math.min(...allSpeeds) : 6);

  const recoverRatio = recoverCount / block.length;

  // Determine intensity
  let intensity: 'low' | 'medium' | 'high' = 'medium';
  if (avgSpeed >= 8 || maxIncline >= 6 || sprintCount >= 2) {
    intensity = 'high';
  } else if (avgSpeed <= 6 || recoverRatio >= 0.3) {
    intensity = 'low';
  }

  // Determine character
  let character: TreadCharacter = 'balanced';

  if (recoverRatio >= 0.3) {
    character = 'recovery_focused';
  } else if (sprintCount >= 2 || (sprintCount >= 1 && block.length <= 3)) {
    character = 'sprint_focused';
  } else if (maxIncline >= 4) {
    character = 'incline_focus';
  } else if (intervalCount >= block.length * 0.5) {
    character = 'interval_heavy';
  } else if (firstSpeeds.length >= 2) {
    // Check for speed progression
    const isBuilding = firstSpeeds.every((s, i) =>
      i === 0 || s >= firstSpeeds[i - 1] - 0.5
    );
    if (isBuilding && firstSpeeds[firstSpeeds.length - 1] > firstSpeeds[0]) {
      character = 'speed_build';
    }
  }

  return {
    baseSpeed,
    maxSpeed,
    speedRange,
    avgSpeed,
    hasIncline: maxIncline > 0,
    maxIncline,
    inclineMinutes,
    hasRecover: recoverCount > 0,
    recoverCount,
    recoverRatio,
    hasSprint: sprintCount > 0,
    sprintCount,
    hasIntervals: intervalCount > 0,
    intervalCount,
    intensity,
    character
  };
}

/**
 * Score how well two blocks flow together (0-100)
 * Higher score = better flow
 */
export function scoreBlockFlow(
  currentBlock: TreadBlockProfile,
  nextBlock: TreadBlockProfile,
  position: 'early' | 'middle' | 'late'  // Position in the round
): number {
  let score = 100;
  const penalties: { reason: string; penalty: number }[] = [];

  // === SPEED FLOW ===
  // Base speed should be similar or progressively building
  const speedDiff = Math.abs(nextBlock.baseSpeed - currentBlock.baseSpeed);

  if (speedDiff > 1.5) {
    penalties.push({ reason: 'Large speed jump', penalty: 25 });
  } else if (speedDiff > 1) {
    penalties.push({ reason: 'Moderate speed jump', penalty: 10 });
  }

  // Penalize speed drops (except for recovery)
  if (nextBlock.baseSpeed < currentBlock.baseSpeed - 0.5 &&
      nextBlock.character !== 'recovery_focused') {
    penalties.push({ reason: 'Speed regression', penalty: 15 });
  }

  // === INCLINE CONSISTENCY ===
  // Don't jump from no incline to heavy incline
  if (!currentBlock.hasIncline && nextBlock.maxIncline >= 4) {
    penalties.push({ reason: 'Sudden incline introduction', penalty: 30 });
  }

  // Don't drop from heavy incline to none abruptly
  if (currentBlock.maxIncline >= 4 && !nextBlock.hasIncline) {
    penalties.push({ reason: 'Abrupt incline drop', penalty: 15 });
  }

  // Large incline jumps
  if (nextBlock.maxIncline - currentBlock.maxIncline > 3) {
    penalties.push({ reason: 'Large incline increase', penalty: 20 });
  }

  // === RECOVERY BALANCE ===
  // Don't stack recovery-focused blocks
  if (currentBlock.character === 'recovery_focused' &&
      nextBlock.character === 'recovery_focused') {
    penalties.push({ reason: 'Back-to-back recovery blocks', penalty: 25 });
  }

  // === SPRINT PLACEMENT ===
  // Sprints should generally come in middle/late blocks, not early
  if (position === 'early' && nextBlock.sprintCount >= 2) {
    penalties.push({ reason: 'Heavy sprints too early', penalty: 15 });
  }

  // Back-to-back sprint-heavy blocks can be exhausting
  if (currentBlock.sprintCount >= 2 && nextBlock.sprintCount >= 2) {
    penalties.push({ reason: 'Back-to-back sprint blocks', penalty: 20 });
  }

  // === CHARACTER COMPATIBILITY ===
  // Some character transitions are jarring
  const jarringTransitions: [TreadCharacter, TreadCharacter][] = [
    ['recovery_focused', 'sprint_focused'],
    ['incline_focus', 'speed_build'],  // Different energy systems
  ];

  for (const [from, to] of jarringTransitions) {
    if (currentBlock.character === from && nextBlock.character === to) {
      penalties.push({ reason: `Jarring transition: ${from} to ${to}`, penalty: 20 });
    }
  }

  // === INTENSITY PROGRESSION ===
  // Generally should build or maintain intensity, not drop (except end)
  if (position !== 'late') {
    if (currentBlock.intensity === 'high' && nextBlock.intensity === 'low') {
      penalties.push({ reason: 'Intensity drop mid-round', penalty: 15 });
    }
  }

  // Late blocks should allow for high intensity (finisher)
  if (position === 'late' && nextBlock.intensity === 'low' &&
      nextBlock.character !== 'recovery_focused') {
    penalties.push({ reason: 'Low intensity finisher', penalty: 10 });
  }

  // === POSITIVE BONUSES ===
  // Reward good progressions

  // Natural speed build
  if (nextBlock.baseSpeed > currentBlock.baseSpeed &&
      nextBlock.baseSpeed <= currentBlock.baseSpeed + 1) {
    score += 10;
  }

  // Matching characters flow well
  if (currentBlock.character === nextBlock.character &&
      currentBlock.character !== 'recovery_focused') {
    score += 5;
  }

  // Incline progression (building)
  if (nextBlock.maxIncline > currentBlock.maxIncline &&
      nextBlock.maxIncline <= currentBlock.maxIncline + 2) {
    score += 5;
  }

  // Apply penalties
  for (const { penalty } of penalties) {
    score -= penalty;
  }

  return Math.max(0, Math.min(100, score));
}

/**
 * Get flow-compatible blocks from a list
 * Returns blocks sorted by flow score
 */
export function getFlowCompatibleBlocks(
  currentProfile: TreadBlockProfile,
  candidates: { block: string[]; index: number }[],
  position: 'early' | 'middle' | 'late',
  minScore: number = 60
): { block: string[]; index: number; score: number; profile: TreadBlockProfile }[] {
  const scored = candidates.map(candidate => {
    const profile = analyzeTreadBlock(candidate.block);
    const score = scoreBlockFlow(currentProfile, profile, position);
    return { ...candidate, score, profile };
  });

  return scored
    .filter(c => c.score >= minScore)
    .sort((a, b) => b.score - a.score);
}

/**
 * Determine position in round based on minute index and duration
 */
export function getPositionInRound(
  currentMinute: number,
  roundDuration: number
): 'early' | 'middle' | 'late' {
  const progress = currentMinute / roundDuration;
  if (progress < 0.3) return 'early';
  if (progress > 0.7) return 'late';
  return 'middle';
}

/**
 * Character labels for display
 */
export const CHARACTER_LABELS: Record<TreadCharacter, string> = {
  speed_build: 'Speed Build',
  incline_focus: 'Incline Focus',
  interval_heavy: 'Interval Heavy',
  recovery_focused: 'Recovery Focused',
  sprint_focused: 'Sprint Focused',
  balanced: 'Balanced'
};

/**
 * Get a summary description of a block's profile
 */
export function getProfileSummary(profile: TreadBlockProfile): string {
  const parts: string[] = [];

  parts.push(`Base: ${profile.baseSpeed}`);

  if (profile.hasIncline) {
    parts.push(`${profile.maxIncline}% incline`);
  }

  if (profile.hasSprint) {
    parts.push(`${profile.sprintCount} sprint${profile.sprintCount > 1 ? 's' : ''}`);
  }

  if (profile.hasRecover) {
    parts.push(`${profile.recoverCount} recover`);
  }

  parts.push(CHARACTER_LABELS[profile.character]);

  return parts.join(' | ');
}
