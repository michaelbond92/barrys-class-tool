import React, { useState, useCallback } from 'react';
import {
  GenerationFeedback,
  PromptMatchRating,
  BarryVibesRating,
  saveFeedback,
  getRandomPrompt,
  calculateFeedbackStats,
  SAMPLE_PROMPTS,
} from '../../services/feedbackService';
import { parseNLPrompt } from '../../services/exerciseIndexingService';

// ============================================================================
// Types
// ============================================================================

interface GeneratedClass {
  rounds: Array<{
    roundNumber: number;
    duration: number;
    minutes: Array<{
      floor: string;
      tread: string;
    }>;
  }>;
}

type GameState = 'prompt' | 'rating' | 'submitted';

// ============================================================================
// Mock Generator (until we wire up the real one)
// Uses the parsed constraints to generate a reasonable mock class
// ============================================================================

// Exercise pools by category
const EXERCISE_POOLS = {
  push: ['Chest Press', 'Incline Press', 'Shoulder Press', 'Tricep Extension', 'Push-ups', 'Chest Fly', 'Arnold Press'],
  pull: ['Rows', 'Bicep Curl', 'Reverse Fly', 'High Pull', 'Hammer Curl', 'Wide Rows', 'Narrow Rows'],
  hinge: ['Deadlift', 'RDL', 'Good Morning', 'Sumo Deadlift', 'Single Leg RDL'],
  legs: ['Squats', 'Lunges', 'Goblet Squat', 'Sumo Squat', 'Split Squat', 'Step-ups', 'Curtsy Lunge'],
  core: ['Plank', 'Russian Twist', 'Dead Bug', 'Bicycle Crunch', 'Hollow Hold'],
  warmup: ['Walkouts', 'Worlds Greatest Stretch', 'Hip Circles', 'Arm Circles', 'Glute Bridges'],
  // Intense moves - only for last 20% of R1 or anytime in R2
  power: ['Single Arm Snatch R/L', 'Clean to Press', 'Thrusters', 'KB Swings', 'Power Cleans'],
  finisher: ['Burpees', 'Mountain Climbers', 'Sprawls', 'Plank Jacks'],
};

// Non-intense compound moves (safe for mid-round)
const SAFE_COMBOS = ['Squat to Press', 'Deadlift to Row', 'Lunge to Curl', 'RDL to Row', 'Reverse Lunge to Press'];

// Tread patterns - using whole number groups of 3
const TREAD_PATTERNS = {
  warmup: '5 - 7',           // Always start here
  build1: '6 - 8',           // First build
  build2: '7 - 9',           // Second build
  push: '8 - 10',            // Push pace
  allOut: '9 - 11',          // All out effort
  recover: '5 - 7',          // Recovery
  endurance: '6 - 8',        // Steady state
  // Incline patterns
  incline1: '5 - 7 @ 4%',
  incline2: '5 - 7 @ 6%',
  incline3: '5 - 7 @ 8%',
  hillClimb: '4 - 6 @ 8% | 10%',  // Split incline change
};

