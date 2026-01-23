import { useState, useCallback } from 'react';
import { ClassPlan, STORAGE_KEYS } from '../types';
import { loadClassHistory, saveClassHistory, addClassToHistory } from '../services/storageService';

export interface UseClassHistoryReturn {
  history: ClassPlan[];
  addToHistory: (classPlan: ClassPlan) => void;
  removeFromHistory: (classId: string) => void;
  clearHistory: () => void;
  getRecentClasses: (count: number) => ClassPlan[];
}

export function useClassHistory(): UseClassHistoryReturn {
  const [history, setHistory] = useState<ClassPlan[]>(() => loadClassHistory());

  const addToHistory = useCallback((classPlan: ClassPlan) => {
    setHistory(prev => addClassToHistory(prev, classPlan));
  }, []);

  const removeFromHistory = useCallback((classId: string) => {
    setHistory(prev => {
      const updated = prev.filter(c => c.id !== classId);
      saveClassHistory(updated);
      return updated;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    saveClassHistory([]);
  }, []);

  const getRecentClasses = useCallback((count: number) => {
    return history.slice(0, count);
  }, [history]);

  return {
    history,
    addToHistory,
    removeFromHistory,
    clearHistory,
    getRecentClasses
  };
}
