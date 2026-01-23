import { TreadEntry, SpeedSet } from '../types';
import { formatMinuteRange } from '../utils/formatUtils';

export interface ParsedTread {
  speeds: SpeedSet[];
  isRecover: boolean;
  isSprint: boolean;
  inclinePercent: number;
  lowestSpeed: number;
  effectiveSpeed: number;
  textColor: 'black' | 'red' | 'purple';
}

export function parseTreadEntry(raw: string): ParsedTread {
  const normalized = raw.trim().toUpperCase();

  // Check for recover
  if (normalized === 'RECOVER' || normalized === 'RECOVERY' || normalized === 'REC') {
    return {
      speeds: [],
      isRecover: true,
      isSprint: false,
      inclinePercent: 0,
      lowestSpeed: 0,
      effectiveSpeed: 0,
      textColor: 'black'
    };
  }

  // Extract incline (e.g., "6% 5, 6, 7" or "6%: 5, 6, 7")
  const inclineMatch = raw.match(/^(\d+)%\s*:?\s*/i);
  const inclinePercent = inclineMatch ? parseInt(inclineMatch[1]) : 0;
  const withoutIncline = inclineMatch ? raw.slice(inclineMatch[0].length) : raw;

  // Check for sprint
  const isSprint = normalized.includes('SPRINT') || normalized.includes('ALL OUT');

  // Split by | for multiple speed sets
  const segments = withoutIncline.split('|').map(s => s.trim());
  const speeds: SpeedSet[] = [];

  for (const segment of segments) {
    // Skip sprint/all out annotations
    if (segment.toUpperCase().includes('SPRINT') || segment.toUpperCase().includes('ALL OUT')) {
      continue;
    }

    // Parse "6, 7, 8" or "6/7/8" format
    const nums = segment.match(/[\d.]+/g);
    if (nums && nums.length >= 3) {
      speeds.push({
        low: parseFloat(nums[0]),
        mid: parseFloat(nums[1]),
        high: parseFloat(nums[2])
      });
    } else if (nums && nums.length === 1) {
      // Single speed (flat)
      const speed = parseFloat(nums[0]);
      speeds.push({ low: speed, mid: speed, high: speed });
    }
  }

  // Use first (lowest) speed set for average calculation
  const lowestSpeed = speeds.length > 0 ? speeds[0].low : 0;

  // Apply incline adjustment: +0.2 per 1%
  const effectiveSpeed = lowestSpeed + (inclinePercent * 0.2);

  // Determine text color
  let textColor: 'black' | 'red' | 'purple' = 'black';
  if (isSprint) {
    textColor = 'purple';
  } else if (inclinePercent > 0) {
    textColor = 'red';
  }

  return {
    speeds,
    isRecover: false,
    isSprint,
    inclinePercent,
    lowestSpeed,
    effectiveSpeed,
    textColor
  };
}

export function parseTreadColumn(rawText: string): TreadEntry[] {
  const lines = rawText.split('\n').filter(line => line.trim());
  const entries: TreadEntry[] = [];

  lines.forEach((line, index) => {
    const parsed = parseTreadEntry(line);
    entries.push({
      minute: formatMinuteRange(index),
      raw: line.trim(),
      ...parsed
    });
  });

  return entries;
}

export function calculateTreadAverage(entries: TreadEntry[]): number {
  const countable = entries.filter(e => !e.isRecover);
  if (countable.length === 0) return 0;

  const sum = countable.reduce((acc, e) => acc + e.effectiveSpeed, 0);
  return sum / countable.length;
}

export function formatSpeedsForDisplay(speeds: SpeedSet[]): string {
  if (speeds.length === 0) return '';
  if (speeds.length === 1) {
    const s = speeds[0];
    return `${s.low}, ${s.mid}, ${s.high}`;
  }
  return speeds.map(s => `${s.low}, ${s.mid}, ${s.high}`).join(' | ');
}

export function createTreadEntry(
  minute: number,
  speeds: SpeedSet | null,
  options: {
    isRecover?: boolean;
    isSprint?: boolean;
    inclinePercent?: number;
  } = {}
): TreadEntry {
  const { isRecover = false, isSprint = false, inclinePercent = 0 } = options;

  if (isRecover) {
    return {
      minute: formatMinuteRange(minute),
      raw: 'RECOVER',
      speeds: [],
      isRecover: true,
      isSprint: false,
      inclinePercent: 0,
      lowestSpeed: 0,
      effectiveSpeed: 0,
      textColor: 'black'
    };
  }

  const speedSet = speeds || { low: 6, mid: 7, high: 8 };
  const lowestSpeed = speedSet.low;
  const effectiveSpeed = lowestSpeed + (inclinePercent * 0.2);

  let raw = '';
  if (inclinePercent > 0) {
    raw += `${inclinePercent}% `;
  }
  raw += `${speedSet.low}, ${speedSet.mid}, ${speedSet.high}`;
  if (isSprint) {
    raw += ' | SPRINT';
  }

  let textColor: 'black' | 'red' | 'purple' = 'black';
  if (isSprint) {
    textColor = 'purple';
  } else if (inclinePercent > 0) {
    textColor = 'red';
  }

  return {
    minute: formatMinuteRange(minute),
    raw,
    speeds: [speedSet],
    isRecover: false,
    isSprint,
    inclinePercent,
    lowestSpeed,
    effectiveSpeed,
    textColor
  };
}
