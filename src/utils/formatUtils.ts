import { SpeedSet, ClassType } from '../types';

export function formatMinuteRange(startMinute: number): string {
  return `${startMinute}-${startMinute + 1}`;
}

export function formatSpeedSet(speeds: SpeedSet): string {
  return `${speeds.low}, ${speeds.mid}, ${speeds.high}`;
}

export function formatTreadAverage(average: number): string {
  return average.toFixed(2);
}

export function formatClassTypeName(classType: ClassType): string {
  const names: Record<ClassType, string> = {
    total_body: 'Total Body',
    chest_back_abs: 'Chest, Back & Abs',
    arms_abs: 'Arms & Abs',
    legs_core: 'Legs & Core'
  };
  return names[classType];
}

export function parseMinuteFromRange(range: string): number {
  const match = range.match(/^(\d+)/);
  return match ? parseInt(match[1]) : 0;
}

export function roundToDecimal(num: number, decimals: number = 2): number {
  const factor = Math.pow(10, decimals);
  return Math.round(num * factor) / factor;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
