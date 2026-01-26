import React, { useState } from 'react';
import { ConfigPanel } from './ConfigPanel';
import { ClassPreview } from './ClassPreview';
import { NLGenerationResults } from './NLGenerationResults';
import { useClassGenerator, GenerationMode } from '../../hooks/useClassGenerator';
import { useClassHistory } from '../../hooks/useClassHistory';
import { calculateTreadAverage } from '../../services/treadParser';
import { hasImportedData } from '../../data/exerciseBlocks';
import {
  generateFromNaturalLanguage,
  getGenerationExamples,
  validateGenerationQuery,
  NLGenerationResult,
} from '../../services/nlGeneratorService';
import { DraftClassForComparison } from '../analytics/AnalyticsPage';
import { RoundMetadata, PairedMinute, TreadMinuteMetadata, ExerciseMetadata } from '../../types/hierarchyTypes';

type UIMode = 'configure' | 'describe';

interface ClassGeneratorProps {
  onCompareClass?: (draftClass: DraftClassForComparison) => void;
}

export function ClassGenerator({ onCompareClass }: ClassGeneratorProps = {}) {
  const { addToHistory } = useClassHistory();
  const {
    config,
    generatedClass,
    isGenerating,
    generationMode,
    setGenerationMode,
    updateConfig,
    generate,
    setGeneratedClass,
    reset
  } = useClassGenerator();

  const [isEditing, setIsEditing] = useState(false);
  const [uiMode, setUiMode] = useState<UIMode>('configure');
  const [nlQuery, setNlQuery] = useState('');
  const [nlPrompt, setNlPrompt] = useState('');  // NL prompt for exercise-based generation
  const [nlResult, setNlResult] = useState<NLGenerationResult | null>(null);
  const [nlError, setNlError] = useState<string | null>(null);
  const [isNlGenerating, setIsNlGenerating] = useState(false);

  const handleGenerate = () => {
    // Pass NL prompt to config if using exercise-based generation
    if (generationMode === 'exercises' && nlPrompt.trim()) {
      updateConfig({ nlPrompt: nlPrompt.trim() });
    }
    generate();
    setIsEditing(false);
  };

  const handleClassChange = (updatedClass: typeof generatedClass) => {
    if (!updatedClass) return;

    // Recalculate tread average
    const allTreadEntries = [
      ...updatedClass.round1.tread,
      ...updatedClass.round2.tread
    ];
    const newAverage = calculateTreadAverage(allTreadEntries);

    setGeneratedClass({
      ...updatedClass,
      treadAverage: newAverage,
      updatedAt: new Date().toISOString()
    });
  };

  const handleSave = () => {
    if (!generatedClass) return;

    // Add to history
    addToHistory(generatedClass);

    setIsEditing(false);
  };

  const handleReset = () => {
    if (window.confirm('Discard this class and start over?')) {
      reset();
      setIsEditing(false);
      setNlResult(null);
      setNlQuery('');
      setNlPrompt('');
    }
  };

  const handleNlGenerate = async () => {
    if (!nlQuery.trim()) return;

    setIsNlGenerating(true);
    setNlError(null);

    try {
      const result = await generateFromNaturalLanguage(nlQuery, config);
      setNlResult(result);
    } catch (error) {
      setNlError(error instanceof Error ? error.message : 'Generation failed');
    } finally {
      setIsNlGenerating(false);
    }
  };

  const handleSelectNlResult = (classPlan: typeof generatedClass) => {
    if (classPlan) {
      setGeneratedClass(classPlan);
      setNlResult(null);
    }
  };

  const handleTryDifferent = () => {
    setNlResult(null);
    setNlQuery('');
  };

  const handleCompare = () => {
    if (!generatedClass || !onCompareClass) return;

    // Convert generated class rounds to RoundMetadata format for comparison
    const convertRoundToMetadata = (round: typeof generatedClass.round1, roundNumber: 1 | 2): RoundMetadata => {
      // Build PairedMinute array from floor and tread entries
      const minutes: PairedMinute[] = round.floor.map((floorEntry, index) => {
        const treadEntry = round.tread[index];
        return {
          minuteLabel: `${index}-${index + 1}`,
          minuteIndex: index,
          tread: {
            rawText: treadEntry?.raw || '',
            speeds: treadEntry?.speeds || [],
            isRecover: treadEntry?.isRecover || false,
            isSprint: treadEntry?.isSprint || false,
            inclinePercent: treadEntry?.inclinePercent || 0,
            effectiveSpeed: treadEntry?.effectiveSpeed || 0,
          } as TreadMinuteMetadata,
          floor: {
            id: `draft-floor-${roundNumber}-${index}`,
            rawText: floorEntry.exercises,
            exercises: [floorEntry.exercises],
            positions: [],
            primaryPosition: 'floor_standing',
            hasPositionTransition: false,
            primaryMuscle: 'chest',
            secondaryMuscles: [],
            movementPattern: 'push',
            modifiers: {},
            repClassification: 'standard',
            gripDemand: 'medium',
            isFinisherMove: false,
            isPowerMove: false,
            minuteInBlock: 0,
            minuteInRound: index,
          } as unknown as ExerciseMetadata,
        };
      });

      return {
        id: `draft-${roundNumber}`,
        roundNumber,
        sourceClassId: 'draft',
        sourceDate: generatedClass.date,
        sourceSheet: 'Draft Class',
        duration: round.duration,
        equipment: {
          rawText: round.equipment,
          primary: { type: 'heavy', count: 2 },
          secondary: undefined,
          benchSetup: 'flat',
        },
        minutes,
        blockIds: [],
        treadBlockIds: [],
        treadPattern: 'intervals',
        treadCharacter: 'balanced',
        sprintCount: round.tread.filter(t => t.isSprint).length,
        recoverCount: round.tread.filter(t => t.isRecover).length,
        hasIncline: round.tread.some(t => t.inclinePercent > 0),
        maxIncline: Math.max(...round.tread.map(t => t.inclinePercent || 0)),
        treadAverage: generatedClass.treadAverage,
        primaryBodyFocus: [],
        movementPatterns: [],
        dominantPosition: 'floor_standing',
        positionSequence: [],
        flowScore: 70,
        gripLoadScore: 5,
        hasGripBreaks: true,
        finisherType: null,
        finisherExercise: '',
        exerciseSequence: round.floor.map(f => f.exercises).join(' | '),
        lastUsed: null,
        useCount: 0,
        useDates: [],
      };
    };

    const draftClass: DraftClassForComparison = {
      label: 'Draft Class',
      round1: convertRoundToMetadata(generatedClass.round1, 1),
      round2: convertRoundToMetadata(generatedClass.round2, 2),
    };

    onCompareClass(draftClass);
  };

  // Check if we have any imported data
  const hasData = hasImportedData();

  // Show empty state if no data available
  if (!hasData && !generatedClass) {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Class Generator</h1>
          <p className="text-gray-600 mt-2">
            Generate complete workout plans using your imported class data
          </p>
        </div>

        <div className="max-w-md mx-auto bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
          <div className="text-4xl mb-4">📊</div>
          <h3 className="text-lg font-semibold text-blue-900 mb-2">No Class Data Available</h3>
          <p className="text-blue-700 mb-4">
            Import a class spreadsheet to start generating classes.
          </p>
          <p className="text-sm text-blue-600">
            Go to the <span className="font-semibold">Import</span> tab to upload your class data.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {!generatedClass ? (
        <>
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Class Generator</h1>
            <p className="text-gray-600 mt-2">
              {uiMode === 'configure'
                ? 'Configure your class and generate a complete workout plan'
                : 'Describe your ideal class in natural language'}
            </p>
          </div>

          {/* Mode Toggle */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex rounded-lg border border-gray-200 p-1 bg-gray-50">
              <button
                onClick={() => { setUiMode('configure'); setNlResult(null); }}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  uiMode === 'configure'
                    ? 'bg-white text-orange-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Configure
              </button>
              <button
                onClick={() => { setUiMode('describe'); setNlResult(null); }}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  uiMode === 'describe'
                    ? 'bg-white text-orange-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Describe
              </button>
            </div>
          </div>

          {/* Configure Mode */}
          {uiMode === 'configure' && (
            <div className="max-w-2xl mx-auto space-y-4">
              {/* Generation Mode Toggle */}
              <div className="bg-white rounded-lg shadow p-4">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Generation Method
                </label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setGenerationMode('exercises')}
                    className={`flex-1 px-4 py-3 rounded-lg border-2 transition-colors text-left ${
                      generationMode === 'exercises'
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-gray-900">Exercise-Based</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Build from individual exercises with flow &amp; vibe matching
                    </div>
                  </button>
                  <button
                    onClick={() => setGenerationMode('blocks')}
                    className={`flex-1 px-4 py-3 rounded-lg border-2 transition-colors text-left ${
                      generationMode === 'blocks'
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-gray-900">Block-Based</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Remix existing 2-4 min blocks from imported classes
                    </div>
                  </button>
                </div>
              </div>

              {/* NL Prompt Input (for exercise-based only) */}
              {generationMode === 'exercises' && (
                <div className="bg-white rounded-lg shadow p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Style Prompt <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={nlPrompt}
                    onChange={(e) => setNlPrompt(e.target.value)}
                    placeholder="e.g., push/pull focus, high intensity, snatch finisher"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                  <div className="text-xs text-gray-500 mt-2">
                    Describe exercise preferences to influence selection
                  </div>
                </div>
              )}

              <ConfigPanel
                config={config}
                onConfigChange={updateConfig}
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
              />
            </div>
          )}

          {/* Describe Mode */}
          {uiMode === 'describe' && !nlResult && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-lg shadow p-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Describe your ideal class
                </label>
                <textarea
                  value={nlQuery}
                  onChange={(e) => setNlQuery(e.target.value)}
                  placeholder="e.g., 10 min push/pull with burpee finisher, high intensity"
                  className="w-full h-24 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleNlGenerate();
                    }
                  }}
                />

                {/* Example queries */}
                <div className="mt-3">
                  <div className="text-xs text-gray-500 mb-2">Try these examples:</div>
                  <div className="flex flex-wrap gap-2">
                    {getGenerationExamples().slice(0, 4).map((example, i) => (
                      <button
                        key={i}
                        onClick={() => setNlQuery(example)}
                        className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded transition-colors"
                      >
                        {example}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Error display */}
                {nlError && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                    {nlError}
                  </div>
                )}

                {/* Generate button */}
                <button
                  onClick={handleNlGenerate}
                  disabled={isNlGenerating || !nlQuery.trim()}
                  className={`mt-4 w-full py-3 rounded-lg font-medium transition-colors ${
                    isNlGenerating || !nlQuery.trim()
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-orange-500 hover:bg-orange-600 text-white'
                  }`}
                >
                  {isNlGenerating ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Generating...
                    </span>
                  ) : (
                    'Generate Class'
                  )}
                </button>
              </div>
            </div>
          )}

          {/* NL Results */}
          {uiMode === 'describe' && nlResult && (
            <div className="max-w-3xl mx-auto">
              <NLGenerationResults
                result={nlResult}
                onSelectPrimary={() => handleSelectNlResult(nlResult.classPlan)}
                onSelectAlternative={(index) => handleSelectNlResult(nlResult.alternatives[index])}
                onTryDifferent={handleTryDifferent}
              />
            </div>
          )}
        </>
      ) : (
        <ClassPreview
          classPlan={generatedClass}
          onClassChange={handleClassChange}
          maxAverage={config.maxTreadAverage}
          isEditing={isEditing}
          onToggleEdit={() => setIsEditing(!isEditing)}
          onSave={handleSave}
          onReset={handleReset}
          onCompare={onCompareClass ? handleCompare : undefined}
        />
      )}
    </div>
  );
}
