import React, { useState, useEffect } from 'react';
import {
  ExercisePosition,
  MovementPattern,
  MuscleGroup,
  POSITION_LABELS,
  MOVEMENT_LABELS,
  MUSCLE_LABELS,
} from '../../data/types';
import {
  ALL_EXERCISES,
  ExerciseDefinition,
} from '../../data/exerciseReference';

// ============================================================================
// Types
// ============================================================================

type BlockCategory = 'warmup' | 'upper_strength' | 'lower_strength' | 'full_body' | 'finisher';

interface GeneratedBlock {
  id: string;
  category: BlockCategory;
  exercises: ExerciseDefinition[];
  flowScore: number;
  reasoning: string;
}

interface BlockFeedback {
  blockId: string;
  category: BlockCategory;
  exercises: string[]; // exercise IDs
  rating: 'good' | 'bad' | 'fixed';
  textFeedback: string;
  fixedOrder?: string[]; // if reordered
  timestamp: string;
}

interface GameStats {
  total: number;
  good: number;
  bad: number;
  fixed: number;
}

// ============================================================================
// Storage
// ============================================================================

const BLOCK_FEEDBACK_KEY = 'barrys_block_feedback';

function saveFeedback(feedback: BlockFeedback): void {
  const existing = loadAllFeedback();
  existing.push(feedback);
  localStorage.setItem(BLOCK_FEEDBACK_KEY, JSON.stringify(existing));
}

