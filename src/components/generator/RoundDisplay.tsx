import React from 'react';
import { Round, TreadEntry, FloorEntry } from '../../types';
import { TreadRow } from './TreadRow';
import { FloorRow } from './FloorRow';
import { Input } from '../ui/Input';

interface RoundDisplayProps {
  round: Round;
  onRoundChange: (round: Round) => void;
  isEditing: boolean;
}

export function RoundDisplay({ round, onRoundChange, isEditing }: RoundDisplayProps) {
  const handleTreadChange = (index: number, entry: TreadEntry) => {
    const newTread = [...round.tread];
    newTread[index] = entry;
    onRoundChange({ ...round, tread: newTread });
  };

  const handleFloorChange = (index: number, entry: FloorEntry) => {
    const newFloor = [...round.floor];
    newFloor[index] = entry;
    onRoundChange({ ...round, floor: newFloor });
  };

  const handleForecastChange = (forecast: string) => {
    onRoundChange({ ...round, forecast });
  };

  const maxRows = Math.max(round.tread.length, round.floor.length);

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Header */}
      <div className="bg-header text-white px-4 py-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">Round {round.number}</h3>
          <span className="text-orange-100">
            {round.duration} min | {round.equipment}
          </span>
        </div>
      </div>

      {/* Forecast */}
      <div className="px-4 py-2 bg-orange-50 border-b border-orange-100">
        {isEditing ? (
          <Input
            placeholder="Floor forecast (optional)"
            value={round.forecast || ''}
            onChange={(e) => handleForecastChange(e.target.value)}
            className="text-sm"
          />
        ) : (
          <p className="text-sm text-gray-600">
            <span className="font-medium">Floor Forecast:</span>{' '}
            {round.forecast || 'Not set'}
          </p>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-4 py-2 text-sm font-medium text-gray-600 w-16">Min</th>
              <th className="text-left px-4 py-2 text-sm font-medium text-gray-600">Tread</th>
              <th className="text-left px-4 py-2 text-sm font-medium text-gray-600">Floor</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: maxRows }).map((_, index) => {
              const treadEntry = round.tread[index];
              const floorEntry = round.floor[index];
              const prevTreadEntry = index > 0 ? round.tread[index - 1] : null;
              const prevFloorEntry = index > 0 ? round.floor[index - 1] : null;

              // Check if this is the start of a new block
              const isNewTreadBlock = treadEntry?.blockIndex !== prevTreadEntry?.blockIndex;
              const isNewFloorBlock = floorEntry?.blockIndex !== prevFloorEntry?.blockIndex;
              const isNewBlock = isNewTreadBlock || isNewFloorBlock;

              return (
                <tr
                  key={index}
                  className={`border-b border-gray-100 hover:bg-gray-50 ${
                    isNewBlock ? 'border-t-2 border-t-gray-300' : ''
                  }`}
                >
                  <td className="px-4 py-2 font-mono text-sm text-gray-500">
                    {treadEntry?.minute || floorEntry?.minute || `${index}-${index + 1}`}
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex items-start gap-2">
                      {treadEntry && isNewTreadBlock && treadEntry.libraryIndex && (
                        <span
                          className={`text-xs px-1.5 py-0.5 rounded font-medium whitespace-nowrap ${
                            treadEntry.blockType === 'warmup'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                          title={`Tread ${treadEntry.blockType === 'warmup' ? 'Warmup' : 'Workout'} Block #${treadEntry.libraryIndex} of ${treadEntry.libraryTotal}`}
                        >
                          T{treadEntry.blockType === 'warmup' ? 'W' : ''}{treadEntry.libraryIndex}
                        </span>
                      )}
                      {treadEntry && (!isNewTreadBlock || !treadEntry.libraryIndex) && (
                        <span className="w-8"></span>
                      )}
                      {treadEntry && (
                        <TreadRow
                          entry={treadEntry}
                          onChange={(e) => handleTreadChange(index, e)}
                          isEditing={isEditing}
                        />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex items-start gap-2">
                      {floorEntry && isNewFloorBlock && floorEntry.libraryIndex && (
                        <span
                          className={`text-xs px-1.5 py-0.5 rounded font-medium whitespace-nowrap ${
                            floorEntry.blockType === 'warmup'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-orange-100 text-orange-700'
                          }`}
                          title={`Floor ${floorEntry.blockType === 'warmup' ? 'Warmup' : 'Workout'} Block #${floorEntry.libraryIndex} of ${floorEntry.libraryTotal}`}
                        >
                          F{floorEntry.blockType === 'warmup' ? 'W' : ''}{floorEntry.libraryIndex}
                        </span>
                      )}
                      {floorEntry && (!isNewFloorBlock || !floorEntry.libraryIndex) && (
                        <span className="w-8"></span>
                      )}
                      {floorEntry && (
                        <FloorRow
                          entry={floorEntry}
                          onChange={(e) => handleFloorChange(index, e)}
                          isEditing={isEditing}
                        />
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
