import { Exercise, ClassPlan, STORAGE_KEYS } from '../types';
import { defaultExercises } from '../data/exercises';

export function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored) as T;
    }
  } catch (error) {
    console.error(`Error loading ${key} from storage:`, error);
  }
  return defaultValue;
}

export function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to storage:`, error);
  }
}

export function removeFromStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing ${key} from storage:`, error);
  }
}

// Exercise-specific functions
export function loadExercises(): Exercise[] {
  return loadFromStorage(STORAGE_KEYS.EXERCISES, defaultExercises);
}

export function saveExercises(exercises: Exercise[]): void {
  saveToStorage(STORAGE_KEYS.EXERCISES, exercises);
}

export function markExerciseUsed(exercises: Exercise[], exerciseId: string, date: string): Exercise[] {
  return exercises.map(ex => {
    if (ex.id === exerciseId) {
      return {
        ...ex,
        lastUsed: date,
        usageHistory: [...ex.usageHistory, date]
      };
    }
    return ex;
  });
}

export function resetExerciseHistory(exercises: Exercise[]): Exercise[] {
  return exercises.map(ex => ({
    ...ex,
    lastUsed: undefined,
    usageHistory: []
  }));
}

// Class history functions
export function loadClassHistory(): ClassPlan[] {
  return loadFromStorage(STORAGE_KEYS.CLASS_HISTORY, []);
}

export function saveClassHistory(history: ClassPlan[]): void {
  saveToStorage(STORAGE_KEYS.CLASS_HISTORY, history);
}

export function addClassToHistory(history: ClassPlan[], classPlan: ClassPlan): ClassPlan[] {
  // Keep last 50 classes
  const updated = [classPlan, ...history].slice(0, 50);
  saveClassHistory(updated);
  return updated;
}

// Draft class functions
export function loadDraftClass(): ClassPlan | null {
  return loadFromStorage(STORAGE_KEYS.DRAFT_CLASS, null);
}

export function saveDraftClass(classPlan: ClassPlan): void {
  saveToStorage(STORAGE_KEYS.DRAFT_CLASS, classPlan);
}

export function clearDraftClass(): void {
  removeFromStorage(STORAGE_KEYS.DRAFT_CLASS);
}

// User preferences
export interface UserPreferences {
  maxTreadAverage: number;
  defaultEquipment: string;
}

export function loadPreferences(): UserPreferences {
  return loadFromStorage(STORAGE_KEYS.USER_PREFS, {
    maxTreadAverage: 7.75,
    defaultEquipment: '2 Heavy Dumbbells'
  });
}

export function savePreferences(prefs: UserPreferences): void {
  saveToStorage(STORAGE_KEYS.USER_PREFS, prefs);
}
