// ============================================================================
// Import Page Wrapper
// Provides context and state management for the Import Wizard
// ============================================================================

import React, { useState, useCallback } from 'react';
import { ImportWizard } from './ImportWizard';
import { loadIndexFromStorage, clearIndexFromStorage } from '../../services/indexingService';

interface ImportStats {
  classesImported: number;
  roundsCreated: number;
  floorBlocksCreated: number;
  treadBlocksCreated: number;
  errors: string[];
}

export function ImportPage() {
  const [showWizard, setShowWizard] = useState(false);
  const [lastImport, setLastImport] = useState<ImportStats | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [dataVersion, setDataVersion] = useState(0); // Force re-render after delete

  // Load existing data stats
  const index = loadIndexFromStorage();
  const existingStats = {
    classes: index?.classes?.length || 0,
    rounds: index?.rounds?.length || 0,
    floorBlocks: index?.floorBlocks?.length || 0,
    treadBlocks: index?.treadBlocks?.length || 0,
  };

  const handleComplete = (stats: ImportStats) => {
    setLastImport(stats);
    setShowWizard(false);
    setDataVersion(v => v + 1); // Force re-render
  };

  const handleCancel = () => {
    setShowWizard(false);
  };

  const handleDelete = useCallback(() => {
    clearIndexFromStorage();
    setShowDeleteConfirm(false);
    setLastImport(null);
    setDataVersion(v => v + 1); // Force re-render
  }, []);

  if (showWizard) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <ImportWizard onComplete={handleComplete} onCancel={handleCancel} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Data Stats */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Imported Data</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-gray-900">{existingStats.classes}</p>
            <p className="text-sm text-gray-500">Classes</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-gray-900">{existingStats.rounds}</p>
            <p className="text-sm text-gray-500">Rounds</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-gray-900">{existingStats.floorBlocks}</p>
            <p className="text-sm text-gray-500">Floor Blocks</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-gray-900">{existingStats.treadBlocks}</p>
            <p className="text-sm text-gray-500">Tread Blocks</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setShowWizard(true)}
            className="flex-1 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Import from Spreadsheet
          </button>

          {existingStats.classes > 0 && (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-3 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete All
            </button>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Delete All Data?</h3>
            </div>
            <p className="text-gray-600 mb-6">
              This will permanently delete all imported class data:
            </p>
            <ul className="text-sm text-gray-500 mb-6 space-y-1">
              <li>• {existingStats.classes} classes</li>
              <li>• {existingStats.rounds} rounds</li>
              <li>• {existingStats.floorBlocks} floor blocks</li>
              <li>• {existingStats.treadBlocks} tread blocks</li>
            </ul>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                Delete All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Last Import Results */}
      {lastImport && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="font-medium text-green-800 mb-3 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Import Successful
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-green-700 font-medium">{lastImport.classesImported}</p>
              <p className="text-green-600">Classes imported</p>
            </div>
            <div>
              <p className="text-green-700 font-medium">{lastImport.roundsCreated}</p>
              <p className="text-green-600">Rounds created</p>
            </div>
            <div>
              <p className="text-green-700 font-medium">{lastImport.floorBlocksCreated}</p>
              <p className="text-green-600">Floor blocks</p>
            </div>
            <div>
              <p className="text-green-700 font-medium">{lastImport.treadBlocksCreated}</p>
              <p className="text-green-600">Tread blocks</p>
            </div>
          </div>
          {lastImport.errors.length > 0 && (
            <div className="mt-4 pt-4 border-t border-green-200">
              <p className="text-sm text-yellow-700 font-medium mb-2">
                {lastImport.errors.length} warning(s):
              </p>
              <ul className="text-sm text-yellow-600 list-disc list-inside">
                {lastImport.errors.slice(0, 5).map((err, idx) => (
                  <li key={idx}>{err}</li>
                ))}
                {lastImport.errors.length > 5 && (
                  <li>...and {lastImport.errors.length - 5} more</li>
                )}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Instructions */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="font-medium text-gray-900 mb-3">Spreadsheet Format</h3>
        <p className="text-sm text-gray-600 mb-4">
          Upload an Excel file (.xlsx) with class data. Each sheet should represent one class:
        </p>
        <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside">
          <li>Sheet name should include the date (e.g., "1.17.25 (119)")</li>
          <li>Include "Round 1" and "Round 2" markers</li>
          <li>Equipment rows: "Equipment: 2 Heavies"</li>
          <li>Floor exercises and tread data in separate columns</li>
        </ul>
      </div>
    </div>
  );
}
