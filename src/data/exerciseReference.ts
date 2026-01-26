// ============================================================================
// Exercise Reference
// Curated exercise database with correct tagging for Barry's classes
//
// This file contains researched, accurate exercise metadata.
// Use TagValidationGame to verify and refine these tags with user feedback.
// ============================================================================

import { ExercisePosition, MovementPattern, MuscleGroup } from './types';

export interface ExerciseDefinition {
  id: string;
  name: string;
  aliases: string[];           // Other names/abbreviations
  position: ExercisePosition;
  secondaryPosition?: ExercisePosition;  // For combo moves
  movementPattern: MovementPattern;
  secondaryPattern?: MovementPattern;    // For combo moves
  primaryMuscles: MuscleGroup[];         // Can have multiple primary targets
  secondaryMuscles: MuscleGroup[];
  gripDemand: 'high' | 'medium' | 'low' | 'none';
  isCompound: boolean;
  isPower: boolean;
  isFinisher: boolean;
  isWarmup: boolean;
  equipment: string[];
  description: string;
  cues: string[];              // Coaching cues
  status: 'verified' | 'needs_review' | 'unverified';
}

// ============================================================================
// WARMUP EXERCISES
// ============================================================================

export const WARMUP_EXERCISES: ExerciseDefinition[] = [
  {
    id: 'wgs',
    name: "World's Greatest Stretch",
    aliases: ['WGS', 'Worlds Greatest'],
    position: 'floor_laying',
    movementPattern: 'lunge',
    primaryMuscles: ['full_body'],
    secondaryMuscles: ['glutes', 'hamstrings', 'shoulders'],
    gripDemand: 'none',
    isCompound: true,
    isPower: false,
    isFinisher: false,
    isWarmup: true,
    equipment: [],
    description: 'Deep lunge with rotation. Opens hips, thoracic spine, and shoulders.',
    cues: ['Front knee over ankle', 'Rotate and reach toward ceiling', 'Keep back leg straight'],
    status: 'verified',
  },
  {
    id: 'gms',
    name: 'Good Morning Stretch',
    aliases: ['GMS', 'Good Morning'],
    position: 'floor_standing',
    movementPattern: 'hinge',
    primaryMuscles: ['hamstrings'],
    secondaryMuscles: ['back', 'glutes'],
    gripDemand: 'none',
    isCompound: false,
    isPower: false,
    isFinisher: false,
    isWarmup: true,
    equipment: [],
    description: 'Hip hinge with straight legs to stretch hamstrings and lower back.',
    cues: ['Soft knees', 'Hinge at hips', 'Flat back'],
    status: 'verified',
  },
  {
    id: 'cat_cow',
    name: 'Cat Cow',
    aliases: ['Cat/Cow', 'Cat-Cow'],
    position: 'floor_laying',
    movementPattern: 'plank',
    primaryMuscles: ['back'],
    secondaryMuscles: ['core'],
    gripDemand: 'none',
    isCompound: false,
    isPower: false,
    isFinisher: false,
    isWarmup: true,
    equipment: [],
    description: 'Spinal flexion and extension on hands and knees.',
    cues: ['Round spine for cat', 'Arch for cow', 'Move with breath'],
    status: 'verified',
  },
  {
    id: 'inchworm',
    name: 'Inchworm',
    aliases: ['Inch Worm'],
    position: 'floor_laying',
    movementPattern: 'plank',
    primaryMuscles: ['core'],
    secondaryMuscles: ['shoulders', 'hamstrings'],
    gripDemand: 'low',
    isCompound: true,
    isPower: false,
    isFinisher: false,
    isWarmup: true,
    equipment: [],
    description: 'Walk hands out to plank, walk feet to hands.',
    cues: ['Keep legs straight', 'Walk hands out to plank', 'Engage core'],
    status: 'verified',
  },
];

// ============================================================================
// PUSH EXERCISES
// ============================================================================