function generateMockClass(prompt: string): GeneratedClass {
  const parsed = parseNLPrompt(prompt);

  // Determine round structure
  const round1Duration = parsed.round1?.duration || 10;
  const round2Duration = parsed.round2?.duration || 8;
  const hasSecondRound = prompt.toLowerCase().includes('2 round') ||
                          prompt.toLowerCase().includes('two round') ||
                          parsed.round2 !== null;

  // Helper: get exercise pool based on constraints
  const getExercisePool = (constraints: typeof parsed.round1): string[] => {
    let pool: string[] = [];
    const movements = constraints?.movements || [];
    const muscles = constraints?.muscles || [];

    // Movement-based
    if (movements.includes('push')) pool.push(...EXERCISE_POOLS.push);
    if (movements.includes('pull')) pool.push(...EXERCISE_POOLS.pull);
    if (movements.includes('hinge')) pool.push(...EXERCISE_POOLS.hinge);
    if (movements.includes('squat') || movements.includes('lunge')) pool.push(...EXERCISE_POOLS.legs);

    // Muscle-based
    if (muscles.includes('chest') || muscles.includes('shoulders') || muscles.includes('triceps')) {
      pool.push(...EXERCISE_POOLS.push);
    }
    if (muscles.includes('back') || muscles.includes('biceps')) {
      pool.push(...EXERCISE_POOLS.pull);
    }
    if (muscles.includes('quads') || muscles.includes('glutes') || muscles.includes('hamstrings') || muscles.includes('calves')) {
      pool.push(...EXERCISE_POOLS.legs);
    }
    if (muscles.includes('core')) {
      pool.push(...EXERCISE_POOLS.core);
    }

    // Default: full body mix
    if (pool.length === 0) {
      pool = [...EXERCISE_POOLS.push, ...EXERCISE_POOLS.pull, ...EXERCISE_POOLS.legs];
    }

    return [...new Set(pool)];
  };

  // Helper: generate tread pattern for a block of minutes
  const generateTreadBlock = (
    duration: number,
    constraints: typeof parsed.round1
  ): string[] => {
    const treads: string[] = [];
    const useIncline = constraints?.treadIncline === true;
    const useEndurance = constraints?.treadEndurance === true;
    const noIncline = constraints?.treadIncline === false;

    // Always start with warmup (2-3 min at 5-7)
    const warmupLength = Math.min(3, Math.floor(duration * 0.2));
    for (let i = 0; i < warmupLength; i++) {
      treads.push(TREAD_PATTERNS.warmup);
    }

    // Main block patterns (hold each for 2-3 minutes)
    let remaining = duration - warmupLength;

    if (useIncline && !noIncline) {
      // Incline progression
      const patterns = [TREAD_PATTERNS.incline1, TREAD_PATTERNS.incline2, TREAD_PATTERNS.incline3];
      let patternIdx = 0;
      while (remaining > 0) {
        const blockLen = Math.min(remaining, 2 + Math.floor(Math.random() * 2)); // 2-3 min blocks
        for (let i = 0; i < blockLen; i++) {
          treads.push(patterns[patternIdx % patterns.length]);
        }
        patternIdx++;
        remaining -= blockLen;
      }
    } else if (useEndurance) {
      // Endurance: steady build, hold, recover pattern
      const patterns = [TREAD_PATTERNS.build1, TREAD_PATTERNS.endurance, TREAD_PATTERNS.build2, TREAD_PATTERNS.endurance];
      let patternIdx = 0;
      while (remaining > 0) {
        const blockLen = Math.min(remaining, 2 + Math.floor(Math.random() * 2));
        for (let i = 0; i < blockLen; i++) {
          treads.push(patterns[patternIdx % patterns.length]);
        }
        patternIdx++;
        remaining -= blockLen;
      }
    } else {
      // Standard: build → push → recover pattern
      const buildRecover = [
        { pattern: TREAD_PATTERNS.build1, len: 2 },
        { pattern: TREAD_PATTERNS.build2, len: 2 },
        { pattern: TREAD_PATTERNS.push, len: 2 },
        { pattern: TREAD_PATTERNS.recover, len: 1 },
        { pattern: TREAD_PATTERNS.push, len: 2 },
        { pattern: TREAD_PATTERNS.allOut, len: 1 },
      ];
      let blockIdx = 0;
      while (remaining > 0) {
        const block = buildRecover[blockIdx % buildRecover.length];
        const actualLen = Math.min(remaining, block.len);
        for (let i = 0; i < actualLen; i++) {
          treads.push(block.pattern);
        }
        remaining -= actualLen;
        blockIdx++;
      }
    }

    return treads;
  };

  // Helper: check if exercise is intense (power/finisher)
  const isIntenseExercise = (exercise: string): boolean => {
    const intense = [...EXERCISE_POOLS.power, ...EXERCISE_POOLS.finisher];
    return intense.some(e => exercise.toLowerCase().includes(e.toLowerCase().split(' ')[0]));
  };

  // Generate a round
  const generateRound = (
    roundNumber: 1 | 2,
    duration: number,
    constraints: typeof parsed.round1
  ): GeneratedClass['rounds'][0] => {
    const pool = getExercisePool(constraints);
    const mustInclude = constraints?.mustInclude || [];
    const useHeavy = constraints?.equipment === 'heavy';
    const useMedium = constraints?.equipment === 'medium';
    const compoundFocus = constraints?.compoundFocus;

    // Generate tread patterns for whole round
    const treadPatterns = generateTreadBlock(duration, constraints);

    const minutes: Array<{ floor: string; tread: string }> = [];
    const usedExercises: string[] = [];
    let lastWasIntense = false;

    // Calculate when intense moves are allowed
    // R1: only last 20% | R2: anytime after warmup
    const intenseAllowedAfter = roundNumber === 1
      ? Math.floor(duration * 0.8)
      : 2;

    // Track must-includes to place them appropriately
    const mustIncludeSet = new Set(mustInclude);
    const includedMustHaves = new Set<string>();

    for (let i = 0; i < duration; i++) {
      const isWarmup = i < 2;
      const isFinisher = i === duration - 1;
      const canUseIntense = i >= intenseAllowedAfter;

      let floorExercise: string;
      let reps: number;

      // Warmup minutes
      if (isWarmup) {
        floorExercise = EXERCISE_POOLS.warmup[Math.floor(Math.random() * EXERCISE_POOLS.warmup.length)];
        reps = 6;
      }
      // Finisher minute - always power/finisher move
      else if (isFinisher) {
        const finisherPool = [...EXERCISE_POOLS.power, ...EXERCISE_POOLS.finisher];
        floorExercise = finisherPool[Math.floor(Math.random() * finisherPool.length)];
        reps = 6;
        lastWasIntense = true;
      }
      // Must-include exercises (place in appropriate zone)
      else if (mustIncludeSet.size > includedMustHaves.size) {
        const remaining = [...mustIncludeSet].filter(m => !includedMustHaves.has(m));
        const toInclude = remaining[0];

        // Check if this must-include is intense
        const exerciseMap: Record<string, string> = {
          'deadlift': 'Deadlift',
          'snatch': 'Single Arm Snatch R/L',
          'burpee': 'Burpees',
          'clean': 'Clean to Press',
          'row': 'Rows',
          'squat': 'Squats',
          'lunge': 'Lunges',
          'press': 'Chest Press',
        };

        const mappedExercise = exerciseMap[toInclude] || toInclude;
        const isIntense = isIntenseExercise(mappedExercise);

        // Only use intense must-includes when allowed
        if (isIntense && !canUseIntense) {
          // Pick from pool instead, save must-include for later
          floorExercise = pool[Math.floor(Math.random() * pool.length)];
        } else if (isIntense && lastWasIntense) {
          // Don't do intense back-to-back
          floorExercise = pool[Math.floor(Math.random() * pool.length)];
        } else {
          includedMustHaves.add(toInclude);
          floorExercise = mappedExercise;
          lastWasIntense = isIntense;
        }
        reps = 8 + Math.floor(Math.random() * 3) * 2; // 8, 10, or 12
      }
      // Compound focus - use safe combos (not Clean to Press)
      else if (compoundFocus && Math.random() < 0.4 && !lastWasIntense) {
        floorExercise = SAFE_COMBOS[Math.floor(Math.random() * SAFE_COMBOS.length)];
        reps = 8 + Math.floor(Math.random() * 2) * 2; // 8 or 10
        lastWasIntense = false;
      }
      // Regular exercise from pool
      else {
        // Avoid repeating last exercise
        let attempts = 0;
        do {
          floorExercise = pool[Math.floor(Math.random() * pool.length)];
          attempts++;
        } while (usedExercises.slice(-2).includes(floorExercise) && attempts < 5);

        reps = 8 + Math.floor(Math.random() * 3) * 2; // 8, 10, or 12
        lastWasIntense = false;
      }

      usedExercises.push(floorExercise);

      // Add equipment modifier
      let modifier = '';
      if (useHeavy && !isWarmup) modifier = 'Heavy ';
      else if (useMedium && !isWarmup && Math.random() < 0.3) modifier = 'Tempo ';

      const formattedFloor = `${reps} ${modifier}${floorExercise}`.trim();

      minutes.push({
        floor: formattedFloor,
        tread: treadPatterns[i] || TREAD_PATTERNS.endurance
      });
    }

    return { roundNumber, duration, minutes };
  };

  const rounds: GeneratedClass['rounds'] = [];

  // Generate Round 1
  rounds.push(generateRound(1, round1Duration, parsed.round1 || undefined));

  // Generate Round 2 if applicable
  if (hasSecondRound) {
    rounds.push(generateRound(2, round2Duration, parsed.round2 || undefined));
  }

  return { rounds };
}

