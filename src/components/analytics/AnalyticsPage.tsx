// ============================================================================
// Analytics Page Wrapper
// Loads data and renders the Analytics Dashboard
// Supports comparing draft classes to historical classes
// ============================================================================

import React, { useState, useEffect } from 'react';
import {
  ClassMetadata,
  RoundMetadata,
  BlockMetadata,
  ExerciseMetadata,
} from '../../types/hierarchyTypes';
import { loadIndexFromStorage } from '../../services/indexingService';
import { AnalyticsDashboard } from './AnalyticsDashboard';
import { ClassComparison } from './ClassComparison';

type AnalyticsTab = 'dashboard' | 'compare';

// Draft class interface for comparison
export interface DraftClassForComparison {
  label: string;
  round1?: RoundMetadata;
  round2?: RoundMetadata;
}

interface AnalyticsPageProps {
  draftClass?: DraftClassForComparison;
  initialTab?: AnalyticsTab;
}

export function AnalyticsPage({ draftClass, initialTab }: AnalyticsPageProps = {}) {
  const [activeTab, setActiveTab] = useState<AnalyticsTab>(initialTab || (draftClass ? 'compare' : 'dashboard'));
  const [classes, setClasses] = useState<ClassMetadata[]>([]);
  const [rounds, setRounds] = useState<RoundMetadata[]>([]);
  const [blocks, setBlocks] = useState<BlockMetadata[]>([]);
  const [exercises, setExercises] = useState<ExerciseMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClassA, setSelectedClassA] = useState<ClassMetadata | null>(null);
  const [selectedClassB, setSelectedClassB] = useState<ClassMetadata | null>(null);

  useEffect(() => {
    const index = loadIndexFromStorage();
    if (index) {
      setClasses(index.classes || []);
      setRounds(index.rounds || []);
      setBlocks(index.floorBlocks || []);
      // Note: exercises are not stored directly on blocks
      // They would need to be parsed from block content if needed
      setExercises([]);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
      </div>
    );
  }

  const hasData = classes.length > 0 || rounds.length > 0 || blocks.length > 0;

  if (!hasData) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Data to Analyze</h3>
        <p className="text-gray-500 mb-4">
          Import class data from a spreadsheet to see analytics and usage patterns.
        </p>
        <p className="text-sm text-gray-400">
          Go to the <strong>Import</strong> tab to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Analytics</h2>

          {/* Tab Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'dashboard'
                  ? 'bg-orange-100 text-orange-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('compare')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'compare'
                  ? 'bg-orange-100 text-orange-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Compare Classes
            </button>
          </div>
        </div>

        {activeTab === 'dashboard' ? (
          <AnalyticsDashboard
            classes={classes}
            rounds={rounds}
            blocks={blocks}
            exercises={exercises}
          />
        ) : (
          <div className="space-y-4">
            {/* Draft Class Banner */}
            {draftClass && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <span className="text-orange-600 text-lg">📝</span>
                  <div>
                    <div className="font-medium text-orange-900">Comparing Draft Class</div>
                    <div className="text-sm text-orange-700">
                      Select up to 2 previous classes to compare against your draft.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Class Selectors */}
            <div className={`grid gap-4 ${draftClass ? 'grid-cols-2' : 'grid-cols-2'}`}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {draftClass ? 'Compare to Class 1' : 'Class A'}
                </label>
                <select
                  value={selectedClassA?.id || ''}
                  onChange={(e) => {
                    const cls = classes.find(c => c.id === e.target.value);
                    setSelectedClassA(cls || null);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="">Select a class...</option>
                  {classes.map(cls => (
                    <option key={cls.id} value={cls.id}>
                      {new Date(cls.date).toLocaleDateString()} - {cls.dayOfWeek}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {draftClass ? 'Compare to Class 2 (Optional)' : 'Class B'}
                </label>
                <select
                  value={selectedClassB?.id || ''}
                  onChange={(e) => {
                    const cls = classes.find(c => c.id === e.target.value);
                    setSelectedClassB(cls || null);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="">Select a class...</option>
                  {classes
                    .filter(cls => cls.id !== selectedClassA?.id)
                    .map(cls => (
                      <option key={cls.id} value={cls.id}>
                        {new Date(cls.date).toLocaleDateString()} - {cls.dayOfWeek}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {/* Comparison or placeholder */}
            {draftClass && selectedClassA ? (
              <ClassComparison
                classA={selectedClassA}
                classB={selectedClassB || selectedClassA}
                roundsA={rounds.filter(r => r.sourceClassId === selectedClassA.id)}
                roundsB={selectedClassB
                  ? rounds.filter(r => r.sourceClassId === selectedClassB.id)
                  : rounds.filter(r => r.sourceClassId === selectedClassA.id)
                }
                draftClass={draftClass}
              />
            ) : selectedClassA && selectedClassB ? (
              <ClassComparison
                classA={selectedClassA}
                classB={selectedClassB}
                roundsA={rounds.filter(r => r.sourceClassId === selectedClassA.id)}
                roundsB={rounds.filter(r => r.sourceClassId === selectedClassB.id)}
              />
            ) : (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <p className="text-gray-500">
                  {draftClass
                    ? 'Select at least one class above to compare against your draft.'
                    : 'Select two classes above to compare them.'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