export const PUSH_EXERCISES: ExerciseDefinition[] = [
  {
    id: 'chest_press',
    name: 'Chest Press',
    aliases: ['Bench Press', 'DB Chest Press', 'Dumbbell Press'],
    position: 'bench_laying',
    movementPattern: 'push',
    primaryMuscles: ['chest'],
    secondaryMuscles: ['triceps', 'shoulders'],
    gripDemand: 'medium',
    isCompound: true,
    isPower: false,
    isFinisher: false,
    isWarmup: false,
    equipment: ['2 Heavy Dumbbells', '2 Mediums'],
    description: 'Lying on bench, press dumbbells up from chest.',
    cues: ['Feet flat on floor', 'Shoulders back', 'Control the descent'],
    status: 'verified',
  },
  {
    id: 'incline_press',
    name: 'Incline Press',
    aliases: ['Incline Chest Press', 'Incline DB Press'],
    position: 'bench_laying',
    movementPattern: 'push',
    primaryMuscles: ['chest'],
    secondaryMuscles: ['shoulders', 'triceps'],
    gripDemand: 'medium',
    isCompound: true,
    isPower: false,
    isFinisher: false,
    isWarmup: false,
    equipment: ['2 Heavy Dumbbells', '2 Mediums'],
    description: 'Chest press on inclined bench, targets upper chest.',
    cues: ['One riser under bench head', 'Press at angle', 'Squeeze at top'],
    status: 'verified',
  },
  {
    id: 'pushup',
    name: 'Push Up',
    aliases: ['Pushup', 'Push-up', 'Press Up'],
    position: 'floor_laying',
    movementPattern: 'push',
    primaryMuscles: ['chest'],
    secondaryMuscles: ['triceps', 'shoulders', 'core'],
    gripDemand: 'low',
    isCompound: true,
    isPower: false,
    isFinisher: false,
    isWarmup: false,
    equipment: [],
    description: 'Classic floor push movement.',
    cues: ['Hands under shoulders', 'Core tight', 'Full range of motion'],
    status: 'verified',
  },
  {
    id: 'shoulder_press',
    name: 'Shoulder Press',
    aliases: ['OH Press', 'Overhead Press', 'Military Press'],
    position: 'floor_standing',
    secondaryPosition: 'bench_sitting',
    movementPattern: 'push',
    primaryMuscles: ['shoulders'],
    secondaryMuscles: ['triceps', 'core'],
    gripDemand: 'medium',
    isCompound: true,
    isPower: false,
    isFinisher: false,
    isWarmup: false,
    equipment: ['2 Mediums', '2 Heavy Dumbbells'],
    description: 'Press dumbbells overhead from shoulder height.',
    cues: ['Core engaged', 'Press straight up', 'Dont arch back'],
    status: 'verified',
  },
  {
    id: 'skull_crusher',
    name: 'Skull Crusher',
    aliases: ['Skull Crushers', 'Lying Tricep Extension'],
    position: 'bench_laying',
    movementPattern: 'push',
    primaryMuscles: ['triceps'],
    secondaryMuscles: [],
    gripDemand: 'medium',
    isCompound: false,
    isPower: false,
    isFinisher: false,
    isWarmup: false,
    equipment: ['2 Mediums', '1 Heavy'],
    description: 'Lying tricep extension, lower weight toward forehead.',
    cues: ['Keep elbows still', 'Lower to forehead', 'Squeeze at top'],
    status: 'verified',
  },
  {
    id: 'tricep_extension',
    name: 'Tricep Extension',
    aliases: ['OH Tricep', 'Overhead Extension'],
    position: 'floor_standing',
    secondaryPosition: 'bench_sitting',
    movementPattern: 'push',
    primaryMuscles: ['triceps'],
    secondaryMuscles: [],
    gripDemand: 'medium',
    isCompound: false,
    isPower: false,
    isFinisher: false,
    isWarmup: false,
    equipment: ['1 Heavy', '2 Mediums'],
    description: 'Overhead tricep extension with dumbbell behind head.',
    cues: ['Elbows close to ears', 'Extend fully', 'Control the weight'],
    status: 'verified',
  },
  {
    id: 'tricep_kickback',
    name: 'Tricep Kickback',
    aliases: ['Kickback', 'DB Kickback'],
    position: 'floor_standing',
    secondaryPosition: 'bench_laying',
    movementPattern: 'push',
    primaryMuscles: ['triceps'],
    secondaryMuscles: [],
    gripDemand: 'medium',
    isCompound: false,
    isPower: false,
    isFinisher: false,
    isWarmup: false,
    equipment: ['2 Mediums'],
    description: 'Hinged forward, extend arms back.',
    cues: ['Hinge at hips', 'Upper arm parallel to floor', 'Squeeze at extension'],
    status: 'verified',
  },
];

// ============================================================================
// PULL EXERCISES
// ============================================================================

