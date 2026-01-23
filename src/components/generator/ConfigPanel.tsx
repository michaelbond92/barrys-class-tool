import React from 'react';
import { GeneratorConfig, ClassType, Equipment } from '../../types';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { CLASS_TYPE_CONFIGS, EQUIPMENT_OPTIONS } from '../../data/classTypes';

interface ConfigPanelProps {
  config: GeneratorConfig;
  onConfigChange: (updates: Partial<GeneratorConfig>) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

const classTypeOptions = Object.values(CLASS_TYPE_CONFIGS).map(ct => ({
  value: ct.id,
  label: ct.name
}));

const equipmentOptions = EQUIPMENT_OPTIONS.map(eq => ({
  value: eq,
  label: eq
}));

export function ConfigPanel({
  config,
  onConfigChange,
  onGenerate,
  isGenerating
}: ConfigPanelProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Class Configuration</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Class Type */}
        <Select
          label="Class Type"
          options={classTypeOptions}
          value={config.classType}
          onChange={(val) => onConfigChange({ classType: val as ClassType })}
        />

        {/* Date */}
        <Input
          label="Date"
          type="date"
          value={config.date}
          onChange={(e) => onConfigChange({ date: e.target.value })}
        />

        {/* Round 1 Duration */}
        <Input
          label="Round 1 Duration (min)"
          type="number"
          min={5}
          max={20}
          value={config.round1Duration}
          onChange={(e) => onConfigChange({ round1Duration: parseInt(e.target.value) || 12 })}
        />

        {/* Round 2 Duration */}
        <Input
          label="Round 2 Duration (min)"
          type="number"
          min={5}
          max={20}
          value={config.round2Duration}
          onChange={(e) => onConfigChange({ round2Duration: parseInt(e.target.value) || 8 })}
        />

        {/* Round 1 Equipment */}
        <Select
          label="Round 1 Equipment"
          options={equipmentOptions}
          value={config.round1Equipment}
          onChange={(val) => onConfigChange({ round1Equipment: val as Equipment })}
        />

        {/* Round 2 Equipment */}
        <Select
          label="Round 2 Equipment"
          options={equipmentOptions}
          value={config.round2Equipment}
          onChange={(val) => onConfigChange({ round2Equipment: val as Equipment })}
        />

        {/* Max Tread Average */}
        <Input
          label="Max Tread Average"
          type="number"
          min={5}
          max={10}
          step={0.25}
          value={config.maxTreadAverage}
          onChange={(e) => onConfigChange({ maxTreadAverage: parseFloat(e.target.value) || 7.75 })}
        />
      </div>

      <div className="mt-6">
        <Button
          onClick={onGenerate}
          disabled={isGenerating}
          className="w-full"
          size="lg"
        >
          {isGenerating ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Generating...
            </span>
          ) : (
            'Generate Class'
          )}
        </Button>
      </div>
    </div>
  );
}
