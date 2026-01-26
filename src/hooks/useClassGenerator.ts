import { useState, useCallback } from 'react';
import { ClassPlan, GeneratorConfig } from '../types';
import { generateClassFromBlocks, createDefaultConfig } from '../services/blockBasedGenerator';
import { generateClassFromExercises } from '../services/exerciseBasedGenerator';
import { calculateTreadAverage } from '../services/treadParser';

export type GenerationMode = 'blocks' | 'exercises';

export interface UseClassGeneratorReturn {
  config: GeneratorConfig;
  generatedClass: ClassPlan | null;
  isGenerating: boolean;
  generationMode: GenerationMode;
  setGenerationMode: (mode: GenerationMode) => void;
  updateConfig: (updates: Partial<GeneratorConfig>) => void;
  generate: () => ClassPlan;
  setGeneratedClass: (classPlan: ClassPlan | null) => void;
  updateClassPlan: (updates: Partial<ClassPlan>) => void;
  recalculateAverage: () => void;
  reset: () => void;
}

export function useClassGenerator(): UseClassGeneratorReturn {
  const [config, setConfig] = useState<GeneratorConfig>(createDefaultConfig);
  const [generatedClass, setGeneratedClass] = useState<ClassPlan | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationMode, setGenerationMode] = useState<GenerationMode>('exercises');

  const updateConfig = useCallback((updates: Partial<GeneratorConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  }, []);

  const generate = useCallback(() => {
    setIsGenerating(true);
    try {
      // Use the appropriate generator based on mode
      const classPlan = generationMode === 'exercises'
        ? generateClassFromExercises(config)
        : generateClassFromBlocks(config);
      setGeneratedClass(classPlan);
      return classPlan;
    } finally {
      setIsGenerating(false);
    }
  }, [config, generationMode]);

  const updateClassPlan = useCallback((updates: Partial<ClassPlan>) => {
    setGeneratedClass(prev => {
      if (!prev) return null;
      return {
        ...prev,
        ...updates,
        updatedAt: new Date().toISOString()
      };
    });
  }, []);

  const recalculateAverage = useCallback(() => {
    if (!generatedClass) return;

    const allTreadEntries = [
      ...generatedClass.round1.tread,
      ...generatedClass.round2.tread
    ];
    const newAverage = calculateTreadAverage(allTreadEntries);

    setGeneratedClass(prev => {
      if (!prev) return null;
      return {
        ...prev,
        treadAverage: newAverage,
        updatedAt: new Date().toISOString()
      };
    });
  }, [generatedClass]);

  const reset = useCallback(() => {
    setConfig(createDefaultConfig());
    setGeneratedClass(null);
  }, []);

  return {
    config,
    generatedClass,
    isGenerating,
    generationMode,
    setGenerationMode,
    updateConfig,
    generate,
    setGeneratedClass,
    updateClassPlan,
    recalculateAverage,
    reset
  };
}
