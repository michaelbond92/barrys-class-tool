import React from 'react';
import { SearchBar } from './SearchBar';
import { CategoryFilter } from './CategoryFilter';
import { ExerciseList } from './ExerciseList';
import { useExerciseLibrary } from '../../hooks/useExerciseLibrary';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { Equipment } from '../../types';

const equipmentOptions = [
  { value: 'all', label: 'All Equipment' },
  { value: '2 Heavy Dumbbells', label: '2 Heavy Dumbbells' },
  { value: '2 Mediums', label: '2 Mediums' },
  { value: '2 Light Dumbbells', label: '2 Light Dumbbells' },
  { value: 'Bodyweight', label: 'Bodyweight' }
];

export function ExerciseLibrary() {
  const {
    filteredExercises,
    categoryFilter,
    equipmentFilter,
    searchQuery,
    setCategoryFilter,
    setEquipmentFilter,
    setSearchQuery,
    resetHistory
  } = useExerciseLibrary();

  const handleResetHistory = () => {
    if (window.confirm('Reset all exercise usage history? This cannot be undone.')) {
      resetHistory();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Exercise Library</h1>
          <p className="text-gray-600 mt-1">
            {filteredExercises.length} exercises
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleResetHistory}>
          Reset History
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
            />
          </div>
          <div className="w-full sm:w-48">
            <Select
              options={equipmentOptions}
              value={equipmentFilter}
              onChange={(val) => setEquipmentFilter(val as Equipment | 'all')}
            />
          </div>
        </div>

        <CategoryFilter
          selected={categoryFilter}
          onChange={setCategoryFilter}
        />
      </div>

      {/* Freshness Legend */}
      <div className="flex gap-4 text-sm">
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-green-100"></span>
          Fresh (0 uses)
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-yellow-100"></span>
          Used 1x
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-orange-100"></span>
          Used 2x
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-100"></span>
          Overused (3+)
        </span>
      </div>

      {/* Exercise List */}
      <ExerciseList exercises={filteredExercises} />
    </div>
  );
}
