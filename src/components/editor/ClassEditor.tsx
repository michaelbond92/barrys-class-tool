import React from 'react';
import { ClassPlan, Round } from '../../types';
import { RoundDisplay } from '../generator/RoundDisplay';

interface ClassEditorProps {
  classPlan: ClassPlan;
  onClassChange: (classPlan: ClassPlan) => void;
}

export function ClassEditor({ classPlan, onClassChange }: ClassEditorProps) {
  const handleRound1Change = (round: Round) => {
    onClassChange({
      ...classPlan,
      round1: round as Round & { number: 1 },
      updatedAt: new Date().toISOString()
    });
  };

  const handleRound2Change = (round: Round) => {
    onClassChange({
      ...classPlan,
      round2: round as Round & { number: 2 },
      updatedAt: new Date().toISOString()
    });
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <RoundDisplay
        round={classPlan.round1}
        onRoundChange={handleRound1Change}
        isEditing={true}
      />
      <RoundDisplay
        round={classPlan.round2}
        onRoundChange={handleRound2Change}
        isEditing={true}
      />
    </div>
  );
}
