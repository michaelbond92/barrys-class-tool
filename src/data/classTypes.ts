import { ClassType, Equipment, ExerciseCategory } from '../types';

export interface ClassTypeConfig {
  id: ClassType;
  name: string;
  description: string;
  primaryCategories: ExerciseCategory[];
  secondaryCategories: ExerciseCategory[];
  suggestedEquipment: Equipment[];
}

export const CLASS_TYPE_CONFIGS: Record<ClassType, ClassTypeConfig> = {
  total_body: {
    id: 'total_body',
    name: 'Total Body',
    description: 'Full body workout targeting all muscle groups',
    primaryCategories: ['chest', 'back', 'legs'],
    secondaryCategories: ['shoulders', 'arms', 'core'],
    suggestedEquipment: ['2 Heavy Dumbbells', '2 Mediums']
  },
  chest_back_abs: {
    id: 'chest_back_abs',
    name: 'Chest, Back & Abs',
    description: 'Upper body push/pull with core focus',
    primaryCategories: ['chest', 'back'],
    secondaryCategories: ['core'],
    suggestedEquipment: ['2 Heavy Dumbbells', '2 Mediums']
  },
  arms_abs: {
    id: 'arms_abs',
    name: 'Arms & Abs',
    description: 'Biceps, triceps, shoulders with core work',
    primaryCategories: ['arms', 'shoulders'],
    secondaryCategories: ['core'],
    suggestedEquipment: ['2 Mediums', '2 Light Dumbbells']
  },
  legs_core: {
    id: 'legs_core',
    name: 'Legs & Core',
    description: 'Lower body strength with core stability',
    primaryCategories: ['legs'],
    secondaryCategories: ['core'],
    suggestedEquipment: ['2 Heavy Dumbbells', '2 Mediums']
  }
};

export const EQUIPMENT_OPTIONS: Equipment[] = [
  '2 Heavy Dumbbells',
  '2 Mediums',
  '2 Light Dumbbells',
  'Bodyweight'
];

export const DEFAULT_ROUND_DURATIONS = {
  round1: 12,
  round2: 8
};

export const DEFAULT_MAX_AVERAGE = 7.75;
