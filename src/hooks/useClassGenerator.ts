import { useState, useCallback } from 'react';
import { ClassPlan, GeneratorConfig } from '../types';
import { generateClassFromBlocks, createDefaultConfig } from '../services/blockBasedGenerator';
import { calculateTreadAverage } from '../services/treadParser';

export interface UseClassGeneratorReturn {
  config: GeneratorConfig;
  generatedClass: ClassPlan | null;
  isGenerating: boolean;
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

  const updateConfig = useCallback((updates: Partial<GeneratorConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  }, []);

  const generate = useCallback(() => {
    setIsGenerating(true);
    try {
      const classPlan = generateClassFromBlocks(config);
      setGeneratedClass(classPlan);
      return classPlan;
    } finally {
      setIsGenerating(false);
    }
  }, [config]);

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
    updateConfig,
    generate,
    setGeneratedClass,
    updateClassPlan,
    recalculateAverage,
    reset
  };
}
