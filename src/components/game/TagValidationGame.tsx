import React, { useState, useEffect } from 'react';
import {
  ExercisePosition,
  MovementPattern,
  MuscleGroup,
  POSITION_LABELS,
  MOVEMENT_LABELS,
  MUSCLE_LABELS,
} from '../../data/types';
import { ALL_EXERCISES, ExerciseDefinition } from '../../data/exerciseReference';

// ============================================================================
// Types
// ============================================================================

interface TagFeedback {
  exerciseId: string;
  exerciseName: string;
  field: 'position' | 'movement' | 'muscles';
  originalValue: string | string[];
  userValue: string | string[];
  isCorrect: boolean;
  timestamp: string;
}

interface GameStats {
  total: number;
  correct: number;
  incorrect: number;
  skipped: number;
}

// ============================================================================
// Storage
// ============================================================================

const TAG_FEEDBACK_KEY = 'barrys_tag_feedback';

function saveFeedback(feedback: TagFeedback): void {
  const existing = loadAllFeedback();
  existing.push(feedback);
  localStorage.setItem(TAG_FEEDBACK_KEY, JSON.stringify(existing));
}

function loadAllFeedback(): TagFeedback[] {
  try {
    const stored = localStorage.getItem(TAG_FEEDBACK_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

// ============================================================================
// Main Component
// ============================================================================

type GameMode = 'random' | 'all_fields';
const ALL_FIELDS: ('position' | 'movement' | 'muscles')[] = ['position', 'movement', 'muscles'];

export function TagValidationGame() {
  const [gameMode, setGameMode] = useState<GameMode>('all_fields');
  const [currentExercise, setCurrentExercise] = useState<ExerciseDefinition | null>(null);
  const [currentField, setCurrentField] = useState<'position' | 'movement' | 'muscles'>('position');
  const [currentFieldIndex, setCurrentFieldIndex] = useState(0); // For all_fields mode
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [selectedMuscles, setSelectedMuscles] = useState<Set<string>>(new Set());
  const [showResult, setShowResult] = useState(false);
  const [stats, setStats] = useState<GameStats>({ total: 0, correct: 0, incorrect: 0, skipped: 0 });
  const [reviewedExercises, setReviewedExercises] = useState<Set<string>>(new Set());

  // Load next random exercise
  const loadNextExercise = () => {
    const available = ALL_EXERCISES.filter(ex => !reviewedExercises.has(ex.id));

    if (available.length === 0) {
      setCurrentExercise(null);
      return;
    }

    const randomIndex = Math.floor(Math.random() * available.length);
    setCurrentExercise(available[randomIndex]);

    if (gameMode === 'random') {
      setCurrentField(ALL_FIELDS[Math.floor(Math.random() * ALL_FIELDS.length)]);
    } else {
      setCurrentFieldIndex(0);
      setCurrentField('position');
    }

    setSelectedAnswer(null);
    setSelectedMuscles(new Set());
    setShowResult(false);
  };

  // Move to next field (for all_fields mode)
  const nextField = () => {
    const nextIndex = currentFieldIndex + 1;
    if (nextIndex >= ALL_FIELDS.length) {
      // Done with this exercise, mark as reviewed and get next
      if (currentExercise) {
        setReviewedExercises(prev => new Set([...prev, currentExercise.id]));
      }
      loadNextExercise();
    } else {
      setCurrentFieldIndex(nextIndex);
      setCurrentField(ALL_FIELDS[nextIndex]);
      setSelectedAnswer(null);
      setSelectedMuscles(new Set());
      setShowResult(false);
    }
  };

  useEffect(() => {
    loadNextExercise();
  }, []);

  // Get options for current field
  const getOptions = (): { value: string; label: string }[] => {
    switch (currentField) {
      case 'position':
        return Object.entries(POSITION_LABELS).map(([value, label]) => ({ value, label }));
      case 'movement':
        return Object.entries(MOVEMENT_LABELS).map(([value, label]) => ({ value, label }));
      case 'muscles':
        return Object.entries(MUSCLE_LABELS).map(([value, label]) => ({ value, label }));
    }
  };

  // Get current value for field
  const getCurrentValue = (): string | string[] => {
    if (!currentExercise) return '';
    switch (currentField) {
      case 'position':
        return currentExercise.position;
      case 'movement':
        return currentExercise.movementPattern;
      case 'muscles':
        return currentExercise.primaryMuscles;
    }
  };

  // Format value for display
  const formatValue = (value: string | string[]): string => {
    if (Array.isArray(value)) {
      return value.map(v => MUSCLE_LABELS[v as MuscleGroup] || v).join(', ');
    }
    if (currentField === 'position') return POSITION_LABELS[value as ExercisePosition] || value;
    if (currentField === 'movement') return MOVEMENT_LABELS[value as MovementPattern] || value;
    return MUSCLE_LABELS[value as MuscleGroup] || value;
  };

  // Toggle muscle selection (multi-select)
  const toggleMuscle = (muscle: string) => {
    setSelectedMuscles(prev => {
      const newSet = new Set(prev);
      if (newSet.has(muscle)) {
        newSet.delete(muscle);
      } else {
        newSet.add(muscle);
      }
      return newSet;
    });
  };

  // Check if current selection matches original
  const isSelectionCorrect = (): boolean => {
    if (currentField === 'muscles') {
      const original = currentExercise?.primaryMuscles || [];
      if (selectedMuscles.size !== original.length) return false;
      for (const m of selectedMuscles) {
        if (!original.includes(m as MuscleGroup)) return false;
      }
      return true;
    }
    return selectedAnswer === getCurrentValue();
  };

  // Get user's selection for saving
  const getUserSelection = (): string | string[] => {
    if (currentField === 'muscles') {
      return Array.from(selectedMuscles);
    }
    return selectedAnswer || '';
  };

  // Handle answer submission
  const handleAnswer = (isCorrect: boolean) => {
    if (!currentExercise) return;
    if (currentField !== 'muscles' && !selectedAnswer) return;
    if (currentField === 'muscles' && selectedMuscles.size === 0) return;

    const feedback: TagFeedback = {
      exerciseId: currentExercise.id,
      exerciseName: currentExercise.name,
      field: currentField,
      originalValue: getCurrentValue(),
      userValue: getUserSelection(),
      isCorrect,
      timestamp: new Date().toISOString(),
    };

    saveFeedback(feedback);

    setStats(prev => ({
      ...prev,
      total: prev.total + 1,
      correct: prev.correct + (isCorrect ? 1 : 0),
      incorrect: prev.incorrect + (isCorrect ? 0 : 1),
    }));

    // In random mode, mark exercise as reviewed; in all_fields mode, nextField handles it
    if (gameMode === 'random') {
      setReviewedExercises(prev => new Set([...prev, currentExercise.id]));
    }
    setShowResult(true);
  };

  // Handle skip
  const handleSkip = () => {
    if (!currentExercise) return;

    setStats(prev => ({
      ...prev,
      total: prev.total + 1,
      skipped: prev.skipped + 1,
    }));

    if (gameMode === 'all_fields') {
      nextField();
    } else {
      setReviewedExercises(prev => new Set([...prev, currentExercise.id]));
      loadNextExercise();
    }
  };

  // Handle next (after showing result)
  const handleNext = () => {
    if (gameMode === 'all_fields') {
      nextField();
    } else {
      loadNextExercise();
    }
  };

  // Progress bar
  const progress = ALL_EXERCISES.length > 0
    ? (reviewedExercises.size / ALL_EXERCISES.length) * 100
    : 0;

  if (!currentExercise) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-green-600 mb-4">All Done!</h2>
          <p className="text-gray-600 mb-6">
            You've reviewed all {ALL_EXERCISES.length} exercises.
          </p>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-green-100 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">{stats.correct}</div>
              <div className="text-sm text-green-700">Correct</div>
            </div>
            <div className="bg-red-100 rounded-lg p-4">
              <div className="text-2xl font-bold text-red-600">{stats.incorrect}</div>
              <div className="text-sm text-red-700">Incorrect</div>
            </div>
            <div className="bg-gray-100 rounded-lg p-4">
              <div className="text-2xl font-bold text-gray-600">{stats.skipped}</div>
              <div className="text-sm text-gray-700">Skipped</div>
            </div>
          </div>
          <button
            onClick={() => {
              setReviewedExercises(new Set());
              setStats({ total: 0, correct: 0, incorrect: 0, skipped: 0 });
              loadNextExercise();
            }}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Start Over
          </button>
        </div>
      </div>
    );
  }

  const hasSelection = currentField === 'muscles' ? selectedMuscles.size > 0 : !!selectedAnswer;

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Progress: {reviewedExercises.size} / {ALL_EXERCISES.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-red-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Mode toggle and stats */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4 text-sm">
          <span className="text-green-600">Correct: {stats.correct}</span>
          <span className="text-red-600">Wrong: {stats.incorrect}</span>
          <span className="text-gray-600">Skipped: {stats.skipped}</span>
        </div>
        <div className="flex gap-2 items-center">
          <span className="text-sm text-gray-500">Mode:</span>
          <button
            onClick={() => setGameMode('random')}
            className={`px-3 py-1 text-sm rounded-l-lg transition-colors ${
              gameMode === 'random'
                ? 'bg-red-600 text-white'
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          >
            Random
          </button>
          <button
            onClick={() => setGameMode('all_fields')}
            className={`px-3 py-1 text-sm rounded-r-lg transition-colors ${
              gameMode === 'all_fields'
                ? 'bg-red-600 text-white'
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          >
            All Fields
          </button>
        </div>
      </div>

      {/* Main card */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Exercise header */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6">
          <h2 className="text-2xl font-bold mb-2">{currentExercise.name}</h2>
          <p className="text-red-100">{currentExercise.description}</p>
          {currentExercise.aliases.length > 0 && (
            <p className="text-red-200 text-sm mt-2">
              Also known as: {currentExercise.aliases.join(', ')}
            </p>
          )}
        </div>

        {/* Question */}
        <div className="p-6">
          {/* Field progress for all_fields mode */}
          {gameMode === 'all_fields' && (
            <div className="flex justify-center gap-2 mb-4">
              {ALL_FIELDS.map((field, idx) => (
                <div
                  key={field}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    idx < currentFieldIndex
                      ? 'bg-green-500 text-white'
                      : idx === currentFieldIndex
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {idx + 1}
                </div>
              ))}
            </div>
          )}

          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {currentField === 'position' && 'What is the PRIMARY POSITION for this exercise?'}
            {currentField === 'movement' && 'What is the MOVEMENT PATTERN for this exercise?'}
            {currentField === 'muscles' && 'What are the PRIMARY MUSCLES for this exercise? (Select all that apply)'}
          </h3>

          {/* Current tag display */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="text-sm text-gray-500 mb-1">Current tag{currentField === 'muscles' ? 's' : ''}:</div>
            <div className="font-mono text-lg">
              {formatValue(getCurrentValue())}
            </div>
          </div>

          {!showResult ? (
            <>
              {/* Options grid */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {getOptions().map(option => {
                  const isSelected = currentField === 'muscles'
                    ? selectedMuscles.has(option.value)
                    : selectedAnswer === option.value;

                  return (
                    <button
                      key={option.value}
                      onClick={() => {
                        if (currentField === 'muscles') {
                          toggleMuscle(option.value);
                        } else {
                          setSelectedAnswer(option.value);
                        }
                      }}
                      className={`p-3 rounded-lg border-2 text-left transition-all ${
                        isSelected
                          ? 'border-red-600 bg-red-50 text-red-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      {currentField === 'muscles' && (
                        <span className="mr-2">{isSelected ? '☑' : '☐'}</span>
                      )}
                      {option.label}
                    </button>
                  );
                })}
              </div>

              {/* Selected muscles display */}
              {currentField === 'muscles' && selectedMuscles.size > 0 && (
                <div className="mb-4 p-3 bg-red-50 rounded-lg">
                  <span className="text-sm text-gray-600">Selected: </span>
                  <span className="font-medium text-red-700">
                    {Array.from(selectedMuscles).map(m => MUSCLE_LABELS[m as MuscleGroup]).join(', ')}
                  </span>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => handleAnswer(true)}
                  disabled={!hasSelection || !isSelectionCorrect()}
                  className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${
                    hasSelection && isSelectionCorrect()
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Correct Tag{currentField === 'muscles' ? 's' : ''}
                </button>
                <button
                  onClick={() => handleAnswer(false)}
                  disabled={!hasSelection || isSelectionCorrect()}
                  className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${
                    hasSelection && !isSelectionCorrect()
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Wrong - Update
                </button>
              </div>

              <button
                onClick={handleSkip}
                className="w-full mt-3 py-2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                Skip (unsure)
              </button>
            </>
          ) : (
            <div className="text-center">
              <div className={`text-6xl mb-4 ${isSelectionCorrect() ? 'text-green-500' : 'text-red-500'}`}>
                {isSelectionCorrect() ? '✓' : '✗'}
              </div>
              <p className="text-lg mb-6">
                {isSelectionCorrect()
                  ? 'Tag confirmed as correct!'
                  : `Feedback recorded: should be "${formatValue(getUserSelection())}"`
                }
              </p>
              <button
                onClick={handleNext}
                className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                {gameMode === 'all_fields' && currentFieldIndex < ALL_FIELDS.length - 1
                  ? `Next Field (${currentFieldIndex + 2}/${ALL_FIELDS.length})`
                  : 'Next Exercise'
                }
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Exercise details */}
      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-700 mb-2">Exercise Details</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div><span className="text-gray-500">Position:</span> {POSITION_LABELS[currentExercise.position as ExercisePosition]}</div>
          <div><span className="text-gray-500">Pattern:</span> {MOVEMENT_LABELS[currentExercise.movementPattern as MovementPattern]}</div>
          <div className="col-span-2"><span className="text-gray-500">Primary Muscles:</span> {currentExercise.primaryMuscles.map(m => MUSCLE_LABELS[m as MuscleGroup]).join(', ')}</div>
          <div><span className="text-gray-500">Grip:</span> {currentExercise.gripDemand}</div>
          <div><span className="text-gray-500">Power:</span> {currentExercise.isPower ? 'Yes' : 'No'}</div>
          <div><span className="text-gray-500">Finisher:</span> {currentExercise.isFinisher ? 'Yes' : 'No'}</div>
        </div>
        {currentExercise.cues.length > 0 && (
          <div className="mt-3">
            <span className="text-gray-500 text-sm">Cues:</span>
            <ul className="list-disc list-inside text-sm text-gray-600">
              {currentExercise.cues.map((cue, i) => (
                <li key={i}>{cue}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
