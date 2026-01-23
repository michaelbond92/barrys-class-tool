import React from 'react';
import { TreadInput } from './TreadInput';
import { TreadResults } from './TreadResults';
import { useTreadCalculator } from '../../hooks/useTreadCalculator';

export function TreadCalculator() {
  const {
    rawInput,
    setRawInput,
    parsedEntries,
    average,
    countableMinutes,
    totalMinutes,
    recoverMinutes,
    clear
  } = useTreadCalculator();

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Tread Calculator</h1>
        <p className="text-gray-600 mt-2">
          Paste your tread column to calculate the average speed
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TreadInput
          value={rawInput}
          onChange={setRawInput}
          onClear={clear}
        />
        <TreadResults
          entries={parsedEntries}
          average={average}
          countableMinutes={countableMinutes}
          totalMinutes={totalMinutes}
          recoverMinutes={recoverMinutes}
        />
      </div>
    </div>
  );
}
