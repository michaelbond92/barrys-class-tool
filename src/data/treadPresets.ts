import { EnergyLevel, SpeedSet } from '../types';

export interface TreadPreset {
  name: string;
  energyLevel: EnergyLevel;
  speeds: SpeedSet;
  inclinePercent: number;
  isRecover: boolean;
  isSprint: boolean;
}

// L1 Presets (Warmup - easier)
export const L1_PRESETS: TreadPreset[] = [
  {
    name: 'Easy Jog',
    energyLevel: 'L1',
    speeds: { low: 5, mid: 6, high: 7 },
    inclinePercent: 0,
    isRecover: false,
    isSprint: false
  },
  {
    name: 'Warm Up Push',
    energyLevel: 'L1',
    speeds: { low: 5.5, mid: 6.5, high: 7.5 },
    inclinePercent: 0,
    isRecover: false,
    isSprint: false
  },
  {
    name: 'Light Incline',
    energyLevel: 'L1',
    speeds: { low: 5, mid: 6, high: 7 },
    inclinePercent: 3,
    isRecover: false,
    isSprint: false
  }
];

// L2 Presets (Building - moderate)
export const L2_PRESETS: TreadPreset[] = [
  {
    name: 'Steady State',
    energyLevel: 'L2',
    speeds: { low: 6, mid: 7, high: 8 },
    inclinePercent: 0,
    isRecover: false,
    isSprint: false
  },
  {
    name: 'Push Pace',
    energyLevel: 'L2',
    speeds: { low: 6.5, mid: 7.5, high: 8.5 },
    inclinePercent: 0,
    isRecover: false,
    isSprint: false
  },
  {
    name: 'Rolling Hills',
    energyLevel: 'L2',
    speeds: { low: 6, mid: 7, high: 8 },
    inclinePercent: 5,
    isRecover: false,
    isSprint: false
  },
  {
    name: 'Build Speed',
    energyLevel: 'L2',
    speeds: { low: 6, mid: 7.5, high: 9 },
    inclinePercent: 0,
    isRecover: false,
    isSprint: false
  },
  {
    name: 'Recover',
    energyLevel: 'L2',
    speeds: { low: 0, mid: 0, high: 0 },
    inclinePercent: 0,
    isRecover: true,
    isSprint: false
  }
];

// L3 Presets (Finisher - intense)
export const L3_PRESETS: TreadPreset[] = [
  {
    name: 'All Out',
    energyLevel: 'L3',
    speeds: { low: 7, mid: 8.5, high: 10 },
    inclinePercent: 0,
    isRecover: false,
    isSprint: false
  },
  {
    name: 'Sprint',
    energyLevel: 'L3',
    speeds: { low: 8, mid: 10, high: 12 },
    inclinePercent: 0,
    isRecover: false,
    isSprint: true
  },
  {
    name: 'Hill Sprint',
    energyLevel: 'L3',
    speeds: { low: 6, mid: 7, high: 8 },
    inclinePercent: 8,
    isRecover: false,
    isSprint: true
  },
  {
    name: 'Hero Moment',
    energyLevel: 'L3',
    speeds: { low: 6, mid: 8, high: 10 },
    inclinePercent: 0,
    isRecover: false,
    isSprint: true
  }
];

export function getPresetsByEnergyLevel(level: EnergyLevel): TreadPreset[] {
  switch (level) {
    case 'L1':
      return L1_PRESETS;
    case 'L2':
      return L2_PRESETS;
    case 'L3':
      return L3_PRESETS;
  }
}

export function formatSpeedSet(speeds: SpeedSet): string {
  return `${speeds.low}, ${speeds.mid}, ${speeds.high}`;
}

export function formatTreadEntry(preset: TreadPreset): string {
  if (preset.isRecover) {
    return 'RECOVER';
  }

  let result = '';
  if (preset.inclinePercent > 0) {
    result += `${preset.inclinePercent}% `;
  }
  result += formatSpeedSet(preset.speeds);
  if (preset.isSprint) {
    result += ' | SPRINT';
  }
  return result;
}
