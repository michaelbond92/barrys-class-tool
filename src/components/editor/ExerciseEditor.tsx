// ============================================================================
// Exercise Editor
// UI for viewing and editing exercise metadata
// ============================================================================

import React, { useState, useMemo } from 'react';
import { ALL_EXERCISES, ExerciseDefinition } from '../../data/exerciseReference';
import {
  ExercisePosition,
  MovementPattern,
  MuscleGroup,
  WeightPath,
  WeightPosition,
  MovementPlane,
  EquipmentOption,
  POSITION_LABELS,
  MOVEMENT_LABELS,
  MUSCLE_LABELS,
  WEIGHT_POSITION_LABELS,
  MOVEMENT_PLANE_LABELS,
} from '../../data/types';
import {
  getAllExercisesWithOverrides,
  saveOverride,
  deleteOverride,
  hasOverride,
  getOverrideCount,
  ExerciseOverride,
} from '../../services/exerciseOverrideService';

// ============================================================================
// Types
// ============================================================================

type FilterCategory = 'all' | 'warmup' | 'push' | 'pull' | 'hinge' | 'squat' | 'lunge' | 'power' | 'core' | 'needs_review';

// ============================================================================
// Main Component
// ============================================================================

export function ExerciseEditor() {
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  // Force refresh of exercise list
  const refresh = () => setRefreshKey(k => k + 1);

  // Get exercises with overrides applied
  const exercises = useMemo(() => {
    return getAllExercisesWithOverrides();
  }, [refreshKey]);

  // Filter exercises
  const filteredExercises = useMemo(() => {
    let result = exercises;

    // Filter by category
    if (filter !== 'all') {
      if (filter === 'needs_review') {
        result = result.filter(e => e.status === 'needs_review' || !hasOverride(e.id));
      } else if (filter === 'warmup') {
        result = result.filter(e => e.isWarmup);
      } else if (filter === 'power') {
        result = result.filter(e => e.isPower);
      } else if (filter === 'core') {
        result = result.filter(e => e.movementPattern === 'plank' || e.movementPattern === 'rotation');
      } else {
        result = result.filter(e => e.movementPattern === filter);
      }
    }

    // Filter by search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(e =>
        e.name.toLowerCase().includes(q) ||
        e.aliases.some(a => a.toLowerCase().includes(q))
      );
    }

    return result;
  }, [exercises, filter, searchQuery]);

  const selectedExercise = selectedExerciseId
    ? exercises.find(e => e.id === selectedExerciseId)
    : null;

  const overrideCount = getOverrideCount();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">Exercise Editor</h1>
        <p className="text-gray-600 mt-1">
          Review and edit exercise metadata ({exercises.length} exercises, {overrideCount} customized)
        </p>
      </div>

      <div className="flex gap-6">
        {/* Left Panel - Exercise List */}
        <div className="w-1/3 bg-white rounded-lg shadow overflow-hidden flex flex-col" style={{ maxHeight: '75vh' }}>
          {/* Filters */}
          <div className="p-4 border-b bg-gray-50 space-y-3">
            <input
              type="text"
              placeholder="Search exercises..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
            <div className="flex flex-wrap gap-1">
              {[
                { id: 'all', label: 'All' },
                { id: 'needs_review', label: 'Needs Review' },
                { id: 'warmup', label: 'Warmup' },
                { id: 'push', label: 'Push' },
                { id: 'pull', label: 'Pull' },
                { id: 'hinge', label: 'Hinge' },
                { id: 'squat', label: 'Squat' },
                { id: 'lunge', label: 'Lunge' },
                { id: 'power', label: 'Power' },
                { id: 'core', label: 'Core' },
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id as FilterCategory)}
                  className={`px-2 py-1 text-xs rounded-full transition-colors ${
                    filter === f.id
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Exercise List */}
          <div className="flex-1 overflow-y-auto">
            {filteredExercises.map(exercise => (
              <ExerciseListItem
                key={exercise.id}
                exercise={exercise}
                isSelected={selectedExerciseId === exercise.id}
                hasOverride={hasOverride(exercise.id)}
                onClick={() => setSelectedExerciseId(exercise.id)}
              />
            ))}
            {filteredExercises.length === 0 && (
              <div className="p-4 text-center text-gray-500">
                No exercises match your filters
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Exercise Detail */}
        <div className="flex-1">
          {selectedExercise ? (
            <ExerciseDetailPanel
              exercise={selectedExercise}
              onSave={() => {
                refresh();
              }}
              onReset={() => {
                deleteOverride(selectedExercise.id);
                refresh();
              }}
            />
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
              <div className="text-4xl mb-4">👈</div>
              <p>Select an exercise to view and edit its metadata</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Exercise List Item
// ============================================================================

interface ExerciseListItemProps {
  exercise: ExerciseDefinition;
  isSelected: boolean;
  hasOverride: boolean;
  onClick: () => void;
}

function ExerciseListItem({ exercise, isSelected, hasOverride, onClick }: ExerciseListItemProps) {
  const hasWeightPath = !!exercise.weightPath || hasOverride;
  const hasMovementPlane = !!exercise.movementPlane || hasOverride;
  const hasEquipmentOptions = (exercise.equipmentOptions && exercise.equipmentOptions.length > 0) || hasOverride;

  const completeness = [hasWeightPath, hasMovementPlane, hasEquipmentOptions].filter(Boolean).length;

  return (
    <button
      onClick={onClick}
      className={`w-full px-4 py-3 text-left border-b transition-colors ${
        isSelected
          ? 'bg-orange-100 border-orange-200'
          : 'hover:bg-gray-50 border-gray-100'
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="font-medium text-gray-900 flex items-center gap-2">
            {exercise.name}
            {hasOverride && (
              <span className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded">
                Modified
              </span>
            )}
          </div>
          <div className="text-xs text-gray-500 mt-0.5">
            {MOVEMENT_LABELS[exercise.movementPattern]} • {POSITION_LABELS[exercise.position]}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <CompletenessIndicator count={completeness} total={3} />
        </div>
      </div>
    </button>
  );
}

