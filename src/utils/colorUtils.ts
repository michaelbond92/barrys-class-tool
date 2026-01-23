import { EnergyLevel } from '../types';

export function getEnergyLevelColor(level: EnergyLevel): string {
  switch (level) {
    case 'L1':
      return 'bg-energy-l1'; // Green - warmup
    case 'L2':
      return 'bg-energy-l2'; // Yellow - building
    case 'L3':
      return 'bg-energy-l3'; // Pink - finisher
  }
}

export function getEnergyLevelTextColor(level: EnergyLevel): string {
  switch (level) {
    case 'L1':
      return 'text-green-800';
    case 'L2':
      return 'text-yellow-800';
    case 'L3':
      return 'text-pink-800';
  }
}

export function getTreadTextColor(isRecover: boolean, isSprint: boolean, inclinePercent: number): string {
  if (isRecover) return 'text-gray-500';
  if (isSprint) return 'text-hero'; // Purple
  if (inclinePercent > 0) return 'text-incline'; // Red
  return 'text-black';
}

export function getFreshnessColor(usageCount: number): string {
  if (usageCount === 0) return 'bg-green-100 text-green-800'; // Fresh
  if (usageCount === 1) return 'bg-yellow-100 text-yellow-800'; // Used once
  if (usageCount === 2) return 'bg-orange-100 text-orange-800'; // Used twice
  return 'bg-red-100 text-red-800'; // Overused
}

export function getFreshnessLabel(usageCount: number): string {
  if (usageCount === 0) return 'Fresh';
  if (usageCount === 1) return 'Used 1x';
  if (usageCount === 2) return 'Used 2x';
  return 'Overused';
}

export function getAverageColor(average: number, maxAverage: number): string {
  const ratio = average / maxAverage;
  if (ratio <= 0.9) return 'text-green-600'; // Well under max
  if (ratio <= 1.0) return 'text-yellow-600'; // Near max but ok
  return 'text-red-600'; // Over max
}
