import { useState, useCallback, useMemo } from 'react';
import { TreadEntry } from '../types';
import { parseTreadColumn, calculateTreadAverage } from '../services/treadParser';

export interface UseTreadCalculatorReturn {
  rawInput: string;
  setRawInput: (input: string) => void;
  parsedEntries: TreadEntry[];
  average: number;
  countableMinutes: number;
  totalMinutes: number;
  recoverMinutes: number;
  clear: () => void;
}

export function useTreadCalculator(): UseTreadCalculatorReturn {
  const [rawInput, setRawInput] = useState('');

  const parsedEntries = useMemo(() => {
    if (!rawInput.trim()) return [];
    return parseTreadColumn(rawInput);
  }, [rawInput]);

  const average = useMemo(() => {
    return calculateTreadAverage(parsedEntries);
  }, [parsedEntries]);

  const stats = useMemo(() => {
    const totalMinutes = parsedEntries.length;
    const recoverMinutes = parsedEntries.filter(e => e.isRecover).length;
    const countableMinutes = totalMinutes - recoverMinutes;
    return { totalMinutes, recoverMinutes, countableMinutes };
  }, [parsedEntries]);

  const clear = useCallback(() => {
    setRawInput('');
  }, []);

  return {
    rawInput,
    setRawInput,
    parsedEntries,
    average,
    ...stats,
    clear
  };
}
