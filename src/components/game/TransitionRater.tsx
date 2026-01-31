// ============================================================================
// Transition Rater Game (Smart Mode)
// Fast RLHF with learned rules - shows predictions, focuses on uncertain pairs
// Keyboard shortcuts: Y = Yes, N = No, S = Skip, A = Accept Prediction
// ============================================================================

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ALL_EXERCISES, ExerciseDefinition } from '../../data/exerciseReference';
import { predictTransition, TransitionPrediction } from '../../services/transitionRulesService';

// ============================================================================
// Types
// ============================================================================

export interface TransitionRating {
  id: string;
  from: string;           // exercise ID
  fromName: string;       // exercise name (for readability)
  to: string;             // exercise ID
  toName: string;         // exercise name
  rating: 'yes' | 'no' | 'skip';
  note?: string;
  timestamp: string;
  // New: track prediction accuracy
  prediction?: 'yes' | 'no' | 'uncertain';
  predictionConfidence?: number;
  agreedWithPrediction?: boolean;
}

interface TransitionPair {
  from: ExerciseDefinition;
  to: ExerciseDefinition;
  prediction: TransitionPrediction;
}

type RatingMode = 'smart' | 'random' | 'review_predictions';

// ============================================================================
// Storage
// ============================================================================

const STORAGE_KEY = 'barrys_transition_ratings';

function loadRatings(): TransitionRating[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveRatings(ratings: TransitionRating[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ratings));
}

