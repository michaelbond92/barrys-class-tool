import React, { useState } from 'react';
import { ConfigPanel } from './ConfigPanel';
import { ClassPreview } from './ClassPreview';
import { useClassGenerator } from '../../hooks/useClassGenerator';
import { useClassHistory } from '../../hooks/useClassHistory';
import { calculateTreadAverage } from '../../services/treadParser';

export function ClassGenerator() {
  const { addToHistory } = useClassHistory();
  const {
    config,
    generatedClass,
    isGenerating,
    updateConfig,
    generate,
    setGeneratedClass,
    reset
  } = useClassGenerator();

  const [isEditing, setIsEditing] = useState(false);

  const handleGenerate = () => {
    generate();
    setIsEditing(false);
  };

  const handleClassChange = (updatedClass: typeof generatedClass) => {
    if (!updatedClass) return;

    // Recalculate tread average
    const allTreadEntries = [
      ...updatedClass.round1.tread,
      ...updatedClass.round2.tread
    ];
    const newAverage = calculateTreadAverage(allTreadEntries);

    setGeneratedClass({
      ...updatedClass,
      treadAverage: newAverage,
      updatedAt: new Date().toISOString()
    });
  };

  const handleSave = () => {
    if (!generatedClass) return;

    // Add to history
    addToHistory(generatedClass);

    setIsEditing(false);
  };

  const handleReset = () => {
    if (window.confirm('Discard this class and start over?')) {
      reset();
      setIsEditing(false);
    }
  };

  return (
    <div className="space-y-6">
      {!generatedClass ? (
        <>
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Class Generator</h1>
            <p className="text-gray-600 mt-2">
              Configure your class and generate a complete workout plan
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <ConfigPanel
              config={config}
              onConfigChange={updateConfig}
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
            />
          </div>
        </>
      ) : (
        <ClassPreview
          classPlan={generatedClass}
          onClassChange={handleClassChange}
          maxAverage={config.maxTreadAverage}
          isEditing={isEditing}
          onToggleEdit={() => setIsEditing(!isEditing)}
          onSave={handleSave}
          onReset={handleReset}
        />
      )}
    </div>
  );
}