function CompletenessIndicator({ count, total }: { count: number; total: number }) {
  const colors = count === total ? 'bg-green-500' : count > 0 ? 'bg-yellow-500' : 'bg-gray-300';
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`w-2 h-2 rounded-full ${i < count ? colors : 'bg-gray-200'}`}
        />
      ))}
    </div>
  );
}

// ============================================================================
// Exercise Detail Panel
// ============================================================================

interface ExerciseDetailPanelProps {
  exercise: ExerciseDefinition;
  onSave: () => void;
  onReset: () => void;
}

function ExerciseDetailPanel({ exercise, onSave, onReset }: ExerciseDetailPanelProps) {
  // Local state for edits
  const [position, setPosition] = useState(exercise.position);
  const [secondaryPosition, setSecondaryPosition] = useState(exercise.secondaryPosition);
  const [movementPattern, setMovementPattern] = useState(exercise.movementPattern);
  const [secondaryPattern, setSecondaryPattern] = useState(exercise.secondaryPattern);
  const [primaryMuscles, setPrimaryMuscles] = useState<MuscleGroup[]>(exercise.primaryMuscles);
  const [secondaryMuscles, setSecondaryMuscles] = useState<MuscleGroup[]>(exercise.secondaryMuscles);
  const [gripDemand, setGripDemand] = useState(exercise.gripDemand);
  const [isCompound, setIsCompound] = useState(exercise.isCompound);
  const [isPower, setIsPower] = useState(exercise.isPower);
  const [isFinisher, setIsFinisher] = useState(exercise.isFinisher);
  const [isWarmup, setIsWarmup] = useState(exercise.isWarmup);

  // New fields - metadata now baked into exercise definitions
  const [weightPath, setWeightPath] = useState<WeightPath | undefined>(
    exercise.weightPath
  );
  const [movementPlane, setMovementPlane] = useState<MovementPlane | undefined>(
    exercise.movementPlane
  );
  const [equipmentOptions, setEquipmentOptions] = useState<EquipmentOption[]>(
    exercise.equipmentOptions || []
  );

  // Reset state when exercise changes
  React.useEffect(() => {
    setPosition(exercise.position);
    setSecondaryPosition(exercise.secondaryPosition);
    setMovementPattern(exercise.movementPattern);
    setSecondaryPattern(exercise.secondaryPattern);
    setPrimaryMuscles(exercise.primaryMuscles);
    setSecondaryMuscles(exercise.secondaryMuscles);
    setGripDemand(exercise.gripDemand);
    setIsCompound(exercise.isCompound);
    setIsPower(exercise.isPower);
    setIsFinisher(exercise.isFinisher);
    setIsWarmup(exercise.isWarmup);
    setWeightPath(exercise.weightPath);
    setMovementPlane(exercise.movementPlane);
    setEquipmentOptions(exercise.equipmentOptions || []);
  }, [exercise.id]);

  const handleSave = () => {
    const override: ExerciseOverride = {
      id: exercise.id,
      position,
      secondaryPosition,
      movementPattern,
      secondaryPattern,
      primaryMuscles,
      secondaryMuscles,
      gripDemand,
      isCompound,
      isPower,
      isFinisher,
      isWarmup,
      weightPath,
      movementPlane,
      equipmentOptions,
      status: 'verified',
    };
    saveOverride(override);
    onSave();
  };

  const handleReset = () => {
    if (confirm('Reset this exercise to its default values?')) {
      onReset();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden" style={{ maxHeight: '75vh', overflowY: 'auto' }}>
      {/* Header */}
      <div className="px-6 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
        <h2 className="text-xl font-bold">{exercise.name}</h2>
        <p className="text-orange-100 text-sm mt-1">
          {exercise.aliases.join(', ')}
        </p>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Description */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-600">{exercise.description}</div>
          {exercise.cues.length > 0 && (
            <div className="mt-2 text-xs text-gray-500">
              Cues: {exercise.cues.join(' • ')}
            </div>
          )}
        </div>

        {/* Position */}
        <Section title="Body Position">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Primary Position</label>
              <select
                value={position}
                onChange={e => setPosition(e.target.value as ExercisePosition)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500"
              >
                {Object.entries(POSITION_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Position</label>
              <select
                value={secondaryPosition || ''}
                onChange={e => setSecondaryPosition(e.target.value as ExercisePosition || undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500"
              >
                <option value="">None</option>
                {Object.entries(POSITION_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
          </div>
        </Section>

        {/* Movement Pattern */}
        <Section title="Movement Pattern">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Primary Pattern</label>
              <select
                value={movementPattern}
                onChange={e => setMovementPattern(e.target.value as MovementPattern)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500"
              >
                {Object.entries(MOVEMENT_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Pattern</label>
              <select
                value={secondaryPattern || ''}
                onChange={e => setSecondaryPattern(e.target.value as MovementPattern || undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500"
              >
                <option value="">None</option>
                {Object.entries(MOVEMENT_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
          </div>
        </Section>

        {/* Muscles */}
        <Section title="Muscle Groups">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Primary Muscles</label>
              <MuscleSelector selected={primaryMuscles} onChange={setPrimaryMuscles} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Muscles</label>
              <MuscleSelector selected={secondaryMuscles} onChange={setSecondaryMuscles} />
            </div>
          </div>
        </Section>

        {/* Weight Path (NEW) */}
        <Section title="Weight Path" badge="New">
          <p className="text-xs text-gray-500 mb-3">
            Where the weight is during the movement. Enables compound flow detection (e.g., curl → press).
          </p>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start</label>
              <select
                value={weightPath?.start || 'none'}
                onChange={e => setWeightPath({
                  start: e.target.value as WeightPosition,
                  mid: weightPath?.mid || 'none',
                  end: weightPath?.end || 'none',
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500"
              >
                {Object.entries(WEIGHT_POSITION_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mid (Peak)</label>
              <select
                value={weightPath?.mid || 'none'}
                onChange={e => setWeightPath({
                  start: weightPath?.start || 'none',
                  mid: e.target.value as WeightPosition,
                  end: weightPath?.end || 'none',
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500"
              >
                {Object.entries(WEIGHT_POSITION_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End</label>
              <select
                value={weightPath?.end || 'none'}
                onChange={e => setWeightPath({
                  start: weightPath?.start || 'none',
                  mid: weightPath?.mid || 'none',
                  end: e.target.value as WeightPosition,
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500"
              >
                {Object.entries(WEIGHT_POSITION_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
          </div>
        </Section>

        {/* Movement Plane (NEW) */}
        <Section title="Movement Plane" badge="New">
          <p className="text-xs text-gray-500 mb-3">
            The plane of motion. Lateral exercises don't mix well with sagittal ones.
          </p>
          <div className="flex gap-2">
            {Object.entries(MOVEMENT_PLANE_LABELS).map(([value, label]) => (
              <button
                key={value}
                onClick={() => setMovementPlane(value as MovementPlane)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  movementPlane === value
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </Section>

        {/* Equipment Options (NEW) */}
        <Section title="Equipment Options" badge="New">
          <p className="text-xs text-gray-500 mb-3">
            Valid equipment configurations for this exercise.
          </p>
          <EquipmentOptionsEditor
            options={equipmentOptions}
            onChange={setEquipmentOptions}
          />
        </Section>

        {/* Other Properties */}
        <Section title="Other Properties">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Grip Demand</label>
              <select
                value={gripDemand}
                onChange={e => setGripDemand(e.target.value as typeof gripDemand)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500"
              >
                <option value="none">None</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="flex flex-wrap gap-4 items-center">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isCompound}
                  onChange={e => setIsCompound(e.target.checked)}
                  className="rounded text-orange-500 focus:ring-orange-500"
                />
                <span className="text-sm">Compound</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPower}
                  onChange={e => setIsPower(e.target.checked)}
                  className="rounded text-orange-500 focus:ring-orange-500"
                />
                <span className="text-sm">Power</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFinisher}
                  onChange={e => setIsFinisher(e.target.checked)}
                  className="rounded text-orange-500 focus:ring-orange-500"
                />
                <span className="text-sm">Finisher</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isWarmup}
                  onChange={e => setIsWarmup(e.target.checked)}
                  className="rounded text-orange-500 focus:ring-orange-500"
                />
                <span className="text-sm">Warmup</span>
              </label>
            </div>
          </div>
        </Section>

        {/* Actions */}
        <div className="flex justify-between pt-4 border-t">
          {hasOverride(exercise.id) && (
            <button
              onClick={handleReset}
              className="px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            >
              Reset to Default
            </button>
          )}
          <div className="flex-1" />
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Helper Components
// ============================================================================

function Section({ title, badge, children }: { title: string; badge?: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        {badge && (
          <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full">{badge}</span>
        )}
      </div>
      {children}
    </div>
  );
}

function MuscleSelector({
  selected,
  onChange,
}: {
  selected: MuscleGroup[];
  onChange: (muscles: MuscleGroup[]) => void;
}) {
  const toggle = (muscle: MuscleGroup) => {
    if (selected.includes(muscle)) {
      onChange(selected.filter(m => m !== muscle));
    } else {
      onChange([...selected, muscle]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {Object.entries(MUSCLE_LABELS).map(([value, label]) => (
        <button
          key={value}
          onClick={() => toggle(value as MuscleGroup)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            selected.includes(value as MuscleGroup)
              ? 'bg-orange-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function EquipmentOptionsEditor({
  options,
  onChange,
}: {
  options: EquipmentOption[];
  onChange: (options: EquipmentOption[]) => void;
}) {
  const addOption = () => {
    onChange([...options, { type: 'medium', count: 2 }]);
  };

  const removeOption = (index: number) => {
    onChange(options.filter((_, i) => i !== index));
  };

  const updateOption = (index: number, field: 'type' | 'count', value: string | number) => {
    const newOptions = [...options];
    if (field === 'type') {
      newOptions[index] = { ...newOptions[index], type: value as EquipmentOption['type'] };
    } else {
      newOptions[index] = { ...newOptions[index], count: value as 1 | 2 };
    }
    onChange(newOptions);
  };

  return (
    <div className="space-y-2">
      {options.map((opt, i) => (
        <div key={i} className="flex items-center gap-2">
          <select
            value={opt.count}
            onChange={e => updateOption(i, 'count', parseInt(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500"
          >
            <option value={1}>1</option>
            <option value={2}>2</option>
          </select>
          <select
            value={opt.type}
            onChange={e => updateOption(i, 'type', e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500"
          >
            <option value="heavy">Heavy Dumbbells</option>
            <option value="medium">Medium Dumbbells</option>
            <option value="light">Light Dumbbells</option>
            <option value="band">Resistance Band</option>
            <option value="none">Bodyweight</option>
          </select>
          <button
            onClick={() => removeOption(i)}
            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
      <button
        onClick={addOption}
        className="w-full px-4 py-2 border-2 border-dashed border-gray-300 text-gray-500 rounded-lg hover:border-gray-400 hover:text-gray-600 transition-colors text-sm"
      >
        + Add Equipment Option
      </button>
    </div>
  );
}

export default ExerciseEditor;