function exportRatings(ratings: TransitionRating[]): void {
  const blob = new Blob([JSON.stringify(ratings, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `transition_ratings_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

// ============================================================================
// Pair Generation
// ============================================================================

function generateSmartPair(
  exercises: ExerciseDefinition[],
  ratedPairs: Set<string>,
  mode: RatingMode
): TransitionPair | null {
  const validExercises = exercises.filter(e => !e.isWarmup || Math.random() > 0.7);
  const maxAttempts = 200;

  for (let i = 0; i < maxAttempts; i++) {
    const fromIdx = Math.floor(Math.random() * validExercises.length);
    let toIdx = Math.floor(Math.random() * validExercises.length);
    while (toIdx === fromIdx) {
      toIdx = Math.floor(Math.random() * validExercises.length);
    }

    const from = validExercises[fromIdx];
    const to = validExercises[toIdx];
    const pairKey = `${from.id}→${to.id}`;

    if (ratedPairs.has(pairKey)) continue;

    const prediction = predictTransition(from, to);

    // In smart mode, prefer uncertain pairs (need human judgment)
    if (mode === 'smart') {
      // Skip high-confidence predictions - we already "know" these
      if (prediction.confidence >= 90) continue;
      // Prefer uncertain or medium-confidence pairs
      if (prediction.prediction === 'uncertain' || prediction.confidence < 75) {
        return { from, to, prediction };
      }
    }

    // In review mode, show predictions and let user validate
    if (mode === 'review_predictions') {
      if (prediction.confidence >= 80) {
        return { from, to, prediction };
      }
    }

    // In random mode, show anything
    if (mode === 'random') {
      return { from, to, prediction };
    }
  }

  // Fallback: return any unrated pair
  for (let i = 0; i < 50; i++) {
    const fromIdx = Math.floor(Math.random() * validExercises.length);
    let toIdx = Math.floor(Math.random() * validExercises.length);
    while (toIdx === fromIdx) {
      toIdx = Math.floor(Math.random() * validExercises.length);
    }

    const from = validExercises[fromIdx];
    const to = validExercises[toIdx];
    const pairKey = `${from.id}→${to.id}`;

    if (!ratedPairs.has(pairKey)) {
      return { from, to, prediction: predictTransition(from, to) };
    }
  }

  return null;
}

// ============================================================================
// Stats Component
// ============================================================================

function RatingStats({ ratings }: { ratings: TransitionRating[] }) {
  const stats = useMemo(() => {
    const yes = ratings.filter(r => r.rating === 'yes').length;
    const no = ratings.filter(r => r.rating === 'no').length;
    const skip = ratings.filter(r => r.rating === 'skip').length;
    const withNotes = ratings.filter(r => r.note).length;

    // Calculate prediction accuracy
    const withPredictions = ratings.filter(r => r.prediction && r.prediction !== 'uncertain');
    const agreed = withPredictions.filter(r => r.agreedWithPrediction).length;
    const accuracy = withPredictions.length > 0
      ? Math.round((agreed / withPredictions.length) * 100)
      : 0;

    return { yes, no, skip, withNotes, total: ratings.length, accuracy, predictionsChecked: withPredictions.length };
  }, [ratings]);

  return (
    <div className="space-y-2">
      <div className="flex gap-4 text-sm flex-wrap">
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 bg-green-500 rounded-full"></span>
          <span>Yes: {stats.yes}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 bg-red-500 rounded-full"></span>
          <span>No: {stats.no}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 bg-gray-400 rounded-full"></span>
          <span>Skip: {stats.skip}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
          <span>Notes: {stats.withNotes}</span>
        </div>
        <div className="text-gray-500">
          Total: {stats.total}
        </div>
      </div>
      {stats.predictionsChecked > 0 && (
        <div className="text-sm text-purple-600">
          Rule Accuracy: {stats.accuracy}% ({stats.predictionsChecked} predictions checked)
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Exercise Display
// ============================================================================

function ExerciseCard({ exercise, label }: { exercise: ExerciseDefinition; label: string }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 flex-1">
      <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">{label}</div>
      <div className="text-xl font-bold text-gray-900">{exercise.name}</div>
      <div className="mt-2 text-sm text-gray-600 space-y-1">
        <div>
          <span className="text-gray-400">Position:</span>{' '}
          {exercise.position.replace('_', ' ')}
          {exercise.secondaryPosition && (
            <span className="text-gray-400"> / {exercise.secondaryPosition.replace('_', ' ')}</span>
          )}
        </div>
        <div>
          <span className="text-gray-400">Pattern:</span>{' '}
          {exercise.movementPattern}
        </div>
        <div>
          <span className="text-gray-400">Muscles:</span>{' '}
          {exercise.primaryMuscles.join(', ')}
        </div>
        {exercise.weightPath && (
          <div>
            <span className="text-gray-400">Weight:</span>{' '}
            {exercise.weightPath.start} → {exercise.weightPath.end}
          </div>
        )}
        {exercise.gripDemand && (
          <div>
            <span className="text-gray-400">Grip:</span>{' '}
            {exercise.gripDemand}
          </div>
        )}
        {exercise.movementPlane && (
          <div>
            <span className="text-gray-400">Plane:</span>{' '}
            {exercise.movementPlane}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Prediction Display
// ============================================================================

function PredictionBadge({ prediction }: { prediction: TransitionPrediction }) {
  const colors = {
    yes: 'bg-green-100 text-green-800 border-green-300',
    no: 'bg-red-100 text-red-800 border-red-300',
    uncertain: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  };

  return (
    <div className={`rounded-lg border-2 p-4 ${colors[prediction.prediction]}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="font-bold text-lg">
          System Predicts: {prediction.prediction.toUpperCase()}
        </span>
        <span className="text-sm">
          {prediction.confidence}% confidence
        </span>
      </div>
      <div className="text-sm space-y-1">
        {prediction.reasons.map((reason, i) => (
          <div key={i}>• {reason}</div>
        ))}
      </div>
      {prediction.ruleApplied && (
        <div className="mt-2 text-xs opacity-75">
          Rule: {prediction.ruleApplied}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function TransitionRater() {
  const [ratings, setRatings] = useState<TransitionRating[]>([]);
  const [currentPair, setCurrentPair] = useState<TransitionPair | null>(null);
  const [note, setNote] = useState('');
  const [showRecent, setShowRecent] = useState(false);
  const [mode, setMode] = useState<RatingMode>('smart');

  // Build set of rated pairs for quick lookup
  const ratedPairs = useMemo(() => {
    return new Set(ratings.map(r => `${r.from}→${r.to}`));
  }, [ratings]);

  // Load ratings on mount
  useEffect(() => {
    setRatings(loadRatings());
  }, []);

  // Generate initial pair
  useEffect(() => {
    if (!currentPair) {
      setCurrentPair(generateSmartPair(ALL_EXERCISES, ratedPairs, mode));
    }
  }, [currentPair, ratedPairs, mode]);

  // Handle rating submission
  const submitRating = useCallback((rating: 'yes' | 'no' | 'skip') => {
    if (!currentPair) return;

    const agreedWithPrediction =
      currentPair.prediction.prediction !== 'uncertain' &&
      currentPair.prediction.prediction === rating;

    const newRating: TransitionRating = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      from: currentPair.from.id,
      fromName: currentPair.from.name,
      to: currentPair.to.id,
      toName: currentPair.to.name,
      rating,
      note: note.trim() || undefined,
      timestamp: new Date().toISOString(),
      prediction: currentPair.prediction.prediction,
      predictionConfidence: currentPair.prediction.confidence,
      agreedWithPrediction,
    };

    const newRatings = [...ratings, newRating];
    setRatings(newRatings);
    saveRatings(newRatings);

    // Reset for next pair
    setNote('');
    setCurrentPair(generateSmartPair(
      ALL_EXERCISES,
      new Set([...ratedPairs, `${currentPair.from.id}→${currentPair.to.id}`]),
      mode
    ));
  }, [currentPair, note, ratings, ratedPairs, mode]);

  // Accept prediction shortcut
  const acceptPrediction = useCallback(() => {
    if (!currentPair || currentPair.prediction.prediction === 'uncertain') return;
    submitRating(currentPair.prediction.prediction);
  }, [currentPair, submitRating]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case 'y':
          submitRating('yes');
          break;
        case 'n':
          submitRating('no');
          break;
        case 's':
          submitRating('skip');
          break;
        case 'a':
          acceptPrediction();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [submitRating, acceptPrediction]);

  // Calculate possible pairs
  const totalPossiblePairs = ALL_EXERCISES.length * (ALL_EXERCISES.length - 1);
  const percentComplete = ((ratings.length / totalPossiblePairs) * 100).toFixed(1);

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Transition Rater</h1>
        <p className="text-gray-600 mt-1">
          Smart mode: System predicts, you validate. Press A to accept prediction.
        </p>
      </div>

      {/* Mode Toggle */}
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => { setMode('smart'); setCurrentPair(null); }}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
            mode === 'smart'
              ? 'bg-purple-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Smart (Uncertain)
        </button>
        <button
          onClick={() => { setMode('review_predictions'); setCurrentPair(null); }}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
            mode === 'review_predictions'
              ? 'bg-purple-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Review Predictions
        </button>
        <button
          onClick={() => { setMode('random'); setCurrentPair(null); }}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
            mode === 'random'
              ? 'bg-purple-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Random
        </button>
      </div>

      {/* Stats */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <RatingStats ratings={ratings} />
        <div className="mt-2 text-xs text-gray-500">
          {ratings.length} of {totalPossiblePairs} possible pairs rated ({percentComplete}%)
        </div>
      </div>

      {/* Current Pair */}
      {currentPair && (
        <div className="mb-6">
          {/* Prediction Badge */}
          <div className="mb-4">
            <PredictionBadge prediction={currentPair.prediction} />
          </div>

          {/* Exercise Cards */}
          <div className="flex gap-4 items-stretch">
            <ExerciseCard exercise={currentPair.from} label="From" />
            <div className="flex items-center">
              <div className="text-3xl text-gray-400">→</div>
            </div>
            <ExerciseCard exercise={currentPair.to} label="To" />
          </div>

          {/* Question */}
          <div className="mt-6 text-center">
            <div className="text-lg text-gray-700 mb-4">
              Does <strong>{currentPair.from.name}</strong> flow smoothly into <strong>{currentPair.to.name}</strong>?
            </div>

            {/* Note field */}
            <div className="mb-4">
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Optional note (e.g., 'good grip break', 'awkward weight transition')"
                className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            {/* Rating buttons */}
            <div className="flex justify-center gap-3 flex-wrap">
              {currentPair.prediction.prediction !== 'uncertain' && (
                <button
                  onClick={acceptPrediction}
                  className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-lg shadow transition-colors"
                >
                  Accept {currentPair.prediction.prediction.toUpperCase()} (A)
                </button>
              )}
              <button
                onClick={() => submitRating('yes')}
                className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow transition-colors"
              >
                Yes (Y)
              </button>
              <button
                onClick={() => submitRating('no')}
                className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg shadow transition-colors"
              >
                No (N)
              </button>
              <button
                onClick={() => submitRating('skip')}
                className="px-6 py-3 bg-gray-400 hover:bg-gray-500 text-white font-semibold rounded-lg shadow transition-colors"
              >
                Skip (S)
              </button>
            </div>

            <div className="mt-3 text-sm text-gray-500">
              Keyboard: Y = Yes, N = No, S = Skip, A = Accept Prediction
            </div>
          </div>
        </div>
      )}

      {!currentPair && (
        <div className="text-center py-12 text-gray-500">
          No more pairs to rate in this mode. Try a different mode or export your ratings.
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-4 justify-center mt-8 pt-6 border-t">
        <button
          onClick={() => exportRatings(ratings)}
          disabled={ratings.length === 0}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-lg transition-colors"
        >
          Export JSON ({ratings.length} ratings)
        </button>
        <button
          onClick={() => setShowRecent(!showRecent)}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
        >
          {showRecent ? 'Hide' : 'Show'} Recent
        </button>
      </div>

      {/* Recent ratings */}
      {showRecent && ratings.length > 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-3">Recent Ratings</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {ratings.slice(-20).reverse().map((r) => (
              <div key={r.id} className="flex items-center gap-2 text-sm">
                <span className={`w-2 h-2 rounded-full ${
                  r.rating === 'yes' ? 'bg-green-500' :
                  r.rating === 'no' ? 'bg-red-500' : 'bg-gray-400'
                }`}></span>
                <span className="font-medium">{r.fromName}</span>
                <span className="text-gray-400">→</span>
                <span className="font-medium">{r.toName}</span>
                {r.prediction && r.prediction !== 'uncertain' && (
                  <span className={`text-xs px-1.5 py-0.5 rounded ${
                    r.agreedWithPrediction
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {r.agreedWithPrediction ? '✓' : '✗'} pred
                  </span>
                )}
                {r.note && (
                  <span className="text-gray-500 italic">"{r.note}"</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default TransitionRater;