export const PULL_EXERCISES: ExerciseDefinition[] = [
  {
    id: 'row',
    name: 'Row',
    aliases: ['Bent Over Row', 'DB Row', 'BO Row'],
    position: 'floor_standing',
    movementPattern: 'pull',
    primaryMuscles: ['back'],
    secondaryMuscles: ['biceps'],
    gripDemand: 'high',
    isCompound: true,
    isPower: false,
    isFinisher: false,
    isWarmup: false,
    equipment: ['2 Heavy Dumbbells', '2 Mediums'],
    description: 'Hinged forward, pull weights to hips.',
    cues: ['Flat back', 'Drive elbows back', 'Squeeze shoulder blades'],
    status: 'verified',
  },
  {
    id: 'renegade_row',
    name: 'Renegade Row',
    aliases: ['RR', 'Plank Row'],
    position: 'floor_laying',
    movementPattern: 'pull',
    primaryMuscles: ['back', 'core'],
    secondaryMuscles: ['biceps'],
    gripDemand: 'high',
    isCompound: true,
    isPower: false,
    isFinisher: false,
    isWarmup: false,
    equipment: ['2 Mediums'],
    description: 'Plank position, alternating rows.',
    cues: ['Minimize hip rotation', 'Wide feet for stability', 'Core tight'],
    status: 'verified',
  },
  {
    id: 'bicep_curl',
    name: 'Bicep Curl',
    aliases: ['Curl', 'DB Curl', 'Dumbbell Curl'],
    position: 'floor_standing',
    movementPattern: 'pull',
    primaryMuscles: ['biceps'],
    secondaryMuscles: [],
    gripDemand: 'high',
    isCompound: false,
    isPower: false,
    isFinisher: false,
    isWarmup: false,
    equipment: ['2 Mediums', '2 Heavy Dumbbells'],
    description: 'Standing curl, palms up.',
    cues: ['Elbows at sides', 'Full range', 'Control the negative'],
    status: 'verified',
  },
  {
    id: 'hammer_curl',
    name: 'Hammer Curl',
    aliases: ['Hammer', 'Neutral Grip Curl'],
    position: 'floor_standing',
    movementPattern: 'pull',
    primaryMuscles: ['biceps'],
    secondaryMuscles: [],
    gripDemand: 'high',
    isCompound: false,
    isPower: false,
    isFinisher: false,
    isWarmup: false,
    equipment: ['2 Mediums'],
    description: 'Curl with neutral (hammer) grip.',
    cues: ['Palms facing each other', 'Elbows steady', 'Squeeze at top'],
    status: 'verified',
  },
  {
    id: 'pullover',
    name: 'Pullover',
    aliases: ['Lat Pullover', 'DB Pullover'],
    position: 'bench_laying',
    movementPattern: 'pull',
    primaryMuscles: ['back'],
    secondaryMuscles: ['chest', 'triceps'],
    gripDemand: 'medium',
    isCompound: true,
    isPower: false,
    isFinisher: false,
    isWarmup: false,
    equipment: ['1 Heavy'],
    description: 'Lying on bench, arc weight overhead and back.',
    cues: ['Slight elbow bend', 'Feel the stretch', 'Pull with lats'],
    status: 'verified',
  },
  {
    id: 'upright_row',
    name: 'Upright Row',
    aliases: ['High Pull', 'Hi Pull'],
    position: 'floor_standing',
    movementPattern: 'pull',
    primaryMuscles: ['shoulders', 'back'],
    secondaryMuscles: ['biceps'],
    gripDemand: 'high',
    isCompound: true,
    isPower: false,
    isFinisher: false,
    isWarmup: false,
    equipment: ['2 Mediums'],
    description: 'Pull weights up along body to chest height.',
    cues: ['Elbows high', 'Lead with elbows', 'Control down'],
    status: 'verified',
  },
  {
    id: 'reverse_fly',
    name: 'Reverse Fly',
    aliases: ['Rear Delt Fly', 'Bent Over Fly'],
    position: 'floor_standing',
    movementPattern: 'pull',
    primaryMuscles: ['back'],
    secondaryMuscles: ['shoulders'],
    gripDemand: 'medium',
    isCompound: false,
    isPower: false,
    isFinisher: false,
    isWarmup: false,
    equipment: ['2 Mediums'],
    description: 'Hinged forward, fly arms out to sides.',
    cues: ['Slight elbow bend', 'Squeeze shoulder blades', 'Control the movement'],
    status: 'verified',
  },
];

// ============================================================================
// HINGE EXERCISES
// ============================================================================