// ============================================================================
// Components
// ============================================================================

interface RatingButtonProps {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  color: 'green' | 'yellow' | 'red';
}

function RatingButton({ selected, onClick, children, color }: RatingButtonProps) {
  const colorClasses = {
    green: selected ? 'bg-green-600 text-white' : 'bg-green-100 text-green-800 hover:bg-green-200',
    yellow: selected ? 'bg-yellow-500 text-white' : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
    red: selected ? 'bg-red-600 text-white' : 'bg-red-100 text-red-800 hover:bg-red-200',
  };

  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg font-medium transition-colors ${colorClasses[color]}`}
    >
      {children}
    </button>
  );
}

function ClassDisplay({ generatedClass }: { generatedClass: GeneratedClass }) {
  return (
    <div className="space-y-4">
      {generatedClass.rounds.map((round) => (
        <div key={round.roundNumber} className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-bold text-gray-700 mb-3">
            Round {round.roundNumber} ({round.duration} min)
          </h4>
          <div className="grid grid-cols-12 gap-2 text-sm">
            <div className="col-span-1 font-medium text-gray-500">Min</div>
            <div className="col-span-6 font-medium text-gray-500">Floor</div>
            <div className="col-span-5 font-medium text-gray-500">Tread</div>
            {round.minutes.map((minute, idx) => (
              <React.Fragment key={idx}>
                <div className="col-span-1 text-gray-400">{idx + 1}</div>
                <div className="col-span-6 font-mono text-xs">{minute.floor}</div>
                <div className="col-span-5 font-mono text-xs text-blue-600">{minute.tread}</div>
              </React.Fragment>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function StatsDisplay() {
  const stats = calculateFeedbackStats();

  if (stats.total === 0) {
    return (
      <div className="text-gray-500 text-sm">
        No feedback collected yet. Rate some classes to see stats!
      </div>
    );
  }

  const promptMatchPercent = (rating: PromptMatchRating) =>
    Math.round((stats.promptMatch[rating] / stats.total) * 100);
  const barryVibesPercent = (rating: BarryVibesRating) =>
    Math.round((stats.barryVibes[rating] / stats.total) * 100);

  return (
    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
      <h4 className="font-bold text-gray-700">Feedback Stats ({stats.total} classes rated)</h4>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-sm font-medium text-gray-600 mb-1">Prompt Match</div>
          <div className="flex gap-2 text-xs">
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
              Nailed: {promptMatchPercent('nailed')}%
            </span>
            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
              Close: {promptMatchPercent('close')}%
            </span>
            <span className="bg-red-100 text-red-800 px-2 py-1 rounded">
              Missed: {promptMatchPercent('missed')}%
            </span>
          </div>
        </div>

        <div>
          <div className="text-sm font-medium text-gray-600 mb-1">Barry Vibes</div>
          <div className="flex gap-2 text-xs">
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
              Definitely: {barryVibesPercent('definitely')}%
            </span>
            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
              Maybe: {barryVibesPercent('maybe')}%
            </span>
            <span className="bg-red-100 text-red-800 px-2 py-1 rounded">
              No Way: {barryVibesPercent('no_way')}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Main Game Component
// ============================================================================

export function VibeCheckGame() {
  const [gameState, setGameState] = useState<GameState>('prompt');
  const [prompt, setPrompt] = useState<string>(getRandomPrompt());
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [useCustomPrompt, setUseCustomPrompt] = useState(false);
  const [generatedClass, setGeneratedClass] = useState<GeneratedClass | null>(null);

  const [promptMatch, setPromptMatch] = useState<PromptMatchRating | null>(null);
  const [barryVibes, setBarryVibes] = useState<BarryVibesRating | null>(null);
  const [notes, setNotes] = useState<string>('');

  const [showStats, setShowStats] = useState(false);

  const handleGenerate = useCallback(() => {
    const activePrompt = useCustomPrompt ? customPrompt : prompt;
    if (!activePrompt.trim()) return;

    const generated = generateMockClass(activePrompt);
    setGeneratedClass(generated);
    setGameState('rating');
    setPromptMatch(null);
    setBarryVibes(null);
    setNotes('');
  }, [prompt, customPrompt, useCustomPrompt]);

  const handleSubmit = useCallback(() => {
    if (!promptMatch || !barryVibes || !generatedClass) return;

    const activePrompt = useCustomPrompt ? customPrompt : prompt;
    const parsed = parseNLPrompt(activePrompt);

    const feedback: GenerationFeedback = {
      id: `feedback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      prompt: activePrompt,
      generatedClass,
      promptMatch,
      barryVibes,
      notes: notes.trim() || undefined,
      timestamp: new Date().toISOString(),
      parsedConstraints: {
        round1: parsed.round1 as Record<string, unknown> || undefined,
        round2: parsed.round2 as Record<string, unknown> || undefined,
      },
    };

    saveFeedback(feedback);
    setGameState('submitted');
  }, [prompt, customPrompt, useCustomPrompt, generatedClass, promptMatch, barryVibes, notes]);

  const handleNext = useCallback(() => {
    setPrompt(getRandomPrompt());
    setCustomPrompt('');
    setUseCustomPrompt(false);
    setGeneratedClass(null);
    setGameState('prompt');
    setPromptMatch(null);
    setBarryVibes(null);
    setNotes('');
  }, []);

  const handleNewRandom = useCallback(() => {
    setPrompt(getRandomPrompt());
    setUseCustomPrompt(false);
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Vibe Check Game</h2>
          <p className="text-gray-600">Rate generated classes to help improve the AI</p>
        </div>
        <button
          onClick={() => setShowStats(!showStats)}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          {showStats ? 'Hide Stats' : 'Show Stats'}
        </button>
      </div>

      {/* Stats */}
      {showStats && <StatsDisplay />}

      {/* Prompt Section */}
      {gameState === 'prompt' && (
        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <h3 className="font-bold text-lg text-gray-700">Class Prompt</h3>

          {/* Toggle */}
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={!useCustomPrompt}
                onChange={() => setUseCustomPrompt(false)}
                className="text-blue-600"
              />
              <span>Random prompt</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={useCustomPrompt}
                onChange={() => setUseCustomPrompt(true)}
                className="text-blue-600"
              />
              <span>Custom prompt</span>
            </label>
          </div>

          {/* Prompt display/input */}
          {useCustomPrompt ? (
            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Enter your class prompt..."
              className="w-full h-24 p-3 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          ) : (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800">{prompt}</p>
              <button
                onClick={handleNewRandom}
                className="mt-2 text-sm text-blue-600 hover:text-blue-800"
              >
                Get different prompt
              </button>
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={useCustomPrompt && !customPrompt.trim()}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Generate Class
          </button>
        </div>
      )}

      {/* Rating Section */}
      {gameState === 'rating' && generatedClass && (
        <div className="space-y-6">
          {/* Prompt reminder */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-sm text-blue-600 font-medium mb-1">Prompt:</div>
            <p className="text-blue-800">{useCustomPrompt ? customPrompt : prompt}</p>
          </div>

          {/* Generated class */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-bold text-lg text-gray-700 mb-4">Generated Class</h3>
            <ClassDisplay generatedClass={generatedClass} />
          </div>

          {/* Rating */}
          <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
            <div>
              <h4 className="font-medium text-gray-700 mb-3">Does this match the prompt?</h4>
              <div className="flex gap-3">
                <RatingButton
                  selected={promptMatch === 'nailed'}
                  onClick={() => setPromptMatch('nailed')}
                  color="green"
                >
                  Nailed It
                </RatingButton>
                <RatingButton
                  selected={promptMatch === 'close'}
                  onClick={() => setPromptMatch('close')}
                  color="yellow"
                >
                  Close
                </RatingButton>
                <RatingButton
                  selected={promptMatch === 'missed'}
                  onClick={() => setPromptMatch('missed')}
                  color="red"
                >
                  Missed It
                </RatingButton>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-700 mb-3">Would Barry teach this?</h4>
              <div className="flex gap-3">
                <RatingButton
                  selected={barryVibes === 'definitely'}
                  onClick={() => setBarryVibes('definitely')}
                  color="green"
                >
                  Definitely
                </RatingButton>
                <RatingButton
                  selected={barryVibes === 'maybe'}
                  onClick={() => setBarryVibes('maybe')}
                  color="yellow"
                >
                  Maybe
                </RatingButton>
                <RatingButton
                  selected={barryVibes === 'no_way'}
                  onClick={() => setBarryVibes('no_way')}
                  color="red"
                >
                  No Way
                </RatingButton>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-700 mb-2">Notes (optional)</h4>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="What was good? What was off?"
                className="w-full h-20 p-3 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={!promptMatch || !barryVibes}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Submit Feedback
            </button>
          </div>
        </div>
      )}

      {/* Submitted Section */}
      {gameState === 'submitted' && (
        <div className="bg-white rounded-lg shadow-md p-6 text-center space-y-4">
          <div className="text-4xl">🎉</div>
          <h3 className="font-bold text-xl text-gray-700">Feedback Saved!</h3>
          <p className="text-gray-600">
            Your rating helps improve the class generator. Ready for another?
          </p>
          <button
            onClick={handleNext}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Rate Another Class
          </button>
        </div>
      )}
    </div>
  );
}

export default VibeCheckGame;
