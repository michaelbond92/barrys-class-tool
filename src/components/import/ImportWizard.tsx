// ============================================================================
// Import Wizard
// Multi-step wizard for importing class data from xlsx files
// ============================================================================

import React, { useState, useCallback } from 'react';
import { ImportedClass, WorkoutType, WORKOUT_TYPE_LABELS, BlockMetadata, TreadBlockMetadata } from '../../types/hierarchyTypes';
import { parseClassSpreadsheet, validateImportedClass, formatDateForDisplay } from '../../services/xlsxParserService';
import { indexImportedClasses, saveIndexToStorage } from '../../services/indexingService';
import { buildExerciseIndex, saveExerciseIndex } from '../../services/exerciseIndexingService';
import { generateAllBlockEmbeddings, generateAllRoundEmbeddings } from '../../services/firebase/vectorSearchService';
import { isFirebaseConfigured, initializeFirebase, getAuthInstance } from '../../services/firebase/firebaseConfig';

// Check if OpenAI API key is configured
function isOpenAIConfigured(): boolean {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  return Boolean(apiKey && apiKey.length > 0 && apiKey !== 'undefined');
}

// Detect workout type from filename
function detectWorkoutTypeFromFilename(filename: string): WorkoutType {
  const lower = filename.toLowerCase();
  if (lower.includes('total body')) return 'total_body';
  if (lower.includes('chest') && lower.includes('back')) return 'chest_back_abs';
  if (lower.includes('arms')) return 'arms_abs';
  if (lower.includes('legs') || lower.includes('glutes')) return 'legs_glutes';
  if (lower.includes('stretch')) return 'full_body_stretch';
  return 'other';
}

type WizardStep = 'upload' | 'preview' | 'importing' | 'complete';

interface ImportWizardProps {
  onComplete: (stats: ImportStats) => void;
  onCancel: () => void;
}

interface ImportStats {
  classesImported: number;
  roundsCreated: number;
  floorBlocksCreated: number;
  treadBlocksCreated: number;
  errors: string[];
}

type ImportPhase = 'parsing' | 'indexing' | 'embeddings' | 'complete';