export const HINGE_EXERCISES: ExerciseDefinition[] = [
  {
    id: 'deadlift',
    name: 'Deadlift',
    aliases: ['DL', 'DB Deadlift', 'Dumbbell Deadlift'],
    position: 'floor_standing',
    movementPattern: 'hinge',
    primaryMuscles: ['hamstrings', 'glutes', 'back'],
    secondaryMuscles: [],
    gripDemand: 'high',
    isCompound: true,
    isPower: false,
    isFinisher: false,
    isWarmup: false,
    equipment: ['2 Heavy Dumbbells'],
    description: 'Hip hinge to lower and lift weights.',
    cues: ['Flat back', 'Hinge at hips', 'Drive through heels'],
    status: 'verified',
  },
  {
    id: 'rdl',
    name: 'Romanian Deadlift',
    aliases: ['RDL', 'Stiff Leg Deadlift'],
    position: 'floor_standing',
    movementPattern: 'hinge',
    primaryMuscles: ['hamstrings'],
    secondaryMuscles: ['glutes', 'back'],
    gripDemand: 'high',
    isCompound: true,
    isPower: false,
    isFinisher: false,
    isWarmup: false,
    equipment: ['2 Heavy Dumbbells'],
    description: 'Deadlift variation with straighter legs.',
    cues: ['Soft knees', 'Push hips back', 'Feel hamstring stretch'],
    status: 'verified',
  },
  {
    id: 'sdl',
    name: 'Single Leg Deadlift',
    aliases: ['SDL', 'SL Deadlift', '1 Leg Deadlift'],
    position: 'floor_standing',
    movementPattern: 'hinge',
    primaryMuscles: ['hamstrings'],
    secondaryMuscles: ['glutes', 'back', 'core'],
    gripDemand: 'high',
    isCompound: true,
    isPower: false,
    isFinisher: false,
    isWarmup: false,
    equipment: ['2 Mediums', '1 Heavy'],
    description: 'Deadlift on one leg for balance challenge.',
    cues: ['Hinge with flat back', 'Back leg extends behind', 'Core tight for balance'],
    status: 'verified',
  },
  {
    id: 'db_swing',
    name: 'Dumbbell Swing',
    aliases: ['DB Swing', 'Swing', 'KB Swing'],
    position: 'floor_standing',
    movementPattern: 'hinge',
    primaryMuscles: ['glutes'],
    secondaryMuscles: ['hamstrings', 'shoulders', 'core'],
    gripDemand: 'high',
    isCompound: true,
    isPower: true,
    isFinisher: true,
    isWarmup: false,
    equipment: ['1 Heavy'],
    description: 'Explosive hip hinge swinging weight.',
    cues: ['Power from hips', 'Arms are just along for ride', 'Squeeze glutes at top'],
    status: 'verified',
  },
];

// ============================================================================
// SQUAT EXERCISES
// ============================================================================

export const SQUAT_EXERCISES: ExerciseDefinition[] = [
  {
    id: 'squat',
    name: 'Squat',
    aliases: ['Air Squat', 'Bodyweight Squat'],
    position: 'floor_standing',
    movementPattern: 'squat',
    primaryMuscles: ['quads', 'glutes'],
    secondaryMuscles: ['hamstrings'],
    gripDemand: 'none',
    isCompound: true,
    isPower: false,
    isFinisher: false,
    isWarmup: false,
    equipment: [],
    description: 'Basic squat movement.',
    cues: ['Feet shoulder width', 'Knees track over toes', 'Depth below parallel'],
    status: 'verified',
  },
  {
    id: 'goblet_squat',
    name: 'Goblet Squat',
    aliases: ['Goblet', 'DB Squat'],
    position: 'floor_standing',
    movementPattern: 'squat',
    primaryMuscles: ['quads'],
    secondaryMuscles: ['glutes', 'core'],
    gripDemand: 'medium',
    isCompound: true,
    isPower: false,
    isFinisher: false,
    isWarmup: false,
    equipment: ['1 Heavy'],
    description: 'Squat holding dumbbell at chest.',
    cues: ['Hold weight at chest', 'Elbows inside knees', 'Upright torso'],
    status: 'verified',
  },
  {
    id: 'sumo_squat',
    name: 'Sumo Squat',
    aliases: ['Wide Squat', 'Sumo'],
    position: 'floor_standing',
    movementPattern: 'squat',
    primaryMuscles: ['glutes', 'hamstrings'],
    secondaryMuscles: ['quads'],
    gripDemand: 'low',
    isCompound: true,
    isPower: false,
    isFinisher: false,
    isWarmup: false,
    equipment: ['1 Heavy'],
    description: 'Wide stance squat targeting glutes.',
    cues: ['Wide stance', 'Toes out 45 degrees', 'Knees track over toes'],
    status: 'verified',
  },
];

// ============================================================================
// LUNGE EXERCISES
// ============================================================================

