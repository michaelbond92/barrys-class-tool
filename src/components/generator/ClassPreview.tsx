import React from 'react';
import { ClassPlan, Round } from '../../types';
import { RoundDisplay } from './RoundDisplay';
import { TreadAverageIndicator } from './TreadAverageIndicator';
import { Button } from '../ui/Button';
import { formatClassTypeName } from '../../utils/formatUtils';
import { formatDisplayDate } from '../../utils/dateUtils';
import { copyToClipboard, exportToXLSX } from '../../services/exportService';

interface ClassPreviewProps {
  classPlan: ClassPlan;
  onClassChange: (classPlan: ClassPlan) => void;
  maxAverage: number;
  isEditing: boolean;
  onToggleEdit: () => void;
  onSave: () => void;
  onReset: () => void;
  onCompare?: () => void;
}

export function ClassPreview({
  classPlan,
  onClassChange,
  maxAverage,
  isEditing,
  onToggleEdit,
  onSave,
  onReset,
  onCompare
}: ClassPreviewProps) {
  const [copySuccess, setCopySuccess] = React.useState(false);

  const handleRound1Change = (round: Round) => {
    onClassChange({ ...classPlan, round1: round as Round & { number: 1 } });
  };

  const handleRound2Change = (round: Round) => {
    onClassChange({ ...classPlan, round2: round as Round & { number: 2 } });
  };

  const handleCopy = async () => {
    const success = await copyToClipboard(classPlan);
    if (success) {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const handleExport = () => {
    exportToXLSX(classPlan);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {formatClassTypeName(classPlan.classType)}
            </h2>
            <p className="text-gray-500">{formatDisplayDate(classPlan.date)}</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={isEditing ? 'primary' : 'outline'}
              size="sm"
              onClick={onToggleEdit}
            >
              {isEditing ? 'Done Editing' : 'Edit'}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleCopy}
            >
              {copySuccess ? 'Copied!' : 'Copy'}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleExport}
            >
              Export XLSX
            </Button>
            {onCompare && (
              <Button
                variant="secondary"
                size="sm"
                onClick={onCompare}
              >
                Compare
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
            >
              Reset
            </Button>
          </div>
        </div>
      </div>

      {/* Tread Average */}
      <TreadAverageIndicator
        average={classPlan.treadAverage}
        maxAverage={maxAverage}
      />

      {/* Rounds */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <RoundDisplay
          round={classPlan.round1}
          onRoundChange={handleRound1Change}
          isEditing={isEditing}
        />
        <RoundDisplay
          round={classPlan.round2}
          onRoundChange={handleRound2Change}
          isEditing={isEditing}
        />
      </div>

      {/* Save Button */}
      {isEditing && (
        <div className="flex justify-center">
          <Button onClick={onSave} size="lg">
            Save to History
          </Button>
        </div>
      )}
    </div>
  );
}
