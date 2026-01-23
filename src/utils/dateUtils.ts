import { format, subWeeks, isAfter, parseISO } from 'date-fns';

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'yyyy-MM-dd');
}

export function formatDisplayDate(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'MMM d, yyyy');
}

export function getToday(): string {
  return formatDate(new Date());
}

export function isWithinLastNWeeks(dateStr: string, weeks: number): boolean {
  const date = parseISO(dateStr);
  const cutoff = subWeeks(new Date(), weeks);
  return isAfter(date, cutoff);
}

export function countUsageInLastNWeeks(usageHistory: string[], weeks: number): number {
  return usageHistory.filter(date => isWithinLastNWeeks(date, weeks)).length;
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