export const LUNGE_EXERCISES: ExerciseDefinition[] = [
  {
    id: 'lunge',
    name: 'Lunge',
    aliases: ['Forward Lunge', 'Static Lunge'],
    position: 'floor_standing',
    movementPattern: 'lunge',
    primaryMuscles: ['quads', 'glutes'],
    secondaryMuscles: ['hamstrings'],
    gripDemand: 'low',
    isCompound: true,
    isPower: false,
    isFinisher: false,
    isWarmup: false,
    equipment: ['2 Heavy Dumbbells', '2 Mediums'],
    description: 'Step forward into lunge position.',
    cues: ['90 degree angles', 'Front knee over ankle', 'Upright torso'],
    status: 'verified',
  },
  {
    id: 'reverse_lunge',
    name: 'Reverse Lunge',
    aliases: ['Backward Lunge', 'Step Back Lunge'],
    position: 'floor_standing',
    movementPattern: 'lunge',
    primaryMuscles: ['glutes', 'hamstrings'],
    secondaryMuscles: ['quads'],
    gripDemand: 'low',
    isCompound: true,
    isPower: false,
    isFinisher: false,
    isWarmup: false,
    equipment: ['2 Heavy Dumbbells', '2 Mediums'],
    description: 'Step backward into lunge.',
    cues: ['Step back', 'Drop back knee', 'Drive through front heel'],
    status: 'verified',
  },
  {
    id: 'curtsy_lunge',
    name: 'Curtsy Lunge',
    aliases: ['Curtsy', 'Crossover Lunge'],
    position: 'floor_standing',
    movementPattern: 'lunge',
    primaryMuscles: ['glutes'],
    secondaryMuscles: ['quads'],
    gripDemand: 'low',
    isCompound: true,
    isPower: false,
    isFinisher: false,
    isWarmup: false,
    equipment: ['2 Mediums'],
    description: 'Lunge with back leg crossing behind.',
    cues: ['Cross behind', 'Keep hips square', 'Feel outer glute'],
    status: 'verified',
  },
  {
    id: 'lateral_lunge',
    name: 'Lateral Lunge',
    aliases: ['Side Lunge'],
    position: 'floor_standing',
    movementPattern: 'lunge',
    primaryMuscles: ['quads'],
    secondaryMuscles: ['glutes', 'hamstrings'],
    gripDemand: 'low',
    isCompound: true,
    isPower: false,
    isFinisher: false,
    isWarmup: false,
    equipment: ['2 Mediums'],
    description: 'Step sideways into lunge.',
    cues: ['Push hips back', 'Straight trailing leg', 'Return to center'],
    status: 'verified',
  },
];

// ============================================================================
// POWER EXERCISES
// ============================================================================

export const POWER_EXERCISES: ExerciseDefinition[] = [
  {
    id: 'snatch',
    name: 'Snatch',
    aliases: ['DB Snatch', 'Dumbbell Snatch'],
    position: 'floor_standing',
    movementPattern: 'power',
    primaryMuscles: ['full_body'],
    secondaryMuscles: ['shoulders', 'glutes', 'core'],
    gripDemand: 'high',
    isCompound: true,
    isPower: true,
    isFinisher: true,
    isWarmup: false,
    equipment: ['1 Heavy', '2 Mediums'],
    description: 'Explosive lift from floor to overhead in one motion.',
    cues: ['Drive from legs', 'Pull weight close to body', 'Punch overhead'],
    status: 'verified',
  },
  {
    id: 'clean',
    name: 'Clean',
    aliases: ['DB Clean', 'Dumbbell Clean'],
    position: 'floor_standing',
    movementPattern: 'power',
    primaryMuscles: ['full_body'],
    secondaryMuscles: ['glutes', 'back', 'shoulders'],
    gripDemand: 'high',
    isCompound: true,
    isPower: true,
    isFinisher: true,
    isWarmup: false,
    equipment: ['2 Heavy Dumbbells', '2 Mediums'],
    description: 'Explosive lift from floor to rack position.',
    cues: ['Hip drive', 'Elbows high and fast', 'Catch at shoulders'],
    status: 'verified',
  },
  {
    id: 'clean_to_press',
    name: 'Clean to Press',
    aliases: ['Clean and Press', 'Clean & Press'],
    position: 'floor_standing',
    movementPattern: 'power',
    secondaryPattern: 'push',
    primaryMuscles: ['full_body'],
    secondaryMuscles: ['shoulders', 'glutes', 'core'],
    gripDemand: 'high',
    isCompound: true,
    isPower: true,
    isFinisher: true,
    isWarmup: false,
    equipment: ['2 Mediums'],
    description: 'Clean to rack then press overhead.',
    cues: ['Explosive clean', 'Catch at shoulders', 'Press up'],
    status: 'verified',
  },
  {
    id: 'thruster',
    name: 'Thruster',
    aliases: ['Squat to Press', 'Squat Press'],
    position: 'floor_standing',
    movementPattern: 'power',
    secondaryPattern: 'squat',
    primaryMuscles: ['full_body'],
    secondaryMuscles: ['quads', 'shoulders', 'core'],
    gripDemand: 'medium',
    isCompound: true,
    isPower: true,
    isFinisher: true,
    isWarmup: false,
    equipment: ['2 Mediums'],
    description: 'Squat with press at the top.',
    cues: ['Deep squat', 'Drive up explosively', 'Press as you stand'],
    status: 'verified',
  },
  {
    id: 'burpee',
    name: 'Burpee',
    aliases: ['Burpees'],
    position: 'floor_laying',
    secondaryPosition: 'floor_standing',
    movementPattern: 'power',
    primaryMuscles: ['full_body'],
    secondaryMuscles: ['chest', 'core', 'quads'],
    gripDemand: 'low',
    isCompound: true,
    isPower: true,
    isFinisher: true,
    isWarmup: false,
    equipment: [],
    description: 'Drop to pushup, jump up.',
    cues: ['Chest to floor', 'Jump feet to hands', 'Jump up with arms overhead'],
    status: 'verified',
  },
  {
    id: 'squat_to_hi_pull',
    name: 'Squat to High Pull',
    aliases: ['Squat to Hi Pull', 'Squat Hi Pull'],
    position: 'floor_standing',
    movementPattern: 'power',
    secondaryPattern: 'squat',
    primaryMuscles: ['full_body'],
    secondaryMuscles: ['quads', 'shoulders', 'back'],
    gripDemand: 'high',
    isCompound: true,
    isPower: true,
    isFinisher: true,
    isWarmup: false,
    equipment: ['2 Mediums'],
    description: 'Squat with high pull at standing.',
    cues: ['Deep squat', 'Explosive stand', 'Elbows high on pull'],
    status: 'verified',
  },
];