function loadAllFeedback(): BlockFeedback[] {
  try {
    const stored = localStorage.getItem(BLOCK_FEEDBACK_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

// ============================================================================
// Flow Scoring (simplified from TECHNICAL_SPEC)
// ============================================================================

const POSITION_TRANSITION_COSTS: Record<string, Record<string, number>> = {
  'floor_standing': { 'floor_standing': 0, 'floor_laying': 15, 'bench_laying': 20, 'bench_sitting': 10 },
  'floor_laying': { 'floor_standing': 15, 'floor_laying': 0, 'bench_laying': 10, 'bench_sitting': 15 },
  'bench_laying': { 'floor_standing': 20, 'floor_laying': 10, 'bench_laying': 0, 'bench_sitting': 5 },
  'bench_sitting': { 'floor_standing': 10, 'floor_laying': 15, 'bench_laying': 5, 'bench_sitting': 0 },
};

function getTransitionCost(from: ExerciseDefinition, to: ExerciseDefinition): number {
  const positionCost = POSITION_TRANSITION_COSTS[from.position]?.[to.position] ?? 10;

  // Grip fatigue penalty
  let gripPenalty = 0;
  if (from.gripDemand === 'high' && to.gripDemand === 'high') {
    gripPenalty = 15;
  } else if (from.gripDemand === 'high' || to.gripDemand === 'high') {
    gripPenalty = 5;
  }

  // Same muscle group penalty (back-to-back)
  let musclePenalty = 0;
  const fromMuscles = new Set(from.primaryMuscles);
  const toMuscles = new Set(to.primaryMuscles);
  for (const m of fromMuscles) {
    if (toMuscles.has(m)) {
      musclePenalty = 10;
      break;
    }
  }

  return positionCost + gripPenalty + musclePenalty;
}

function calculateBlockFlowScore(exercises: ExerciseDefinition[]): number {
  if (exercises.length < 2) return 100;

  let totalCost = 0;
  for (let i = 0; i < exercises.length - 1; i++) {
    totalCost += getTransitionCost(exercises[i], exercises[i + 1]);
  }

  const avgCost = totalCost / (exercises.length - 1);
  // Convert cost to score (0-100, lower cost = higher score)
  return Math.max(0, Math.min(100, 100 - avgCost * 2));
}

// ============================================================================
// Block Generation
// ============================================================================

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function pickRandom<T>(array: T[], count: number): T[] {
  return shuffleArray(array).slice(0, count);
}

// ============================================================================
// Position-First Block Generation
// Key insight: Minimize position changes, mix muscle groups, sprinkle core as utility
// ============================================================================

const UPPER_MUSCLES = ['chest', 'back', 'shoulders', 'biceps', 'triceps'];
const LOWER_MUSCLES = ['quads', 'hamstrings', 'glutes', 'calves'];

function hasUpperFocus(exercise: ExerciseDefinition): boolean {
  return exercise.primaryMuscles.some(m => UPPER_MUSCLES.includes(m));
}

function hasLowerFocus(exercise: ExerciseDefinition): boolean {
  return exercise.primaryMuscles.some(m => LOWER_MUSCLES.includes(m));
}

function isCore(exercise: ExerciseDefinition): boolean {
  return exercise.primaryMuscles.includes('core') || exercise.primaryMuscles.includes('obliques');
}

// Group exercises by their primary position for smooth blocks
function getExercisesByPrimaryPosition(position: ExercisePosition): ExerciseDefinition[] {
  return ALL_EXERCISES.filter(e =>
    e.position === position &&
    !e.isWarmup &&
    !e.isPower &&
    !e.isFinisher
  );
}

function generateWarmupBlock(): GeneratedBlock {
  // ONLY use exercises tagged as warmup - no strength moves
  const warmups = ALL_EXERCISES.filter(e => e.isWarmup);

  // Categorize warmups by their role in the flow
  const standingStretches = warmups.filter(e =>
    e.position === 'floor_standing' &&
    (e.name.toLowerCase().includes('stretch') ||
     e.name.toLowerCase().includes('good morning') ||
     e.id === 'gms')
  );

  const transitions = warmups.filter(e =>
    e.name.toLowerCase().includes('inchworm') ||
    e.id === 'inchworm'
  );

  const plankBased = warmups.filter(e =>
    e.position === 'floor_laying' ||
    e.movementPattern === 'plank' ||
    e.name.toLowerCase().includes('cat') ||
    e.name.toLowerCase().includes('push')
  );

  const exercises: ExerciseDefinition[] = [];

  // Flow: Standing stretch → Transition (inchworm) → Plank/floor work
  if (standingStretches.length > 0) {
    exercises.push(standingStretches[Math.floor(Math.random() * standingStretches.length)]);
  }

  if (transitions.length > 0 && Math.random() > 0.3) {
    exercises.push(transitions[Math.floor(Math.random() * transitions.length)]);
  }

  if (plankBased.length > 0) {
    const available = plankBased.filter(e => !exercises.some(ex => ex.id === e.id));
    if (available.length > 0) {
      exercises.push(available[Math.floor(Math.random() * available.length)]);
    }
  }

  // If we didn't get enough, fill from remaining warmups
  if (exercises.length < 2) {
    const remaining = warmups.filter(e => !exercises.some(ex => ex.id === e.id));
    while (exercises.length < 2 && remaining.length > 0) {
      const idx = Math.floor(Math.random() * remaining.length);
      exercises.push(remaining.splice(idx, 1)[0]);
    }
  }

  return {
    id: `warmup-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    category: 'warmup',
    exercises,
    flowScore: calculateBlockFlowScore(exercises),
    reasoning: 'Warmup flow: standing stretch → transition → plank/floor',
  };
}

function generateUpperStrengthBlock(): GeneratedBlock {
  // Pick a primary position (bench or standing)
  const usesBench = Math.random() > 0.5;
  const primaryPosition: ExercisePosition = usesBench ? 'bench_laying' : 'floor_standing';

  // Get exercises for that position with upper body focus
  const positionExercises = getExercisesByPrimaryPosition(primaryPosition)
    .filter(e => hasUpperFocus(e));

  const exercises: ExerciseDefinition[] = [];

  // Pick 2-3 exercises from primary position
  const mainExercises = pickRandom(positionExercises, 2 + Math.floor(Math.random() * 2));
  exercises.push(...mainExercises);

  // Maybe add 1 core exercise as grip break / active recovery (30% chance)
  if (Math.random() < 0.3) {
    const coreOptions = ALL_EXERCISES.filter(e =>
      isCore(e) &&
      !e.isWarmup &&
      // Pick core that matches position or is adjacent
      (e.position === primaryPosition ||
       (primaryPosition === 'bench_laying' && e.position === 'bench_sitting'))
    );
    if (coreOptions.length > 0) {
      exercises.push(coreOptions[Math.floor(Math.random() * coreOptions.length)]);
    }
  }

  return {
    id: `upper-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    category: 'upper_strength',
    exercises,
    flowScore: calculateBlockFlowScore(exercises),
    reasoning: `Upper body focus, ${usesBench ? 'bench' : 'standing'} position${exercises.some(isCore) ? ' + core break' : ''}`,
  };
}

function generateLowerStrengthBlock(): GeneratedBlock {
  // Categorize lower body by movement pattern
  const hinges = ALL_EXERCISES.filter(e =>
    e.position === 'floor_standing' &&
    e.movementPattern === 'hinge' &&
    hasLowerFocus(e) &&
    !e.isWarmup && !e.isPower && !e.isFinisher
  );

  const lunges = ALL_EXERCISES.filter(e =>
    e.position === 'floor_standing' &&
    e.movementPattern === 'lunge' &&
    !e.isWarmup && !e.isPower && !e.isFinisher
  );

  const squats = ALL_EXERCISES.filter(e =>
    e.position === 'floor_standing' &&
    e.movementPattern === 'squat' &&
    !e.isWarmup && !e.isPower && !e.isFinisher
  );

  const exercises: ExerciseDefinition[] = [];

  // Pattern: Hinge → Single-leg (lunge) → maybe core → more single-leg or squat
  // Start with hinge (deadlift variations)
  if (hinges.length > 0) {
    exercises.push(hinges[Math.floor(Math.random() * hinges.length)]);
  }

  // Add a lunge variation
  if (lunges.length > 0) {
    exercises.push(lunges[Math.floor(Math.random() * lunges.length)]);
  }

  // Maybe core break in the middle (40% chance)
  if (Math.random() < 0.4) {
    const coreOptions = ALL_EXERCISES.filter(e =>
      isCore(e) &&
      (e.position === 'floor_standing' || e.position === 'floor_laying') &&
      !e.isWarmup
    );
    if (coreOptions.length > 0) {
      exercises.push(coreOptions[Math.floor(Math.random() * coreOptions.length)]);
    }
  }

  // End with another lunge or squat
  const finishers = [...lunges, ...squats].filter(e => !exercises.some(ex => ex.id === e.id));
  if (finishers.length > 0) {
    exercises.push(finishers[Math.floor(Math.random() * finishers.length)]);
  }

  return {
    id: `lower-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    category: 'lower_strength',
    exercises,
    flowScore: calculateBlockFlowScore(exercises),
    reasoning: `Lower body: hinge → lunge${exercises.some(isCore) ? ' → core break' : ''} → lunge/squat`,
  };
}

function generateFullBodyBlock(): GeneratedBlock {
  // Full body mixes upper and lower but stays in ONE position zone
  const usesBench = Math.random() > 0.6; // 40% bench, 60% standing

  const exercises: ExerciseDefinition[] = [];

  if (usesBench) {
    // Bench zone: bench_laying + bench_sitting (minimal transition)
    const benchExercises = ALL_EXERCISES.filter(e =>
      (e.position === 'bench_laying' || e.position === 'bench_sitting') &&
      !e.isWarmup && !e.isPower && !e.isFinisher
    );
    exercises.push(...pickRandom(benchExercises, 3));
  } else {
    // Standing zone: floor_standing (maybe one floor_laying)
    const standingExercises = ALL_EXERCISES.filter(e =>
      e.position === 'floor_standing' &&
      !e.isWarmup && !e.isPower && !e.isFinisher
    );
    exercises.push(...pickRandom(standingExercises, 2 + Math.floor(Math.random() * 2)));

    // Maybe add one floor exercise at the end
    if (Math.random() < 0.3) {
      const floorExercises = ALL_EXERCISES.filter(e =>
        e.position === 'floor_laying' &&
        !e.isWarmup && !e.isPower && !e.isFinisher
      );
      if (floorExercises.length > 0) {
        exercises.push(floorExercises[Math.floor(Math.random() * floorExercises.length)]);
      }
    }
  }

  return {
    id: `fullbody-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    category: 'full_body',
    exercises,
    flowScore: calculateBlockFlowScore(exercises),
    reasoning: `Full body, ${usesBench ? 'bench zone' : 'standing zone'} - mixed muscle groups`,
  };
}

function generateFinisherBlock(): GeneratedBlock {
  // Finisher needs movement pattern continuity
  // Group power moves by their base pattern
  const hingePower = ALL_EXERCISES.filter(e =>
    (e.isFinisher || e.isPower) &&
    (e.movementPattern === 'hinge' || e.movementPattern === 'power') &&
    (e.name.toLowerCase().includes('swing') ||
     e.name.toLowerCase().includes('snatch') ||
     e.name.toLowerCase().includes('clean') ||
     e.name.toLowerCase().includes('deadlift'))
  );

  const squatPower = ALL_EXERCISES.filter(e =>
    (e.isFinisher || e.isPower) &&
    (e.name.toLowerCase().includes('thruster') ||
     e.name.toLowerCase().includes('squat'))
  );

  const plankPower = ALL_EXERCISES.filter(e =>
    (e.isFinisher || e.isPower) &&
    (e.name.toLowerCase().includes('burpee') ||
     e.movementPattern === 'plank')
  );

  // Pick a pattern family
  const families = [hingePower, squatPower, plankPower].filter(f => f.length > 0);
  if (families.length === 0) {
    // Fallback
    const anyPower = ALL_EXERCISES.filter(e => e.isFinisher || e.isPower);
    return {
      id: `finisher-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      category: 'finisher',
      exercises: anyPower.length > 0 ? [anyPower[0]] : [],
      flowScore: 50,
      reasoning: 'Finisher: power move',
    };
  }

  const chosenFamily = families[Math.floor(Math.random() * families.length)];
  const exercises: ExerciseDefinition[] = [];

  // Get build-up that matches the pattern
  const isHingeFamily = chosenFamily === hingePower;
  const isSquatFamily = chosenFamily === squatPower;

  const buildUp = ALL_EXERCISES.filter(e =>
    e.isCompound &&
    !e.isPower &&
    !e.isFinisher &&
    e.position === 'floor_standing' &&
    (isHingeFamily ? e.movementPattern === 'hinge' :
     isSquatFamily ? e.movementPattern === 'squat' :
     e.movementPattern === 'lunge')
  );

  // Build-up first
  if (buildUp.length > 0) {
    exercises.push(buildUp[Math.floor(Math.random() * buildUp.length)]);
  }

  // Single power move from the same family
  exercises.push(chosenFamily[Math.floor(Math.random() * chosenFamily.length)]);

  const patternName = isHingeFamily ? 'hinge-based' : isSquatFamily ? 'squat-based' : 'plank-based';

  return {
    id: `finisher-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    category: 'finisher',
    exercises,
    flowScore: calculateBlockFlowScore(exercises),
    reasoning: `Finisher: ${patternName} build-up → power`,
  };
}

function generateBlock(category: BlockCategory): GeneratedBlock {
  switch (category) {
    case 'warmup': return generateWarmupBlock();
    case 'upper_strength': return generateUpperStrengthBlock();
    case 'lower_strength': return generateLowerStrengthBlock();
    case 'full_body': return generateFullBodyBlock();
    case 'finisher': return generateFinisherBlock();
  }
}

function generateBatchOfBlocks(count: number = 4): GeneratedBlock[] {
  const categories: BlockCategory[] = ['warmup', 'upper_strength', 'lower_strength', 'full_body', 'finisher'];
  const blocks: GeneratedBlock[] = [];

  for (let i = 0; i < count; i++) {
    const category = categories[i % categories.length];
    blocks.push(generateBlock(category));
  }

  return blocks;
}

// ============================================================================
// Components
// ============================================================================

const CATEGORY_COLORS: Record<BlockCategory, string> = {
  warmup: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  upper_strength: 'bg-blue-100 text-blue-800 border-blue-300',
  lower_strength: 'bg-green-100 text-green-800 border-green-300',
  full_body: 'bg-purple-100 text-purple-800 border-purple-300',
  finisher: 'bg-orange-100 text-orange-800 border-orange-300',
};

const CATEGORY_LABELS: Record<BlockCategory, string> = {
  warmup: 'Warmup',
  upper_strength: 'Upper Body',
  lower_strength: 'Lower Body',
  full_body: 'Full Body',
  finisher: 'Finisher',
};

interface BlockCardProps {
  block: GeneratedBlock;
  onRate: (rating: 'good' | 'bad', feedback: string) => void;
  onFix: (newOrder: ExerciseDefinition[], feedback: string) => void;
}

function BlockCard({ block, onRate, onFix }: BlockCardProps) {
  const [feedback, setFeedback] = useState('');
  const [isReordering, setIsReordering] = useState(false);
  const [reorderedExercises, setReorderedExercises] = useState<ExerciseDefinition[]>(block.exercises);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newOrder = [...reorderedExercises];
    const [dragged] = newOrder.splice(draggedIndex, 1);
    newOrder.splice(index, 0, dragged);
    setReorderedExercises(newOrder);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const flowScore = isReordering
    ? calculateBlockFlowScore(reorderedExercises)
    : block.flowScore;

  const flowColor = flowScore >= 70 ? 'text-green-600' : flowScore >= 50 ? 'text-yellow-600' : 'text-red-600';

  return (
    <div className="bg-white rounded-lg shadow-md border overflow-hidden">
      {/* Header */}
      <div className={`px-4 py-2 border-b flex justify-between items-center ${CATEGORY_COLORS[block.category]}`}>
        <span className="font-semibold">{CATEGORY_LABELS[block.category]}</span>
        <span className={`text-sm font-mono ${flowColor}`}>
          Flow: {Math.round(flowScore)}
        </span>
      </div>

      {/* Exercises */}
      <div className="p-4">
        <div className="space-y-2 mb-3">
          {(isReordering ? reorderedExercises : block.exercises).map((exercise, idx) => (
            <div
              key={exercise.id}
              draggable={isReordering}
              onDragStart={() => handleDragStart(idx)}
              onDragOver={(e) => handleDragOver(e, idx)}
              onDragEnd={handleDragEnd}
              className={`flex items-center gap-2 p-2 rounded ${
                isReordering
                  ? 'bg-gray-100 cursor-move hover:bg-gray-200'
                  : 'bg-gray-50'
              } ${draggedIndex === idx ? 'opacity-50' : ''}`}
            >
              {isReordering && (
                <span className="text-gray-400">⋮⋮</span>
              )}
              <span className="font-medium">{exercise.name}</span>
              <span className="text-xs text-gray-500">
                {POSITION_LABELS[exercise.position]}
              </span>
            </div>
          ))}
        </div>

        {/* Reasoning */}
        <p className="text-xs text-gray-500 italic mb-3">{block.reasoning}</p>

        {/* Feedback input */}
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Optional: Why is this good/bad? What would make it better?"
          className="w-full p-2 text-sm border rounded resize-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          rows={2}
        />

        {/* Actions */}
        <div className="flex gap-2 mt-3">
          {!isReordering ? (
            <>
              <button
                onClick={() => onRate('good', feedback)}
                className="flex-1 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors text-sm font-medium"
              >
                👍 Good
              </button>
              <button
                onClick={() => onRate('bad', feedback)}
                className="flex-1 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm font-medium"
              >
                👎 Bad
              </button>
              <button
                onClick={() => setIsReordering(true)}
                className="flex-1 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors text-sm font-medium"
              >
                ✏️ Fix
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  onFix(reorderedExercises, feedback);
                  setIsReordering(false);
                }}
                className="flex-1 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm font-medium"
              >
                ✓ Save Fix
              </button>
              <button
                onClick={() => {
                  setReorderedExercises(block.exercises);
                  setIsReordering(false);
                }}
                className="flex-1 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors text-sm font-medium"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function BlockBuilderGame() {
  const [blocks, setBlocks] = useState<GeneratedBlock[]>([]);
  const [stats, setStats] = useState<GameStats>({ total: 0, good: 0, bad: 0, fixed: 0 });
  const [batchSize, setBatchSize] = useState(4);

  const generateNewBatch = () => {
    setBlocks(generateBatchOfBlocks(batchSize));
  };

  useEffect(() => {
    generateNewBatch();
  }, []);

  const handleRate = (blockId: string, rating: 'good' | 'bad', textFeedback: string) => {
    const block = blocks.find(b => b.id === blockId);
    if (!block) return;

    const feedback: BlockFeedback = {
      blockId,
      category: block.category,
      exercises: block.exercises.map(e => e.id),
      rating,
      textFeedback,
      timestamp: new Date().toISOString(),
    };

    saveFeedback(feedback);

    setStats(prev => ({
      ...prev,
      total: prev.total + 1,
      good: prev.good + (rating === 'good' ? 1 : 0),
      bad: prev.bad + (rating === 'bad' ? 1 : 0),
    }));

    // Remove rated block
    setBlocks(prev => prev.filter(b => b.id !== blockId));
  };

  const handleFix = (blockId: string, newOrder: ExerciseDefinition[], textFeedback: string) => {
    const block = blocks.find(b => b.id === blockId);
    if (!block) return;

    const feedback: BlockFeedback = {
      blockId,
      category: block.category,
      exercises: block.exercises.map(e => e.id),
      rating: 'fixed',
      textFeedback,
      fixedOrder: newOrder.map(e => e.id),
      timestamp: new Date().toISOString(),
    };

    saveFeedback(feedback);

    setStats(prev => ({
      ...prev,
      total: prev.total + 1,
      fixed: prev.fixed + 1,
    }));

    // Remove fixed block
    setBlocks(prev => prev.filter(b => b.id !== blockId));
  };

  const allFeedback = loadAllFeedback();

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Block Builder Game</h1>
        <p className="text-gray-600">
          Rate generated blocks to help train the system. Good blocks get reinforced,
          bad blocks get avoided, and fixes teach better ordering.
        </p>
      </div>

      {/* Stats bar */}
      <div className="flex justify-between items-center mb-6 p-4 bg-gray-100 rounded-lg">
        <div className="flex gap-6">
          <div>
            <span className="text-sm text-gray-500">Session: </span>
            <span className="font-semibold">{stats.total}</span>
          </div>
          <div>
            <span className="text-sm text-gray-500">👍 </span>
            <span className="font-semibold text-green-600">{stats.good}</span>
          </div>
          <div>
            <span className="text-sm text-gray-500">👎 </span>
            <span className="font-semibold text-red-600">{stats.bad}</span>
          </div>
          <div>
            <span className="text-sm text-gray-500">✏️ </span>
            <span className="font-semibold text-blue-600">{stats.fixed}</span>
          </div>
          <div>
            <span className="text-sm text-gray-500">All-time: </span>
            <span className="font-semibold">{allFeedback.length}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm">
            <span>Batch size:</span>
            <select
              value={batchSize}
              onChange={(e) => setBatchSize(Number(e.target.value))}
              className="border rounded px-2 py-1"
            >
              <option value={2}>2</option>
              <option value={4}>4</option>
              <option value={6}>6</option>
            </select>
          </label>
          <button
            onClick={generateNewBatch}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            Generate New Batch
          </button>
        </div>
      </div>

      {/* Blocks grid */}
      {blocks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {blocks.map(block => (
            <BlockCard
              key={block.id}
              block={block}
              onRate={(rating, feedback) => handleRate(block.id, rating, feedback)}
              onFix={(newOrder, feedback) => handleFix(block.id, newOrder, feedback)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-4">All blocks rated! Generate a new batch to continue.</p>
          <button
            onClick={generateNewBatch}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            Generate New Batch
          </button>
        </div>
      )}

      {/* Tips */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-800 mb-2">Tips</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• <strong>Good blocks:</strong> Exercises flow naturally, make sense for the category</li>
          <li>• <strong>Bad blocks:</strong> Awkward transitions, wrong exercises for the category</li>
          <li>• <strong>Fix:</strong> Drag exercises to reorder, then save - teaches better sequencing</li>
          <li>• <strong>Text feedback:</strong> Explain why - helps identify patterns we're missing</li>
        </ul>
      </div>
    </div>
  );
}