export function ImportWizard({ onComplete, onCancel }: ImportWizardProps) {
  const [step, setStep] = useState<WizardStep>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [classes, setClasses] = useState<ImportedClass[]>([]);
  const [selectedClasses, setSelectedClasses] = useState<Set<number>>(new Set());
  const [importProgress, setImportProgress] = useState(0);
  const [importPhase, setImportPhase] = useState<ImportPhase>('parsing');
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<ImportStats | null>(null);
  const [workoutType, setWorkoutType] = useState<WorkoutType>('total_body');
  const [embeddingsSkipped, setEmbeddingsSkipped] = useState(false);

  // Handle file drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.name.endsWith('.xlsx')) {
      setFile(droppedFile);
      handleFileSelect(droppedFile);
    } else {
      setError('Please upload an .xlsx file');
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  // Handle file selection
  const handleFileSelect = async (selectedFile: File) => {
    setError(null);
    setFile(selectedFile);

    // Auto-detect workout type from filename
    const detectedType = detectWorkoutTypeFromFilename(selectedFile.name);
    setWorkoutType(detectedType);

    try {
      const parsed = await parseClassSpreadsheet(selectedFile);
      setClasses(parsed);

      // Select all classes by default
      const allIndices = new Set(parsed.map((_, i) => i));
      setSelectedClasses(allIndices);

      setStep('preview');
    } catch (err) {
      setError(`Failed to parse file: ${err}`);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  };

  // Toggle class selection
  const toggleClass = (index: number) => {
    const newSelected = new Set(selectedClasses);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedClasses(newSelected);
  };

  const selectAll = () => {
    setSelectedClasses(new Set(classes.map((_, i) => i)));
  };

  const selectNone = () => {
    setSelectedClasses(new Set());
  };

  // Start import
  const handleImport = async () => {
    setStep('importing');
    setImportProgress(0);
    setImportPhase('parsing');
    setEmbeddingsSkipped(false);

    try {
      // Filter selected classes
      const toImport = classes.filter((_, i) => selectedClasses.has(i));

      // Index classes with workout type
      setImportProgress(10);
      setImportPhase('indexing');
      const indexed = indexImportedClasses(toImport, workoutType);

      setImportProgress(30);

      // Save to storage
      saveIndexToStorage(indexed);

      setImportProgress(35);

      // Build exercise-level index for exercise-based generation
      const exerciseIndex = buildExerciseIndex();
      saveExerciseIndex(exerciseIndex);
      console.log(`Exercise index built: ${exerciseIndex.exercises.size} unique exercises`);

      setImportProgress(40);

      // Generate embeddings if OpenAI and Firebase are configured
      const openAIReady = isOpenAIConfigured();
      const firebaseReady = isFirebaseConfigured();

      if (openAIReady && firebaseReady) {
        setImportPhase('embeddings');

        try {
          // Initialize Firebase if not already done
          await initializeFirebase();

          // Get user ID (use anonymous ID if not logged in)
          let userId = 'anonymous';
          try {
            const auth = getAuthInstance();
            userId = auth.currentUser?.uid || 'anonymous';
          } catch {
            // Auth not initialized, use anonymous
          }

          // Combine floor and tread blocks for embedding generation
          const allBlocks = indexed.floorBlocks as BlockMetadata[];
          const totalItems = allBlocks.length + indexed.rounds.length;
          let completedItems = 0;

          // Generate block embeddings
          if (allBlocks.length > 0) {
            await generateAllBlockEmbeddings(userId, allBlocks, (completed) => {
              completedItems = completed;
              const progress = 40 + Math.floor((completedItems / totalItems) * 50);
              setImportProgress(progress);
            });
          }

          // Generate round embeddings
          if (indexed.rounds.length > 0) {
            await generateAllRoundEmbeddings(userId, indexed.rounds, (completed) => {
              completedItems = allBlocks.length + completed;
              const progress = 40 + Math.floor((completedItems / totalItems) * 50);
              setImportProgress(progress);
            });
          }
        } catch (embeddingError) {
          console.warn('Embedding generation failed, continuing without embeddings:', embeddingError);
          setEmbeddingsSkipped(true);
        }
      } else {
        // Skip embeddings if not configured
        setEmbeddingsSkipped(true);
        if (!openAIReady) {
          console.warn('OpenAI API key not configured, skipping embedding generation');
        }
        if (!firebaseReady) {
          console.warn('Firebase not configured, skipping embedding generation');
        }
      }

      setImportProgress(100);
      setImportPhase('complete');

      const importStats: ImportStats = {
        classesImported: indexed.classes.length,
        roundsCreated: indexed.rounds.length,
        floorBlocksCreated: indexed.floorBlocks.length,
        treadBlocksCreated: indexed.treadBlocks.length,
        errors: toImport.flatMap(c => c.parseErrors),
      };

      setStats(importStats);
      setStep('complete');
    } catch (err) {
      setError(`Import failed: ${err}`);
      setStep('preview');
    }
  };

  // Render current step
  const renderStep = () => {
    switch (step) {
      case 'upload':
        return renderUploadStep();
      case 'preview':
        return renderPreviewStep();
      case 'importing':
        return renderImportingStep();
      case 'complete':
        return renderCompleteStep();
    }
  };

  // Upload step
  const renderUploadStep = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Import Class Data</h2>
        <p className="text-gray-500 mt-1">
          Upload your Barry's class spreadsheet (.xlsx) to import historical class data.
        </p>
      </div>

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-orange-400 transition-colors cursor-pointer"
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <div className="text-4xl mb-4">📁</div>
        <p className="text-lg font-medium text-gray-700">
          Drop your .xlsx file here
        </p>
        <p className="text-sm text-gray-500 mt-1">
          or click to browse
        </p>
        <input
          id="file-input"
          type="file"
          accept=".xlsx"
          onChange={handleFileInputChange}
          className="hidden"
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="text-sm text-gray-500">
        <h3 className="font-medium text-gray-700 mb-2">Expected format:</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>Each sheet = one class (sheet name contains date, e.g., "1.17.25 (119)")</li>
          <li>Two rounds per sheet with equipment info</li>
          <li>Columns: Minute, Tread, Floor, Notes</li>
        </ul>
      </div>
    </div>
  );

  // Preview step
  const renderPreviewStep = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Preview Import</h2>
          <p className="text-gray-500 mt-1">
            Found {classes.length} classes in "{file?.name}"
          </p>
        </div>
        <div className="space-x-2">
          <button
            onClick={selectAll}
            className="text-sm text-orange-600 hover:underline"
          >
            Select all
          </button>
          <button
            onClick={selectNone}
            className="text-sm text-gray-500 hover:underline"
          >
            Select none
          </button>
        </div>
      </div>

      {/* Workout Type Selector */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Workout Type for All Classes
        </label>
        <select
          value={workoutType}
          onChange={(e) => setWorkoutType(e.target.value as WorkoutType)}
          className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
        >
          {Object.entries(WORKOUT_TYPE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
        <p className="text-xs text-gray-500 mt-2">
          Auto-detected from filename. Change if needed.
        </p>
      </div>

      <div className="border rounded-lg overflow-hidden max-h-96 overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="w-10 px-3 py-2"></th>
              <th className="text-left px-3 py-2">Date</th>
              <th className="text-left px-3 py-2">R1</th>
              <th className="text-left px-3 py-2">R2</th>
              <th className="text-left px-3 py-2">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {classes.map((cls, index) => {
              const validation = validateImportedClass(cls);
              const hasErrors = !validation.isValid;
              const hasWarnings = validation.warnings.length > 0;

              return (
                <tr
                  key={index}
                  className={`
                    ${selectedClasses.has(index) ? 'bg-orange-50' : ''}
                    ${hasErrors ? 'bg-red-50' : ''}
                    hover:bg-gray-50 cursor-pointer
                  `}
                  onClick={() => toggleClass(index)}
                >
                  <td className="px-3 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={selectedClasses.has(index)}
                      onChange={() => toggleClass(index)}
                      className="rounded text-orange-500 focus:ring-orange-500"
                    />
                  </td>
                  <td className="px-3 py-2 font-medium">
                    {cls.date !== 'unknown' ? formatDateForDisplay(cls.date) : cls.sourceSheet}
                  </td>
                  <td className="px-3 py-2 text-gray-600">
                    {cls.round1.minutes.length}min • {cls.round1.equipment}
                  </td>
                  <td className="px-3 py-2 text-gray-600">
                    {cls.round2.minutes.length}min • {cls.round2.equipment}
                  </td>
                  <td className="px-3 py-2">
                    {hasErrors ? (
                      <span className="text-red-600" title={validation.errors.join('\n')}>
                        ❌ {validation.errors.length} error(s)
                      </span>
                    ) : hasWarnings ? (
                      <span className="text-amber-600" title={validation.warnings.join('\n')}>
                        ⚠️ {validation.warnings.length} warning(s)
                      </span>
                    ) : (
                      <span className="text-green-600">✅ OK</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between pt-4 border-t">
        <button
          onClick={() => setStep('upload')}
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          ← Back
        </button>
        <div className="space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={handleImport}
            disabled={selectedClasses.size === 0}
            className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Import {selectedClasses.size} class(es)
          </button>
        </div>
      </div>
    </div>
  );

  // Get phase description for progress display
  const getPhaseDescription = () => {
    switch (importPhase) {
      case 'parsing':
        return 'Parsing exercises from spreadsheet...';
      case 'indexing':
        return 'Indexing classes, detecting positions, calculating flow scores...';
      case 'embeddings':
        return 'Generating semantic embeddings for similarity search...';
      case 'complete':
        return 'Import complete!';
      default:
        return 'Processing...';
    }
  };

  // Importing step
  const renderImportingStep = () => (
    <div className="space-y-6 text-center py-12">
      <div className="text-4xl animate-pulse">📊</div>
      <h2 className="text-xl font-semibold text-gray-900">Importing Classes...</h2>
      <div className="w-64 mx-auto">
        <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="bg-orange-500 h-full transition-all duration-300"
            style={{ width: `${importProgress}%` }}
          />
        </div>
        <p className="text-sm text-gray-500 mt-2">{importProgress}%</p>
      </div>
      <p className="text-gray-500">
        {getPhaseDescription()}
      </p>
      {importPhase === 'embeddings' && (
        <p className="text-xs text-gray-400">
          This enables "More Like This" and semantic search features
        </p>
      )}
    </div>
  );

  // Complete step
  const renderCompleteStep = () => (
    <div className="space-y-6 text-center py-8">
      <div className="text-6xl">🎉</div>
      <h2 className="text-2xl font-semibold text-gray-900">Import Complete!</h2>

      {stats && (
        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto text-left">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-orange-500">{stats.classesImported}</div>
            <div className="text-sm text-gray-600">Classes imported</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-orange-500">{stats.roundsCreated}</div>
            <div className="text-sm text-gray-600">Rounds indexed</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-orange-500">{stats.floorBlocksCreated}</div>
            <div className="text-sm text-gray-600">Floor blocks</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-orange-500">{stats.treadBlocksCreated}</div>
            <div className="text-sm text-gray-600">Tread blocks</div>
          </div>
        </div>
      )}

      {stats && stats.errors.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-left max-w-md mx-auto">
          <div className="font-medium text-amber-700 mb-2">
            {stats.errors.length} warning(s) during import:
          </div>
          <ul className="text-sm text-amber-600 space-y-1">
            {stats.errors.slice(0, 5).map((err, i) => (
              <li key={i}>• {err}</li>
            ))}
            {stats.errors.length > 5 && (
              <li>...and {stats.errors.length - 5} more</li>
            )}
          </ul>
        </div>
      )}

      {embeddingsSkipped && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left max-w-md mx-auto">
          <div className="font-medium text-blue-700 mb-1">
            Embeddings skipped
          </div>
          <p className="text-sm text-blue-600">
            Semantic search features ("More Like This", "Surprise Me") require OpenAI API key and Firebase to be configured.
            Basic search and generation will still work.
          </p>
        </div>
      )}

      <button
        onClick={() => stats && onComplete(stats)}
        className="px-8 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium"
      >
        Done
      </button>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto">
      {renderStep()}
    </div>
  );
}

export default ImportWizard;