// ============================================================================
// CORE EXERCISES
// ============================================================================

export const CORE_EXERCISES: ExerciseDefinition[] = [
  {
    id: 'plank',
    name: 'Plank',
    aliases: ['High Plank', 'Forearm Plank'],
    position: 'floor_laying',
    movementPattern: 'plank',
    primaryMuscles: ['core'],
    secondaryMuscles: ['shoulders'],
    gripDemand: 'none',
    isCompound: false,
    isPower: false,
    isFinisher: false,
    isWarmup: false,
    equipment: [],
    description: 'Isometric core hold.',
    cues: ['Shoulders over wrists', 'Flat back', 'Engage glutes'],
    status: 'verified',
  },
  {
    id: 'mountain_climber',
    name: 'Mountain Climber',
    aliases: ['MC', 'Mountain Climbers'],
    position: 'floor_laying',
    movementPattern: 'plank',
    primaryMuscles: ['core'],
    secondaryMuscles: ['shoulders', 'quads'],
    gripDemand: 'low',
    isCompound: true,
    isPower: false,
    isFinisher: false,
    isWarmup: false,
    equipment: [],
    description: 'Plank with alternating knee drives.',
    cues: ['High plank position', 'Drive knees to chest', 'Keep hips down'],
    status: 'verified',
  },
  {
    id: 'russian_twist',
    name: 'Russian Twist',
    aliases: ['Twist', 'Seated Twist'],
    position: 'bench_sitting',
    movementPattern: 'rotation',
    primaryMuscles: ['obliques', 'core'],
    secondaryMuscles: [],
    gripDemand: 'medium',
    isCompound: false,
    isPower: false,
    isFinisher: false,
    isWarmup: false,
    equipment: ['1 Medium'],
    description: 'Seated rotation with weight.',
    cues: ['Lean back slightly', 'Rotate from core', 'Touch weight to floor each side'],
    status: 'verified',
  },
  {
    id: 'crunch',
    name: 'Crunch',
    aliases: ['Crunches', 'Ab Crunch'],
    position: 'bench_laying',
    movementPattern: 'plank',
    primaryMuscles: ['core'],
    secondaryMuscles: [],
    gripDemand: 'none',
    isCompound: false,
    isPower: false,
    isFinisher: false,
    isWarmup: false,
    equipment: [],
    description: 'Basic abdominal crunch.',
    cues: ['Hands behind head', 'Lift shoulders', 'No neck strain'],
    status: 'verified',
  },
  {
    id: 'situp',
    name: 'Sit Up',
    aliases: ['Situp', 'Sit-up'],
    position: 'bench_sitting',
    movementPattern: 'plank',
    primaryMuscles: ['core'],
    secondaryMuscles: ['hip_flexors'],
    gripDemand: 'none',
    isCompound: false,
    isPower: false,
    isFinisher: false,
    isWarmup: false,
    equipment: [],
    description: 'Full sit up movement.',
    cues: ['Anchor feet', 'Roll up', 'Touch toes at top'],
    status: 'verified',
  },
  {
    id: 'toe_touch',
    name: 'Toe Touch',
    aliases: ['Toe Touches', 'V-Up Toe Touch'],
    position: 'bench_laying',
    movementPattern: 'plank',
    primaryMuscles: ['core'],
    secondaryMuscles: [],
    gripDemand: 'none',
    isCompound: false,
    isPower: false,
    isFinisher: false,
    isWarmup: false,
    equipment: [],
    description: 'Lying on back, reach for toes.',
    cues: ['Legs straight up', 'Reach for toes', 'Shoulder blades off bench'],
    status: 'verified',
  },
  {
    id: 'jacknife',
    name: 'Jacknife',
    aliases: ['Jackknife', 'V-Up'],
    position: 'bench_laying',
    movementPattern: 'plank',
    primaryMuscles: ['core'],
    secondaryMuscles: [],
    gripDemand: 'none',
    isCompound: false,
    isPower: false,
    isFinisher: false,
    isWarmup: false,
    equipment: [],
    description: 'Arms and legs meet in V position.',
    cues: ['Start flat', 'V-shape at top', 'Control down'],
    status: 'verified',
  },
  {
    id: 'dead_bug',
    name: 'Dead Bug',
    aliases: ['Deadbug'],
    position: 'bench_laying',
    movementPattern: 'plank',
    primaryMuscles: ['core'],
    secondaryMuscles: [],
    gripDemand: 'none',
    isCompound: false,
    isPower: false,
    isFinisher: false,
    isWarmup: false,
    equipment: [],
    description: 'Opposite arm and leg extension while on back.',
    cues: ['Back flat on bench', 'Extend opposite arm and leg', 'Control the movement'],
    status: 'verified',
  },
  {
    id: 'commando',
    name: 'Commando',
    aliases: ['Commandos', 'Up Downs'],
    position: 'floor_laying',
    movementPattern: 'plank',
    primaryMuscles: ['core'],
    secondaryMuscles: ['shoulders', 'triceps'],
    gripDemand: 'low',
    isCompound: true,
    isPower: false,
    isFinisher: false,
    isWarmup: false,
    equipment: [],
    description: 'Alternate between forearm and high plank.',
    cues: ['Minimize hip sway', 'Alternate leading arm', 'Core tight'],
    status: 'verified',
  },
];

// ============================================================================
// ALL EXERCISES COMBINED
// ============================================================================

export const ALL_EXERCISES: ExerciseDefinition[] = [
  ...WARMUP_EXERCISES,
  ...PUSH_EXERCISES,
  ...PULL_EXERCISES,
  ...HINGE_EXERCISES,
  ...SQUAT_EXERCISES,
  ...LUNGE_EXERCISES,
  ...POWER_EXERCISES,
  ...CORE_EXERCISES,
];

// ============================================================================
// EXERCISE SUBSTITUTION CLASSES
// Exercises within the same class can be swapped for variety while
// maintaining block structure and flow
// ============================================================================

export interface SubstitutionClass {
  id: string;
  name: string;
  description: string;
  exerciseIds: string[];
  constraints?: {
    samePosition?: boolean;     // Must match position
    sameEquipment?: boolean;    // Must match equipment type
  };
}

export const SUBSTITUTION_CLASSES: SubstitutionClass[] = [
  // Hinge variations (floor standing, posterior chain)
  {
    id: 'hinge_bilateral',
    name: 'Bilateral Hinges',
    description: 'Two-leg hip hinge movements',
    exerciseIds: ['deadlift', 'rdl', 'sdl', 'good_morning'],
    constraints: { samePosition: true },
  },
  {
    id: 'hinge_power',
    name: 'Power Hinges',
    description: 'Explosive hip-driven movements',
    exerciseIds: ['snatch', 'clean', 'db_swing'],
    constraints: { samePosition: true },
  },

  // Squat variations
  {
    id: 'squat_bilateral',
    name: 'Bilateral Squats',
    description: 'Two-leg squat variations',
    exerciseIds: ['squat', 'goblet_squat', 'sumo_squat'],
    constraints: { samePosition: true },
  },

  // Lunge variations
  {
    id: 'lunge_forward',
    name: 'Forward Lunges',
    description: 'Forward-stepping lunge variations',
    exerciseIds: ['lunge', 'curtsy_lunge'],
    constraints: { samePosition: true },
  },
  {
    id: 'lunge_reverse',
    name: 'Reverse Lunges',
    description: 'Backward-stepping lunge variations',
    exerciseIds: ['reverse_lunge'],
    constraints: { samePosition: true },
  },

  // Chest press variations (bench)
  {
    id: 'chest_press',
    name: 'Chest Press',
    description: 'Horizontal pressing on bench',
    exerciseIds: ['chest_press', 'incline_press', 'chest_fly'],
    constraints: { samePosition: true },
  },

  // Row variations
  {
    id: 'row_standing',
    name: 'Standing Rows',
    description: 'Standing pulling movements',
    exerciseIds: ['row', 'upright_row', 'reverse_fly'],
    constraints: { samePosition: true },
  },
  {
    id: 'row_floor',
    name: 'Floor Rows',
    description: 'Floor-based pulling',
    exerciseIds: ['renegade_row'],
    constraints: { samePosition: true },
  },

  // Shoulder press variations
  {
    id: 'shoulder_press',
    name: 'Shoulder Press',
    description: 'Vertical pressing movements',
    exerciseIds: ['shoulder_press'],
    constraints: { samePosition: true },
  },

  // Bicep variations
  {
    id: 'bicep_curl',
    name: 'Bicep Curls',
    description: 'Elbow flexion movements',
    exerciseIds: ['bicep_curl', 'hammer_curl'],
    constraints: { samePosition: true },
  },

  // Tricep variations
  {
    id: 'tricep_extension',
    name: 'Tricep Extensions',
    description: 'Elbow extension movements',
    exerciseIds: ['tricep_extension', 'tricep_kickback', 'skull_crusher'],
    constraints: { samePosition: false }, // These are different positions
  },

  // Core - plank based
  {
    id: 'core_plank',
    name: 'Plank Core',
    description: 'Plank-position core work',
    exerciseIds: ['plank', 'mountain_climber', 'commando'],
    constraints: { samePosition: true },
  },

  // Core - supine
  {
    id: 'core_supine',
    name: 'Supine Core',
    description: 'On-back core work',
    exerciseIds: ['situp', 'crunch', 'toe_touch', 'dead_bug', 'jacknife'],
    constraints: { samePosition: true },
  },

  // Core - rotation
  {
    id: 'core_rotation',
    name: 'Rotational Core',
    description: 'Twisting core movements',
    exerciseIds: ['russian_twist'],
    constraints: { samePosition: true },
  },

  // Power finishers
  {
    id: 'power_finisher',
    name: 'Power Finishers',
    description: 'High-intensity finisher movements',
    exerciseIds: ['burpee', 'thruster', 'squat_to_hi_pull', 'clean_to_press'],
    constraints: { samePosition: false },
  },

  // Warmup stretches
  {
    id: 'warmup_stretch',
    name: 'Warmup Stretches',
    description: 'Dynamic stretching movements',
    exerciseIds: ['wgs', 'gms', 'good_morning_to_squat', 'cat_cow'],
    constraints: { samePosition: false },
  },
];

// Get substitution class for an exercise
export function getSubstitutionClass(exerciseId: string): SubstitutionClass | undefined {
  return SUBSTITUTION_CLASSES.find(sc => sc.exerciseIds.includes(exerciseId));
}

// Get all exercises that can substitute for a given exercise
export function getSubstitutes(exerciseId: string): ExerciseDefinition[] {
  const subClass = getSubstitutionClass(exerciseId);
  if (!subClass) return [];

  return subClass.exerciseIds
    .filter(id => id !== exerciseId)
    .map(id => findExerciseById(id))
    .filter((ex): ex is ExerciseDefinition => ex !== undefined);
}

// ============================================================================
// EQUIPMENT REQUIREMENTS
// ============================================================================

export type EquipmentType = 'heavy' | 'medium' | 'light' | 'none';

export interface EquipmentRequirement {
  type: EquipmentType;
  count: 1 | 2;
}

// Parse equipment strings into structured requirements
export function parseEquipment(equipmentStrings: string[]): EquipmentRequirement[] {
  const requirements: EquipmentRequirement[] = [];

  for (const eq of equipmentStrings) {
    const lower = eq.toLowerCase();
    if (lower.includes('heavy')) {
      const count = lower.includes('2') ? 2 : 1;
      requirements.push({ type: 'heavy', count: count as 1 | 2 });
    } else if (lower.includes('medium')) {
      const count = lower.includes('2') ? 2 : 1;
      requirements.push({ type: 'medium', count: count as 1 | 2 });
    } else if (lower.includes('light')) {
      const count = lower.includes('2') ? 2 : 1;
      requirements.push({ type: 'light', count: count as 1 | 2 });
    }
  }

  return requirements;
}

// Check if two exercises have compatible equipment (can be in same block)
export function hasCompatibleEquipment(ex1: ExerciseDefinition, ex2: ExerciseDefinition): boolean {
  const eq1 = parseEquipment(ex1.equipment);
  const eq2 = parseEquipment(ex2.equipment);

  // No equipment = always compatible
  if (eq1.length === 0 || eq2.length === 0) return true;

  // Check if they share at least one equipment type
  for (const e1 of eq1) {
    for (const e2 of eq2) {
      if (e1.type === e2.type) return true;
    }
  }

  // Different equipment types - could still work but less ideal
  return false;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function findExercise(text: string): ExerciseDefinition | undefined {
  const lower = text.toLowerCase();
  return ALL_EXERCISES.find(ex =>
    ex.name.toLowerCase() === lower ||
    ex.aliases.some(a => a.toLowerCase() === lower) ||
    ex.aliases.some(a => lower.includes(a.toLowerCase()))
  );
}

export function findExerciseById(id: string): ExerciseDefinition | undefined {
  return ALL_EXERCISES.find(ex => ex.id === id);
}

export function getExercisesByPattern(pattern: MovementPattern): ExerciseDefinition[] {
  return ALL_EXERCISES.filter(ex => ex.movementPattern === pattern);
}

export function getExercisesByMuscle(muscle: MuscleGroup): ExerciseDefinition[] {
  return ALL_EXERCISES.filter(ex =>
    ex.primaryMuscles.includes(muscle) || ex.secondaryMuscles.includes(muscle)
  );
}

export function getPowerExercises(): ExerciseDefinition[] {
  return ALL_EXERCISES.filter(ex => ex.isPower);
}

export function getWarmupExercises(): ExerciseDefinition[] {
  return ALL_EXERCISES.filter(ex => ex.isWarmup);
}

export function getFinisherExercises(): ExerciseDefinition[] {
  return ALL_EXERCISES.filter(ex => ex.isFinisher);
}
